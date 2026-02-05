from rest_framework import permissions, viewsets, filters
from .models import Diary, DiaryPage, MedicalRecord, Appointment
from .serializers import DiarySer, DiartPageSer, MedicalRecordSerializer, AppointmentSer
from .filters import DiaryPageFilter
from django_filters.rest_framework import DjangoFilterBackend

class DiaryViewSet(viewsets.ModelViewSet):
    serializer_class = DiarySer
    def get_queryset(self):
        return Diary.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DiaryPageViewSet(viewsets.ModelViewSet):
    serializer_class = DiartPageSer
    filter_backends = [DjangoFilterBackend]
    filterset_class = DiaryPageFilter

    def get_queryset(self):
        return DiaryPage.objects.filter(diary__user=self.request.user)


class MedicalRecordViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['card_number']
    search_fields = ['card_number', 'user__last_name', 'user__first_name']

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return MedicalRecord.objects.none()
        if getattr(user, 'role', '') == 'doctor' or user.is_staff:
            return MedicalRecord.objects.all()

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            return Appointment.objects.filter(doctor=user)
        elif user.role == 'patient':
            return Appointment.objects.filter(medical_record__user=user)
        return Appointment.objects.none()