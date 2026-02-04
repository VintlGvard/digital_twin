from rest_framework import serializers
from .models import User, MedicalBook, Patient

class PatientSer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'