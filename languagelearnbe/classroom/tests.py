from datetime import timedelta
from zoneinfo import ZoneInfo
from django.utils import timezone
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from account.models import Account
from classroom.models import Course, ClassGroup, Enrollment, ClassSession, Attendance


class ClassroomLMSTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.teacher = Account.objects.create_user(
            username='teacher1',
            email='teacher@example.com',
            password='teacherpass123',
            full_name='Ngoc Thao',
            role=Account.ROLE_TEACHER,
            status=Account.STATUS_ACTIVE,
        )
        self.student = Account.objects.create_user(
            username='student1',
            email='student@example.com',
            password='studentpass123',
            full_name='Hoc Sinh',
            role=Account.ROLE_STUDENT,
            status=Account.STATUS_ACTIVE,
        )
        self.pending = Account.objects.create_user(
            username='pending1',
            email='pending@example.com',
            password='pendingpass123',
            role=Account.ROLE_STUDENT,
            status=Account.STATUS_PENDING,
        )

    def auth(self, user):
        self.client.force_authenticate(user=user)

    def test_register_creates_pending_student(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'newkid',
            'email': 'newkid@example.com',
            'password': 'newpassword123',
            'full_name': 'New Kid',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = Account.objects.get(username='newkid')
        self.assertEqual(user.role, Account.ROLE_STUDENT)
        self.assertEqual(user.status, Account.STATUS_PENDING)

    def test_rejected_student_cannot_login(self):
        self.student.status = Account.STATUS_REJECTED
        self.student.save()
        response = self.client.post('/api/auth/login/', {
            'username': 'student1',
            'password': 'studentpass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_pending_student_can_login(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'pending1',
            'password': 'pendingpass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_me_includes_role(self):
        self.auth(self.teacher)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['role'], 'teacher')
        self.assertTrue(response.data['data']['is_teacher'])

    def test_student_cannot_list_students(self):
        self.auth(self.student)
        response = self.client.get('/api/students/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_teacher_lists_and_approves_student(self):
        self.auth(self.teacher)
        response = self.client.get('/api/students/?status=pending')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(response.data['count'], 1)

        response = self.client.post(f'/api/students/{self.pending.id}/approve/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.pending.refresh_from_db()
        self.assertEqual(self.pending.status, Account.STATUS_ACTIVE)

    def test_teacher_creates_student(self):
        self.auth(self.teacher)
        response = self.client.post('/api/students/', {
            'username': 'created1',
            'email': 'created1@example.com',
            'full_name': 'Created Student',
            'password': 'createdpass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.data['data']
        self.assertEqual(data['status'], 'active')
        self.assertEqual(data['temporary_password'], 'createdpass123')

    def test_student_cannot_create_course(self):
        self.auth(self.student)
        response = self.client.post('/api/courses/', {'title': 'IELTS 6.5'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_course_class_session_enrollment_attendance(self):
        self.auth(self.teacher)
        course_res = self.client.post('/api/courses/', {
            'title': 'IELTS Foundation',
            'description': 'Band 5.0–6.0',
            'target_band': '5.0-6.0',
        }, format='json')
        self.assertEqual(course_res.status_code, status.HTTP_201_CREATED)
        course_id = course_res.data['id']

        group_res = self.client.post('/api/class-groups/', {
            'name': 'Lớp tối T3-T5',
            'course': course_id,
        }, format='json')
        self.assertEqual(group_res.status_code, status.HTTP_201_CREATED)
        group_id = group_res.data['id']

        enroll_res = self.client.post(f'/api/class-groups/{group_id}/enroll/', {
            'student_id': self.student.id,
        }, format='json')
        self.assertEqual(enroll_res.status_code, status.HTTP_200_OK)

        now = timezone.now()
        session_res = self.client.post('/api/sessions/', {
            'class_group': group_id,
            'title': 'Speaking cue card',
            'starts_at': (now + timedelta(days=1)).isoformat(),
            'ends_at': (now + timedelta(days=1, hours=1)).isoformat(),
            'meet_link': 'https://meet.google.com/abc-defg-hij',
            'mode': 'group',
        }, format='json')
        self.assertEqual(session_res.status_code, status.HTTP_201_CREATED)
        session_id = session_res.data['id']

        att_res = self.client.post(f'/api/sessions/{session_id}/attendance/', {
            'student_id': self.student.id,
            'status': 'present',
        }, format='json')
        self.assertEqual(att_res.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Attendance.objects.filter(session_id=session_id, student=self.student).exists()
        )

        self.auth(self.student)
        my_courses = self.client.get('/api/courses/')
        self.assertEqual(my_courses.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(my_courses.data['count'], 1)

        my_sessions = self.client.get('/api/sessions/?upcoming=1')
        self.assertEqual(my_sessions.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(my_sessions.data['count'], 1)

        other = Account.objects.create_user(
            username='other',
            email='other@example.com',
            password='otherpass123',
            role=Account.ROLE_STUDENT,
            status=Account.STATUS_ACTIVE,
        )
        self.auth(other)
        other_courses = self.client.get('/api/courses/')
        self.assertEqual(other_courses.data['count'], 0)

    def test_cannot_enroll_pending_student(self):
        self.auth(self.teacher)
        course = Course.objects.create(title='C', teacher=self.teacher)
        group = ClassGroup.objects.create(name='G', course=course, teacher=self.teacher)
        res = self.client.post(f'/api/class-groups/{group.id}/enroll/', {
            'student_id': self.pending.id,
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bulk_enroll_students(self):
        self.auth(self.teacher)
        other = Account.objects.create_user(
            username='student2',
            email='student2@example.com',
            password='studentpass123',
            role=Account.ROLE_STUDENT,
            status=Account.STATUS_ACTIVE,
        )
        course = Course.objects.create(title='C', teacher=self.teacher)
        group = ClassGroup.objects.create(name='G', course=course, teacher=self.teacher)
        res = self.client.post(f'/api/class-groups/{group.id}/enroll/', {
            'student_ids': [self.student.id, other.id, self.pending.id],
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['data']['enrolled_count'], 2)
        self.assertEqual(Enrollment.objects.filter(class_group=group).count(), 2)

    def test_sessions_month_filter(self):
        self.auth(self.teacher)
        course = Course.objects.create(title='C', teacher=self.teacher)
        group = ClassGroup.objects.create(name='G', course=course, teacher=self.teacher)
        now = timezone.now()
        ClassSession.objects.create(
            class_group=group,
            title='This month',
            starts_at=now,
            ends_at=now + timedelta(hours=1),
        )
        ClassSession.objects.create(
            class_group=group,
            title='Next month',
            starts_at=now + timedelta(days=40),
            ends_at=now + timedelta(days=40, hours=1),
        )
        month = now.astimezone(ZoneInfo('Asia/Ho_Chi_Minh')).strftime('%Y-%m')
        res = self.client.get(f'/api/sessions/?month={month}')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        titles = [row['title'] for row in res.data['results']]
        self.assertIn('This month', titles)
        self.assertNotIn('Next month', titles)

    def test_dashboard_teacher_and_student(self):
        self.auth(self.teacher)
        res = self.client.get('/api/classroom/dashboard/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['data']['role'], 'teacher')
        self.assertGreaterEqual(res.data['data']['pending_students'], 1)
        self.assertIn('month', res.data['data'])
        self.assertIn('label', res.data['data']['month'])

        self.auth(self.student)
        res = self.client.get('/api/classroom/dashboard/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['data']['role'], 'student')
        self.assertTrue(res.data['data']['is_approved'])
