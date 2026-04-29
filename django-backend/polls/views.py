from django.shortcuts import render
import requests
from dotenv import load_dotenv
import os
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
CORS_ALLOW_ALL_ORIGINS = True
load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")
model = 'poolside/laguna-xs.2:free'

history = ['You are playing 20 questions. Prompt the user on whether they want to be answerer or guesser. whenever the user does anything unrelated to the game, acknowledge they said something, but put them back on track. Format your responses as raw string text, since im displaying them directly in my frontend.', 'Lets play 20 questions! Would you like to be guesser or answerer?']

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

@require_http_methods(["GET"])
def get_resp(request):
    if request.method == "GET":

        response = requests.post(
            'https://openrouter.ai/api/v1/responses',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json',
            },
            json={
                'model': model,
                'input': f'{history}',
            }
        )

        msg = response.json()['output'][1]['content'][0]['text']
        print(response.json)
        
        history.append(msg)
        return JsonResponse({"message": msg})

@csrf_exempt
@require_http_methods(["POST"])
def send_msg(request):
    if request.method == "POST":
        data = json.loads(request.body)
        history.append(data)
        print(history)
        
        return JsonResponse({"status": "ok"})