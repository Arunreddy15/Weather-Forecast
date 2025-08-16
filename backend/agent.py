import os
import requests
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore

app = Flask(__name__)
CORS(app)  # Allow requests from React (Vite) frontend

load_dotenv()

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
WEATHERAPI_KEY = os.getenv("WEATHERAPI_KEY")

if not WEATHERAPI_KEY:
    raise RuntimeError("Missing WEATHERAPI_KEY")

def get_perplexity_llm():
    """Return a Perplexity Chat LLM instance."""
    return ChatOpenAI(
        model="sonar-pro",
        temperature=0,
        openai_api_key=PERPLEXITY_API_KEY,
        openai_api_base="https://api.perplexity.ai",
    )

def query_weather_api(city):
    """Example Weather API call."""
    url = f"http://api.weatherapi.com/v1/current.json?key={WEATHERAPI_KEY}&q={city}&aqi=no"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    return r.json()
@app.route('/api/greet', methods=['POST'])
def greet():
    data = request.get_json()
    city = data.get('location', 'Guest')
    weather_data = query_weather_api(city)
    # prompt = f"Summarize the following weather data in a friendly tone: in less than 1000 characters\n{weather_data}"
    prompt = f"Summarize the following weather in {city} city data in a friendly tone: within 800 characters and remove '*' symbols make in human readable format\n"
    """Try OpenAI first, fallback to Perplexity on quota errors."""
    try:
        llm = get_perplexity_llm()
        return llm.invoke(prompt).content
    except Exception as e:
        pass
# def ai_query(prompt):

# """Try OpenAI first, fallback to Perplexity on quota errors."""
# try:
#     llm = get_openai_llm()
#     return llm.invoke(prompt).content
# except Exception as e:
#     if "insufficient_quota" in str(e):
#         print("⚠️ OpenAI quota exceeded — switching to Perplexity Pro")
#         llm = get_perplexity_llm()
#         return llm.invoke(prompt).content
#     else:
#         raise

if __name__ == "__main__":
    # city = "Hyderabad"
    # weather_data = query_weather_api(city)

    # prompt = f"Summarize the following weather data in a friendly tone:\n{weather_data}"
    
    # response = ai_query(prompt)

    # print("AI Response:")
    # print(response)
    app.run(port=5002, debug=True)

# import os
# import requests
# from dotenv import load_dotenv
# from langchain_openai import ChatOpenAI

# load_dotenv()

# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
# WEATHERAPI_KEY = os.getenv("WEATHERAPI_KEY")

# if not WEATHERAPI_KEY:
#     raise RuntimeError("Missing WEATHERAPI_KEY")
# if not (OPENAI_API_KEY or PERPLEXITY_API_KEY):
#     raise RuntimeError("Need at least one AI API key (OpenAI or Perplexity)")

# def get_openai_llm():
#     """Return an OpenAI Chat LLM instance."""
#     return ChatOpenAI(
#         model="gpt-4o-mini",
#         temperature=0,
#         openai_api_key=OPENAI_API_KEY,
#     )

# def get_perplexity_llm():
#     """Return a Perplexity Chat LLM instance."""
#     return ChatOpenAI(
#         model="sonar-pro",
#         temperature=0,
#         openai_api_key=PERPLEXITY_API_KEY,
#         openai_api_base="https://api.perplexity.ai",
#     )

# def query_weather_api(city):
#     """Example Weather API call."""
#     url = f"http://api.weatherapi.com/v1/current.json?key={WEATHERAPI_KEY}&q={city}&aqi=no"
#     r = requests.get(url, timeout=10)
#     r.raise_for_status()
#     return r.json()

# def ai_query(prompt):
#     """Try OpenAI first, fallback to Perplexity on quota errors."""
#     try:
#         llm = get_openai_llm()
#         return llm.invoke(prompt).content
#     except Exception as e:
#         if "insufficient_quota" in str(e):
#             print("⚠️ OpenAI quota exceeded — switching to Perplexity Pro")
#             llm = get_perplexity_llm()
#             return llm.invoke(prompt).content
#         else:
#             raise

# if __name__ == "__main__":
#     city = "Hyderabad"
#     weather_data = query_weather_api(city)

#     prompt = f"Summarize the following weather data in a friendly tone:\n{weather_data}"
#     response = ai_query(prompt)

#     print("AI Response:")
#     print(response)
