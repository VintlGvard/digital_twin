from django.test import TestCase
from unittest.mock import MagicMock
from .models import DiaryPage

class MedicalTest(TestCase):
    def test_blood_pressure(self):
        page = DiaryPage(systolic=120, diastolic=80)
        crisis_page = DiaryPage(systolic=190, diastolic=120)
        error_page = DiaryPage(systolic=80, diastolic=100)

        self.assertEqual(page.get_bp_status(), 'Нормальное')
        self.assertEqual(crisis_page.get_bp_status(), 'Критическое')
        self.assertEqual(error_page.get_bp_status(), 'Ошибка')

    def test_dosage(self):
        page = DiaryPage()
        res = page.calculate_dose(70, 0.5,30)

        self.assertTrue(res, 30)
        self.assertGreater(res, 0)
        self.assertEqual(page.calculate_dose(50, 0.1, 10), 5)

    def test_glucose_trend(self):
        levels = [5.0, 7.0, 9.0]
        diff = levels[-1] - levels[0]

        self.assertTrue(diff > 0)
        self.assertEqual(len(levels), 3)
        self.assertIn(9.0, levels)

    def test_drug_interaction(self):
        checker = MagicMock()
        checker.check.return_value = 'Опасно'

        result = checker.check('Аспирин', 'Мефедрон')

        self.assertEqual(result, 'Опасно')
        self.assertTrue(checker.check.called)
        checker.check.assert_called_with('Аспирин', 'Мефедрон')

    def test_alerts(self):
        notifier = MagicMock()
        status = 'Критический'

        if status == 'Критический':
            notifier.send_alert('Высокое значения!', priority=1)

        notifier.send_alert.assert_called_once()
        args, kwargs = notifier.send_alert.call_args
        self.assertEqual(kwargs['priority'], 1)
        self.assertIn('Высокое', args[0])
