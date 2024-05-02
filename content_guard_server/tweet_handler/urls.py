from django.http import HttpResponse
from django.urls import path
from .views import TweetView

def home(request):
    return HttpResponse("Welcome to the content guard server!")

urlpatterns = [
    path('tweet/', TweetView.as_view(), name='tweet_data'),
    path('', home, name='home'),
]