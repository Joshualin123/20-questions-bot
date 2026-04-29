import requests


response = requests.post(
    'https://openrouter.ai/api/v1/responses',
    headers={
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
    },
    json={
        'model': 'nvidia/nemotron-3-super-120b-a12b:free',
        'input': 'You are playing 20 questions. Start by saying something like lets play 20 questions!, and then ask if the user wants to be guesser or answerer (the one who thinks of a thing for the other person to guess).',
    }
)
print(response.json()['output'][1]['content'][0]['text'])
