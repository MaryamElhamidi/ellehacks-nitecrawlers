from elevenlabs.client import ElevenLabs

client = ElevenLabs(api_key="ELEVENLABS_API_KEY")

# Get raw response with headers
response = client.text_to_speech.with_raw_response.convert(
    text="Hello, world!",
    voice_id="UgBBYS2sOqTuMpoF3BR0"
)

# Access character cost from headers
char_cost = response.headers.get("x-character-count")
request_id = response.headers.get("request-id")
audio_data = response.data
