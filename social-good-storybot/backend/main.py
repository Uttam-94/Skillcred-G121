from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

# Change the import statement to a regular, non-relative import
# This assumes 'backend' is in your Python path, which it is when you run uvicorn
# from the parent directory.
from backend.utils import load_prompt, build_story_prompt


# Load .env variables
load_dotenv()

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")  # loaded from .env

@app.get("/")
def home():
    return {"message": "Storytelling Chatbot Backend Running"}

@app.post("/generate")
async def generate_story(request: Request):
    data = await request.json()
    user_input = data.get("message", "")

    prompt = load_prompt() + "\n" + build_story_prompt(user_input)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENROUTER_API_KEY}"
    }

    payload = {
        "model": "deepseek/deepseek-r1-0528:free",
        "messages": [
            {"role": "system", "content": load_prompt()},
            {"role": "user", "content": user_input}
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post("https://openrouter.ai/api/v1/chat/completions",
                                     headers=headers, json=payload)
        result = response.json()

    output_text = result["choices"][0]["message"]["content"]
    return {"response": output_text}