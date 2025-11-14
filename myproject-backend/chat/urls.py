# chat/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.chatbot_api, name='chatbot_api'),      # → /chat/api/chat/
    path('clear/', views.clear_chat, name='clear_chat'),       # → /chat/api/clear/
]