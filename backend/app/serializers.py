from rest_framework import serializers
from .models import User, MedicalRecord, Diary, DiaryPage, Appointment

class DiartPageSer(serializers.ModelSerializer):
    class Meta:
        model = DiaryPage
        fields = '__all__'

class DiarySer(serializers.ModelSerializer):
    pages = DiartPageSer(many=True, read_only=True)
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Diary
        fields = '__all__'

class MedicalRecordSerializer(serializers.ModelSerializer):
    diaries = DiarySer(many=True, read_only=True)
    patient_name = serializers.ReadOnlyField(source='user.get_full_name')

    class Meta:
        model = MedicalRecord
        fields = "__all__"

class UserSer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'surname', 'role', 'gender', 'phone_number', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class AppointmentSer(serializers.ModelSerializer):
    doctor_name = serializers.ReadOnlyField(source='doctor.get_full_name')
    patient_name = serializers.ReadOnlyField(source='medical_record.user.get_full_name')

    class Meta:
        model = Appointment
        fields = '__all__'