from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.urls import reverse
from django.views.decorators.http import require_POST
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from allauth.account.views import LoginView, EmailView
from .models import Category, UserCategory, Prompt

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
    categories = Category.objects.prefetch_related('subcategories__prompts')
    userCategories = UserCategory.objects.prefetch_related('usersubcategories__userprompts')

    context = {'categories': categories, 'userCategories': userCategories}

    return render(request, 'home.html', context)

@login_required
@require_POST
def updateProbability(request):
    prompt_text = request.POST.get('prompt_id')
    new_probability = request.POST.get('probability')

    try:
        prompt = Prompt.objects.get(text=prompt_text, user=request.user)
        prompt.probability = float(new_probability)
        prompt.save()
        return JsonResponse({'status': 'success'})
    except Prompt.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Prompt not found'}, status=404)