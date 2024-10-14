#from django.shortcuts import render
from django.urls import reverse_lazy
from django.contrib.auth import logout
from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm
from django.contrib.auth.views import PasswordChangeView, LogoutView
from django.views.generic import CreateView


class SignUpView(CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"

class PasswordChange(PasswordChangeView):
    form_class = PasswordChangeForm
    success_url = reverse_lazy("login")
    template_name = "registration/password_change_form.html"

    def form_valid(self, form):
        response = super().form_valid(form)
        logout(self.request)
        return response
    
class LogOutUser(LogoutView):
    form_class = LogoutView
    succes_url = reverse_lazy("home")