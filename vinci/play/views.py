from django.shortcuts import render
from .models import Trail, Question
from django.core import serializers
import json

# Create your views here.

def index(request):
    trail_id = int(request.GET.get('id'))
    trail = Trail.objects.get(pk=trail_id)
    questions = trail.questions.all()
    question_json = serializers.serialize("json", questions)

    return render(request, 'index.html', {'trail':trail, 'question_json':question_json})