from django.conf import settings
from django.db import models
from common.models import BaseModel


class Course(BaseModel):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    target_band = models.CharField(max_length=40, blank=True)
    is_active = models.BooleanField(default=True)
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='courses',
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class ClassGroup(BaseModel):
    name = models.CharField(max_length=200)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='class_groups')
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='class_groups',
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f'{self.name} ({self.course.title})'


class Enrollment(BaseModel):
    STATUS_ENROLLED = 'enrolled'
    STATUS_DROPPED = 'dropped'
    STATUS_CHOICES = (
        (STATUS_ENROLLED, 'Enrolled'),
        (STATUS_DROPPED, 'Dropped'),
    )

    class_group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE, related_name='enrollments')
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments',
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ENROLLED)

    class Meta:
        unique_together = ['class_group', 'student']
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.student} → {self.class_group}'


class ClassSession(BaseModel):
    MODE_GROUP = 'group'
    MODE_ONE_ON_ONE = 'one_on_one'
    MODE_CHOICES = (
        (MODE_GROUP, 'Group'),
        (MODE_ONE_ON_ONE, '1-1'),
    )

    class_group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE, related_name='sessions')
    title = models.CharField(max_length=200, blank=True)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    meet_link = models.URLField(max_length=500, blank=True)
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default=MODE_GROUP)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['starts_at']
        indexes = [
            models.Index(fields=['starts_at']),
        ]

    def __str__(self):
        return self.title or f'Session {self.pk}'


class Attendance(BaseModel):
    STATUS_PRESENT = 'present'
    STATUS_ABSENT = 'absent'
    STATUS_LATE = 'late'
    STATUS_EXCUSED = 'excused'
    STATUS_CHOICES = (
        (STATUS_PRESENT, 'Present'),
        (STATUS_ABSENT, 'Absent'),
        (STATUS_LATE, 'Late'),
        (STATUS_EXCUSED, 'Excused'),
    )

    session = models.ForeignKey(ClassSession, on_delete=models.CASCADE, related_name='attendances')
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='attendances',
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PRESENT)
    note = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ['session', 'student']

    def __str__(self):
        return f'{self.student} {self.status} @ {self.session_id}'
