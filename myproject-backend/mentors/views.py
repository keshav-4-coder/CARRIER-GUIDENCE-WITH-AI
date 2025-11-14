# from rest_framework import viewsets, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from rest_framework.filters import SearchFilter, OrderingFilter
# from django_filters.rest_framework import DjangoFilterBackend
# from .models import Mentor, Booking
# from .serializers import MentorSerializer, BookingSerializer
# from django.db.models import Avg, Count, Q
# from django.utils import timezone

# class MentorViewSet(viewsets.ModelViewSet):
#     queryset = Mentor.objects.filter(is_approved=True)
#     serializer_class = MentorSerializer
#     filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
#     filterset_fields = ['category']
#     search_fields = ['full_name', 'expertise', 'short_bio']
#     ordering_fields = ['rating', 'total_sessions', 'full_name']
#     ordering = ['-rating']
    
#     @action(detail=False, methods=['get'])
#     def stats(self, request):
#         """Get mentor statistics"""
#         total_mentors = self.queryset.count()
#         total_sessions = Booking.objects.filter(status='completed').count()
#         average_rating = self.queryset.aggregate(Avg('rating'))['rating__avg'] or 0
        
#         return Response({
#             'total_mentors': total_mentors,
#             'total_sessions': total_sessions,
#             'average_rating': round(average_rating, 1) if average_rating else 0
#         })
    
#     @action(detail=False, methods=['post'])
#     def register(self, request):
#         """Register a new mentor (not approved by default)"""
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(is_approved=False)
#             return Response({
#                 'message': 'Registration successful! Your profile will be reviewed within 24 hours.',
#                 'data': serializer.data
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class BookingViewSet(viewsets.ModelViewSet):
#     queryset = Booking.objects.all()
#     serializer_class = BookingSerializer
#     filter_backends = [DjangoFilterBackend, OrderingFilter]
#     filterset_fields = ['mentor', 'status', 'student_email']
#     ordering_fields = ['booking_date', 'created_at']
#     ordering = ['-created_at']
    
#     def create(self, request, *args, **kwargs):
#         """Create a new booking"""
#         serializer = self.get_serializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
            
#             # Increment mentor's total_sessions
#             booking = serializer.instance
#             booking.mentor.total_sessions += 1
#             booking.mentor.save()
            
#             return Response({
#                 'message': 'Booking created successfully! Confirmation email will be sent shortly.',
#                 'data': serializer.data
#             }, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     @action(detail=True, methods=['post'])
#     def confirm(self, request, pk=None):
#         """Confirm a pending booking"""
#         booking = self.get_object()
#         if booking.status == 'pending':
#             booking.status = 'confirmed'
#             booking.save()
#             return Response({'message': 'Booking confirmed!', 'data': BookingSerializer(booking).data})
#         return Response({'error': 'Only pending bookings can be confirmed.'}, 
#                        status=status.HTTP_400_BAD_REQUEST)
    
#     @action(detail=True, methods=['post'])
#     def cancel(self, request, pk=None):
#         """Cancel a booking"""
#         booking = self.get_object()
#         if booking.status in ['pending', 'confirmed']:
#             booking.status = 'cancelled'
#             booking.save()
#             return Response({'message': 'Booking cancelled.', 'data': BookingSerializer(booking).data})
#         return Response({'error': 'Cannot cancel completed or already cancelled bookings.'}, 
#                        status=status.HTTP_400_BAD_REQUEST)
    
#     @action(detail=True, methods=['post'])
#     def complete(self, request, pk=None):
#         """Mark booking as completed and request rating"""
#         booking = self.get_object()
#         if booking.status == 'confirmed':
#             booking.status = 'completed'
#             booking.save()
            
#             # Request rating from request data if provided
#             rating = request.data.get('rating')
#             if rating:
#                 mentor = booking.mentor
#                 # Calculate new average rating
#                 all_ratings = Booking.objects.filter(
#                     mentor=mentor, 
#                     status='completed'
#                 ).exclude(rating_given=True)
#                 mentor.rating = float(rating)
#                 mentor.save()
            
#             return Response({'message': 'Session marked as completed!', 'data': BookingSerializer(booking).data})
#         return Response({'error': 'Only confirmed bookings can be completed.'}, 
#                        status=status.HTTP_400_BAD_REQUEST)
    
#     @action(detail=False, methods=['get'])
#     def my_bookings(self, request):
#         """Get bookings for a specific student email"""
#         email = request.query_params.get('email')
#         if not email:
#             return Response({'error': 'Email parameter required.'}, 
#                           status=status.HTTP_400_BAD_REQUEST)
        
#         bookings = self.queryset.filter(student_email=email)
#         serializer = self.get_serializer(bookings, many=True)
#         return Response(serializer.data)



from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Mentor, Booking
from .serializers import MentorSerializer, BookingSerializer
from django.db.models import Avg, Count, Q
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from .email_utils import send_booking_confirmation_email, send_booking_completed_email

class MentorViewSet(viewsets.ModelViewSet):
    queryset = Mentor.objects.filter(is_approved=True)
    serializer_class = MentorSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['full_name', 'expertise', 'short_bio']
    ordering_fields = ['rating', 'total_sessions', 'full_name']
    ordering = ['-rating']
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get mentor statistics"""
        total_mentors = self.queryset.count()
        total_sessions = Booking.objects.filter(status='completed').count()
        average_rating = self.queryset.aggregate(Avg('rating'))['rating__avg'] or 0
        
        return Response({
            'total_mentors': total_mentors,
            'total_sessions': total_sessions,
            'average_rating': round(average_rating, 1) if average_rating else 0
        })
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new mentor (not approved by default)"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(is_approved=False)
            return Response({
                'message': 'Registration successful! Your profile will be reviewed within 24 hours.',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['mentor', 'status', 'student_email']
    ordering_fields = ['booking_date', 'created_at']
    ordering = ['-created_at']
    
    def create(self, request, *args, **kwargs):
        """Create a new booking and send confirmation email"""
        serializer = self.get_serializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                booking = serializer.save()
                
                # Increment mentor's total_sessions
                booking.mentor.total_sessions += 1
                booking.mentor.save()
                
                # Send confirmation email
                try:
                    send_booking_confirmation_email(booking)
                except Exception as e:
                    print(f"Email sending error: {e}")
                
                return Response({
                    'message': 'Booking created successfully! Confirmation email has been sent.',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': f'Booking failed: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a pending booking and send confirmation email"""
        booking = self.get_object()
        if booking.status == 'pending':
            booking.status = 'confirmed'
            booking.save()
            
            # Send confirmation email
            try:
                send_booking_confirmation_email(booking)
            except Exception as e:
                print(f"Email sending error: {e}")
            
            return Response({
                'message': 'Booking confirmed! Confirmation email has been sent.',
                'data': BookingSerializer(booking).data
            })
        return Response({'error': 'Only pending bookings can be confirmed.'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        if booking.status in ['pending', 'confirmed']:
            booking.status = 'cancelled'
            booking.save()
            
            # Send cancellation email
            try:
                send_booking_cancellation_email(booking)
            except Exception as e:
                print(f"Email sending error: {e}")
            
            return Response({
                'message': 'Booking cancelled.',
                'data': BookingSerializer(booking).data
            })
        return Response({'error': 'Cannot cancel completed or already cancelled bookings.'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark booking as completed and send completion email"""
        booking = self.get_object()
        if booking.status == 'confirmed':
            booking.status = 'completed'
            booking.save()
            
            # Request rating from request data if provided
            rating = request.data.get('rating')
            if rating:
                mentor = booking.mentor
                # Calculate new average rating
                all_bookings = Booking.objects.filter(
                    mentor=mentor, 
                    status='completed'
                )
                if all_bookings.exists():
                    total_rating = sum([b.rating for b in all_bookings if b.rating]) + float(rating)
                    mentor.rating = total_rating / (all_bookings.count() + 1)
                    mentor.save()
            
            # Send completion email to both student and mentor
            try:
                send_booking_completed_email(booking)
            except Exception as e:
                print(f"Email sending error: {e}")
            
            return Response({
                'message': 'Session marked as completed! Notification emails have been sent.',
                'data': BookingSerializer(booking).data
            })
        return Response({'error': 'Only confirmed bookings can be completed.'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        """Get bookings for a specific student email"""
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Email parameter required.'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        bookings = self.queryset.filter(student_email=email)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)