import os
import sys
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# 1. التأكد من وجود مكتبات اللغة العربية (بدون تجاهل الأخطاء)
try:
    import arabic_reshaper
    from bidi.algorithm import get_display
except ImportError:
    print("❌ خطأ: مكتبات اللغة العربية غير موجودة! قم بتشغيل:")
    print("python -m pip install arabic-reshaper python-bidi")
    sys.exit(1)

# تحديد المسارات الأساسية
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_CUSTOMERS_CV = os.path.join(BASE_DIR, 'static', 'uploads', 'customers', 'cv')

# 2. الباحث الذكي عن الخطوط (Smart Font Locator)
# سيبحث السكربت عن الخط في عدة أماكن محتملة لضمان عمله 100%
possible_font_paths = [
    os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'Fonts', 'ARIAL.TTF'),
    os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'fonts', 'arial.ttf'),
    os.path.join(BASE_DIR, 'Fonts', 'ARIAL.TTF'),
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\ARIAL.TTF"
]

_font_path = None
for path in possible_font_paths:
    if os.path.exists(path):
        _font_path = path
        break

# إذا لم يجد الخط، سيطبع رسالة واضحة بدلاً من طباعة مربعات سوداء
if not _font_path:
    print("❌ خطأ: لم أتمكن من العثور على ملف الخط ARIAL.TTF!")
    print("لقد بحثت في المسارات التالية:")
    for p in possible_font_paths:
        print(f"  - {p}")
    sys.exit(1)

print(f"✅ تم العثور على الخط بنجاح في: {_font_path}")
pdfmetrics.registerFont(TTFont('Arial', _font_path))
DEFAULT_FONT = 'Arial'

def _ensure_directory(path: str) -> None:
    os.makedirs(path, exist_ok=True)

def _reshape_text(text: str) -> str:
    """تشكيل وتعديل اتجاه النص العربي"""
    # إذا كان النص يحتوي على أي حرف عربي، قم بتشكيله
    if any('\u0600' <= ch <= '\u06FF' for ch in text):
        reshaped = arabic_reshaper.reshape(text)
        return get_display(reshaped)
    return text

def _draw_field(c: canvas.Canvas, label: str, value: str, y: int) -> int:
    c.setFont(DEFAULT_FONT, 12)
    # السر هنا: دمج النص أولاً، ثم تشكيله بالكامل ليحافظ على اتجاهه
    full_text = f"{label}: {value}"
    c.drawString(50, y, _reshape_text(full_text))
    return y - 20

def _create_cv(file_path: str, data: dict) -> None:
    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4
    y = height - 60

    c.setFont(DEFAULT_FONT, 16)
    header = "السيرة الذاتية" if data.get('language') == 'ar' else "Resume"
    c.drawString(50, y, _reshape_text(header))
    y -= 30

    label_university = "الجامعة" if data.get('language') == 'ar' else "University"
    label_qualification = "المؤهل" if data.get('language') == 'ar' else "Qualification"
    label_experience = "خبرة" if data.get('language') == 'ar' else "Experience"
    label_skills = "المهارات" if data.get('language') == 'ar' else "Skills"

    y = _draw_field(c, label_university, str(data['university']), y)
    y = _draw_field(c, label_qualification, str(data['qualification']), y)
    y = _draw_field(c, label_experience, str(data['experience']), y)
    y = _draw_field(c, label_skills, str(data['skills']), y)

    c.showPage()
    c.save()

def generate_dummy_cvs() -> None:
    _ensure_directory(UPLOAD_CUSTOMERS_CV)

    cv_entries = [
        {"language": "ar", "university": "جامعة الملك فهد للبترول والمعادن", "qualification": "ماجستير", "experience": 5, "skills": "Python, AI", "filename": "cv_ar_1.pdf"},
        {"language": "ar", "university": "جامعة الملك سعود", "qualification": "بكالوريوس", "experience": 2, "skills": "Java, SQL", "filename": "cv_ar_2.pdf"},
        {"language": "ar", "university": "جامعة عادية", "qualification": "دبلوم", "experience": 0, "skills": "HTML, CSS", "filename": "cv_ar_3.pdf"},
        {"language": "en", "university": "Massachusetts Institute of Technology", "qualification": "PhD", "experience": 8, "skills": "Machine Learning, C++", "filename": "cv_en_1.pdf"},
        {"language": "en", "university": "King Abdulaziz University", "qualification": "Bachelor", "experience": 3, "skills": "Project Management, Agile", "filename": "cv_en_2.pdf"},
        {"language": "en", "university": "Unknown University", "qualification": "Master", "experience": 1, "skills": "Marketing, SEO", "filename": "cv_en_3.pdf"},
    ]

    for entry in cv_entries:
        file_path = os.path.join(UPLOAD_CUSTOMERS_CV, entry["filename"])
        _create_cv(file_path, entry)
        print(f"Generated dummy CV: {file_path}")

if __name__ == "__main__":
    generate_dummy_cvs()