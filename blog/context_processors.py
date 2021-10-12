from .models import User


def users(request):
    users = User.objects.all()
    return {'users': users}
