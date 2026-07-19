# ==============================================================================
# الوظيفة الأساسية للملف: نقطة الدخول الرئيسية (Entry Point) لتشغيل تطبيق فلاسك وبدء الخادم.
# الروابط أو الميزات: يستدعي الدالة create_app() لتهيئة وتشغيل التطبيق.
# المتطلبات الخاصة: يعتمد على تطبيق فلاسك المُنشأ في مجلد app.
# ==============================================================================
from dotenv import load_dotenv
load_dotenv()  # Loads variables from .env into os.environ before the app starts

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
# trigger reload
