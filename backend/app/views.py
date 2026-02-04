from django.shortcuts import render
from rest_framework import permissions, viewsets
from .models import User
from .serializers import PatientSer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = PatientSer
    permission_classes = [permissions.IsAuthenticated]