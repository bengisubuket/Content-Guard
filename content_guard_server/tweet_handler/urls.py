from django.http import HttpResponse
from django.urls import path
from .views import TweetView, KeywordCategoryView, ReportView, UserView, KeywordsGroupedBySecondView, CategoryGroupedBySecondView, KwStatsView, CatStatsView

def home(request):
    return HttpResponse("Welcome to the content guard server!")

urlpatterns = [
    path('tweet/', TweetView.as_view(), name='tweet_data'),
    path('blockedCounts/', KeywordCategoryView.as_view(), name='keyword_category_data'),
    path('report/', ReportView.as_view(), name='report_data'),
    path('report/<str:report_id>/', ReportView.as_view()),
    path('report/<int:report_id>/delete/', ReportView.as_view(), name='report-delete'),
    path('stat/kw/', KeywordsGroupedBySecondView.as_view(), name='keywords_grouped_by_second'),
    path('stat/cat/', CategoryGroupedBySecondView.as_view(), name='category_grouped_by_second'),
    path('stat/kw/24hr/', KwStatsView.as_view(), name='kw_stats'),
    path('stat/cat/24hr/', CatStatsView.as_view(), name='cat_stats'),
    path('', home, name='home'),
    path('user/', UserView.as_view(), name='user_data'),
    path('user/<str:user_id>/', UserView.as_view()), # get user by user_id,
]
