import os
import json
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from PIL import Image
import io
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="LanguageImmersion API - Gemini Free")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar cliente de Gemini
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class TranslationResponse(BaseModel):
    object_detected: str
    target_language: str
    vocabulary: str
    example_sentence: str
    phonetic: str


@app.get("/")
def home():
    return {"status": "ok", "message": "LanguageImmersion Backend funcionando correctamente"}


@app.post("/analyze-image", response_model=TranslationResponse)
async def analyze_image(
    target_language: str = Form("french"),
    image: UploadFile = File(...)
):
    try:
        # 1. Cargar la imagen recibida
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents))

        # 2. Prompt indicando respuesta JSON estricta
        prompt = f"""
        Identifica el objeto principal de esta imagen para un estudiante de idioma.
        Idioma objetivo: {target_language}.

        Responde ÚNICAMENTE con un JSON válido con esta estructura:
        {{
            "object_detected": "nombre del objeto en español",
            "vocabulary": "el/la palabra con su artículo en {target_language}",
            "example_sentence": "una frase natural y cotidiana en {target_language} usando la palabra",
            "phonetic": "transcripción fonética aproximada o pronunciación simplificada"
        }}
        """

        # 3. Llamada a Gemini 1.5 Flash (Gratuito con soporte de Visión)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[pil_image, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )

        # 4. Parsear respuesta
        data = json.loads(response.text)

        return TranslationResponse(
            object_detected=data.get("object_detected", "Desconocido"),
            target_language=target_language,
            vocabulary=data.get("vocabulary", ""),
            example_sentence=data.get("example_sentence", ""),
            phonetic=data.get("phonetic", "")
        )

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Error en el análisis: {str(e)}")
