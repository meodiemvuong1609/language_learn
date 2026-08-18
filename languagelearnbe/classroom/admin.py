from django.contrib import admin
from .models import Course, ClassGroup, Enrollment, ClassSession, Attendance


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'target_band', 'teacher', 'is_active')
    search_fields = ('title',)


@admin.register(ClassGroup)
class ClassGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'course', 'teacher')
    list_filter = ('course',)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'class_group', 'status')
    list_filter = ('status',)


@admin.register(ClassSession)
class ClassSessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'class_group', 'starts_at', 'mode')
    list_filter = ('mode',)


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'session', 'status')
    list_filter = ('status',)
