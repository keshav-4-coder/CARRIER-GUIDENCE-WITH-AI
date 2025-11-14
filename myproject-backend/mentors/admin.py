from django.contrib import admin
from .models import Mentor, Booking

@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'expertise', 'category', 'rating', 'total_sessions', 'is_approved', 'created_at']
    list_filter = ['category', 'is_approved', 'created_at']
    search_fields = ['full_name', 'email', 'expertise']
    list_editable = ['is_approved']
    ordering = ['-created_at']
    
    actions = ['approve_mentors']
    
    def approve_mentors(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} mentor(s) approved successfully.')
    approve_mentors.short_description = "Approve selected mentors"


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['student_name', 'mentor', 'booking_date', 'booking_time', 'status', 'created_at']
    list_filter = ['status', 'booking_date']
    search_fields = ['student_name', 'student_email', 'mentor__full_name']
    list_editable = ['status']
    ordering = ['-booking_date', '-booking_time']