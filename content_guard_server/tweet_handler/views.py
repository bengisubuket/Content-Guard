from django.http import JsonResponse
from .models import Tweet
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json
from g4f.client import Client
import logging
import time

client = Client()

@method_decorator(csrf_exempt, name='dispatch')
class TweetView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            tweet_text = data.get('tweetText', '')
            category = ""
            retry_count = 3
            delay = 0.5  # Initial delay in seconds

            for attempt in range(retry_count):
                try:
                    response = client.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=[{"role": "user", "content": "Categorize the following tweet into one of the following categories: [Technology, Fashion, Travel, Music, Movies, Food, Sports, Science, Health, Politics, Business, Gaming, Books, Art, Photography, Fitness, Education, Environment, Celebrities, News, Weather, Humor, SelfCare, Relationships, Pets, Parenting, TechnologyTrends, Space, Motivation, SocialJustice] and give it as a one-word answer, do not give any further information: {tweet}".format(tweet=tweet_text)}],
                    )
                    category = response.choices[0].message.content
                    break  # Exit loop if successful
                except Exception as e:
                    logging.error(f"Attempt {attempt + 1}: {str(e)}")
                    time.sleep(delay)
                    delay *= 2  # Exponential backoff

            tweet = Tweet(user_id=data['userId'], tab_id=data['tabId'], category=category)
            tweet.save()

            # Include the category in the response
            return JsonResponse({'status': 'success', 'message': 'Tweet data saved.', 'category': category}, status=201)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    def get(self, request):
        # Testing endpoint, to be disabled in production
        return JsonResponse({'status': 'success', 'message': 'GET request received. This method is for testing only.'})
