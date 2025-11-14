import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Configure Gemini with your API key
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# List all available models
print("Available Gemini Models:")
for model in genai.list_models():
    print(f"Model: {model.name}, Supported Methods: {model.supported_generation_methods}")
