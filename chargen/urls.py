from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView
from allauth.account.views import LoginView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("home/", TemplateView.as_view(template_name="home.html"), name="home"),
    path("<str:username>/library/", TemplateView.as_view(template_name="library.html"), name="library"),
    path("accounts/login/", LoginView.as_view(), name="account_login"),
    path("accounts/", include("allauth.urls")),
]