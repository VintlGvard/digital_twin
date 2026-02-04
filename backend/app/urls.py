from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularSwaggerView, SpectacularAPIView

urlpatterns = [
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'auth/', include('djoser.urls.jwt')),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs')
]
