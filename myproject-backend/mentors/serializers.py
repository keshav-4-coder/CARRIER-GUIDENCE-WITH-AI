from rest_framework import serializers
from .models import Mentor, Booking
from django.utils import timezone
from datetime import datetime

class MentorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mentor
        fields = ['id', 'full_name', 'email', 'expertise', 'category', 'short_bio', 
                  'education', 'experience', 'rating', 'total_sessions', 'is_approved', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'rating', 'total_sessions']


class BookingSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source='mentor.full_name', read_only=True)
    is_upcoming = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = ['id', 'mentor', 'mentor_name', 'student_name', 'student_email', 
                  'booking_date', 'booking_time', 'topic', 'notes', 'status', 
                  'created_at', 'updated_at', 'is_upcoming']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_upcoming(self, obj):
        return obj.is_upcoming
    
    def validate(self, data):
        # Check if booking date is in the future
        if data['booking_date'] < timezone.now().date():
            raise serializers.ValidationError("Booking date must be in the future.")
        
        # Check for double booking
        existing_booking = Booking.objects.filter(
            mentor=data['mentor'],
            booking_date=data['booking_date'],
            booking_time=data['booking_time'],
            status__in=['pending', 'confirmed']
        ).exists()
        
        if existing_booking:
            raise serializers.ValidationError("This time slot is already booked.")
        
        return data