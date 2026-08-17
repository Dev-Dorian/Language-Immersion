import os
import json
import base64
from typing import List, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="LanguageImmersion API - Local Ollama")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TranslationResponse(BaseModel):
    object_detected: str
    target_language: str
    vocabulary: str
    examples: List[str]


@app.get("/")
def home():
    return {"status": "ok", "app": "LanguageImmersion Backend con Ollama Local"}


def ensure_string(val: Any) -> str:
    """Convierte objetos o tipos no esperados a una cadena limpia."""
    if isinstance(val, dict):
        # Si devuelve un dict, toma el primer valor no vacío o une los valores
        return " / ".join(str(v) for v in val.values() if v)
    if isinstance(val, list):
        return ", ".join(str(v) for v in val if v)
    return str(val) if val is not None else ""


def ensure_string_list(val: Any) -> List[str]:
    """ Escanea y garantiza que el resultado sea siempre una lista de cadenas. """
    if isinstance(val, list):
        return [ensure_string(item) for item in val if item]
    if isinstance(val, str):
        # Si devolvió un solo texto largo con saltos de línea
        lines = [line.strip() for line in val.split("\n") if line.strip()]
        return lines if lines else [val]
    if isinstance(val, dict):
        return [ensure_string(v) for v in val.values() if v]
    return []


@app.post("/analyze-image", response_model=TranslationResponse)
async def analyze_image(
    target_language: str = Form("spanish"),
    image: UploadFile = File(...)
):
    try:
        # 1. Leer los bytes de la imagen recibida desde la app
        contents = await image.read()
        if not contents:
            raise ValueError("El archivo de imagen está vacío.")

        # 2. Convertir la imagen a bytes/base64 requeridos por Ollama
        base64_image = base64.b64encode(contents).decode("utf-8")

        # 3. Prompt estructurado para forzar respuesta JSON
        prompt = f"""
        Identifica el objeto principal de esta imagen para un estudiante de idioma.
        Idioma objetivo: {target_language}.

        Genera exactamente 3 oraciones de ejemplo sencillas y de uso cotidiano en {target_language} utilizando el vocabulario identificado.

        Responde ÚNICAMENTE con un objeto JSON válido con esta estructura exacta, sin texto explicativo adicional:
        Instrucción estricta: Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:
        {{
            "object_detected": "nombre del objeto en {target_language}",
            "vocabulary": "el/la palabra con su artículo en {target_language}",
            "examples":[
                "1. Primera oración en {target_language}",
                "2. Segunda oración en {target_language}",
                "3. Tercera oración en {target_language}"
            ]
        }}
        """

        # 4. Enviar la imagen a Ollama local (usando llava o llama3.2-vision)
        response = ollama.chat(
            model='gemma4:12b',  # O 'llama3.2-vision'
            messages=[
                {
                    'role': 'user',
                    'content': prompt,
                    'images': [base64_image]
                }
            ],
            format='json'  # Forzar respuesta en formato JSON
        )

        response_content = response['message']['content']
        if not response_content:
            raise ValueError("Ollama devolvió una respuesta vacía.")

        data = json.loads(response_content)

        return TranslationResponse(
            object_detected=ensure_string(
                data.get("object_detected", "Desconocido")),
            target_language=target_language,
            vocabulary=ensure_string(data.get("vocabulary", "")),
            examples=ensure_string_list(data.get("examples", []))
        )

    except Exception as e:
        print("\n❌ --- ERROR EN ANALYZE-IMAGE (OLLAMA) --- ❌")
        print(f"Tipo: {type(e).__name__}")
        print(f"Mensaje: {str(e)}")
        print("-------------------------------------------\n")
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar con Ollama local: {str(e)}"
        )
