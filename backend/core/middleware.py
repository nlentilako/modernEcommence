"""Custom middleware for the Smart E-Commerce platform."""
import json
import time
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from utils.logging import log_request


class RequestLoggingMiddleware(MiddlewareMixin):
    """Middleware to log API requests for analytics and debugging."""
    
    def process_request(self, request):
        request.start_time = time.time()
        return None

    def process_response(self, request, response):
        if hasattr(request, 'start_time') and request.path.startswith('/api/'):
            duration = time.time() - request.start_time
            
            # Log request details
            log_data = {
                'method': request.method,
                'path': request.path,
                'user': str(request.user) if hasattr(request, 'user') and request.user.is_authenticated else 'Anonymous',
                'status_code': response.status_code,
                'duration': duration,
                'timestamp': time.time(),
            }
            
            # Log to file or external service
            log_request(log_data)
        
        return response


class RateLimitMiddleware(MiddlewareMixin):
    """Middleware to implement rate limiting."""
    
    def process_request(self, request):
        # Implement rate limiting logic here
        # This is a simplified version - in production, use django-ratelimit
        return None


class SecurityHeadersMiddleware(MiddlewareMixin):
    """Middleware to add security headers to responses."""
    
    def process_response(self, request, response):
        # Add security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        return response