from django.http import HttpResponse
from django.urls import path
from .views import TweetView, KeywordCategoryView, ReportView

def home(request):
    return HttpResponse("Welcome to the content guard server!")

urlpatterns = [
    path('tweet/', TweetView.as_view(), name='tweet_data'),
    path('blockedCounts/', KeywordCategoryView.as_view(), name='keyword_category_data'),
    path('report/', ReportView.as_view(), name='report_data'),
    path('report/<int:report_id>/get/', ReportView.as_view(), name='report-get'),
    path('report/<int:report_id>/delete/', ReportView.as_view(), name='report-delete'),
    path('', home, name='home'),
]
