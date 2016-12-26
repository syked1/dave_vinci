from django.db import models

# Create your models here.

class Trail(models.Model):
    name = models.CharField(max_length=100, null=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Question(models.Model):
    trail = models.ForeignKey(Trail, null=True, on_delete=models.SET_NULL, related_name='questions')
    question = models.CharField(max_length=1000, null=False)
    location_answer = models.BooleanField(default=False)
    answer = models.CharField(max_length=1000, null=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    answer_latitude = models.FloatField(null=True)
    answer_longitude = models.FloatField(null=True)


