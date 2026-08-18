from rest_framework.permissions import BasePermission


class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, 'is_teacher', False))


class IsApprovedAccount(BasePermission):
    """Teachers always pass. Students must be approved (status=active)."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return bool(getattr(user, 'is_approved', False))
