def load_prompt():
    return "You are a friendly storytelling chatbot. Answer clearly and creatively."

def build_story_prompt(user_input: str) -> str:
    return f"User asked: {user_input}\nPlease give a helpful, creative answer."
