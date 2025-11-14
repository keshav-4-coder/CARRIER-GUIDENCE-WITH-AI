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
    # Correct: Only ONE include for chat
    path('chat/api/', include('chat.urls')),  # ← /chat/api/chat/

    # JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Other apps
    path('api/accounts/', include('accounts.urls')),
    path('/mentors/', include('mentors.urls')),  # ← Fixed: was 'api/' prefix

    path('admin/', admin.site.urls),
    path("csrf/", get_csrf_token),

    path('favicon.ico', RedirectView.as_view(url='/static/vite.svg')),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='index'),
]