from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from .models import Trail, Question, TrailCookie, CorrectQuestion
from .forms import TrailForm, QuestionForm
from django.core import serializers

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



def create_trail(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = TrailForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            t = form.save()
            trail_id = t.id
            # redirect to a new URL:
            return HttpResponseRedirect('/create-update?id={}'.format(trail_id))

    # if a GET (or any other method) we'll create a blank form
    else:
        form = TrailForm()
        response = render(request, 'create.html', {'form':form})
        return response



def create_update(request):
    try:
        trail_id = int(request.GET.get('id'))
    except TypeError:
        return HttpResponseRedirect('/create')    
    try:
        trail = Trail.objects.get(pk=trail_id)
    except (Trail.DoesNotExist, ValueError):
        return HttpResponseRedirect('/create')
    else:
        question_json_string = trail.return_question_json_string()
    form = QuestionForm()
    response = render(request, 'update.html', {'trail':trail,
                      'question_json':question_json_string,
                      'form':form})
    return response

def create_question(request):
    trail_id = int(request.GET.get('id'))
    trail = Trail.objects.get(pk=trail_id)
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = QuestionForm(request.POST)
        
        # check whether it's valid:
        if form.is_valid():
            print('valid')
            # process the data in form.cleaned_data as required
            q = form.save(commit=False)
            q.trail = trail
            q.save()
            question_json_string = trail.return_question_json_string()
            # redirect to a new URL:
            response = HttpResponse(question_json_string, content_type="application/json")
            return response
        else:
            print(form.errors)

    # if a GET (or any other method) we'll create a blank form
    else:
        return HttpResponse('{}', content_type="application/json")



