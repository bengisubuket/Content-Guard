from django.db import models

class Tweet(models.Model):
    user_id = models.CharField(max_length=255)
    tab_id = models.CharField(max_length=255)
    category = models.TextField()
    tweet_text = models.TextField()

    def __str__(self):
        return self.category
    
class Keyword(models.Model):
    keyword = models.CharField(max_length=255, unique=True)
    number_of_blocked_tweets = models.IntegerField(default=0)

    def __str__(self):
        return self.keyword
    
class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    number_of_blocked_tweets = models.IntegerField(default=0)

    def __str__(self):
        return self.name