# backend/urls.py
from django.urls import path, re_path, include
from django.contrib import admin
from django.views.generic import TemplateView, RedirectView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import get_csrf_token

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # CSRF token endpoint
    path('csrf/', get_csrf_token, name='csrf_token'),
    
    # JWT Authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # API endpoints for different apps
    path('api/accounts/', include('accounts.urls')),
    path('api/chat/', include('chat.urls')),  # Chat API routes
    path('api/mentors/', include('mentors.urls')),  # Mentors API routes
    
    # Favicon redirect
    path('favicon.ico', RedirectView.as_view(url='/static/vite.svg', permanent=True)),
    
    # Catch-all route: Serve React app for all other routes
    # This must be LAST so it doesn't override API routes
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='index'),
]
