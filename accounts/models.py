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
        ordering = ['order']  # Ensure ordering by 'order' field


class Subcategory(models.Model):
    category = models.ForeignKey(Category, related_name='subcategories', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.category.name} -> {self.name}'

    class Meta:
        ordering = ['order']  # Ensure ordering by 'order' field


class Prompt(models.Model):
    subcategory = models.ForeignKey(Subcategory, related_name='prompts', on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.subcategory.name}: {self.text}'

    class Meta:
        ordering = ['order']  # Ensure ordering by 'order' field
