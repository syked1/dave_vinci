from django.shortcuts import render, HttpResponse
from .models import Trail, Question, TrailCookie, CorrectQuestion


# Create your views here.

def index(request):
    trail_id = int(request.GET.get('id'))
    trail = Trail.objects.get(pk=trail_id)
    
    
    """Check if they have a cookie for this trail and create one if not"""
    cookie_key = request.COOKIES.get(str(trail.uid))
    if cookie_key:
        trail_cookie = TrailCookie.objects.filter(uid = cookie_key).last()
    else:
        trail_cookie = TrailCookie(trail=trail)
        trail_cookie.save()

    question_json_string = trail_cookie.return_question_json_string()
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
    question_json_string = trail_cookie.return_question_json_string()
    return HttpResponse(question_json_string, content_type="application/json")
