from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from anthropic import Anthropic
import json
from django.conf import settings
import re
import os


@csrf_exempt
def chatbot_api(request):
    print(f"REQUEST METHOD: {request.method}")
    print(f"REQUEST PATH: {request.path}")

# Initialize Anthropic client
api_key = os.getenv('ANTHROPIC_API_KEY') or settings.ANTHROPIC_API_KEY
if not api_key:
    raise ValueError("ANTHROPIC_API_KEY not found in environment or settings!")

client = Anthropic(api_key=api_key)

# Store conversation history
conversation_history = {}

# Knowledge Base with Resources
KNOWLEDGE_BASE = {
    'chartered accountant': {
        'description': 'Chartered Accountant - Finance & Accounting Professional',
        'summary': 'Specialized finance professional handling accounting, taxation, and auditing with high earning potential.',
        'skills': ['Accounting', 'Taxation', 'Auditing', 'Financial Management', 'Business Law'],
        'roadmap': [
            {'step': 1, 'stage': 'CA Foundation', 'duration': '4 months', 'details': 'After 12th pass, register and study'},
            {'step': 2, 'stage': 'CA Intermediate', 'duration': '8 months', 'details': 'Two groups covering accounting, taxation, auditing'},
            {'step': 3, 'stage': 'Articleship/Internship', 'duration': '3 years', 'details': 'Practical training under practicing CA'},
            {'step': 4, 'stage': 'CA Final', 'duration': '8 months', 'details': 'Advanced topics and specializations'},
            {'step': 5, 'stage': 'Practice/Employment', 'duration': 'Ongoing', 'details': 'Own practice or company job'}
        ],
        'resources': [
            {'name': 'ICAI Official', 'url': 'https://www.icai.org', 'type': 'Registration & Study Materials'},
            {'name': 'CA Study Material', 'url': 'https://www.icai.org/post/study-material', 'type': 'Study Resources'},
            {'name': 'Online Coaching', 'url': 'https://www.unacademy.com/ca-foundation', 'type': 'Video Courses'},
            {'name': 'Practice Tests', 'url': 'https://www.testbook.com/ca', 'type': 'Mock Exams'}
        ],
        'time': '4.5 - 5.5 years total',
        'salary': '₹6-12 lakhs entry level, ₹50+ lakhs senior',
        'jobs': ['Audit Firm', 'Tax Consultant', 'Financial Advisor', 'Company Secretary', 'Own Practice']
    },
    'cybersecurity': {
        'description': 'Cybersecurity - Ethical Hacking & Network Security',
        'summary': 'Protect digital systems from attacks through ethical hacking, with excellent job prospects and high salary.',
        'skills': ['Network Security', 'Penetration Testing', 'Cryptography', 'Python', 'Linux', 'Malware Analysis'],
        'roadmap': [
            {'step': 1, 'stage': 'Networking Basics', 'duration': '1-2 months', 'details': 'TCP/IP, DNS, HTTP, OSI model'},
            {'step': 2, 'stage': 'Linux & Command Line', 'duration': '1 month', 'details': 'Operating system mastery and scripting'},
            {'step': 3, 'stage': 'Python Programming', 'duration': '2-3 months', 'details': 'Security automation and scripting'},
            {'step': 4, 'stage': 'Security Concepts', 'duration': '2 months', 'details': 'Encryption, cryptography, vulnerability analysis'},
            {'step': 5, 'stage': 'Hands-On Practice', 'duration': '2-3 months', 'details': 'HackTheBox, TryHackMe, CTF challenges'},
            {'step': 6, 'stage': 'Certifications', 'duration': '2-3 months', 'details': 'CEH, Security+, OSCP'}
        ],
        'resources': [
            {'name': 'HackTheBox', 'url': 'https://www.hackthebox.com', 'type': 'Hacking Labs'},
            {'name': 'TryHackMe', 'url': 'https://www.tryhackme.com', 'type': 'Interactive Training'},
            {'name': 'Cybrary', 'url': 'https://www.cybrary.it', 'type': 'Cybersecurity Courses'},
            {'name': 'Coursera Security+', 'url': 'https://www.coursera.org/learn/CompTIA', 'type': 'Certification Prep'}
        ],
        'time': '6-12 months to entry-level job',
        'salary': '₹5-8 lakhs entry level, ₹20-40 lakhs senior',
        'jobs': ['Security Analyst', 'Penetration Tester', 'Network Security Specialist', 'SOC Analyst', 'Security Engineer']
    },
    'business': {
        'description': 'Business Studies - Management & Entrepreneurship',
        'summary': 'Learn management, marketing, finance, and leadership to run businesses or lead organizations.',
        'skills': ['Business Management', 'Marketing', 'Finance', 'Leadership', 'Analytics', 'Strategy'],
        'roadmap': [
            {'step': 1, 'stage': 'Bachelor Degree', 'duration': '3 years', 'details': 'Business Administration or Commerce'},
            {'step': 2, 'stage': 'Internships', 'duration': '1-2 years', 'details': 'Work experience in various departments'},
            {'step': 3, 'stage': 'MBA/Specialization', 'duration': '2 years', 'details': 'Finance, Marketing, HR, or Entrepreneurship'},
            {'step': 4, 'stage': 'Management Track', 'duration': '3-5 years', 'details': 'Senior roles, director positions'},
            {'step': 5, 'stage': 'Leadership/Entrepreneurship', 'duration': 'Ongoing', 'details': 'C-suite or start own business'}
        ],
        'resources': [
            {'name': 'Coursera Business', 'url': 'https://www.coursera.org/business', 'type': 'Online Courses'},
            {'name': 'LinkedIn Learning', 'url': 'https://www.linkedin.com/learning', 'type': 'Business Skills'},
            {'name': 'Harvard ManageMentor', 'url': 'https://www.harvardbusiness.org', 'type': 'Case Studies'},
            {'name': 'Udemy Business', 'url': 'https://www.udemy.com/courses/business', 'type': 'Business Courses'}
        ],
        'time': '3-5 years for degree, 2-5 years for MBA',
        'salary': '₹3-5 lakhs entry level, ₹15-30 lakhs senior',
        'jobs': ['Business Analyst', 'Product Manager', 'Marketing Manager', 'Financial Analyst', 'Entrepreneur']
    },
    'psychology': {
        'description': 'Psychology - Mental Health & Human Behavior',
        'summary': 'Study human behavior and mental health to help people and improve quality of life.',
        'skills': ['Counseling', 'Research', 'Clinical Assessment', 'Communication', 'Ethics', 'Empathy'],
        'roadmap': [
            {'step': 1, 'stage': 'Bachelor in Psychology', 'duration': '3 years', 'details': 'Foundation in all psychology domains'},
            {'step': 2, 'stage': 'Internships/Practicum', 'duration': '1-2 years', 'details': 'Practical experience in clinics or research'},
            {'step': 3, 'stage': 'Masters Specialization', 'duration': '2 years', 'details': 'Clinical, Counseling, or Organizational Psychology'},
            {'step': 4, 'stage': 'Licensing/Certification', 'duration': '1-2 years', 'details': 'Professional credentials and registration'},
            {'step': 5, 'stage': 'Professional Practice', 'duration': 'Ongoing', 'details': 'Therapy, research, or organizational role'}
        ],
        'resources': [
            {'name': 'APA', 'url': 'https://www.apa.org', 'type': 'Psychology Association'},
            {'name': 'Coursera Psychology', 'url': 'https://www.coursera.org/learn/psychology', 'type': 'Online Courses'},
            {'name': 'University Programs', 'url': 'https://www.topuniversities.com/psychology', 'type': 'Degree Programs'},
            {'name': 'Psychology Today', 'url': 'https://www.psychologytoday.com', 'type': 'Resources & Directory'}
        ],
        'time': '3-5+ years for professional role',
        'salary': '₹2-4 lakhs entry level, ₹8-15 lakhs senior',
        'jobs': ['Clinical Psychologist', 'Counselor', 'HR Psychologist', 'Researcher', 'Life Coach']
    }
}

def extract_interest(message):
    """Extract interest/field from message"""
    msg_lower = message.lower()
    
    for field in KNOWLEDGE_BASE.keys():
        if field in msg_lower:
            return field
    
    if 'hack' in msg_lower or 'cyber' in msg_lower or 'security' in msg_lower:
        return 'cybersecurity'
    if 'ca' in msg_lower and ('charted' in msg_lower or 'accountant' in msg_lower):
        return 'chartered accountant'
    if 'business' in msg_lower or 'commerce' in msg_lower:
        return 'business'
    if 'psych' in msg_lower:
        return 'psychology'
    
    return None

def extract_name(message):
    """Extract name from message"""
    msg_lower = message.lower()
    match = re.search(r'(?:i am|i\'m|name is|call me)\s+([a-zA-Z]+)', msg_lower, re.IGNORECASE)
    if match:
        return match.group(1).capitalize()
    return None

def format_roadmap_response(interest):
    """Format roadmap as structured JSON with sections"""
    if interest not in KNOWLEDGE_BASE:
        return None
    
    kb = KNOWLEDGE_BASE[interest]
    
    return {
        'type': 'roadmap',
        'title': kb['description'],
        'summary': kb['summary'],
        'timeline': kb['time'],
        'salary': kb['salary'],
        'key_skills': kb['skills'][:5],
        'roadmap_steps': kb['roadmap'],
        'job_roles': kb['jobs'],
        'resources': kb['resources']
    }

@csrf_exempt
def chatbot_api(request):
    """Main chatbot endpoint with structured responses"""
    
    # Handle OPTIONS for CORS preflight
    if request.method == 'OPTIONS':
        response = JsonResponse({'status': 'ok'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    
    # Only allow POST
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Only POST method allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        user_message = data.get('message', '').strip()
        user_profile = data.get('userProfile', {})
        user_id = data.get('userId', 'default_user')
        
        if not user_message:
            return JsonResponse({
                'success': False,
                'error': 'Message cannot be empty'
            }, status=400)
        
        # Update name if provided
        name = extract_name(user_message)
        if name and name != 'Student':
            user_profile['name'] = name
        
        # Extract interest
        interest = extract_interest(user_message)
        if interest:
            user_profile['interest'] = interest
        
        # Initialize conversation history
        if user_id not in conversation_history:
            conversation_history[user_id] = []
        
        conversation_history[user_id].append({
            "role": "user",
            "content": user_message
        })
        
        print(f"\n=== CLAUDE API CALL ===")
        print(f"User: {user_message}")
        print(f"Interest: {interest}\n")
        
        # Check if asking for roadmap/guidance
        roadmap_keywords = ['roadmap', 'path', 'guide', 'how', 'steps', 'timeline', 'learn', 'start', 'process']
        is_roadmap_request = any(keyword in user_message.lower() for keyword in roadmap_keywords)
        
        # If roadmap request and we have knowledge, return structured data
        if is_roadmap_request and interest and interest in KNOWLEDGE_BASE:
            roadmap_data = format_roadmap_response(interest)
            
            # Also get Claude's insights
            system_prompt = f"""You are a career mentor. Provide a brief, encouraging insight (2-3 sentences) about pursuing {interest}. 
Be specific and motivating. Don't repeat the roadmap - just add value."""
            
            messages = [
                {"role": "user", "content": f"Give me brief insight about starting {interest} career"}
            ]
        else:
            roadmap_data = None
            
            system_prompt = f"""You are a career and education mentor. Student name: {user_profile.get('name', 'Student')}.
If they mention an interest, help them understand that field. Keep response concise (2-4 sentences max).
Be encouraging and practical. If they ask questions, answer specifically."""
            
            messages = conversation_history[user_id][-20:]
        
        # Call Claude API
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=500,
            system=system_prompt,
            messages=messages
        )
        
        ai_text = response.content[0].text.strip()
        
        # Store in history
        conversation_history[user_id].append({
            "role": "assistant",
            "content": ai_text
        })
        
        # Keep only last 20 messages
        if len(conversation_history[user_id]) > 20:
            conversation_history[user_id] = conversation_history[user_id][-20:]
        
        # Return structured response
        response_data = {
            'success': True,
            'response': ai_text,
            'userProfile': user_profile
        }
        
        # Add structured data if available
        if roadmap_data:
            response_data['structured_data'] = roadmap_data
        
        return JsonResponse(response_data)
    
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@csrf_exempt
def clear_chat(request):
    """Clear conversation history"""
    
    if request.method == 'OPTIONS':
        response = JsonResponse({'status': 'ok'})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Only POST method allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        user_id = data.get('userId', 'default_user')
        
        if user_id in conversation_history:
            del conversation_history[user_id]
        
        return JsonResponse({'success': True, 'message': 'Chat cleared'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)