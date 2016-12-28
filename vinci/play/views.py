from django.shortcuts import render
from .models import Trail, Question, CookieTracker, CookieQuestionTracker
from django.core import serializers
import json

# Create your views here.

def index(request):
    trail_id = int(request.GET.get('id'))
    trail = Trail.objects.get(pk=trail_id)
    questions = trail.questions.all()
    question_json = serializers.serialize("json", questions)
    """Check if they have a cookie for this trail and create one if not"""
    cookie = request.COOKIES.get(str(trail.uid))
    if cookie:
        cookie_tracker = CookieTracker.objects.filter(uid = cookie).last()
    else:
        cookie_tracker = CookieTracker(trail=trail)
        cookie_tracker.save()


    """Add a field in question_json for each question if it is completed or not"""


    response = render(request, 'index.html', {'trail':trail, 'question_json':question_json})
    response.set_cookie(str(trail.uid), value=str(cookie_tracker.uid), max_age=1000000)

    return response


