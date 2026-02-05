from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and (request.user.role=='doctor'))

class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and (request.user.role=='patient'))

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.method in SAFE_METHODS or
            request.user and
            (request.user.role=='admin')
        )

