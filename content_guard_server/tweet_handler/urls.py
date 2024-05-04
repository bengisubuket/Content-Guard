from django.http import HttpResponse
from django.urls import path
from .views import TweetView, KeywordView

def home(request):
    return HttpResponse("Welcome to the content guard server!")

urlpatterns = [
    path('tweet/', TweetView.as_view(), name='tweet_data'),
    path('keyword/', KeywordView.as_view(), name='keyword_data'),
    path('', home, name='home'),
]
