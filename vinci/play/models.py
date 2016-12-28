from django.db import models
import uuid
# Create your models here.

class Trail(models.Model):
    uid = models.UUIDField(primary_key=False, default=uuid.uuid4, editable=False)
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


class CookieTracker(models.Model):
    trail = models.ForeignKey(Trail, null=True, on_delete=models.SET_NULL, related_name='cookies')
    uid = models.UUIDField(primary_key=False, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)


class CookieQuestionTracker(models.Model):
    cookie_tracker = models.ForeignKey(CookieTracker, null=True,
                                       on_delete=models.SET_NULL, related_name='cookie_questions')
    question = models.ForeignKey(CookieTracker, null=True,
                                       on_delete=models.SET_NULL, related_name='cookies')
    created_at = models.DateTimeField(auto_now_add=True)