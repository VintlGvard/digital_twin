from django.shortcuts import render
from rest_framework import permissions, viewsets
from .models import User, Diary, DiaryPage
from .serializers import PatientSer, DiarySer, DiartPageSer, MedicalRecordSerializer
from .filters import DiaryPageFilter
from django_filters.rest_framework import DjangoFilterBackend

class PatientViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = PatientSer
    permission_classes = [permissions.IsAuthenticated]

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

class MedicalRecordViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Diary.objects.filter(medical_record__user=self.request.user)

    def perform_create(self, serializer):
        medical_record = self.request.user.medical_record
        serializer.save(medical_record=medical_record)