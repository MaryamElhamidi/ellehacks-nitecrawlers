from elevenlabs.client import ElevenLabs
import os
from typing import IO, Iterator

class ElevenLabsClient:
    def __init__(self):
        api_key = os.getenv("ELEVENLABS_API_KEY")
        if not api_key:
            print("Warning: ELEVENLABS_API_KEY not set in environment variables")
        self.client = ElevenLabs(api_key=api_key)

    def text_to_speech(self, text: str, voice_id: str = "21m00Tcm4TlvDq8ikWAM") -> Iterator[bytes]:
        """
        Converts text to speech using ElevenLabs API.
        Returns the audio stream.
        """
        try:
            audio_stream = self.client.text_to_speech.convert(
                text=text,
                voice_id=voice_id,
                model_id="eleven_multilingual_v2"
            )
            return audio_stream
        except Exception as e:
            print(f"Error generating audio: {e}")
            raise e
