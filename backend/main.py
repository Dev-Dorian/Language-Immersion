import os
import json
import io
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from PIL import Image
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

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("⚠️ ADVERTENCIA: GEMINI_API_KEY no encontrada.")
else:
    print("✅ GEMINI_API_KEY cargada correctamente.")

# Configurar cliente de Gemini
genai.configure(api_key=api_key)


class TranslationResponse(BaseModel):
    object_detected: str
    target_language: str
    vocabulary: str
    example_sentence: str
    phonetic: str


@app.get("/")
def home():
    return {"status": "ok", "app": "LanguageImmersion"}


@app.get("/list-models")
def list_models():
    try:
        models = [
            m.name for m in genai.list_models()
            if 'generateContent' in m.supported_generation_methods
        ]
        return {"available_models": models}
    except Exception as e:
        return {"error": str(e)}


def get_working_model():
    """Busca y retorna el primer modelo activo disponible para tu API Key."""
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            # Quitamos el prefijo 'models/' si la librería lo requiere
            model_name = m.name.replace("models/", "")
            return model_name
    raise RuntimeError(
        "No se encontraron modelos con 'generateContent' para esta API Key.")


@app.post("/analyze-image", response_model=TranslationResponse)
async def analyze_image(
    target_language: str = Form("french"),
    image: UploadFile = File(...)
):
    try:
        contents = await image.read()
        if not contents:
            raise ValueError("El archivo recibido está vacío.")

        pil_image = Image.open(io.BytesIO(contents))
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")

        prompt = f"""
        Identifica el objeto principal de esta imagen para un estudiante de idioma.
        Idioma objetivo: {target_language}.

        Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
        {{
            "object_detected": "nombre del objeto en español",
            "vocabulary": "el/la palabra con su artículo en {target_language}",
            "example_sentence": "una frase natural en {target_language} usando la palabra",
            "phonetic": "transcripción fonética aproximada"
        }}
        """

        # Obtener dinámicamente un modelo activo para tu API Key
        active_model_name = get_working_model()
        print(f"👉 Usando el modelo activo: {active_model_name}")

        model = genai.GenerativeModel('gemini-2.0-flash')

        # Generar respuesta
        response = model.generate_content(
            [prompt, pil_image],
            generation_config={"response_mime_type": "application/json"}
        )

        if not response.text:
            raise ValueError("Gemini devolvió una respuesta vacía.")

        data = json.loads(response.text)

        return TranslationResponse(
            object_detected=data.get("object_detected", "Desconocido"),
            target_language=target_language,
            vocabulary=data.get("vocabulary", ""),
            example_sentence=data.get("example_sentence", ""),
            phonetic=data.get("phonetic", "")
        )

    except Exception as e:
        print("\n❌ --- ERROR EN ANALYZE-IMAGE --- ❌")
        print(f"Tipo: {type(e).__name__}")
        print(f"Mensaje: {str(e)}")
        print("-----------------------------------\n")
        raise HTTPException(status_code=500, detail=str(e))
