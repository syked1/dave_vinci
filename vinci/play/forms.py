from django.forms import ModelForm
from .models import Trail, Question

class TrailForm(ModelForm):
    class Meta:
        model = Trail
        fields = ['name']

class QuestionForm(ModelForm):
    class Meta:
        model = Question
        fields = ['question', 'answer', 'latitude', 'longitude']
