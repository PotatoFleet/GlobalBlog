from django.shortcuts import render, redirect
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.core.files.base import ContentFile
from .models import User, Post
from string import ascii_lowercase, ascii_uppercase
import json


def home(request):

    if 'sort_by' not in request.session:
        request.session['sort_by'] = "Latest"

    if 'show' not in request.session:
        request.session['show'] = "All Blogs"

    sort_by = request.session['sort_by']
    show = request.session['show']

    blogs = Post.objects.all()[::-1]

    if request.method == 'POST':
        show = request.POST['show'] if request.POST['show'] != "" else show
        request.session['show'] = show

        if show == "Liked Blogs":
            blogs = []
            for blog in User.objects.get(username=request.session['user']).likedblogs_set.all():
                try:
                    blogs.append(Post.objects.get(id=blog.blog_id))
                except:
                    pass

        elif show == "Your Blogs":
            blogs[:] = [blog for blog in blogs if blog.sender ==
                        request.session['user']]

        sort_by = request.POST['sort'] if request.POST['sort'] != "" else sort_by
        request.session['sort_by'] = sort_by

        if sort_by == "Most Liked":
            blogs = [post[1] for post in sorted(zip([post.likes for post in blogs],
                                                    blogs), key=lambda x: x[0])][::-1]
        elif sort_by == "Latest":
            blogs = blogs[::-1]

    return render(request, 'home.html', {
        'blogs': blogs,
        'sorted_by': sort_by,
        'show': show,
        'liked_blogs': [blog.blog_id for blog in User.objects.get(username=request.session['user']).likedblogs_set.all()] if "user" in request.session else None
    })


def register(request):

    if request.method == 'POST':

        username = request.POST['username']
        password = request.POST['password']
        email = request.POST['email']

        user = User(username=username, password=password, email=email)
        user.save()

        return redirect('login')

    usernames = [user.username for user in User.objects.all()]
    json_usernames = json.dumps(usernames)

    emails = [user.email for user in User.objects.all()]
    json_emails = json.dumps(emails)

    return render(request, 'register.html', {'usernames': json_usernames, 'emails': json_emails})


def login(request):

    if 'user' in request.session:
        messages.error(request, "You are already logged in")
        return redirect('home')

    if request.method == "POST":

        username = request.POST['username']
        password = request.POST['password']

        try:
            User.objects.get(username=username, password=password)
        except:
            messages.error(request, 'Invalid username or password')
            return redirect('login')

        request.session['user'] = username

        messages.success(request, 'Successfully logged in')
        return redirect('home')

    return render(request, 'login.html')


def reset_password(request):

    emails = [user.email for user in User.objects.all()]
    emailsJSON = json.dumps(emails)

    return render(request, 'reset_password.html', {'emails': emailsJSON})


def sent(request):
    return render(request, 'sent.html')


def logout(request):

    if request.session.get('user', False):
        del request.session['user']
    else:
        messages.error(request, "You are already logged out")
        return redirect('home')

    messages.success(request, "Successfully logged out")
    return redirect('home')


def encrypt(string):
    signature = ['@', '.'] + list(ascii_uppercase) + \
        list(ascii_lowercase) + [str(i) for i in range(10)]

    encrypted_string = "".join([signature[signature.index(
        string[i]) + 5] + signature[signature.index(string[i]) + 10] for i in range(len(string))])

    return encrypted_string


def reset(request, token, email):

    enc = encrypt(email)

    if enc != token:

        messages.error(request, "Invalid verification token")
        return redirect('home')

    if request.method == 'POST':

        new_password = request.POST.get('new_password')
        password_confirm = request.POST.get('confirm_password')

        if new_password != password_confirm:
            messages.error(request, "Passwords do not match")
            return redirect(f'/resetPassword/{token}/{email}/')

        user = User.objects.get(email=email)
        user.password = new_password
        user.save()

        messages.success(request, "Password saved successfully")
        return redirect('login')

    return render(request, 'reset.html', {'token': token, 'email': email})


def verified(request, token, email):
    return redirect(f'/resetPassword/{token}/{email}')


def settings(request):
    if 'user' not in request.session:
        return redirect('login')

    user = User.objects.get(username=request.session['user'])
    return render(request, 'settings.html', {'user': user})


@csrf_exempt
def save_picture(request):

    if request.method == "POST":

        image = request.FILES['img']

        user = User.objects.get(username=request.session['user'])

        if user.picture != user.username + '.png':
            user.picture = user.username + '.png'
            user.save()

            default_storage.save(
                f'blog/static/images/{user.username}.png', ContentFile(image.read()))
        else:
            default_storage.delete(f'blog/static/images/{user.username}.png')
            default_storage.save(
                f'blog/static/images/{user.username}.png', ContentFile(image.read()))

    return redirect('settings')


def post(request):

    if 'user' not in request.session:
        messages.error(request, "You must be logged in to create posts")
        return redirect('home')

    if request.method == "POST":

        sender = request.session['user']
        blog_title = request.POST.get('blog_title', False)
        blog_content = request.POST.get('blog_content', False)

        blog = Post(sender=sender, blog_title=blog_title,
                    blog_content=blog_content)

        blog.save()

        return redirect(f'/blog/{blog.id}')

    return render(request, 'post.html')


def blog(request, id):

    blog = Post.objects.get(id=id)

    if "user" in request.session:

        liked_blogs = [blog.blog_id for blog in User.objects.get(
            username=request.session['user']).likedblogs_set.all()]

        return render(request, "blog.html", {
            'blog': blog,
            'liked_blog': int(id) in liked_blogs
        })

    return render(request, "blog.html", {
        "blog": blog,
        'liked_blog': []
    })


def user_blogs(request):

    if 'user' not in request.session:
        messages.error(request, "You must be logged in to access this webpage")
        return redirect('home')

    liked_blogs = [blog.blog_id for blog in User.objects.get(
        username=request.session['user']).likedblogs_set.all()]

    return render(request, "user_blogs.html", {'blogs': Post.objects.all(), 'liked_blogs': liked_blogs})


@ csrf_exempt
def save_likes(request):

    if request.method == "POST":

        blog = Post.objects.get(id=request.POST.get('id'))

        user = User.objects.get(username=request.session['user'])

        liked_blog_set = [
            liked_blog.blog_id for liked_blog in user.likedblogs_set.all()]

        if blog.id in liked_blog_set:
            user.likedblogs_set.filter(blog_id=blog.id).delete()
        else:
            user.likedblogs_set.create(blog_id=blog.id, user=user)

        blog.likes = request.POST.get('likes')
        blog.save()

    return redirect('home')


def liked_blogs(request):

    if "user" not in request.session:
        messages.error(request, "You are not logged in")
        return redirect('home')

    user = User.objects.get(username=request.session['user'])

    liked_blogs = [
        liked_blog.blog_id for liked_blog in user.likedblogs_set.all()]

    blogs = [blog for blog in Post.objects.all() if blog.id in liked_blogs]

    return render(request, "liked_blogs.html", {
        "blogs": blogs
    })


def edit_blog(request, id):

    if 'user' not in request.session:
        messages.error(request, "You are not logged in")
        return redirect('home')

    blog = Post.objects.get(id=id)

    if blog.sender != request.session['user']:
        messages.error(request, "You do not own this blog")
        return redirect('home')

    if request.method == "POST":

        blog_title = request.POST['blog-title']
        blog_content = request.POST['blog-content']

        blog.blog_title = blog_title
        blog.blog_content = blog_content

        blog.save()

        messages.success(request, "Successfully saved blog")
        return redirect(f'/blog/{id}')

    return render(request, "edit.html", {'blog': Post.objects.get(id=id)})


def delete_blog(request, id):

    blog = Post.objects.get(id=id)

    if blog.sender != request.session['user']:
        messages.error(request, "You cannot delete blogs that you didn't make")
        return redirect('home')

    blog.delete()

    messages.success(request, "Succssfully deleted blog")
    return redirect('home')
