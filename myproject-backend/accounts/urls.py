from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Authentication endpoints
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('google-auth/', views.google_auth, name='google-auth'),
    
    # User profile endpoints
    path('profile/', views.get_user_profile, name='profile'),
    path('profile/update/', views.update_user_profile, name='update-profile'),
    path('change-password/', views.change_password, name='change-password'),
    
    # Admin endpoints
    path('admin/users/', views.list_all_users, name='list-users'),
    path('admin/users/<int:user_id>/', views.get_user_detail, name='user-detail'),
    path('admin/users/<int:user_id>/update/', views.update_user, name='update-user'),
    path('admin/users/<int:user_id>/delete/', views.delete_user, name='delete-user'),
    path('admin/users/<int:user_id>/toggle-status/', views.toggle_user_status, name='toggle-user-status'),
]