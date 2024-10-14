from allauth.account.adapter import DefaultAccountAdapter
from django.urls import reverse
from django.shortcuts import redirect

class CustomAccountAdapter(DefaultAccountAdapter):
    def get_login_redirect_url(self, request):
        return reverse("library", args=[request.user.username])
    
    def get_signup_redirect_url(self, request):
        return reverse("library", args=[request.user.username])  
