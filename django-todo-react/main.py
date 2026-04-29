import requests
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")

history = ['You are playing 20 questions. Start by saying something like lets play 20 questions! in response to this message, and then ask if the user wants to be guesser or answerer (the one who thinks of a thing for the other person to guess). Also, if the user gives any response unrelated to the game, acknowledge that they said something, but prioritize playing the game.']

#send initial input to ai
response = requests.post(
        'https://openrouter.ai/api/v1/responses',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        json={
            'model': 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
            'input': history[0],
        }
    )

msg = response.json()['output'][1]['content'][0]['text']
history.append(msg) #add response to message history

while True:

    print(history[len(history) - 1])
    user_in = input()

    history.append(user_in)

    response = requests.post(
        'https://openrouter.ai/api/v1/responses',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        json={
            'model': 'nvidia/nemotron-3-super-120b-a12b:free',
            'input': f'{history}',
        }
    )

    msg = response.json()['output'][1]['content'][0]['text']
    
    history.append(msg)


