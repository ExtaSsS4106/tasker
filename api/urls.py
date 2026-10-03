from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from .views import *
urlpatterns = [
    path('', ErrorResponse.as_view(), name='error-response'),
    
    path('profile-info/', ProfileInfo.as_view(), name='profile-info'),
    
    path('amisuperuser/', AmIsuperUser.as_view(), name='register'),

    path('register/', RegisterView.as_view(), name='register'),
    
    path('profile/', ProfileView.as_view(), name='profile'),
    
    path('logout/', LogoutView.as_view(), name='logout'),
    path('tasks/', TaskListView.as_view(), name='task-list'),
    path('tasks/<int:task_id>/', TaskActionView.as_view(), name='task-action'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
