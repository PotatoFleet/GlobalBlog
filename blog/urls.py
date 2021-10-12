
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('login/', views.login, name="login"),
    path('register/', views.register, name="register"),
    path('logout/', views.logout, name="logout"),
    path('reset/', views.reset_password, name="reset"),
    path('sent/', views.sent, name="sent"),
    path('emailVerification/<token>/<email>/',
         views.verified, name="verify-token"),
    path('resetPassword/<token>/<email>/', views.reset, name="reset-password"),
    path('settings/', views.settings, name="settings"),
    path('settings/savePicture/', views.save_picture, name="save-picture"),
    path('post/', views.post, name="post"),
    path('blog/<id>', views.blog, name="blog"),
    path('userBlogs/', views.user_blogs, name="user_blogs"),
    path('likedBlogs/', views.liked_blogs, name="liked_blogs"),
    path('saveLikes/', views.save_likes, name="save_likes"),
    path('editBlog/<id>/', views.edit_blog, name="edit_blog"),
    path('deleteBlog/<id>', views.delete_blog, name="delete-blog")
]
