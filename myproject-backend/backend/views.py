from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.middleware.csrf import get_token
import os


def frontend(request):
    """Serve the React frontend"""
    print("DEBUG: Entering frontend view")
    full_path = os.path.join(settings.FRONTEND_DIR, 'index.html')
    print(f"DEBUG: Full path = '{full_path}'")
    if os.path.exists(full_path):
        print(f"DEBUG: File exists, serving '{full_path}'")
        with open(full_path, 'rb') as f:
            return HttpResponse(f.read(), content_type='text/html')
    print(f"DEBUG: File not found at '{full_path}', returning 404")
    return HttpResponse("File not found", status=404)


def get_csrf_token(request):
    """Return CSRF token for frontend"""
    return JsonResponse({"csrfToken": get_token(request)})