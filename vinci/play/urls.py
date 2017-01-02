from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^create$', views.create_trail, name='create'),
    url(r'^create-update$', views.create_update, name='create-update'),
    url(r'^correct$', views.correct_answer, name='correct_answer'),
    url(r'^create-question$', views.create_question, name='create-question'),


]