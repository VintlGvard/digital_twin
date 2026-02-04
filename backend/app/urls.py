from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularSwaggerView, SpectacularAPIView
from .views import DiaryViewSet, DiaryPageViewSet, MedicalRecordViewSet, AppointmentViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'medical-records', MedicalRecordViewSet, basename='medicalrecords')
router.register(r'diaries', DiaryViewSet, basename='diary')
router.register(r'pages', DiaryPageViewSet, basename='diarypage')
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'auth/', include('djoser.urls.jwt')),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
    path('', include(router.urls))
]
