from django import forms 
from django.forms import ModelForm
from .models import Trail, Question

class TrailForm(ModelForm):
    class Meta:
        model = Trail
        fields = ['name']
        widgets = {
                   'name': forms.TextInput(attrs={'class': 'trailName'}),
                   }

    def __init__(self, *args, **kwargs):
        super(TrailForm, self).__init__(*args, **kwargs)
        self.fields['name'].label = "Trail Name:"
        self.fields['name'].widget.attrs.update({'class' : 'trailName'}) 



class QuestionForm(ModelForm):
    class Meta:
        model = Question
        fields = ['question', 'answer', 'latitude', 'longitude']
