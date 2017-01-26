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
        widgets = {
           'question': forms.TextInput(attrs={'class': 'form_input'}),
           'answer': forms.TextInput(attrs={'class': 'form_input'}),
           'question': forms.Textarea(attrs={ 'rows': 3}),
           'answer': forms.Textarea(attrs={ 'rows': 3})
           }
        
    def __init__(self, *args, **kwargs):
        super(QuestionForm, self).__init__(*args, **kwargs)
        self.fields['question'].widget.attrs.update({'class' : 'form_input'})
        self.fields['answer'].widget.attrs.update({'class' : 'form_input'})