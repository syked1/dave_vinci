from django.shortcuts import render, HttpResponse
from .models import Trail, Question, TrailCookie, CorrectQuestion
from django.core import serializers
import json

# Create your views here.

def index(request):
    trail_id = int(request.GET.get('id'))
    trail = Trail.objects.get(pk=trail_id)
    questions = trail.questions.all()
    question_json = json.loads(serializers.serialize("json", questions))
    
    """Check if they have a cookie for this trail and create one if not"""
    cookie_key = request.COOKIES.get(str(trail.uid))
    if cookie_key:
        trail_cookie = TrailCookie.objects.filter(uid = cookie_key).last()
    else:
        trail_cookie = TrailCookie(trail=trail)
        trail_cookie.save()

    """Add a field in question_json for each question if it is completed or not"""
    correct_questions = trail_cookie.correct_questions.all()
    correct_question_ids = [cq.question.id for cq in correct_questions]
    for q in question_json:
        if q['pk'] in correct_question_ids:
            q['correct'] = True
        else:
            q['correct'] = False
    question_json_string = json.dumps(question_json)
    response = render(request, 'index.html', {'trail':trail, 'question_json':question_json_string})
    response.set_cookie(str(trail.uid), value=str(trail_cookie.uid), max_age=1000000)

    return response


def correct_answer(request):
    question_id =  int(request.GET.get('id'))
    question = Question.objects.get(pk=question_id)
    trail = question.trail
    cookie_key = request.COOKIES.get(str(trail.uid))
    trail_cookie = TrailCookie.objects.filter(uid = cookie_key).last()
    c = CorrectQuestion(trail_cookie=trail_cookie, question=question)
    c.save()
    return HttpResponse('{}', content_type="application/json")
