from django.db import models

class User(models.Model):
    token = models.CharField(max_length=255, null=True, blank=True)
    secret = models.CharField(max_length=255, null=True, blank=True)
    user_displayName = models.CharField(max_length=255, null=True, blank=True)
    user_id = models.CharField(max_length=255, unique=True)
    photo_url = models.URLField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phoneNumber = models.CharField(max_length=255, null=True, blank=True)
    userName = models.CharField(max_length=255, null=True, blank=True)


class Tweet(models.Model):
    tab_id = models.CharField(max_length=255)
    category = models.TextField()
    tweet_text = models.TextField()
    tweet_id = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.category
    
class Keyword(models.Model):
    keyword = models.CharField(max_length=255)
    tweet_ids = models.JSONField(default=list)
    number_of_blocked_tweets = models.IntegerField(default=0)
    time_added = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.keyword
    
class Category(models.Model):
    name = models.CharField(max_length=255)
    tweet_ids = models.JSONField(default=list)
    number_of_blocked_tweets = models.IntegerField(default=0)
    time_added = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Report(models.Model):
    user_id = models.CharField(max_length=255)
    report_id = models.CharField(max_length=255, unique=True)
    categories_reported = models.JSONField(default=list)
    keywords_reported = models.JSONField(default=list)
    time_added = models.DateTimeField(auto_now_add=True)

