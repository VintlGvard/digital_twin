from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinValueValidator, MaxValueValidator, MinLengthValidator

class User(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    surname = models.CharField(max_length=32)

    ROLE = [
        ('doctor', 'Доктор'),
        ('patient', 'Пациент'),
        ('admin', 'Администратор')
    ]

    GENDER = [
        ('male', 'Мужской'),
        ('female', 'Женский')
    ]

    role = models.CharField(choices=ROLE, blank=False, default='patient', max_length=20)
    gender = models.CharField(choices=GENDER, blank=True, max_length=10)
    phone_number = models.CharField(max_length=20, blank=True, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.get_full_name()})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name} {self.surname}".strip()

class MedicalRecord(models.Model):
    card_number = models.CharField(max_length=50, unique=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    snils = models.CharField(max_length=11, blank=True, null=True, validators=[MinLengthValidator(11)])
    series_passport = models.CharField(max_length=4, blank=True, validators=[MinLengthValidator(4)])
    numbers_passport = models.CharField(max_length=6, blank=True, validators=[MinLengthValidator(6)])

    blood_type = models.CharField(max_length=5, blank=True, null=True)
    chronic_diseases = models.TextField(blank=True)

    def __str__(self):
        return f"Медкарта {self.card_number} ({self.user.email})"

class Diary(models.Model):
    title = models.CharField(max_length=200)
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} (Карта №{self.medical_record.card_number})"

class DiaryPage(models.Model):
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE)
    timestamp = models.DateTimeField()
    systolic = models.PositiveSmallIntegerField(validators=[MinValueValidator(40), MaxValueValidator(250)], null=True, blank=True)
    diastolic = models.PositiveSmallIntegerField(validators=[MinValueValidator(20), MaxValueValidator(150)], null=True, blank=True)
    glucose = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    pain_level = models.PositiveSmallIntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=True, blank=True)
    symptoms = models.TextField(blank=True)
    wellbeing = models.CharField(max_length=20, default='good')
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Запись {self.diary.title} от {self.timestamp}"

    def get_bp_status(self):
        if self.systolic <= self.diastolic:
            return 'Ошибка'
        if self.systolic >= 180 or self.diastolic >= 120:
            return 'Критическое'
        return 'Нормальное'

    def calculate_dose(self, weight, mg_per_kg, limit):
        dose = weight * mg_per_kg
        return min(dose, limit)

class Appointment(models.Model):
    STATUS = (
        ('scheduled', 'Запланировано'),
        ('completed', 'Завершено'),
        ('cancelled', 'Отменено'),
    )
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'doctor'})
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.PROTECT)
    data_time = models.DateTimeField(verbose_name="Время приема")
    reason = models.TextField()
    diagnosis = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)

    status = models.CharField(max_length=20, choices=STATUS, default='scheduled')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-data_time']

    def __str__(self):
        return f"Прием {self.data_time}: {self.doctor.last_name} -> {self.medical_record.user.last_name}"


