from django.db import models
from django.core.validators import URLValidator
from django.utils import timezone

class Mentor(models.Model):
    CATEGORY_CHOICES = [
        ('Academic Guidance', 'Academic Guidance'),
        ('Career & Skills', 'Career & Skills'),
        ('Technology & Coding', 'Technology & Coding'),
    ]
    
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    expertise = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    short_bio = models.TextField()
    education = models.CharField(max_length=255, blank=True)
    experience = models.CharField(max_length=100, blank=True)
    rating = models.FloatField(default=0.0)
    total_sessions = models.IntegerField(default=0)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-rating', '-total_sessions']
    
    def __str__(self):
        return self.full_name


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    mentor = models.ForeignKey(Mentor, on_delete=models.CASCADE, related_name='bookings')
    student_name = models.CharField(max_length=255)
    student_email = models.EmailField()
    booking_date = models.DateField()
    booking_time = models.TimeField()
    topic = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ('mentor', 'booking_date', 'booking_time')  # Prevent double booking
    
    def __str__(self):
        return f"{self.student_name} with {self.mentor.full_name} on {self.booking_date}"
    
    @property
    def is_upcoming(self):
        booking_datetime = timezone.make_aware(
            timezone.datetime.combine(self.booking_date, self.booking_time)
        )
        return booking_datetime > timezone.now()