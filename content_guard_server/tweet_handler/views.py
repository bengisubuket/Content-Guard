import logging
from django.utils import timezone
from django.http import JsonResponse
from .models import Tweet, Keyword, Category, Report, User
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
import json
from g4f.client import Client
import time
from datetime import timedelta
from collections import defaultdict

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
            user = User.objects.get(user_id=data.get('uid'))  # Fetch your user appropriately
            tab_id = data.get('tabId')
            category = self.categorize_tweet(tweet_text)

            # Save the new tweet
            new_tweet = Tweet(user=user, tab_id=tab_id, tweet_id=tweet_id, category=category, tweet_text=tweet_text)
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
            user_id = data.get('uid')

            # Process keywords
            self.process_keywords(keyword_count_dic, user_id)

            # Process categories
            self.process_categories(category_count_dic, user_id)

            return JsonResponse({'status': 'success', 'message': 'Blocked keyword and category counts updated.'}, status=200)

        except Exception as e:
            print(f"Error processing request: {e}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    def process_keywords(self, keyword_count_dic, user_id):
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
                    user = User.objects.get(user_id=user_id)
                    Keyword.objects.create(
                        user=user,
                        keyword=keyword,
                        tweet_ids=list(new_tweet_ids),
                        number_of_blocked_tweets=number_of_blocked_tweets,
                        time_added=timezone.now()
                    )
                    print(f"Keyword '{keyword}': created with {number_of_blocked_tweets} newly blocked tweets.")
                else:
                    print(f"Keyword '{keyword}': No new blocked tweets to create.")

    def process_categories(self, category_count_dic, user_id):
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
                    user = User.objects.get(user_id=user_id)
                    Category.objects.create(
                        user=user,
                        name=category,
                        tweet_ids=list(new_tweet_ids),
                        number_of_blocked_tweets=number_of_blocked_tweets,
                        time_added=timezone.now()
                    )
                    print(f"Category '{category}': created with {number_of_blocked_tweets} newly blocked tweets.")
                else:
                    print(f"Category '{category}': No new blocked tweets to create.")
    
logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class ReportView(View):
    def post(self, request):
        try:
            # Parse the JSON body
            body_unicode = request.body.decode('utf-8')
            body_data = json.loads(body_unicode)
            user_id = body_data.get('user_id')
            report_id = body_data.get('report_id')
            print(f"Received user_id: {user_id}")
            print(f"Received report_id: {report_id}")

            user = User.objects.get(user_id=user_id)  # Fetch your user appropriately

            # Retrieve all keywords and categories
            keywords = Keyword.objects.filter(user=user)
            categories = Category.objects.filter(user=user)

            print(f"Keywords: {keywords}")
            print(f"Categories: {categories}")

            # Aggregate blocked tweet counts
            keyword_counts = {keyword.keyword: sum(len(kw.tweet_ids) for kw in keywords if kw.keyword == keyword.keyword) for keyword in keywords}
            category_counts = {category.name: sum(len(cat.tweet_ids) for cat in categories if cat.name == category.name) for category in categories}

            print(f"Keyword counts: {keyword_counts}")
            print(f"Category counts: {category_counts}")

            # Create a new Report object
            new_report = Report.objects.create(
                report_id=report_id,
                keywords_reported=keyword_counts,
                categories_reported=category_counts,
                time_added=timezone.now(),
                user=user
            )


            #in response send data as well
            return JsonResponse({
                'status': 'success',
                'message': 'Report successfully saved.',
                'keywords_reported': keyword_counts,
                'categories_reported': category_counts
            }, status=201)

        except Exception as e:
            logger.error(f"Error processing the request: {str(e)}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

        
    def get(self, request, user_id):
        # get all reports with user_id
        user = User.objects.get(user_id=user_id) 
        reports = Report.objects.filter(user=user)
        reports_list = []
        for report in reports:
            reports_list.append({
                'user_id': report.user_id,
                'report_id': report.report_id,
                'keywords_reported': report.keywords_reported,
                'categories_reported': report.categories_reported,
                'time_added': report.time_added
            })
        return JsonResponse({
            'status': 'success',
            'reports': reports_list
        })
        
    def delete(self, request, report_id, user_id):
        try:
            user = User.objects.get(user_id=user_id)  # Fetch your user appropriately
            # Retrieve the report by the given report_id
            report = Report.objects.get(report_id=report_id, user=user)
            report.delete()

            return JsonResponse({'status': 'success', 'message': 'Report deleted successfully.'}, status=200)

        except Report.DoesNotExist:
            logger.error(f"Report with id {report_id} does not exist.")
            return JsonResponse({'status': 'error', 'message': f'Report with id {report_id} does not exist.'}, status=404)

        except Exception as e:
            logger.error(f"Error deleting the report: {str(e)}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    
    def get(self, request, report_id=None, user_id=None):
        if report_id:
            try:
                # Retrieve the specific report by the given report_id and user_id
                user = User.objects.get(user_id=user_id)  # Fetch your user appropriately
                report = Report.objects.get(report_id=report_id, user=user)
                report_data = {
                    'user': report.user.user_id,
                    'report_id': report.report_id,
                    'keywords_reported': report.keywords_reported,
                    'categories_reported': report.categories_reported,
                    'time_added': report.time_added
                }

                return JsonResponse({
                    'status': 'success',
                    'report': report_data
                })

            except Report.DoesNotExist:
                return JsonResponse({
                    'status': 'error',
                    'message': f'Report with id {report_id} does not exist.'
                }, status=404)

            except Exception as e:
                logger.error(f"Error retrieving the report: {str(e)}")
                return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

        else:
            # Existing code to return all reports if no report_id is provided
            reports = Report.objects.all()
            reports_list = []
            for report in reports:
                reports_list.append({
                    'user_id': report.user_id,
                    'report_id': report.report_id,
                    'keywords_reported': report.keywords_reported,
                    'categories_reported': report.categories_reported,
                    'time_added': report.time_added
                })
            return JsonResponse({
                'status': 'success',
                'reports': reports_list
            })

class KwStatsView(View):
    def get(self, request, user_id=None):
        try:
            # Get the current time
            now = timezone.now()
            # Calculate the time 24 hours ago from now
            last_24_hours = now - timezone.timedelta(hours=24)
            
            # Initialize a dictionary to hold counts for each hour (0-23)
            tweets_per_hour = defaultdict(int)
            
            # Query all keywords where time_added is within the last 24 hours
            user = User.objects.get(user_id=user_id)  # Fetch your user appropriately
            keywords_last_24_hours = Keyword.objects.filter(time_added__gte=last_24_hours, user=user).values('time_added', 'number_of_blocked_tweets')
            
            # Populate the dictionary based on each tweet's hour of the day
            for entry in keywords_last_24_hours:
                hour = entry['time_added'].hour
                tweets_per_hour[hour] += entry['number_of_blocked_tweets']
            
            # Prepare arrays for the 24 hours
            hours = list(range(24))  # List from 0 to 23 representing each hour
            total_blocked = [tweets_per_hour[hour] for hour in hours]  # Default to 0 if the hour has no data
            
            return JsonResponse({'status': 'success', 'hours': hours, 'total_blocked': total_blocked}, safe=False)
        except Exception as e:
            # Log the error (print or use logging module)
            print(f"Error occurred: {str(e)}")
            # Return an error response
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

class CatStatsView(View):
    def get(self, request, user_id=None):
        try:
            # Get the current time
            now = timezone.now()
            # Calculate the time 24 hours ago from now
            last_24_hours = now - timezone.timedelta(hours=24)
            
            # Initialize a dictionary to hold counts for each hour (0-23)
            tweets_per_hour = defaultdict(int)
            
            # Query all keywords where time_added is within the last 24 hours
            user = User.objects.get(user_id=user_id)  # Fetch your user appropriately
            keywords_last_24_hours = Category.objects.filter(time_added__gte=last_24_hours, user=user).values('time_added', 'number_of_blocked_tweets')
            
            # Populate the dictionary based on each tweet's hour of the day
            for entry in keywords_last_24_hours:
                hour = entry['time_added'].hour
                tweets_per_hour[hour] += entry['number_of_blocked_tweets']
            
            # Prepare arrays for the 24 hours
            hours = list(range(24))  # List from 0 to 23 representing each hour
            total_blocked = [tweets_per_hour[hour] for hour in hours]  # Default to 0 if the hour has no data
            
            return JsonResponse({'status': 'success', 'hours': hours, 'total_blocked': total_blocked}, safe=False)
        except Exception as e:
            # Log the error (print or use logging module)
            print(f"Error occurred: {str(e)}")
            # Return an error response
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

class KeywordsGroupedBySecondView(View):
    def get(self, request, user_id=None):
        # Fetch all keywords
        user = User.objects.get(user_id=user_id)  # Fetch your user appropriately
        keywords = Keyword.objects.filter(user=user)

        # Normalize time_added to the nearest second
        for keyword in keywords:
            keyword.time_added = keyword.time_added - timedelta(microseconds=keyword.time_added.microsecond)

        # Convert QuerySet to list to manipulate
        keywords = list(keywords)

        # Group by 'time_added' with second precision
        grouped_data = {}
        for keyword in keywords:
            key = keyword.time_added
            if key in grouped_data:
                grouped_data[key] += keyword.number_of_blocked_tweets
            else:
                grouped_data[key] = keyword.number_of_blocked_tweets

        # Convert the dictionary to the desired output format
        result = [
            {'time_added': key, 'total_blocked_tweets': value}
            for key, value in grouped_data.items()
        ]

        return JsonResponse(sorted(result, key=lambda x: x['time_added']), safe=False)  # Return sorted by time_added
    

class CategoryGroupedBySecondView(View):
    def get(self, request, user_id=None):
        # Fetch all categories
        user = User.objects.get(user_id=user_id)  # Fetch your user appropriately
        categories = Category.objects.filter(user=user)

        # Normalize time_added to the nearest second
        for category in categories:
            category.time_added = category.time_added - timedelta(microseconds=category.time_added.microsecond)

        # Convert QuerySet to list to manipulate
        categories = list(categories)

        # Group by 'time_added' with second precision
        grouped_data = {}
        for category in categories:
            key = category.time_added
            if key in grouped_data:
                grouped_data[key] += category.number_of_blocked_tweets
            else:
                grouped_data[key] = category.number_of_blocked_tweets

        # Convert the dictionary to the desired output format
        result = [
            {'time_added': key, 'total_blocked_tweets': value}
            for key, value in grouped_data.items()
        ]

        return JsonResponse(sorted(result, key=lambda x: x['time_added']), safe=False)  # Return sorted by time_added

@method_decorator(csrf_exempt, name='dispatch')
class UserView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            token = data.get('token')
            secret = data.get('secret')
            user_displayName = data.get('user_displayName')
            user_id = data.get('user_id')
            photo_url = data.get('photo_url')
            email = data.get('email')
            phoneNumber = data.get('phoneNumber')
            userName = data.get('userName')

            new_user = User(token=token, secret=secret, user_displayName=user_displayName, user_id=user_id, photo_url=photo_url, email=email, phoneNumber=phoneNumber, userName=userName)
            new_user.save()
            return JsonResponse({'status': 'success', 'message': 'New user saved.'}, status=201)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    def get(self, request, user_id=None):
        if user_id:
            try:
                user = User.objects.get(user_id=user_id)
                user_data = {
                    'token': user.token,
                    'secret': user.secret,
                    'user_displayName': user.user_displayName,
                    'user_id': user.user_id,
                    'photo_url': user.photo_url,
                    'email': user.email,
                    'phoneNumber': user.phoneNumber,
                    'userName': user.userName
                }
                return JsonResponse({'status': 'success', 'user': user_data}, status=200)
            except User.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
        else:
            return JsonResponse({'status': 'error', 'message': 'User ID is required'}, status=400)
