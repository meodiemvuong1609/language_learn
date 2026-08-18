from rest_framework import serializers
from account.models import Account
from account.serializers import TeacherStudentSerializer
from .models import Course, ClassGroup, Enrollment, ClassSession, Attendance


class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    class_group_count = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'target_band', 'is_active',
            'teacher', 'teacher_name', 'class_group_count', 'student_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'teacher', 'created_at', 'updated_at']

    def get_class_group_count(self, obj):
        return getattr(obj, 'class_group_count', 0)

    def get_student_count(self, obj):
        return getattr(obj, 'student_count', 0)


class EnrollmentSerializer(serializers.ModelSerializer):
    student = TeacherStudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Account.objects.filter(role=Account.ROLE_STUDENT),
        source='student',
        write_only=True,
    )

    class Meta:
        model = Enrollment
        fields = [
            'id', 'class_group', 'student', 'student_id', 'status',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClassGroupSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True, allow_null=True, default='')
    student_count = serializers.SerializerMethodField()
    enrollments = EnrollmentSerializer(many=True, read_only=True)

    class Meta:
        model = ClassGroup
        fields = [
            'id', 'name', 'course', 'course_title', 'teacher', 'teacher_name',
            'notes', 'student_count', 'enrollments', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'teacher', 'created_at', 'updated_at']

    def get_student_count(self, obj):
        return getattr(obj, 'student_count', 0)


class ClassGroupListSerializer(ClassGroupSerializer):
    class Meta(ClassGroupSerializer.Meta):
        fields = [
            'id', 'name', 'course', 'course_title', 'teacher', 'teacher_name',
            'notes', 'student_count', 'created_at', 'updated_at',
        ]


class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_username = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id', 'session', 'student', 'student_name', 'student_username',
            'status', 'note', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClassSessionSerializer(serializers.ModelSerializer):
    class_group_name = serializers.CharField(source='class_group.name', read_only=True)
    course_title = serializers.CharField(source='class_group.course.title', read_only=True)
    attendances = AttendanceSerializer(many=True, read_only=True)

    class Meta:
        model = ClassSession
        fields = [
            'id', 'class_group', 'class_group_name', 'course_title',
            'title', 'starts_at', 'ends_at', 'meet_link', 'mode', 'notes',
            'attendances', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        starts = attrs.get('starts_at') or getattr(self.instance, 'starts_at', None)
        ends = attrs.get('ends_at') or getattr(self.instance, 'ends_at', None)
        if starts and ends and ends <= starts:
            raise serializers.ValidationError({'ends_at': 'End time must be after start time.'})
        return attrs


class ClassSessionListSerializer(ClassSessionSerializer):
    class Meta(ClassSessionSerializer.Meta):
        fields = [
            'id', 'class_group', 'class_group_name', 'course_title',
            'title', 'starts_at', 'ends_at', 'meet_link', 'mode', 'notes',
            'created_at', 'updated_at',
        ]
