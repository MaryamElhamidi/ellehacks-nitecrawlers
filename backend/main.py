import os
from dotenv import load_dotenv

# Load env from the same directory as this file
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from services.elevenLabsClient import ElevenLabsClient
from services.requests import TTSRequest
import io
import google.generativeai as genai
from pydantic import BaseModel

app = FastAPI()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("Warning: GEMINI_API_KEY not set")

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

class TipRequest(BaseModel):
    action: str
    item_name: str
    price: float
    balance: float

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.post("/api/generate-tip")
async def generate_tip(request: TipRequest):
    print(f"DEBUG: Received tip request: {request}")
    if not GEMINI_API_KEY:
        print("DEBUG: GEMINI_API_KEY is missing")
        return {"tip": "Savings grow when you wait! (Tip: Set GEMINI_API_KEY)"}
    
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')
        prompt = (
            f"Explain to a 10-year-old child why {request.action} a '{request.item_name}' "
            f"that costs ${request.price} is a financial choice. "
            f"The child has ${request.balance} left. "
            f"Keep it under 20 words. Be encouraging but educational. "
            f"If they saved/skipped, praise them. If they bought, remind them of trade-offs."
        )
        print(f"DEBUG: Sending prompt to Gemini: {prompt}")
        response = model.generate_content(prompt)
        print(f"DEBUG: Gemini response: {response.text}")
        return {"tip": response.text}
    except Exception as e:
        print(f"DEBUG: Gemini Error: {e}")
        # Fallback logic
        if "buy" in request.action.lower():
             fallback_tip = f"Buying costs ${request.price}. That's a lot! Maybe wait a week?"
        elif "sav" in request.action.lower(): # save, saving
             fallback_tip = f"Saving is great! You keep your ${request.balance} and grow your wealth."
        else:
             fallback_tip = "Every choice matters. Think: Is this a Need or a Want?"
             
        return {"tip": fallback_tip}

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
