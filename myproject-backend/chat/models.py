# Create file: check_models.py
# Run: python check_models.py

import os
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

api_key = os.getenv('ANTHROPIC_API_KEY')

if not api_key:
    print("❌ API key not found!")
    exit()

print("Testing different Claude models...\n")

# List of models to test
models_to_test = [
    "claude-3-5-sonnet-20241022",
    "claude-3-5-sonnet",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
    "claude-opus-4-1-20250805",
    "claude-3-opus-20250219",
]

client = Anthropic(api_key=api_key)

for model in models_to_test:
    try:
        print(f"Testing: {model}...", end=" ")
        response = client.messages.create(
            model=model,
            max_tokens=10,
            messages=[
                {"role": "user", "content": "say hi"}
            ]
        )
        print(f"✅ WORKS!")
        print(f"   Response: {response.content[0].text}\n")
        
    except Exception as e:
        error_msg = str(e)
        if "not_found" in error_msg or "404" in error_msg:
            print(f"❌ Not found")
        else:
            print(f"❌ Error: {error_msg[:50]}")
        print()

print("\n" + "="*50)
print("Use the model marked ✅ WORKS in your code")
print("="*50)