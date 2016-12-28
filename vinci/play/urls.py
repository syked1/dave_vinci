from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^correct$', views.correct_answer, name='correct_answer')


]