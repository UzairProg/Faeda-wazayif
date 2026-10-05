# ==============================================================================
# الوظيفة الأساسية للملف: نقطة الدخول الرئيسية (Entry Point) لتشغيل تطبيق فلاسك وبدء الخادم.
# الروابط أو الميزات: يستدعي الدالة create_app() لتهيئة وتشغيل التطبيق.
# المتطلبات الخاصة: يعتمد على تطبيق فلاسك المُنشأ في مجلد app.
# ==============================================================================
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from dotenv import load_dotenv

load_dotenv()  # Loads variables from .env into os.environ before the app starts

from app import create_app

app = create_app()

import sys, os
from flask import session, redirect, url_for, render_template



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
# trigger reload
