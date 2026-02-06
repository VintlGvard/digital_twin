from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import MedicalRecord, Diary, DiaryPage, Appointment

User = get_user_model()

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

class UserShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'middle_name', 'phone_number', 'role']

class MedicalRecordSerializer(serializers.ModelSerializer):
    diaries = DiarySer(many=True, read_only=True)
    patient_name = serializers.ReadOnlyField(source='user.get_full_name')
    user = UserShortSerializer(read_only=True)

    class Meta:
        model = MedicalRecord
        fields = "__all__"

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'middle_name', 'role', 'gender', 'phone_number']
        read_only_fields = ['created_at', 'updated_at']

class CustomUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'middle_name', 'role', 'gender', 'phone_number', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class AppointmentSer(serializers.ModelSerializer):
    doctor_name = serializers.ReadOnlyField(source='doctor.get_full_name')
    patient_name = serializers.ReadOnlyField(source='medical_record.user.get_full_name')

    class Meta:
        model = Appointment
        fields = '__all__'