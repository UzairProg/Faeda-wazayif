# -*- coding: utf-8 -*-
import os
import base64
import subprocess
import shutil

artifact_dir = r"C:\Users\Admin\.gemini\antigravity-ide\brain\c97c43d5-f3fd-4d06-ab48-90da393dc49b"
screenshots_dir = os.path.join(artifact_dir, "screenshots")
workspace_dir = r"d:\faeda-wazayif\Faeda-wazayif"

def get_base64(filename):
    p = os.path.join(screenshots_dir, filename)
    if os.path.exists(p):
        with open(p, "rb") as f:
            return "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")
    return ""

img_dashboard = get_base64("dashboard.png")
img_campaigns = get_base64("campaigns.png")
img_incubator = get_base64("incubator.png")
img_coop = get_base64("coop_supervision.png")
img_departments = get_base64("departments.png")
img_students = get_base64("students.png")
img_verifications = get_base64("verifications.png")
img_profile = get_base64("profile.png")

html_content = f"""<!DOCTYPE html>
<html lang="mr">
<head>
<meta charset="UTF-8">
<title>Faeda Jobs - University Ecosystem Master Comprehensive Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Noto+Sans+Devanagari:wght@400;600;700;900&family=Inter:wght@400;500;600;700;900&display=swap');

  @page {{
    size: A4 portrait;
    margin: 12mm 10mm 12mm 10mm;
    @bottom-right {{
      content: "Page " counter(page);
      font-size: 8pt;
      color: #64748b;
    }}
  }}

  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}

  body {{
    font-family: 'Inter', 'Noto Sans Devanagari', 'Cairo', sans-serif;
    background-color: #081628;
    color: #e2e8f0;
    line-height: 1.5;
    font-size: 9.5pt;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}

  .page-break {{
    page-break-before: always;
  }}

  .header-card {{
    background: linear-gradient(135deg, #0F2247 0%, #081628 100%);
    border: 1px solid #1E3A8A;
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 18px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.4);
  }}

  .header-badge {{
    display: inline-block;
    background: rgba(34, 199, 242, 0.15);
    color: #22C7F2;
    border: 1px solid rgba(34, 199, 242, 0.35);
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 8pt;
    font-weight: 700;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}

  h1 {{
    font-size: 18pt;
    font-weight: 900;
    color: #ffffff;
    line-height: 1.25;
    margin-bottom: 6px;
  }}

  .subtitle {{
    color: #94a3b8;
    font-size: 9.5pt;
    line-height: 1.4;
  }}

  .meta-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }}

  .meta-item {{
    background: rgba(8, 22, 40, 0.6);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 8px 10px;
  }}

  .meta-label {{
    font-size: 7.5pt;
    color: #94a3b8;
    text-transform: uppercase;
    font-weight: 600;
  }}

  .meta-value {{
    font-size: 9.5pt;
    color: #ffffff;
    font-weight: 700;
    margin-top: 2px;
  }}

  .section {{
    background: #0F2247;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 18px;
    page-break-inside: avoid;
  }}

  .section-tag {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(18, 75, 201, 0.25);
    color: #22C7F2;
    border: 1px solid rgba(34, 199, 242, 0.35);
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 8pt;
    font-weight: 700;
    margin-bottom: 8px;
  }}

  h2 {{
    font-size: 13pt;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding-bottom: 6px;
  }}

  h3 {{
    font-size: 10.5pt;
    font-weight: 700;
    color: #22C7F2;
    margin-top: 10px;
    margin-bottom: 4px;
  }}

  p, li {{
    font-size: 8.5pt;
    color: #cbd5e1;
    line-height: 1.5;
  }}

  ul {{
    margin-left: 16px;
    margin-bottom: 8px;
  }}

  li {{
    margin-bottom: 4px;
  }}

  .screenshot-container {{
    border: 1px solid #1E3A8A;
    border-radius: 12px;
    overflow: hidden;
    margin: 12px 0 10px 0;
    background: #000000;
    box-shadow: 0 6px 16px rgba(0,0,0,0.5);
  }}

  .screenshot-container img {{
    width: 100%;
    height: auto;
    display: block;
    max-height: 480px;
    object-fit: cover;
    object-position: top;
  }}

  .screenshot-caption {{
    background: #081628;
    padding: 6px 12px;
    font-size: 7.5pt;
    color: #94a3b8;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }}

  .caption-badge {{
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 1px 6px;
    border-radius: 4px;
    font-weight: 700;
  }}

  .card-box {{
    background: rgba(8, 22, 40, 0.7);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 12px;
    margin-top: 8px;
  }}

  .card-box h4 {{
    font-size: 9pt;
    font-weight: 700;
    color: #38bdf8;
    margin-bottom: 6px;
  }}

  .kpi-row {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin: 8px 0;
  }}

  .kpi-box {{
    background: rgba(15, 34, 71, 0.9);
    border: 1px solid rgba(34, 199, 242, 0.2);
    border-radius: 8px;
    padding: 8px;
    text-align: center;
  }}

  .kpi-num {{
    font-size: 13pt;
    font-weight: 900;
    color: #22C7F2;
  }}

  .kpi-title {{
    font-size: 7pt;
    color: #94a3b8;
    margin-top: 2px;
  }}

  table.data-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
    margin: 8px 0;
  }}

  table.data-table th {{
    background: #081628;
    color: #38bdf8;
    font-weight: 700;
    padding: 6px 8px;
    text-align: left;
    border: 1px solid rgba(255,255,255,0.08);
  }}

  table.data-table td {{
    padding: 5px 8px;
    border: 1px solid rgba(255,255,255,0.06);
    color: #cbd5e1;
  }}

  table.data-table tr:nth-child(even) {{
    background: rgba(255,255,255,0.02);
  }}

  .status-tag {{
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 7pt;
    font-weight: 700;
  }}
  .status-verified {{ background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }}
  .status-active {{ background: rgba(34, 199, 242, 0.2); color: #38bdf8; border: 1px solid rgba(34, 199, 242, 0.4); }}
  .status-warning {{ background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }}

  code {{
    background: rgba(0,0,0,0.4);
    color: #f43f5e;
    padding: 1px 4px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 7.5pt;
  }}
</style>
</head>
<body>

  <!-- ==================== HEADER & COVER CARD ==================== -->
  <div class="header-card">
    <span class="header-badge">🏛️ FAEDA ENTERPRISE UNIVERSITY ECOSYSTEM — COMPLETE OFFICIAL REPORT</span>
    <h1>फायदा विद्यापीठ परिसंस्था (Faeda University Ecosystem) संपूर्ण प्रकल्प अहवाल</h1>
    <p class="subtitle">
      किंग फैसल विद्यापीठ (अल-अहसा) व सौदी व्हिजन २०३० (Saudi Vision 2030) मानकांनुसार विकसित केलेले आधुनिक शैक्षणिक व रोजगार समन्वय व्यासपीठ. सर्व पेजेसचे स्क्रीनशॉट्स, कार्यप्रणाली, बॅकएंड एपीआय आणि डेटाबेस मॅपिंगसह विस्तृत तांत्रिक अहवाल.
    </p>

    <div class="meta-grid">
      <div class="meta-item">
        <div class="meta-label">संस्था (Institution)</div>
        <div class="meta-value">किंग फैसल विद्यापीठ (KFU)</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">प्रकल्प स्थिती (Build Status)</div>
        <div class="meta-value" style="color: #34d399;">✅ 100% Production Ready (0 Errors)</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">तांत्रिक फ्रेमवर्क (Tech Stack)</div>
        <div class="meta-value">React + TS + Vite + Flask + SQLite</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">अहवाल दिनांक (Date)</div>
        <div class="meta-value">ऑक्टोबर २०२६ / Vision 2030</div>
      </div>
    </div>
  </div>

  <!-- ==================== SECTION 1: DASHBOARD ==================== -->
  <div class="section">
    <span class="section-tag">PAGE 01 — COMMAND & PERFORMANCE HUB</span>
    <h2>१. मुख्य विद्यापीठ डॅशबोर्ड व रोजगार विश्लेषण (Executive Dashboard)</h2>
    <p>
      विद्यापीठाचा मुख्य डॅशबोर्ड हा एक उच्च दर्जाचा कार्यकारी केंद्र आहे. याद्वारे विद्यापीठाच्या पदवीधरांची थेट रोजगार क्षमता (Employability), सौदी व्हिजन २०३० राष्ट्रीय उद्दिष्टे (Vision 2030 Targets), शैक्षणिक पडताळणी प्रलंबितता (Verification Queue), आणि प्रमुख ३ मॉड्यूल्सचे त्वरित प्रवेश बिंदू (Quick Navigation Hubs) प्रदर्शित होतात.
    </p>

    <div class="kpi-row">
      <div class="kpi-box">
        <div class="kpi-num">८४.६%</div>
        <div class="kpi-title">थेट रोजगार दर (In-Field Rate)</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-num">५९५</div>
        <div class="kpi-title">सर्वेक्षण पदवीधर (Graduates)</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-num">११,४०० SAR</div>
        <div class="kpi-title">सरासरी सुरुवाती वेतन (Avg Salary)</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-num">२.८ महिने</div>
        <div class="kpi-title">नोकरी मिळण्याचा सरासरी वेळ (Time-to-Hire)</div>
      </div>
    </div>

    <div class="screenshot-container">
      <img src="{img_dashboard}" alt="University Executive Dashboard Screenshot" />
      <div class="screenshot-caption">
        <span><strong>स्क्रीनशॉट १:</strong> विद्यापीठ मुख्य कार्यकारी डॅशबोर्ड — ८ केपीआय, ४-टॅब रोजगार विश्लेषण, आणि थेट पडताळणी रांग.</span>
        <span class="caption-badge">Live System Verified</span>
      </div>
    </div>

    <div class="card-box">
      <h4>मुख्य वैशिष्ट्ये आणि कार्यप्रणाली (Key Functionalities)</h4>
      <ul>
        <li><strong>८ मुख्य केपीआय कार्ड्स:</strong> एकूण विद्यार्थी (४,८२०), पडताळणी पूर्ण (४,१५०), सक्रिय मोहिमा (६), मुंशात इनक्यूबेटर कंपन्या (६), कोऑप विद्यार्थी (१२), रोजगारात असलेले पदवीधर (५१९) चे थेट रिअल-टाइम प्रदर्शन.</li>
        <li><strong>रोजगार विश्लेषण कार्ड (Employment KPIs):</strong> ४ स्वतंत्र टॅब्स (Overview, Salaries, Duration, Departments) द्वारे पदवीधरांचे पगार, रोजगार कालावधी आणि विभागवार विश्लेषण.</li>
        <li><strong>३ जलद मॉड्यूल्स हब्स (Core Feature Hubs):</strong> मोहिमा व्यवस्थापन (Campaigns), मुंशात इनक्यूबेटर (Incubator), आणि प्राध्यापक कोऑप सुपरव्हिजन (Co-op) कडे थेट मार्गक्रमण.</li>
        <li><strong>थेट पदवी पडताळणी मोडल (Direct Verification Modal):</strong> डॅशबोर्डवरूनच प्राध्यापक किंवा विद्यापीठ प्रशासक विद्यार्थ्याची पदवी, जीपीए तपासून एका क्लिकवर अधिकृत मान्यता देऊ शकतात.</li>
      </ul>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 2: CAMPAIGNS ==================== -->
  <div class="section">
    <span class="section-tag">PAGE 02 — ACADEMIC RESEARCH & COMMERCIALIZATION</span>
    <h2>२. थिसिस व विद्यापीठ नवकल्पना विपणन मोहिमा (Campaigns & Theses)</h2>
    <p>
      मास्टर्स, पीएचडी आणि पेटंट प्राप्त विद्यार्थ्यांच्या संशोधनाला थेट सौदी उद्योग जगताशी (Corporate & Industry Partners) जोडण्यासाठी हे व्यासपीठ कार्य करते. यामुळे विद्यार्थ्यांचे संशोधन केवळ लायब्ररीपुरते मर्यादित न राहता व्यावसायिक स्पॉन्सरशिप मिळवते.
    </p>

    <div class="screenshot-container">
      <img src="{img_campaigns}" alt="Campaigns Page Screenshot" />
      <div class="screenshot-caption">
        <span><strong>स्क्रीनशॉट २:</strong> संशोधन विपणन मोहिमा — विद्यापीठ अधिकृत शिक्का (Official Seal), ४ कृती बटणे आणि कॉर्पोरेट विश्लेषण.</span>
        <span class="caption-badge">Co-branded Official</span>
      </div>
    </div>

    <div class="card-box">
      <h4>मुख्य वैशिष्ट्ये आणि कार्यप्रणाली (Key Functionalities)</h4>
      <ul>
        <li><strong>विद्यापीठ व प्रायोजक सह-ब्रँडिंग (Co-branding Header):</strong> प्रत्येक मोहिमेवर किंग फैसल विद्यापीठाचा अधिकृत लोगो, मान्यताप्राप्त डिजिटल शिक्का (Official University Seal) आणि मान्यता मजकूर स्पष्ट दिसतो.</li>
        <li><strong>४ सक्रिय कृती बटणे (Interactive Action Buttons):</strong>
          १) <em>संशोधन सारांश (View Research Summary)</em>,
          २) <em>विद्यापीठ मंजुरी स्थिती (University Approval Status)</em>,
          ३) <em>कॉर्पोरेट भागीदारी विनंती (Request Corporate Partnership)</em>,
          ४) <em>मोहीम शेअर करा (Copy / Share Link)</em>.
        </li>
        <li><strong>मंजुरी कार्यप्रवाह (Approval Workflow):</strong> ड्राफ्ट (Draft) ➔ प्रलंबित आढावा (Pending Review) ➔ विद्यापीठ मान्यता (Approved) ➔ सार्वजनिक सक्रिय (Published).</li>
        <li><strong>कार्यप्रदर्शन व विश्लेषण टॅब (Campaign Analytics):</strong> मोहिमांचे एकूण व्ह्यूज, उद्योग चौकशी (Inquiries), आणि स्पॉन्सरशिप लीड्सचे विश्लेषण.</li>
      </ul>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 3: INCUBATOR ==================== -->
  <div class="section">
    <span class="section-tag">PAGE 03 — ENTREPRENEURSHIP & STARTUPS</span>
    <h2>३. 'मुंशात' मान्यताप्राप्त विद्यापीठ इनक्यूबेटर (Monsha'at Incubator)</h2>
    <p>
      किंग फैसल विद्यापीठातील 'मुंशात' (Monsha'at) मान्यताप्राप्त बिझनेस इनक्यूबेटर केंद्र. हे मॉड्यूल विद्यार्थी आणि पदवीधरांच्या स्टार्टअप कंपन्यांची नोंदणी, त्यांनी निर्माण केलेले स्थानिक रोजगार, जमा केलेला भांडवली निधी (SAR), आणि विद्यापीठाच्या अभ्यासक्रमाशी (Academic Connection) जोडणी दर्शवते.
    </p>

    <div class="screenshot-container">
      <img src="{img_incubator}" alt="Monsha'at Incubator Showcase Screenshot" />
      <div class="screenshot-caption">
        <span><strong>स्क्रीनशॉट ३:</strong> मुंशात बिझनेस इनक्यूबेटर — स्टार्टअप पोर्टफोलिओ, रोजगार निर्मिती आणि शैक्षणिक अभ्यासक्रम केस स्टडीज.</span>
        <span class="caption-badge">Monsha'at Accredited</span>
      </div>
    </div>

    <div class="card-box">
      <h4>मुख्य वैशिष्ट्ये आणि कार्यप्रणाली (Key Functionalities)</h4>
      <ul>
        <li><strong>स्टार्टअप नोंदणी मोडल (Register Startup Modal):</strong> नवीन कंपनीचे नाव, संस्थापक, पदवीधर तुकडी, व्यवसाय क्षेत्र, भांडवल आणि निर्माण केलेले रोजगार भरून तात्काळ नोंदणी.</li>
        <li><strong>शैक्षणिक अभ्यासक्रम जोडणी (Academic Connection Flow):</strong> स्टार्टअपची यशोगाथा उद्योजकता अभ्यासक्रम <code>BUS-302</code> मध्ये अधिकृत केस स्टडी म्हणून समाविष्ट केली जाते.</li>
        <li><strong>संस्थात्मक गुणवत्ता मान्यता (NCAAA Alignment):</strong> अल-अहसा ओएसिस शाश्वतता निकष ७.४ शी जुळवून घेत राष्ट्रीय गुणवत्ता मानकांचे पालन.</li>
        <li><strong>क्षेत्रीय फिल्टरिंग (Sector Filtering):</strong> अ‍ॅगटेक (AgTech), लॉजिस्टिक्स, आणि कृत्रिम बुद्धिमत्ता (AI) मधील स्टार्टअप्सचे सुलभ वर्गीकरण.</li>
      </ul>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 4: CO-OP SUPERVISION ==================== -->
  <div class="section">
    <span class="section-tag">PAGE 04 — FACULTY FIELD SUPERVISION</span>
    <h2>४. सहकारी प्रशिक्षण व प्राध्यापक सुपरव्हिजन (Co-op Supervision)</h2>
    <p>
      विद्यार्थ्यांच्या प्रत्यक्ष औद्योगिक प्रशिक्षणावर प्राध्यापकांचे नियंत्रण ठेवणारे कमांड सेंटर. सौदी श्रम मंत्रालय आणि विद्यापीठाच्या नियमांनुसार आवश्यक ४०० तासांचे (400-Hour Benchmark) फील्ड ट्रेनिंग ट्रॅकिंग, कंपनी भेटींचे नियोजन आणि मिडटर्म/फायनल मूल्यांकन यातून पार पाडले जाते.
    </p>

    <div class="screenshot-container">
      <img src="{img_coop}" alt="Co-op Training Supervision Screenshot" />
      <div class="screenshot-caption">
        <span><strong>स्क्रीनशॉट ४:</strong> प्राध्यापक सुपरव्हिजन पोर्टल — ४०० तास प्रगती बार, कंपनी मेंटॉर तपशील आणि ऑन-साइट व्हिजिट वेळापत्रक.</span>
        <span class="caption-badge">400-Hour Tracking</span>
      </div>
    </div>

    <div class="card-box">
      <h4>मुख्य वैशिष्ट्ये आणि कार्यप्रणाली (Key Functionalities)</h4>
      <ul>
        <li><strong>प्राध्यापक आयडेंटिटी व ५ केपीआय कार्ड्स:</strong> नियुक्त विद्यार्थी, सक्रिय प्रशिक्षणार्थी, पूर्ण केलेले प्रशिक्षण, प्रलंबित मूल्यमापन, आणि आगामी कंपनी भेटी.</li>
        <li><strong>४०० तास प्रगती निर्देशक (Visual Hours Progress Bar):</strong> विद्यार्थ्याने पूर्ण केलेले तास व उर्वरित तासांची टक्केवारी व रंगीत इंडिकेटर.</li>
        <li><strong>फील्ड व्हिजिट शेड्यूलिंग (Schedule Field Visit):</strong> प्राध्यापक कंपनीला प्रत्यक्ष भेट (On-site Inspection) किंवा व्हर्च्युअल आढावा नियोजित करू शकतात.</li>
        <li><strong>मूल्यांकन कार्यप्रणाली (Midterm / Final Grading Modal):</strong> कंपनी मेंटॉर गुण (Company Score), प्राध्यापक परीक्षा गुण, आणि अधिकृत शिफारसींची नोंद.</li>
      </ul>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 5: STUDENT DIRECTORY ==================== -->
  <div class="section">
    <span class="section-tag">PAGE 05 — TALENT DISCOVERY & CREDENTIALS</span>
    <h2>५. विद्यार्थी व पदवीधर निर्देशिका (Student Talent Directory)</h2>
    <p>
      विद्यापीठातील सर्व सक्रिय व पदवीधर विद्यार्थ्यांची सर्वसमावेशक निर्देशिका. विद्यार्थ्यांचे शैक्षणिक गुण (GPA), पदवी प्रकार, विभाग, आणि नोकरीच्या शोधात असण्याची स्थिती (Job Search Readiness) येथे संकलित केली जाते.
    </p>

    <div class="screenshot-container">
      <img src="{img_students}" alt="Students Directory Screenshot" />
      <div class="screenshot-caption">
        <span><strong>स्क्रीनशॉट ५:</strong> विद्यार्थी निर्देशिका — ४ केपीआय सारांश, ग्रीड/लिस्ट टॉगल आणि थेट पडताळणी डोसियर.</span>
        <span class="caption-badge">Enterprise Directory</span>
      </div>
    </div>

    <div class="card-box">
      <h4>मुख्य वैशिष्ट्ये आणि कार्यप्रणाली (Key Functionalities)</h4>
      <ul>
        <li><strong>४ सारांश निर्देशक कार्ड्स (KPI Summary Cards):</strong> एकूण विद्यार्थी (Total Students), पडताळणी पूर्ण (Verified Credentials), पदवीधर संख्या (Graduates), आणि सक्रिय नोकरी शोधणारे (Active Job Seekers).</li>
        <li><strong>ग्रीड आणि लिस्ट व्ह्यू पर्याय (Grid / List View Toggle):</strong> युझरच्या सोयीनुसार विद्यार्थ्यांची माहिती आकर्षक कार्ड्स किंवा टेबल स्वरूपात पाहण्याची सुविधा.</li>
        <li><strong>विद्यार्थी शैक्षणिक डोसियर (Academic Dossier Card):</strong> विद्यार्थ्याचे पूर्ण नाव, विभाग, जीपीए, पदवी वर्ष, आणि थेट पडताळणी बॅजचे दर्शन.</li>
        <li><strong>डेटा एक्सपोर्ट आणि फिल्टरिंग:</strong> विभाग, पदवी स्तर आणि पडताळणी स्थितीनुसार एका क्लिकवर डेटा शोधण्याची व सीएसव्ही एक्सपोर्ट करण्याची सोय.</li>
      </ul>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 6: DEGREE VERIFICATION ==================== -->
  <div class="section">
    <span class="section-tag">PAGE 06 — INSTITUTIONAL DIGITAL TRUST</span>
    <h2>६. अधिकृत डिजिटल पदवी पडताळणी प्रणाली (Degree Verification)</h2>
    <p>
      कंपन्या, सरकारी संस्था आणि रिक्रूटर्सकडून येणाऱ्या पदवी पडताळणी विनंत्यांवर अधिकृत प्रक्रिया करणारे मॉडेल. डिजिटल पडताळणी टोकन्स (Verification Tokens) द्वारे कागदपत्रांची तात्काळ सत्यता तपासली जाते.
    </p>

    <div class="screenshot-container">
      <img src="{img_verifications}" alt="Degree Verification Screenshot" />
      <div class="screenshot-caption">
        <span><strong>स्क्रीनशॉट ६:</strong> अधिकृत पदवी पडताळणी प्रणाली — टोकन-आधारित शोध, ४ स्थिती निर्देशक आणि मंजुरी कार्यप्रवाह.</span>
        <span class="caption-badge">Official Digital System</span>
      </div>
    </div>

    <div class="card-box">
      <h4>मुख्य वैशिष्ट्ये आणि कार्यप्रणाली (Key Functionalities)</h4>
      <ul>
        <li><strong>टोकन-आधारित त्वरित पडताळणी (Token Verification Search):</strong> <code>FAEDA-VERIF-KSU-8392</code> सारखा पडताळणी कोड टाकल्यास विद्यार्थ्याचे नाव, विभाग व जीपीए तात्काळ स्क्रीनवर सिद्ध होतो.</li>
        <li><strong>४ स्थिती निर्देशक:</strong> एकूण विनंत्या (Total Requests), अधिकृत मंजूर (Verified), प्रलंबित (Pending Review), आणि नाकारलेले (Rejected).</li>
        <li><strong>डॉक्युमेंट व्ह्यूअर व ऑडिट ट्रेल:</strong> विद्यार्थ्याच्या मूळ पदवी प्रमाणपत्राची तपासणी करून डिजिटल मंजुरी अथवा दुरुस्तीच्या टिप्पण्या देण्याची सुविधा.</li>
      </ul>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 7: DEPARTMENTS & PROFILE ==================== -->
  <div class="section">
    <span class="section-tag">PAGE 07 & 08 — ACADEMIC STRUCTURE & INSTITUTION PROFILE</span>
    <h2>७. शैक्षणिक विभाग आणि विद्यापीठ संस्थात्मक प्रोफाईल (Departments & Profile)</h2>
    <p>
      विद्यापीठातील सर्व मान्यताप्राप्त महाविद्यालये, विभाग, आणि संस्थात्मक प्रोफाइल व्यवस्थापन. विद्यापीठाच्या प्रोफाइलमध्ये राष्ट्रीय मान्यता (NCAAA) आणि क्यूएस रँकिंग (QS Ranking) दर्शवणारा सार्वजनिक पूर्वावलोकन (Public Profile Preview) पर्याय समाविष्ट आहे.
    </p>

    <div class="screenshot-container">
      <img src="{img_departments}" alt="University Departments Screenshot" />
      <div class="screenshot-caption">
        <span><strong>स्क्रीनशॉट ७:</strong> शैक्षणिक विभाग रचना — ४ विभाग केपीआय, पदवी कार्यक्रम आणि व्यवस्थापन मोडल.</span>
        <span class="caption-badge">Academic Structure</span>
      </div>
    </div>

    <div class="screenshot-container" style="margin-top: 14px;">
      <img src="{img_profile}" alt="University Profile Screenshot" />
      <div class="screenshot-caption">
        <span><strong>स्क्रीनशॉट ८:</strong> संस्थात्मक प्रोफाईल — आरोग्य स्कोअरकार्ड (Completeness Score) आणि सार्वजनिक प्रोफाईल पूर्वावलोकन.</span>
        <span class="caption-badge">Institutional Identity</span>
      </div>
    </div>

    <div class="card-box">
      <h4>विभाग व प्रोफाईल कार्यप्रणाली (Key Functionalities)</h4>
      <ul>
        <li><strong>विभाग व्यवस्थापन (Departments CRUD):</strong> नवीन विभाग जोडणे, विभाग प्रमुखांची नावे, पदवी स्तर (B.Sc., M.Sc., Ph.D.) अपडेट करणे.</li>
        <li><strong>८-पॉइंट प्रोफाइल हेल्थ स्कोअरकार्ड:</strong> विद्यापीठाच्या प्रोफाईल परिपूर्णतेची (100% Scorecard) गणना.</li>
        <li><strong>सार्वजनिक प्रोफाईल टॉगल (View Public Profile Toggle):</strong> फॉर्म संपादन आणि कंपन्यांना दिसणारा अधिकृत पब्लिक व्ह्यू यामध्ये सहज स्विचिंग.</li>
      </ul>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ==================== SECTION 8: BACKEND & DATABASE MAPPING ==================== -->
  <div class="section">
    <span class="section-tag">ARCHITECTURE — BACKEND & DATABASE FULL SPECIFICATION</span>
    <h2>८. बॅकएंड एपीआय आणि डेटाबेस आर्किटेक्चर सारणी (Full Tech Mapping)</h2>
    <p>
      फायदा विद्यापीठ परिसंस्थेतील सर्व फीचर्स बॅकएंडमधील फ्लास्क (Flask) राउट्स आणि एसक्यूएलअल्केमी (SQLAlchemy ORM) डेटाबेस टेबल्सशी १००% जोडलेले आहेत.
    </p>

    <h3 style="margin-top: 12px;">१. संपूर्ण १२ विद्यापीठ रेस्ट एपीआय (REST Endpoints)</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>Endpoint URL</th>
          <th>Method</th>
          <th>कार्य (Purpose)</th>
          <th>स्थिती (Test Result)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>/api/v1/university/me</code></td>
          <td><span class="status-tag status-active">GET</span></td>
          <td>सत्र व अधिकृत संस्था ओळख पडताळणी</td>
          <td><span class="status-tag status-verified">200 OK</span></td>
        </tr>
        <tr>
          <td><code>/api/v1/university/profile</code></td>
          <td><span class="status-tag status-active">GET / PUT</span></td>
          <td>विद्यापीठ प्रोफाइल माहिती मिळवणे व अद्यतन करणे</td>
          <td><span class="status-tag status-verified">200 OK</span></td>
        </tr>
        <tr>
          <td><code>/api/v1/university/dashboard</code></td>
          <td><span class="status-tag status-active">GET</span></td>
          <td>मुख्य डॅशबोर्ड एकत्रित मेट्रिक्स व सारांश</td>
          <td><span class="status-tag status-verified">200 OK</span></td>
        </tr>
        <tr>
          <td><code>/api/v1/university/students</code></td>
          <td><span class="status-tag status-active">GET</span></td>
          <td>विद्यार्थी निर्देशिका, शोध व फिल्टरिंग</td>
          <td><span class="status-tag status-verified">200 OK</span></td>
        </tr>
        <tr>
          <td><code>/api/v1/university/verifications</code></td>
          <td><span class="status-tag status-active">GET / PUT</span></td>
          <td>पदवी पडताळणी रांग, स्थिती मंजुरी व नकार</td>
          <td><span class="status-tag status-verified">200 OK</span></td>
        </tr>
        <tr>
          <td><code>/api/v1/university/departments</code></td>
          <td><span class="status-tag status-active">GET / POST / DEL</span></td>
          <td>विभाग यादी, नवीन विभाग निर्मिती व डिलीट</td>
          <td><span class="status-tag status-verified">200 / 201 OK</span></td>
        </tr>
        <tr>
          <td><code>/api/v1/university/employment-kpis</code></td>
          <td><span class="status-tag status-active">GET</span></td>
          <td>पदवीधर रोजगार दर, पगार व व्हिजन २०३० केपीआय</td>
          <td><span class="status-tag status-verified">200 OK</span></td>
        </tr>
        <tr>
          <td><code>/api/v1/university/campaigns</code></td>
          <td><span class="status-tag status-active">GET / POST</span></td>
          <td>संशोधन थिसिस मोहिमा यादी व निर्मिती</td>
          <td><span class="status-tag status-verified">200 / 201 OK</span></td>
        </tr>
        <tr>
          <td><code>/api/v1/university/incubator</code></td>
          <td><span class="status-tag status-active">GET / POST</span></td>
          <td>मुंशात इनक्यूबेटर स्टार्टअप्स पोर्टफोलिओ व नोंदणी</td>
          <td><span class="status-tag status-verified">200 / 201 OK</span></td>
        </tr>
        <tr>
          <td><code>/api/v1/university/coop-supervision</code></td>
          <td><span class="status-tag status-active">GET / POST</span></td>
          <td>सहकारी प्रशिक्षण रोस्टर व नवीन विद्यार्थी इनरोलमेंट</td>
          <td><span class="status-tag status-verified">200 / 201 OK</span></td>
        </tr>
        <tr>
          <td><code>/api/v1/university/coop-schedule</code></td>
          <td><span class="status-tag status-active">GET / POST</span></td>
          <td>प्राध्यापक कंपनी व्हिजिट वेळापत्रक</td>
          <td><span class="status-tag status-verified">200 OK</span></td>
        </tr>
        <tr>
          <td><code>/api/v1/university/academic-updates</code></td>
          <td><span class="status-tag status-active">GET</span></td>
          <td>अभ्यासक्रम बदल, पेटंट्स व राष्ट्रीय पुरस्कार यादी</td>
          <td><span class="status-tag status-verified">200 OK</span></td>
        </tr>
      </tbody>
    </table>

    <h3 style="margin-top: 14px;">२. डेटाबेस टेबल्स आणि लाइव्ह रेकॉर्ड्स (Database Schema)</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>डेटाबेस टेबल</th>
          <th>मुख्य कॉलम्स (Core Columns)</th>
          <th>रेकॉर्ड्स संख्या</th>
          <th>वर्णन</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>universities</code></td>
          <td>id, name_ar, name_en, email, location, logo, qs_rank</td>
          <td><span class="status-tag status-verified">८ संस्था</span></td>
          <td>किंग फैसल विद्यापीठ व मान्यताप्राप्त विद्यापीठे</td>
        </tr>
        <tr>
          <td><code>university_departments</code></td>
          <td>id, university_id, name_ar, degree_type, head_name</td>
          <td><span class="status-tag status-verified">१८ विभाग</span></td>
          <td>संगणक, सायबर सिक्युरिटी, अ‍ॅगटेक इत्यादी विभाग</td>
        </tr>
        <tr>
          <td><code>academic_verifications</code></td>
          <td>id, customer_id, degree_title, gpa, status, token</td>
          <td><span class="status-tag status-verified">६ विनंत्या</span></td>
          <td>पदवी पडताळणी रांग व पडताळणी टोकन्स</td>
        </tr>
        <tr>
          <td><code>university_thesis_campaigns</code></td>
          <td>id, title, researcher, type, status, views, leads</td>
          <td><span class="status-tag status-verified">६ मोहिमा</span></td>
          <td>मास्टर्स व पीएचडी संशोधन मोहिमा</td>
        </tr>
        <tr>
          <td><code>university_incubator_ventures</code></td>
          <td>id, company_name_ar, founder, jobs_created, funding</td>
          <td><span class="status-tag status-verified">६ कंपन्या</span></td>
          <td>मुंशात मान्यताप्राप्त स्टार्टअप पोर्टफोलिओ</td>
        </tr>
        <tr>
          <td><code>coop_training_supervisions</code></td>
          <td>id, student_name, major, company, hours, final_score</td>
          <td><span class="status-tag status-verified">१० विद्यार्थी</span></td>
          <td>४०० तास कोऑप प्रशिक्षण रोस्टर</td>
        </tr>
      </tbody>
    </table>

    <div class="card-box" style="margin-top: 14px; border: 1px solid rgba(16, 185, 129, 0.3);">
      <h4 style="color: #34d399;">अंतिम प्रकल्प पडताळणी निकाल (Verification Summary)</h4>
      <p style="font-size: 8.5pt;">
        ✔️ <strong>फ्रंटएंड:</strong> <code>npm run build</code> (TypeScript <code>tsc -b</code> आणि Vite build) यशस्वीपणे <strong>० एरर्स (0 Errors)</strong> सह पूर्ण झाले.<br/>
        ✔️ <strong>बॅकएंड:</strong> सर्व १२ विद्यापीठ रेस्ट एंडपॉइंट्स टेस्ट क्लायंटवर <strong>200 / 201 OK</strong> रिस्पॉन्स देत आहेत.<br/>
        ✔️ <strong>डेटाबेस:</strong> <code>instance/database.db</code> मधील सर्व टेबल्स तयार असून लाइव्ह सिडेड डेटासह कनेक्टेड आहेत.<br/>
        ✔️ <strong>त्रैभाषिक सपोर्ट:</strong> अरबी (Arabic), इंग्रजी (English) आणि हिंदी/मराठीमध्ये सिस्टीम अखंडपणे कार्यरत आहे.
      </p>
    </div>
  </div>

</body>
</html>
"""

output_html_artifact = os.path.join(artifact_dir, "Faeda_University_Ecosystem_Complete_Report.html")
with open(output_html_artifact, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Generated HTML report:", output_html_artifact)

# Generate PDF with headless Chrome
output_pdf_artifact = os.path.join(artifact_dir, "Faeda_University_Ecosystem_Complete_Report.pdf")
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={output_pdf_artifact}",
    output_html_artifact
]

print("Executing Chrome print-to-pdf...")
res = subprocess.run(cmd, capture_output=True, text=True)
print("Chrome return code:", res.returncode)

if os.path.exists(output_pdf_artifact):
    pdf_size = os.path.getsize(output_pdf_artifact)
    print(f"SUCCESS: PDF generated! Size: {pdf_size} bytes ({round(pdf_size / (1024*1024), 2)} MB)")

    # Also copy to workspace root so user can easily open it directly from their workspace!
    workspace_pdf = os.path.join(workspace_dir, "Faeda_University_Ecosystem_Complete_Report.pdf")
    workspace_html = os.path.join(workspace_dir, "Faeda_University_Ecosystem_Complete_Report.html")
    shutil.copyfile(output_pdf_artifact, workspace_pdf)
    shutil.copyfile(output_html_artifact, workspace_html)
    print(f"Copied to workspace root: {workspace_pdf}")
else:
    print("PDF generation failed. Output:", res.stderr)
