from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    surname = models.CharField(max_length=32)

    ROLE = [
        ('Врач', 'doctor'),
        ('Пациент', 'patient')
    ]

    GENDER = [
        ('Мужчина', 'man'),
        ('Женщина', 'woman')
    ]

    role = models.CharField(choices=ROLE, blank=False, default='patient')
    gender = models.CharField(choices=GENDER, blank=False)

    blood_type = models.CharField(max_length=8)
    snils = models.CharField(max_length=11, blank=True, null=True)
    series_passport = models.CharField(max_length=4, blank=True)
    numbers_passport = models.CharField(max_length=6, blank=True)
    phone_number = models.CharField(max_length=18, blank=True, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email

class Appointment(models.Model):
    doctors = models.ForeignKey(User, on_delete=models.CASCADE)
    info = models.CharField(max_length=1024)
    datetime = models.DateTimeField(auto_now_add=True)

class MedicalBook(models.Model):
    appointments = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Patient(models.Model):
    patient_data = models.OneToOneField(User, on_delete=models.CASCADE)
    medical_book = models.OneToOneField(MedicalBook, on_delete=models.CASCADE)

    def __str__(self):
        return self.patient_data.email