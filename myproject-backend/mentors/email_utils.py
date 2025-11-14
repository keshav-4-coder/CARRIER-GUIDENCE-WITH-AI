from django.core.mail import send_mail
from django.conf import settings


def _safe_str(value):
    """Helper to safely convert dates/objects to strings for emails."""
    try:
        return str(value) if value is not None else ""
    except Exception:
        return ""


def send_booking_confirmation_email(booking):
    """Send booking confirmation email to student."""
    subject = f"✅ Booking Confirmed with {getattr(booking.mentor, 'full_name', '')}"

    student_name = getattr(booking, 'student_name', '')
    mentor_name = getattr(booking.mentor, 'full_name', '')
    mentor_expertise = getattr(booking.mentor, 'expertise', '')
    booking_date = _safe_str(getattr(booking, 'booking_date', ''))
    booking_time = _safe_str(getattr(booking, 'booking_time', ''))
    topic = getattr(booking, 'topic', '')
    notes = getattr(booking, 'notes', '')

    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f0f9ff; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #0077b6; text-align: center;">✅ Booking Confirmed!</h2>
                <p>Hello <strong>{student_name}</strong>,</p>
                <p>Your mentoring session has been confirmed. Here are the details:</p>
                <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0077b6;">
                    <p><strong>Mentor:</strong> {mentor_name}</p>
                    <p><strong>Expertise:</strong> {mentor_expertise}</p>
                    <p><strong>Date:</strong> {booking_date}</p>
                    <p><strong>Time:</strong> {booking_time}</p>
                    <p><strong>Topic:</strong> {topic}</p>
                    {f"<p><strong>Notes:</strong> {notes}</p>" if notes else ""}
                </div>
                <p>Please make sure to be online a few minutes before the scheduled time. If you need to reschedule or cancel, please contact us as soon as possible.</p>
                <p>We wish you a great learning experience!</p>
                <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">This is an automated email. Please do not reply to this message.</p>
            </div>
        </body>
    </html>
    """

    try:
        send_mail(
            subject,
            f"Your booking with {mentor_name} is confirmed for {booking_date} at {booking_time}",
            settings.DEFAULT_FROM_EMAIL,
            [getattr(booking, 'student_email', '')],
            html_message=html_message,
            fail_silently=False,
        )
    except Exception as e:
        # Prefer logging in real projects; print is kept for simplicity in this demo.
        print(f"Error sending email: {e}")


def send_booking_completed_email(booking):
    """Send booking completion email to both student and mentor."""
    student_name = getattr(booking, 'student_name', '')
    mentor_name = getattr(booking.mentor, 'full_name', '')
    booking_date = _safe_str(getattr(booking, 'booking_date', ''))
    booking_time = _safe_str(getattr(booking, 'booking_time', ''))
    topic = getattr(booking, 'topic', '')

    student_subject = f"Session Completed - {mentor_name}"
    student_html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f0f9ff; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #00b4d8; text-align: center;">🎉 Session Completed!</h2>
                
                <p>Hello <strong>{booking.student_name}</strong>,</p>
                
                <p>Your mentoring session with <strong>{booking.mentor.full_name}</strong> has been completed.</p>
                
                <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00b4d8;">
                    <p><strong>Session Date:</strong> {booking_date}</p>
                    <p><strong>Time:</strong> {booking_time}</p>
                    <p><strong>Topic:</strong> {topic}</p>
                    <p><strong>Mentor:</strong> {mentor_name}</p>
                </div>
                <p>We hope you found the session valuable! If you have any feedback or would like to book another session, please let us know.</p>
                <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">This is an automated email. Please do not reply to this message.</p>
            </div>
        </body>
    </html>
    """

    mentor_subject = f"Session Completed - {student_name}"
    mentor_html = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f0f9ff; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #00b4d8; text-align: center;">✅ Session Completed!</h2>
                <p>Hello <strong>{mentor_name}</strong>,</p>
                <p>Your mentoring session with <strong>{student_name}</strong> has been marked as completed.</p>
                <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00b4d8;">
                    <p><strong>Student:</strong> {student_name}</p>
                    <p><strong>Student Email:</strong> {getattr(booking, 'student_email', '')}</p>
                    <p><strong>Session Date:</strong> {booking_date}</p>
                    <p><strong>Time:</strong> {booking_time}</p>
                    <p><strong>Topic:</strong> {topic}</p>
                </div>
                <p>Thank you for dedicating your time to mentor our students!</p>
                <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">This is an automated email. Please do not reply to this message.</p>
            </div>
        </body>
    </html>
    """

    try:
        send_mail(
            student_subject,
            f"Your session with {mentor_name} on {booking_date} has been completed.",
            settings.DEFAULT_FROM_EMAIL,
            [getattr(booking, 'student_email', '')],
            html_message=student_html,
            fail_silently=False,
        )

        send_mail(
            mentor_subject,
            f"Session with {student_name} on {booking_date} has been completed.",
            settings.DEFAULT_FROM_EMAIL,
            [getattr(booking.mentor, 'email', '')],
            html_message=mentor_html,
            fail_silently=False,
        )
    except Exception as e:
        print(f"Error sending completion email: {e}")


