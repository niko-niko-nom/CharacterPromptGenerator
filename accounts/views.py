from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from allauth.account.views import LoginView, EmailView
from .models import Category, Subcategory, Prompt

class CustomLoginView(LoginView):
    def get_success_url(self):
        return reverse("library", kwargs={"username": self.request.user.username})

@login_required
def delete_account(request):
    user = request.user

    if request.method == 'POST':
        user.delete()
        messages.success(request, "Your account has been deleted.")
        return redirect(reverse('account_logout'))
    
    return render(request, "account/delete_account.html")

class CustomEmailChangeView(LoginRequiredMixin, EmailView):
    template_name = "account/email_change.html"

    def form_valid(self, form):
        form.save()
        return redirect(reverse("account_email"))

def home(request):
    categories = Category.objects.all()
    subcategories = Subcategory.objects.all()
    prompts = Prompt.objects.all()
    return render(request, 'home.html', {
        'categories': categories,
        'subcategories': subcategories,
        'prompts': prompts
    })

def prompt_view(request):
    categories = Category.objects.prefetch_related('subcategories__prompts').order_by('order')
    return render(request, 'home.html', {'categories': categories})
