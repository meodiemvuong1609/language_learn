import secrets
from datetime import datetime
from zoneinfo import ZoneInfo
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from account.models import Account
from account.serializers import TeacherStudentSerializer
from common.mixins import StandardResultsSetPagination
from general.general import convert_response
from .models import Course, ClassGroup, Enrollment, ClassSession, Attendance
from .permissions import IsTeacher, IsApprovedAccount
from .serializers import (
    CourseSerializer,
    ClassGroupSerializer,
    ClassGroupListSerializer,
    EnrollmentSerializer,
    ClassSessionSerializer,
    ClassSessionListSerializer,
    AttendanceSerializer,
)


VN_TZ = ZoneInfo('Asia/Ho_Chi_Minh')


def month_bounds(year, month):
    start = datetime(year, month, 1, tzinfo=VN_TZ)
    if month == 12:
        end = datetime(year + 1, 1, 1, tzinfo=VN_TZ)
    else:
        end = datetime(year, month + 1, 1, tzinfo=VN_TZ)
    return start, end


def current_month_bounds():
    now_vn = timezone.now().astimezone(VN_TZ)
    return month_bounds(now_vn.year, now_vn.month), now_vn


class TeacherStudentViewSet(viewsets.ModelViewSet):
    serializer_class = TeacherStudentSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeacher]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'full_name', 'phone']
    ordering_fields = ['created_at', 'username', 'full_name', 'status']
    ordering = ['-created_at']
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        qs = Account.objects.filter(role=Account.ROLE_STUDENT)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        full_name = request.data.get('full_name', '')
        phone = request.data.get('phone', '')
        password = request.data.get('password') or secrets.token_urlsafe(8)

        if not username or not email:
            return Response(
                convert_response('Username and email are required', 400),
                status=status.HTTP_400_BAD_REQUEST,
            )
        if Account.objects.filter(username=username).exists():
            return Response(
                convert_response('Username already exists', 400),
                status=status.HTTP_400_BAD_REQUEST,
            )
        if Account.objects.filter(email=email).exists():
            return Response(
                convert_response('Email already exists', 400),
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(password) < 8:
            return Response(
                convert_response('Password must be at least 8 characters', 400),
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = Account.objects.create_user(
            username=username,
            email=email,
            password=password,
            full_name=full_name,
            phone=phone,
            role=Account.ROLE_STUDENT,
            status=Account.STATUS_ACTIVE,
        )
        data = TeacherStudentSerializer(user).data
        data['temporary_password'] = password
        return Response(
            convert_response('Student created', 201, data),
            status=status.HTTP_201_CREATED,
        )

    def retrieve(self, request, *args, **kwargs):
        student = self.get_object()
        data = self.get_serializer(student).data
        enrollments = Enrollment.objects.filter(student=student).select_related(
            'class_group', 'class_group__course'
        )
        data['enrollments'] = EnrollmentSerializer(enrollments, many=True).data
        att = Attendance.objects.filter(student=student)
        data['attendance_summary'] = {
            'total': att.count(),
            'present': att.filter(status=Attendance.STATUS_PRESENT).count(),
            'absent': att.filter(status=Attendance.STATUS_ABSENT).count(),
            'late': att.filter(status=Attendance.STATUS_LATE).count(),
        }
        return Response(data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        student = self.get_object()
        student.status = Account.STATUS_ACTIVE
        student.save(update_fields=['status', 'updated_at'])
        return Response(
            convert_response('Approved', 200, TeacherStudentSerializer(student).data),
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        student = self.get_object()
        student.status = Account.STATUS_REJECTED
        student.save(update_fields=['status', 'updated_at'])
        return Response(
            convert_response('Rejected', 200, TeacherStudentSerializer(student).data),
            status=status.HTTP_200_OK,
        )


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'target_band']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsTeacher()]
        if self.action in ('list', 'retrieve'):
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsApprovedAccount()]

    def get_queryset(self):
        user = self.request.user
        qs = Course.objects.select_related('teacher').annotate(
            class_group_count=Count('class_groups', distinct=True),
            student_count=Count(
                'class_groups__enrollments__student',
                filter=Q(class_groups__enrollments__status=Enrollment.STATUS_ENROLLED),
                distinct=True,
            ),
        )
        if user.is_teacher:
            return qs
        return qs.filter(
            class_groups__enrollments__student=user,
            class_groups__enrollments__status=Enrollment.STATUS_ENROLLED,
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class ClassGroupViewSet(viewsets.ModelViewSet):
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'notes', 'course__title']
    ordering = ['name']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ClassGroupSerializer
        return ClassGroupListSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy', 'enroll', 'unenroll'):
            return [permissions.IsAuthenticated(), IsTeacher()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        qs = ClassGroup.objects.select_related('course', 'teacher').annotate(
            student_count=Count(
                'enrollments',
                filter=Q(enrollments__status=Enrollment.STATUS_ENROLLED),
            )
        )
        course_id = self.request.query_params.get('course')
        if course_id:
            qs = qs.filter(course_id=course_id)
        if user.is_teacher:
            return qs.prefetch_related('enrollments__student') if self.action == 'retrieve' else qs
        return qs.filter(
            enrollments__student=user,
            enrollments__status=Enrollment.STATUS_ENROLLED,
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    def _enroll_student(self, group, student_id):
        try:
            student = Account.objects.get(pk=student_id, role=Account.ROLE_STUDENT)
        except (Account.DoesNotExist, TypeError, ValueError):
            return None, 'not_found'
        if student.status != Account.STATUS_ACTIVE:
            return None, 'not_approved'
        enrollment, created = Enrollment.objects.update_or_create(
            class_group=group,
            student=student,
            defaults={'status': Enrollment.STATUS_ENROLLED},
        )
        return enrollment, 'created' if created else 'exists'

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        group = self.get_object()
        ids = request.data.get('student_ids')
        if ids is None and request.data.get('student_id') is not None:
            ids = [request.data.get('student_id')]
        if not isinstance(ids, list) or len(ids) == 0:
            return Response(
                convert_response('student_id or student_ids is required', 400),
                status=status.HTTP_400_BAD_REQUEST,
            )

        enrolled = []
        skipped = []
        errors = []
        for sid in ids:
            enrollment, result = self._enroll_student(group, sid)
            if result == 'created':
                enrolled.append(EnrollmentSerializer(enrollment).data)
            elif result == 'exists':
                skipped.append(EnrollmentSerializer(enrollment).data)
            elif result == 'not_approved':
                errors.append({'student_id': sid, 'error': 'Student must be approved first'})
            else:
                errors.append({'student_id': sid, 'error': 'Student not found'})

        if len(ids) == 1 and not enrolled and not skipped:
            msg = errors[0]['error'] if errors else 'Unable to enroll'
            code = 404 if msg == 'Student not found' else 400
            return Response(convert_response(msg, code), status=code)

        return Response(
            convert_response(
                'Enrolled',
                200,
                {
                    'enrolled': enrolled,
                    'skipped': skipped,
                    'errors': errors,
                    'enrolled_count': len(enrolled),
                },
            ),
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['post'])
    def unenroll(self, request, pk=None):
        group = self.get_object()
        student_id = request.data.get('student_id')
        deleted, _ = Enrollment.objects.filter(class_group=group, student_id=student_id).delete()
        if not deleted:
            return Response(
                convert_response('Enrollment not found', 404),
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(convert_response('Unenrolled', 200), status=status.HTTP_200_OK)


class ClassSessionViewSet(viewsets.ModelViewSet):
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.OrderingFilter]
    ordering = ['starts_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ClassSessionSerializer
        return ClassSessionListSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy', 'attendance'):
            return [permissions.IsAuthenticated(), IsTeacher()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        qs = ClassSession.objects.select_related('class_group', 'class_group__course')
        group_id = self.request.query_params.get('class_group')
        if group_id:
            qs = qs.filter(class_group_id=group_id)
        upcoming = self.request.query_params.get('upcoming')
        if upcoming in ('1', 'true', 'True'):
            qs = qs.filter(starts_at__gte=timezone.now())
        month = self.request.query_params.get('month')
        if month:
            try:
                year_s, month_s = month.split('-')
                start, end = month_bounds(int(year_s), int(month_s))
                qs = qs.filter(starts_at__gte=start, starts_at__lt=end)
            except (ValueError, TypeError):
                pass
        if user.is_teacher:
            if self.action == 'retrieve':
                return qs.prefetch_related('attendances__student')
            return qs
        return qs.filter(
            class_group__enrollments__student=user,
            class_group__enrollments__status=Enrollment.STATUS_ENROLLED,
        ).distinct()

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['get', 'post'])
    def attendance(self, request, pk=None):
        session = self.get_object()
        if request.method == 'GET':
            rows = session.attendances.select_related('student')
            return Response(
                convert_response(
                    'Attendance',
                    200,
                    AttendanceSerializer(rows, many=True).data,
                    count=rows.count(),
                ),
                status=status.HTTP_200_OK,
            )

        student_id = request.data.get('student_id')
        att_status = request.data.get('status', Attendance.STATUS_PRESENT)
        note = request.data.get('note', '')
        if not student_id:
            return Response(
                convert_response('student_id is required', 400),
                status=status.HTTP_400_BAD_REQUEST,
            )
        if att_status not in dict(Attendance.STATUS_CHOICES):
            return Response(
                convert_response('Invalid attendance status', 400),
                status=status.HTTP_400_BAD_REQUEST,
            )
        enrolled = Enrollment.objects.filter(
            class_group=session.class_group,
            student_id=student_id,
            status=Enrollment.STATUS_ENROLLED,
        ).exists()
        if not enrolled:
            return Response(
                convert_response('Student is not in this class', 400),
                status=status.HTTP_400_BAD_REQUEST,
            )
        row, _ = Attendance.objects.update_or_create(
            session=session,
            student_id=student_id,
            defaults={'status': att_status, 'note': note},
        )
        return Response(
            convert_response('Attendance saved', 200, AttendanceSerializer(row).data),
            status=status.HTTP_200_OK,
        )


class ClassroomDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        (start, end), now_vn = current_month_bounds()
        month_meta = {
            'year': now_vn.year,
            'month': now_vn.month,
            'label': f'Tháng {now_vn.month:02d}/{now_vn.year}',
        }
        if user.is_teacher:
            session_qs = ClassSession.objects.filter(
                starts_at__gte=start, starts_at__lt=end
            ).select_related('class_group', 'class_group__course').order_by('starts_at')[:100]
            data = {
                'role': 'teacher',
                'month': month_meta,
                'pending_students': Account.objects.filter(
                    role=Account.ROLE_STUDENT, status=Account.STATUS_PENDING
                ).count(),
                'student_count': Account.objects.filter(role=Account.ROLE_STUDENT).count(),
                'active_students': Account.objects.filter(
                    role=Account.ROLE_STUDENT, status=Account.STATUS_ACTIVE
                ).count(),
                'course_count': Course.objects.count(),
                'class_group_count': ClassGroup.objects.count(),
                'upcoming_sessions': ClassSessionListSerializer(session_qs, many=True).data,
            }
            return Response(convert_response('Success', 200, data), status=status.HTTP_200_OK)

        session_qs = ClassSession.objects.filter(
            starts_at__gte=start,
            starts_at__lt=end,
            class_group__enrollments__student=user,
            class_group__enrollments__status=Enrollment.STATUS_ENROLLED,
        ).select_related('class_group', 'class_group__course').distinct().order_by('starts_at')[:100]
        courses = Course.objects.filter(
            class_groups__enrollments__student=user,
            class_groups__enrollments__status=Enrollment.STATUS_ENROLLED,
        ).annotate(
            class_group_count=Count('class_groups', distinct=True),
            student_count=Count(
                'class_groups__enrollments__student',
                filter=Q(class_groups__enrollments__status=Enrollment.STATUS_ENROLLED),
                distinct=True,
            ),
        ).distinct()
        data = {
            'role': 'student',
            'status': user.status,
            'is_approved': user.is_approved,
            'month': month_meta,
            'course_count': courses.count(),
            'upcoming_sessions': ClassSessionListSerializer(session_qs, many=True).data,
            'courses': CourseSerializer(courses[:12], many=True).data,
        }
        return Response(convert_response('Success', 200, data), status=status.HTTP_200_OK)
