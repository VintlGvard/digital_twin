from django_filters import rest_framework as filter
from .models import DiaryPage

class DiaryPageFilter(filter.FilterSet):
    start_date = filter.DateTimeFilter(field_name='timestamp', lookup_expr="gte")
    end_date = filter.DateTimeFilter(field_name="timestamp", lookup_expr='lte')

    min_pain = filter.NumberFilter(field_name='pain_level', lookup_expr='gte')

    class Meta:
        model = DiaryPage
        fields = '__all__'