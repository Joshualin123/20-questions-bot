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

criteria = 'You are playing 20 questions. Prompt the user on whether they want to be answerer (the one replying to the yes/no questions) or guesser (the one asking yes/no questions). whenever the user does anything unrelated to the game, acknowledge they said something first, but put them back on track. Format your responses in response to the latest user reply specifically, try not to repeat the same speech. Dont format your outputs with special characters like newlines or quotes, i just need straight text to output in my frontend. Make sure not to get your roles mixed up.'
history = [""]

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
                'input': f'criteria: {criteria}, chat history: {history}',
            }
        )

        msg = response.json()['output'][1]['content'][0]['text']
        print(response.json)
        
        return JsonResponse({"message": msg})

@csrf_exempt
@require_http_methods(["POST"])
def send_msg(request):
    if request.method == "POST":
        data = json.loads(request.body)
        history[0] = data[0]
        print(f'history: {history}, data len: {data[1]}')
        
        return JsonResponse({"status": "ok"})