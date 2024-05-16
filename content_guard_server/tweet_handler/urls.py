from django.http import HttpResponse
from django.urls import path
from .views import TweetView, KeywordCategoryView, ReportView, UserView, KeywordsGroupedBySecondView, CategoryGroupedBySecondView, KwStatsView, CatStatsView

def home(request):
    return HttpResponse("Welcome to the content guard server!")

urlpatterns = [
    path('tweet/', TweetView.as_view(), name='tweet_data'),
    path('blockedCounts/', KeywordCategoryView.as_view(), name='keyword_category_data'),
    path('report/', ReportView.as_view(), name='report_data'),
    path('report/<str:user_id>/<str:report_id>/', ReportView.as_view()),
    path('report/<str:user_id>/', ReportView.as_view(), name='report-get-all'),
    path('report/<str:user_id>/<int:report_id>/delete/', ReportView.as_view(), name='report-delete'),
    path('stat/kw/<str:user_id>/', KeywordsGroupedBySecondView.as_view(), name='keywords_grouped_by_second'),
    path('stat/cat/<str:user_id>/', CategoryGroupedBySecondView.as_view(), name='category_grouped_by_second'),
    path('stat/kw/24hr/<str:user_id>/', KwStatsView.as_view(), name='kw_stats'),
    path('stat/cat/24hr/<str:user_id>/', CatStatsView.as_view(), name='cat_stats'),
    path('', home, name='home'),
    path('user/', UserView.as_view(), name='user_data'),
    path('user/<str:user_id>/', UserView.as_view()), # get user by user_id,
]
