from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from backend.elevenlabs.elevenLabsClient import ElevenLabsClient
from backend.elevenlabs.requests import TTSRequest
import io
import os
from dotenv import load_dotenv

# Load env from the same directory as this file
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:3000", # React default
    "*" # For development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

eleven_labs_client = ElevenLabsClient()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/api/tts")
async def text_to_speech(request: TTSRequest):
    try:
        audio_generator = eleven_labs_client.text_to_speech(request.text, request.voice_id)
        
        def iterfile():
             for chunk in audio_generator:
                 yield chunk

        return StreamingResponse(iterfile(), media_type="audio/mpeg")
    except Exception as e:
        print(f"Error in tts endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
