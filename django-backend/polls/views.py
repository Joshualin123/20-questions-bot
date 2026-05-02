from django.shortcuts import render
import requests
from dotenv import load_dotenv
import os
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

# Create your views here.
CORS_ALLOW_ALL_ORIGINS = True
load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")
model = 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free'

criteria = 'You are playing 20 questions. Prompt the user on whether they want to be answerer or asker. If user is asker, THEY are asking the yes/no questions. whenever the user does anything unrelated to the game, acknowledge their statement but put them back on track. Format your responses in response to the latest user reply. Do not give away excess information aside from yes/no'
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

#account authentication methods

@csrf_exempt
@require_http_methods(["POST"])
def authenticate_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data[0]
        password = data[1]

        user = authenticate(username=username, password=password)
        print(f'{username}, {password}')
        if user is None:
            print("account doesnt exist")
            return JsonResponse({"status": "This account does not exist."})
        
        print("account exists")
        return JsonResponse({"status": "ok"})

@csrf_exempt
@require_http_methods(["POST"])
def create_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data[0]
        password = data[1]

        user = User.objects.filter(username=username).exists()
        if user:
            print(f"account {username}, {password} already in db")
            return JsonResponse({"status": "This username is already taken."})
        
        User.objects.create_user(username=username, password=password)
        print(f"account {username}, {password} created")
        return JsonResponse({"status": "ok"})
