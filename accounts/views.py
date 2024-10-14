from django.urls import reverse_lazy, reverse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.views.generic import CreateView
from django.shortcuts import redirect, render
from allauth.account.views import LoginView
from django.contrib import messages


class SignUpView(CreateView):
    form_class = UserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"

class CustomLoginView(LoginView):
    def get_success_url(self):
        return reverse("library", username=self.request.user.username)
    
@login_required
def delete_account(request):
    user = request.user

    if request.method == 'POST':
        user.delete()
        messages.success(request, "Your account has been deleted.")
        return redirect(reverse('account_logout'))
    
    return render(request, "account/delete_account.html")