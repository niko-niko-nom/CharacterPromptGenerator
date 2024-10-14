from django.urls import reverse_lazy, reverse
from django.contrib.auth.forms import UserCreationForm
from django.views.generic import CreateView
from django.shortcuts import redirect
from allauth.account.views import LoginView


class SignUpView(CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"

class CustomLoginView(LoginView):
    def get_success_url(self):
        return reverse("library", username=self.request.user.username)