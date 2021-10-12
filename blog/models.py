from django.db import models
from datetime import date

# Create your models here.


class User(models.Model):
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=50)
    email = models.CharField(max_length=50)

    picture = models.CharField(max_length=30, default="default.png")


class likedBlogs(models.Model):
    blog_id = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Liked Blogs"


class Post(models.Model):

    sender = models.CharField(max_length=30)
    blog_title = models.CharField(max_length=50)
    blog_content = models.TextField()
    post_date = models.DateField(default=date.today)
    likes = models.IntegerField(default=0)
