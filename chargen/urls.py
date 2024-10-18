from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView
from allauth.account.views import LoginView
from accounts import views
from accounts.views import CustomEmailChangeView, home

urlpatterns = [
    path('admin/', admin.site.urls),
    path("home/", home, name="home"),
    path("library/<str:username>/", TemplateView.as_view(template_name="library.html"), name="library"),
    path("settings/<str:username>/", TemplateView.as_view(template_name="settings.html"), name="settings"),
    path("accounts/login/", LoginView.as_view(), name="account_login"),
    path('account/change-email/', CustomEmailChangeView.as_view(), name='account_email_change'),
    path("accounts/", include("allauth.urls")),
    path('delete-account/', views.delete_account, name='delete_account'),
]