from django.contrib import admin
from .models import Category, Subcategory, Prompt
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ["email", "username",]

admin.site.register(CustomUser, CustomUserAdmin)

class SubcategoryInline(admin.TabularInline):
    model = Subcategory
    extra = 1
    fields = ['name', 'order']  # Show order field for sorting
    ordering = ['order']

class PromptInline(admin.TabularInline):
    model = Prompt
    extra = 1
    fields = ['text', 'order']  # Show order field for sorting
    ordering = ['order']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order']
    inlines = [SubcategoryInline]
    ordering = ['order']

@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'order']
    inlines = [PromptInline]
    ordering = ['order']

@admin.register(Prompt)
class PromptAdmin(admin.ModelAdmin):
    list_display = ['text', 'subcategory', 'order']
    ordering = ['order']