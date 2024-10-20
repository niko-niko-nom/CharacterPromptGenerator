from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):

    def __str__(self):
        return self.email

class Category(models.Model):
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order']

class Subcategory(models.Model):
    category = models.ForeignKey(Category, related_name='subcategories', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order']

class Prompt(models.Model):
    subcategory = models.ForeignKey(Subcategory, related_name='prompts', on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    probability = models.FloatField(default=1.0)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default="1")

    def __str__(self):
        return self.text

    class Meta:
        ordering = ['order']

class UserCategory(models.Model):
    user = models.ForeignKey(CustomUser, related_name='userCategories', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class UserSubcategory(models.Model):
    user = models.ForeignKey(CustomUser, related_name='userSubCategories', on_delete=models.CASCADE)
    category = models.ForeignKey(UserCategory, related_name='subcategories', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class UserPrompts(models.Model):
    user = models.ForeignKey(CustomUser, related_name='userPrompts', on_delete=models.CASCADE)
    subcategory = models.ForeignKey(UserSubcategory, related_name='prompts', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
    probability = models.FloatField(default=1.0)

    def __str__(self):
        return self.name