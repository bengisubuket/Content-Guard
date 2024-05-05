from django.http import JsonResponse
from .models import Tweet, Keyword, Category    
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json
from g4f.client import Client
import time

client = Client()

@method_decorator(csrf_exempt, name='dispatch')
class TweetView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            tweet_id = data.get('tweetId')

            # Check if the tweet already exists
            existing_tweet = Tweet.objects.filter(tweet_id=tweet_id).first()
            if existing_tweet:
                # Tweet exists, return the saved category
                return JsonResponse({
                    'status': 'success',
                    'message': 'Tweet already processed.',
                    'category': existing_tweet.category
                }, status=200)

            # If tweet does not exist, process and categorize it
            tweet_text = data.get('tweetText', '')
            user_id = data.get('userId')
            tab_id = data.get('tabId')
            category = self.categorize_tweet(tweet_text)

            # Save the new tweet
            new_tweet = Tweet(user_id=user_id, tab_id=tab_id, tweet_id=tweet_id, category=category, tweet_text=tweet_text)
            new_tweet.save()
            return JsonResponse({
                'status': 'success',
                'message': 'New tweet processed and saved.',
                'category': category
            }, status=201)

        except Exception as e:
            # logger.error(f"Failed to process tweet: {str(e)}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    def categorize_tweet(self, tweet_text):
        desired_categories = [
            "Technology", "Fashion", "Travel", "Music", "Movies", "Food", "Sports",
            "Science", "Health", "Politics", "Business", "Gaming", "Books", "Art",
            "Photography", "Fitness", "Education", "Environment", "Celebrities",
            "News", "Weather", "Humor", "SelfCare", "Relationships", "Pets", 
            "Parenting", "Space", "Motivation", "SocialJustice"
        ]
        retry_count = 3
        delay = 0.5  # Initial delay in seconds
        for attempt in range(retry_count):
            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": f"Categorize the following tweet into one of the following categories: {', '.join(desired_categories)} and give it as a one-word answer, do not give any further information: {tweet_text}"}],
                )
                category = response.choices[0].message.content
                if category in desired_categories:
                    return category
            except Exception as e:
                # logger.warning(f"Attempt {attempt + 1}: Failed to categorize tweet. Retrying after {delay} seconds...")
                time.sleep(delay)
                delay *= 2  # Exponential backoff
        # logger.warning("Failed to categorize tweet after multiple attempts.")
        return None  # Fallback if no valid category is determined
    def get(self, request):
        # Testing endpoint, to be disabled in production
        return JsonResponse({'status': 'success', 'message': 'GET request received. This method is for testing only.'})

@method_decorator(csrf_exempt, name='dispatch')
class KeywordCategoryView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            keyword_count_dic = data.get('blockedKwCount', {})
            category_count_dic = data.get('blockedCategoryCount', {})

            # Update or create keyword data
            for keyword, count in keyword_count_dic.items():
                Keyword.objects.update_or_create(
                    keyword=keyword, 
                    defaults={'number_of_blocked_tweets': count}
                )

            # Update or create category data
            for category, count in category_count_dic.items():
                Category.objects.update_or_create(
                    name=category, 
                    defaults={'number_of_blocked_tweets': count}
                )

            return JsonResponse({'status': 'success', 'message': 'Blocked keyword and category counts updated.'}, status=200)
            
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)