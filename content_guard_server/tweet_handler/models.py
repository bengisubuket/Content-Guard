from django.db import models

class Tweet(models.Model):
    user_id = models.CharField(max_length=255)
    tab_id = models.CharField(max_length=255)
    category = models.TextField()

    def __str__(self):
        return self.category