import logging
from django.utils import timezone
from django.http import JsonResponse
from .models import Tweet, Keyword, Category, Report
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
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

            # Process keywords
            self.process_keywords(keyword_count_dic)

            # Process categories
            self.process_categories(category_count_dic)

            return JsonResponse({'status': 'success', 'message': 'Blocked keyword and category counts updated.'}, status=200)

        except Exception as e:
            print(f"Error processing request: {e}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    def process_keywords(self, keyword_count_dic):
        with transaction.atomic():
            for keyword, tweet_ids in keyword_count_dic.items():
                keyword = keyword.lower()  # Normalize keyword
                # Fetch all previous instances and aggregate their tweet IDs
                previous_instances = Keyword.objects.filter(keyword=keyword)
                all_previous_tweet_ids = set()
                for instance in previous_instances:
                    all_previous_tweet_ids.update(instance.tweet_ids)
                
                new_tweet_ids = set(tweet_ids) - all_previous_tweet_ids

                # Create a new Keyword instance only if there are new blocked tweets
                number_of_blocked_tweets = len(new_tweet_ids)
                if number_of_blocked_tweets > 0:
                    Keyword.objects.create(
                        keyword=keyword,
                        tweet_ids=list(new_tweet_ids),
                        number_of_blocked_tweets=number_of_blocked_tweets,
                        time_added=timezone.now()
                    )
                    print(f"Keyword '{keyword}': created with {number_of_blocked_tweets} newly blocked tweets.")
                else:
                    print(f"Keyword '{keyword}': No new blocked tweets to create.")

    def process_categories(self, category_count_dic):
        with transaction.atomic():
            for category, tweet_ids in category_count_dic.items():
                category = category.lower()  # Normalize category
                # Fetch all previous instances and aggregate their tweet IDs
                previous_instances = Category.objects.filter(name=category)
                all_previous_tweet_ids = set()
                for instance in previous_instances:
                    all_previous_tweet_ids.update(instance.tweet_ids)
                
                new_tweet_ids = set(tweet_ids) - all_previous_tweet_ids

                # Create a new Category instance only if there are new blocked tweets
                number_of_blocked_tweets = len(new_tweet_ids)
                if number_of_blocked_tweets > 0:
                    Category.objects.create(
                        name=category,
                        tweet_ids=list(new_tweet_ids),
                        number_of_blocked_tweets=number_of_blocked_tweets,
                        time_added=timezone.now()
                    )
                    print(f"Category '{category}': created with {number_of_blocked_tweets} newly blocked tweets.")
                else:
                    print(f"Category '{category}': No new blocked tweets to create.")

    def get(self, request):
        # get all blocked keywords and categories
        blocked_keywords = Keyword.objects.all()
        blocked_categories = Category.objects.all()
        blocked_keywords_list = []
        blocked_categories_list = []
        for keyword in blocked_keywords:
            blocked_keywords_list.append({
                'keyword': keyword.keyword,
                'tweet_ids': keyword.tweet_ids,
                'number_of_blocked_tweets': keyword.number_of_blocked_tweets,
                'time_added': keyword.time_added
            })
        for category in blocked_categories:
            blocked_categories_list.append({
                'category': category.name,
                'tweet_ids': category.tweet_ids,
                'number_of_blocked_tweets': category.number_of_blocked_tweets,
                'time_added': category.time_added
            })
        return JsonResponse({
            'status': 'success',
            'blockedKeywords': blocked_keywords_list,
            'blockedCategories': blocked_categories_list
        })
    
logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class ReportView(View):
    def post(self, request):
        try:
            # Parse the JSON body
            body_unicode = request.body.decode('utf-8')
            body_data = json.loads(body_unicode)
            user_id = body_data.get('user_id')
            print(f"Received user_id: {user_id}")

            # Retrieve all keywords and categories
            keywords = Keyword.objects.all()
            categories = Category.objects.all()

            # Aggregate blocked tweet counts
            keyword_counts = {keyword.keyword: sum(len(kw.tweet_ids) for kw in keywords if kw.keyword == keyword.keyword) for keyword in keywords}
            category_counts = {category.name: sum(len(cat.tweet_ids) for cat in categories if cat.name == category.name) for category in categories}

            print(f"Keyword counts: {keyword_counts}")
            print(f"Category counts: {category_counts}")

            # Create a new Report object
            new_report = Report.objects.create(
                user_id=user_id,
                keywords_reported=keyword_counts,
                categories_reported=category_counts,
                time_added=timezone.now()
            )

            return JsonResponse({'status': 'success', 'message': 'Report created successfully.'}, status=200)

        except Exception as e:
            logger.error(f"Error processing the request: {str(e)}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    