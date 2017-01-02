from django.db import models
import uuid
from django.core import serializers
import json
# Create your models here.

class Trail(models.Model):
    uid = models.UUIDField(primary_key=False, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def return_question_json_string(self):
        questions = self.questions.all()
        question_json = json.loads(serializers.serialize("json", questions))
        question_json_string = json.dumps(question_json)
        return question_json_string



class Question(models.Model):
    trail = models.ForeignKey(Trail, null=True, on_delete=models.SET_NULL,
                              related_name='questions')
    question = models.CharField(max_length=1000, null=False)
    location_answer = models.BooleanField(default=False)
    answer = models.CharField(max_length=1000, null=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    answer_latitude = models.FloatField(null=True)
    answer_longitude = models.FloatField(null=True)


class TrailCookie(models.Model):
    trail = models.ForeignKey(Trail, null=True, on_delete=models.SET_NULL,
                              related_name='trail_cookies')
    uid = models.UUIDField(primary_key=False, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def return_question_json_string(self):
        questions = self.trail.questions.all()
        correct_questions = self.correct_questions.all()
        correct_question_ids = [cq.question.id for cq in correct_questions]
        question_json = json.loads(serializers.serialize("json", questions))
        for q in question_json:
            if q['pk'] in correct_question_ids:
                q['fields']['correct'] = True
                q['fields']['discovered'] = True
            else:
                q['fields']['correct'] = False
                q['fields']['discovered'] = False
        print(question_json)
        question_json_string = json.dumps(question_json)
        return question_json_string


class CorrectQuestion(models.Model):
    trail_cookie = models.ForeignKey(TrailCookie, null=True,
                                       on_delete=models.SET_NULL, related_name='correct_questions')
    question = models.ForeignKey(Question, null=True,
                                       on_delete=models.SET_NULL, related_name='correct_questions')
    created_at = models.DateTimeField(auto_now_add=True)

