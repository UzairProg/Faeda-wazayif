/**
 * features/university/utils/universityLocalization.ts
 *
 * Trilingual localization adapter for University Workspace content:
 * Arabic (العربية) ↔ English ↔ Hindi (हिन्दी).
 * Ensures that data records, KPIs, campaigns, ventures, and student rosters
 * dynamically present native titles, statuses, and descriptions in the active language.
 */
import type { Language } from "@/store/language.store"
import type {
  GraduateEmploymentKPIs,
  UniversityThesisCampaign,
  UniversityIncubatorVenture,
  CoopSupervisedStudent,
  ProfessorSupervisionScheduleItem,
  UniversityDepartmentItem,
  UniversityOpportunityItem,
  UniversityStudentItem,
} from "../types/university.types"

/**
 * Universal trilingual text selector.
 * Returns Arabic, English, or Hindi string according to current language.
 */
export function tl(
  language: Language,
  ar: string,
  en: string,
  hi?: string
): string {
  if (language === "ar") return ar
  if (language === "hi") return hi || en
  return en
}

/**
 * Localizes Graduate Employment Performance Indicators (KPIs)
 */
export function getLocalizedKPIs(
  kpis: GraduateEmploymentKPIs,
  lang: Language
): GraduateEmploymentKPIs {
  if (lang === "ar") return kpis

  const isHi = lang === "hi"

  // Localized Performance Status & Ranking
  const localizedStatus = isHi
    ? "विज़न 2030 राष्ट्रीय लक्ष्य से 9.6% अधिक"
    : "Outperforming Saudi Vision 2030 National Target (+9.6%)"

  const localizedRank = isHi
    ? "#3 पूर्वी प्रांत में"
    : "#3 in Eastern Province"

  // Department name translations
  const deptMap: Record<string, { en: string; hi: string }> = {
    "علوم الحاسب وتقنية المعلومات": {
      en: "Computer Science & IT",
      hi: "कंप्यूटर विज्ञान एवं आईटी",
    },
    "هندسة البرمجيات": {
      en: "Software Engineering",
      hi: "सॉफ्टवेयर इंजीनियरिंग",
    },
    "العلوم الزراعية والأغذية (AgTech)": {
      en: "Agricultural & Food Sciences (AgTech)",
      hi: "कृषि एवं खाद्य विज्ञान (एगटेक)",
    },
    "إدارة الأعمال ونظم المعلومات": {
      en: "Business Administration & MIS",
      hi: "व्यवसाय प्रबंधन और सूचना प्रणाली",
    },
    "الأمن السيبراني والتحري الرقمي": {
      en: "Cybersecurity & Digital Forensics",
      hi: "साइबर सुरक्षा और डिजिटल फोरेंसिक",
    },
  }

  // Salary brackets translations
  const bracketMap: Record<string, { en: string; hi: string }> = {
    "أقل من 8,000 ر.س": {
      en: "Below SAR 8,000",
      hi: "8,000 रियाल से कम",
    },
    "8,000 - 11,000 ر.س": {
      en: "SAR 8,000 - 11,000",
      hi: "8,000 - 11,000 रियाल",
    },
    "11,000 - 15,000 ر.س": {
      en: "SAR 11,000 - 15,000",
      hi: "11,000 - 15,000 रियाल",
    },
    "أعلى من 15,000 ر.س": {
      en: "Above SAR 15,000",
      hi: "15,000 रियाल से अधिक",
    },
  }

  // Specialization salary breakdown
  const specMap: Record<
    string,
    { en: string; hi: string; demand_en: string; demand_hi: string }
  > = {
    "الذكاء الاصطناعي وعلم البيانات": {
      en: "Artificial Intelligence & Data Science",
      hi: "आर्टिफिशियल इंटेलिजेंस और डेटा साइंस",
      demand_en: "Very High Demand",
      demand_hi: "अत्यधिक मांग",
    },
    "الأمن السيبراني والبنية التحتية": {
      en: "Cybersecurity & Infrastructure",
      hi: "साइबर सुरक्षा और बुनियादी ढांचा",
      demand_en: "Very High Demand",
      demand_hi: "अत्यधिक मांग",
    },
    "هندسة البرمجيات والأنظمة السحابية": {
      en: "Software & Cloud Systems Engineering",
      hi: "सॉफ्टवेयर और क्लाउड सिस्टम",
      demand_en: "High Demand",
      demand_hi: "उच्च मांग",
    },
    "التقنيات الزراعية الحديثة (AgTech)": {
      en: "Modern Agricultural Tech (AgTech)",
      hi: "आधुनिक कृषि तकनीक (एगटेक)",
      demand_en: "Promising & High",
      demand_hi: "उच्च और आशाजनक",
    },
    "نظم المعلومات الإدارية والتحول الرقمي": {
      en: "Management Info Systems & Digital Transformation",
      hi: "प्रबंधन सूचना प्रणाली और डिजिटल परिवर्तन",
      demand_en: "Stable Demand",
      demand_hi: "स्थिर मांग",
    },
  }

  // Duration distribution
  const durMap: Record<
    string,
    { dur_en: string; dur_hi: string; desc_en: string; desc_hi: string }
  > = {
    "أقل من 3 أشهر": {
      dur_en: "Under 3 Months",
      dur_hi: "3 महीने से कम",
      desc_en: "Fast direct placement post-graduation or during co-op training",
      desc_hi: "स्नातक होने के तुरंत बाद या सह-प्रशिक्षण के दौरान त्वरित नियुक्ति",
    },
    "3 إلى 6 أشهر": {
      dur_en: "3 to 6 Months",
      dur_hi: "3 से 6 महीने",
      desc_en: "Standard job search and selective corporate interviews",
      desc_hi: "मानक नौकरी खोज और कॉर्पोरेट साक्षात्कार",
    },
    "6 إلى 12 شهراً": {
      dur_en: "6 to 12 Months",
      dur_hi: "6 से 12 महीने",
      desc_en: "Acquiring extra specialized industry certifications",
      desc_hi: "अतिरिक्त विशेष पेशेवर प्रमाणपत्र प्राप्त करना",
    },
    "أكثر من 12 شهراً": {
      dur_en: "Over 12 Months",
      dur_hi: "12 महीने से अधिक",
      desc_en: "Career pivot, further study, or entrepreneurial pursuits",
      desc_hi: "करियर बदलाव, आगे की पढ़ाई या उद्यमिता",
    },
  }

  return {
    ...kpis,
    overall_metrics: {
      ...kpis.overall_metrics,
      performance_status: localizedStatus,
      national_rank_employability: localizedRank,
    },
    department_rates: kpis.department_rates.map((d) => ({
      ...d,
      department:
        deptMap[d.department]?.[isHi ? "hi" : "en"] || d.department,
    })),
    salary_metrics: {
      ...kpis.salary_metrics,
      salary_brackets: kpis.salary_metrics.salary_brackets.map((b) => ({
        ...b,
        bracket:
          bracketMap[b.bracket]?.[isHi ? "hi" : "en"] || b.bracket,
      })),
      by_specialization: kpis.salary_metrics.by_specialization.map((s) => ({
        ...s,
        specialization:
          specMap[s.specialization]?.[isHi ? "hi" : "en"] || s.specialization,
        demand_level:
          specMap[s.specialization]?.[isHi ? "demand_hi" : "demand_en"] ||
          s.demand_level,
      })),
    },
    unemployment_duration: {
      ...kpis.unemployment_duration,
      distribution: kpis.unemployment_duration.distribution.map((u) => ({
        ...u,
        duration:
          durMap[u.duration]?.[isHi ? "dur_hi" : "dur_en"] || u.duration,
        description:
          durMap[u.duration]?.[isHi ? "desc_hi" : "desc_en"] || u.description,
      })),
    },
  }
}

/**
 * Localizes Thesis & Innovation Campaigns
 */
export function getLocalizedCampaigns(
  campaigns: UniversityThesisCampaign[],
  lang: Language
): UniversityThesisCampaign[] {
  if (lang === "ar") return campaigns

  const isHi = lang === "hi"

  const translations: Record<
    number,
    {
      title_en: string
      title_hi: string
      title_role_en: string
      title_role_hi: string
      dept_en: string
      dept_hi: string
      summary_en: string
      summary_hi: string
      trl_en: string
      trl_hi: string
      target_en: string
      target_hi: string
    }
  > = {
    1: {
      title_en:
        "AI-Driven Smart Irrigation for Date Palms in Al-Ahsa Oasis",
      title_hi:
        "अल-अहसा ओएसिस में खजूर के पेड़ों के लिए एआई आधारित स्मार्ट सिंचाई प्रणाली",
      title_role_en: "M.Sc. Candidate in Artificial Intelligence & Data Science",
      title_role_hi: "आर्टिफिशियल इंटेलिजेंस और डेटा साइंस में एम.एससी शोधकर्ता",
      dept_en: "College of Computer Sciences & IT - AI Dept",
      dept_hi: "कंप्यूटर विज्ञान और सूचना प्रौद्योगिकी कॉलेज - एआई विभाग",
      summary_en:
        "Field-tested deep learning model combining IoT soil moisture telemetry with multi-spectral satellite imaging to optimize precision irrigation for date palms across the Al-Ahsa UNESCO Oasis, reducing groundwater consumption by 38.4% and boosting crop yield by 14.2%.",
      summary_hi:
        "अल-अहसा ओएसिस में खजूर की सिंचाई को अनुकूलित करने के लिए आईओटी और उपग्रह इमेजरी को संयोजित करने वाला एक डीप लर्निंग मॉडल। भूजल खपत में 38.4% की कमी और फसल उत्पादन में 14.2% की वृद्धि दर्ज की गई।",
      trl_en: "TRL 7 - Field Proven Industrial Prototype",
      trl_hi: "TRL 7 - क्षेत्र में प्रमाणित औद्योगिक प्रोटोटाइप",
      target_en: "Commercial Patent Licensing & Corporate R&D Partnership",
      target_hi: "वाणिज्यिक पेटेंट लाइसेंसिंग और कॉर्पोरेट अनुसंधान साझेदारी",
    },
    2: {
      title_en:
        "Autonomous Drone Vision & Spectral Analysis for Early Detection of Red Palm Weevil",
      title_hi:
        "ड्रोन विज़न और स्पेक्ट्रल विश्लेषण द्वारा लाल ताड़ की घुन का प्रारंभिक पता लगाने की प्रणाली",
      title_role_en: "Biotechnology & Robotics Innovation Team",
      title_role_hi: "जैव प्रौद्योगिकी और रोबोटिक्स नवाचार टीम",
      dept_en: "College of Agricultural & Food Sciences",
      dept_hi: "कृषि एवं खाद्य विज्ञान कॉलेज",
      summary_en:
        "National patent-registered sensory system using airborne multi-spectral UAV drones to detect internal palm infestations before visible symptoms appear with 96.3% accuracy, safeguarding Saudi national agricultural security.",
      summary_hi:
        "राष्ट्रीय पेटेंट-पंजीकृत प्रणाली जो ड्रोन और स्पेक्ट्रल विश्लेषण के उपयोग से खजूर के पेड़ों में आंतरिक संक्रमण का 96.3% सटीकता से जल्द पता लगाती है।",
      trl_en: "TRL 8 - Certified Commercial Pre-Production System",
      trl_hi: "TRL 8 - प्रमाणित वाणिज्यिक पूर्व-उत्पादन प्रणाली",
      target_en: "Joint Venture & Agritech Manufacturer Licensing",
      target_hi: "संयुक्त उद्यम और एग्रीटेक निर्माता लाइसेंसिंग",
    },
    3: {
      title_en:
        "Zero-Trust Industrial Cybersecurity Gateway for Smart Energy & Desalination Grids",
      title_hi:
        "स्मार्ट ऊर्जा और जल शोधन ग्रिड के लिए ज़ीरो-ट्रस्ट साइबर सुरक्षा गेटवे",
      title_role_en: "Ph.D. Researcher in Cybersecurity & Embedded Hardware",
      title_role_hi: "साइबर सुरक्षा और एम्बेडेड हार्डवेयर में पीएचडी शोधकर्ता",
      dept_en: "College of Computer Science - Cybersecurity Center",
      dept_hi: "कंप्यूटर विज्ञान कॉलेज - साइबर सुरक्षा केंद्र",
      summary_en:
        "Custom cryptographic hardware gateway protecting SCADA and critical water desalination infrastructure in the Eastern Province against sophisticated zero-day state-actor threats, compliant with Saudi National Cybersecurity Authority (NCA) standards.",
      summary_hi:
        "पूर्वी प्रांत में महत्वपूर्ण जल शोधन और ऊर्जा बुनियादी ढांचे को परिष्कृत साइबर खतरों से बचाने के लिए राष्ट्रीय साइबर सुरक्षा प्राधिकरण (NCA) मानकों के अनुरूप हार्डवेयर गेटवे।",
      trl_en: "TRL 6 - Laboratory Validated Critical Infrastructure Prototype",
      trl_hi: "TRL 6 - प्रयोगशाला में मान्य महत्वपूर्ण बुनियादी ढांचा प्रोटोटाइप",
      target_en: "National Strategic Defense & Energy Procurement",
      target_hi: "राष्ट्रीय रणनीतिक रक्षा और ऊर्जा खरीद",
    },
  }

  return campaigns.map((c) => {
    const t = translations[c.id]
    if (!t) return c

    return {
      ...c,
      thesis_title: isHi ? t.title_hi : t.title_en,
      researcher_title: isHi ? t.title_role_hi : t.title_role_en,
      department: isHi ? t.dept_hi : t.dept_en,
      summary: isHi ? t.summary_hi : t.summary_en,
      commercial_readiness_level: isHi ? t.trl_hi : t.trl_en,
      target_audience: isHi ? t.target_hi : t.target_en,
      endorsement_text: isHi
        ? "विश्वविद्यालय अनुसंधान एवं नवाचार डीनशिप द्वारा आधिकारिक रूप से अनुमोदित"
        : "Officially Endorsed by University Research & Innovation Deanship",
    }
  })
}

/**
 * Localizes Monsha'at Incubator Ventures
 */
export function getLocalizedVentures(
  ventures: UniversityIncubatorVenture[],
  lang: Language
): UniversityIncubatorVenture[] {
  if (lang === "ar") return ventures

  const isHi = lang === "hi"

  const translations: Record<
    number,
    {
      company_en: string
      company_hi: string
      founder_en: string
      founder_hi: string
      major_en: string
      major_hi: string
      cohort_en: string
      cohort_hi: string
      activity_en: string
      activity_hi: string
      products_en: string
      products_hi: string
      criteria_en: string
      criteria_hi: string
      syllabus_en: string
      syllabus_hi: string
    }
  > = {
    1: {
      company_en: "Nakheel Tech Solutions",
      company_hi: "नखील टेक सॉल्यूशंस",
      founder_en: "Eng. Tariq bin Salman Al-Khater",
      founder_hi: "इंजी. तारिक बिन सलमान अल-खातिर",
      major_en: "Management Information Systems (MIS)",
      major_hi: "प्रबंधन सूचना प्रणाली (MIS)",
      cohort_en: "Cohort 4 - Monsha'at KFU Incubator (2024)",
      cohort_hi: "बैच 4 - मुंशात KFU इनक्यूबेटर (2024)",
      activity_en: "Smart Agritech & Precision Irrigation IoT",
      activity_hi: "स्मार्ट कृषि तकनीक और सटीक सिंचाई IoT",
      products_en:
        "IoT wireless sensor gateways, automated solar irrigation controllers, and predictive harvest quality dashboard tailored for Saudi date producers.",
      products_hi:
        "आईओटी वायरलेस सेंसर गेटवे, स्वचालित सौर सिंचाई नियंत्रक और सऊदी खजूर उत्पादकों के लिए फसल गुणवत्ता भविष्यवाणी डैशबोर्ड।",
      criteria_en:
        "Accreditation Criterion 7.4: Direct linking of university graduate venture innovations with Al-Ahsa Oasis regional sustainable economic development.",
      criteria_hi:
        "मान्यता मानदंड 7.4: विश्वविद्यालय स्नातक उद्यम नवाचारों का अल-अहसा ओएसिस के सतत क्षेत्रीय आर्थिक विकास से सीधा जुड़ाव।",
      syllabus_en:
        "Full case study incorporated into undergraduate course 'ENTR-302: Applied Tech Entrepreneurship' at College of Business Administration.",
      syllabus_hi:
        "व्यवसाय प्रशासन कॉलेज में स्नातक पाठ्यक्रम 'लागू तकनीक उद्यमिता' में कंपनी का केस स्टडी शामिल किया गया।",
    },
    2: {
      company_en: "Hasawi Bio-Extracts Co.",
      company_hi: "हसावी बायो-एक्स्ट्रैक्ट्स कंपनी",
      founder_en: "Dr. Laila bint Mansoor Al-Husseini",
      founder_hi: "डॉ. लैला बिन्त मंसूर अल-हुसैनी",
      major_en: "Chemical Engineering & Bioprocesses",
      major_hi: "केमिकल इंजीनियरिंग और बायोप्रोसेस",
      cohort_en: "Cohort 3 - Monsha'at KFU Incubator (2023)",
      cohort_hi: "बैच 3 - मुंशात KFU इनक्यूबेटर (2023)",
      activity_en: "Organic Agricultural Waste Upcycling & Biofertilizers",
      activity_hi: "जैविक कृषि अपशिष्ट पुनर्चक्रण और जैव उर्वरक",
      products_en:
        "Patented high-nitrogen organic fertilizer derived from palm pruning waste, and natural active cosmetic oils certified by SFDA.",
      products_hi:
        "खजूर की छंटाई के कचरे से निर्मित पेटेंटेड जैविक उर्वरक और SFDA द्वारा प्रमाणित प्राकृतिक सौंदर्य तेल।",
      criteria_en:
        "Accreditation Criterion 6.2: Circular economy practices and commercialization of patented bio-inventions with local agriculture partners.",
      criteria_hi:
        "मान्यता मानदंड 6.2: स्थानीय कृषि भागीदारों के साथ परिपत्र अर्थव्यवस्था और पेटेंट किए गए जैव-नवाचारों का व्यावसायीकरण।",
      syllabus_en:
        "Bioprocess laboratory module integrated into 'CHEM-415: Industrial Upcycling & Green Chemistry' senior curriculum.",
      syllabus_hi:
        "वरिष्ठ पाठ्यक्रम 'औद्योगिक अपसाइक्लिंग और हरित रसायन' में बायोप्रोसेस प्रयोगशाला मॉड्यूल को एकीकृत किया गया।",
    },
    3: {
      company_en: "SafeFleet Logistics & Cold Chain",
      company_hi: "सेफफ्लीट लॉजिस्टिक्स एंड कोल्ड चेन",
      founder_en: "Abdulmohsen bin Fahad Al-Dossari",
      founder_hi: "अब्दुलमोहसिन बिन फहद अल-डोसारी",
      major_en: "Supply Chain & Logistics Management",
      major_hi: "आपूर्ति श्रृंखला और रसद प्रबंधन",
      cohort_en: "Cohort 5 - Monsha'at KFU Incubator (2025)",
      cohort_hi: "बैच 5 - मुंशात KFU इनक्यूबेटर (2025)",
      activity_en: "Refrigerated Logistics & IoT Food Safety Telematics",
      activity_hi: "प्रशीतित रसद और आईओटी खाद्य सुरक्षा टेलीमैटिक्स",
      products_en:
        "Real-time refrigerated truck telemetry tracking temperatures, humidity, and delivery SLA compliance for fresh food distribution across Eastern Province.",
      products_hi:
        "पूर्वी प्रांत में ताजे भोजन वितरण के लिए तापमान और आर्द्रता की रीयल-टाइम ट्रैकिंग प्रणाली।",
      criteria_en:
        "Accreditation Criterion 8.1: Industry readiness and direct employment of university graduates in technical fleet operations.",
      criteria_hi:
        "मान्यता मानदंड 8.1: उद्योग तत्परता और बेड़े संचालन में विश्वविद्यालय स्नातकों का सीधा रोजगार।",
      syllabus_en:
        "Live sensor API and telemetry dataset utilized in 'SCM-420: Smart Cold Chain Management' graduation capstone project.",
      syllabus_hi:
        "स्मार्ट कोल्ड चेन प्रबंधन पाठ्यक्रम के कैपस्टोन प्रोजेक्ट में कंपनी का लाइव टेलीमेट्री डेटासेट उपयोग किया गया।",
    },
  }

  return ventures.map((v) => {
    const t = translations[v.id]
    if (!t) return v

    return {
      ...v,
      company_name_ar: isHi ? t.company_hi : t.company_en,
      company_name_en: t.company_en,
      founder_name: isHi ? t.founder_hi : t.founder_en,
      founder_major: isHi ? t.major_hi : t.major_en,
      graduation_cohort: isHi ? t.cohort_hi : t.cohort_en,
      business_activity: isHi ? t.activity_hi : t.activity_en,
      products_and_services: isHi ? t.products_hi : t.products_en,
      university_criteria_connection: isHi ? t.criteria_hi : t.criteria_en,
      academic_material_updates: isHi ? t.syllabus_hi : t.syllabus_en,
    }
  })
}

/**
 * Localizes Co-op Training Students & Schedules
 */
export function getLocalizedCoopStudents(
  students: CoopSupervisedStudent[],
  lang: Language
): CoopSupervisedStudent[] {
  if (lang === "ar") return students

  const isHi = lang === "hi"

  const majorMap: Record<string, { en: string; hi: string }> = {
    "هندسة البرمجيات والأنظمة الموزعة": {
      en: "Software & Distributed Systems Engineering",
      hi: "सॉफ्टवेयर और वितरित सिस्टम इंजीनियरिंग",
    },
    "نظم المعلومات الإدارية والتحول الرقمي": {
      en: "MIS & Digital Transformation",
      hi: "एमआईएस और डिजिटल परिवर्तन",
    },
    "الأمن السيبراني والتحري الرقمي": {
      en: "Cybersecurity & Digital Forensics",
      hi: "साइबर सुरक्षा और डिजिटल फोरेंसिक",
    },
    "الذكاء الاصطناعي وعلم البيانات": {
      en: "Artificial Intelligence & Data Science",
      hi: "आर्टिफिशियल इंटेलिजेंस और डेटा साइंस",
    },
    "التقنيات الزراعية الحديثة": {
      en: "Modern Agricultural Technologies",
      hi: "आधुनिक कृषि प्रौद्योगिकी",
    },
  }

  const specMap: Record<string, { en: string; hi: string }> = {
    "هندسة السحابة وحلول DevOps": {
      en: "Cloud Engineering & DevOps",
      hi: "क्लाउड इंजीनियरिंग और डेवऑप्स",
    },
    "إدارة المنتجات الرقمية وسلاسل الإمداد": {
      en: "Digital Product & Supply Chain Management",
      hi: "डिजिटल उत्पाद और आपूर्ति श्रृंखला",
    },
    "أمن البنية التحتية والاستجابة للحوادث": {
      en: "Infrastructure Security & Incident Response",
      hi: "सुरक्षा बुनियादी ढांचा और घटना प्रतिक्रिया",
    },
    "هندسة البيانات ونماذج التعلم الآلي": {
      en: "Data Engineering & Machine Learning",
      hi: "डेटा इंजीनियरिंग और मशीन लर्निंग",
    },
  }

  const statusMap: Record<string, { en: string; hi: string }> = {
    "تدريب نشط": {
      en: "Active Training",
      hi: "सक्रिय प्रशिक्षण",
    },
    "مكتمل معتمد": {
      en: "Completed & Verified",
      hi: "पूर्ण और सत्यापित",
    },
    "تقييم نهائي بانتظار الاعتماد": {
      en: "Evaluation Pending Approval",
      hi: "मूल्यांकन अनुमोदन लंबित",
    },
  }

  const locMap: Record<string, { en: string; hi: string }> = {
    "الظهران - واحة الأعمال": {
      en: "Dhahran - Business Oasis",
      hi: "धहरान - बिजनेस ओएसिस",
    },
    "الرياض - المدينة الرقمية": {
      en: "Riyadh - Digital City",
      hi: "रियाद - डिजिटल सिटी",
    },
    "الخبر - مجمع الملك سلمان": {
      en: "Khobar - King Salman Complex",
      hi: "खोबार - किंग सलमान कॉम्प्लेक्स",
    },
    "الأحساء - المجمع الصناعي": {
      en: "Al-Ahsa - Industrial Complex",
      hi: "अल-अहसा - औद्योगिक परिसर",
    },
  }

  return students.map((s) => ({
    ...s,
    student_major:
      majorMap[s.student_major]?.[isHi ? "hi" : "en"] || s.student_major,
    trainer_specialization:
      specMap[s.trainer_specialization]?.[isHi ? "hi" : "en"] ||
      s.trainer_specialization,
    status: statusMap[s.status]?.[isHi ? "hi" : "en"] || s.status,
    company_location:
      locMap[s.company_location]?.[isHi ? "hi" : "en"] || s.company_location,
  }))
}

/**
 * Localizes Professor Supervision Schedules
 */
export function getLocalizedSchedules(
  schedules: ProfessorSupervisionScheduleItem[],
  lang: Language
): ProfessorSupervisionScheduleItem[] {
  if (lang === "ar") return schedules

  const isHi = lang === "hi"

  const eventMap: Record<string, { en: string; hi: string }> = {
    "زيارة إشرافية ميدانية للشركة": {
      en: "On-Site Company Supervision Visit",
      hi: "ऑन-साइट कंपनी पर्यवेक्षण दौरा",
    },
    "جلسة تقييم ومراجعة التقرير الفصلي": {
      en: "Midterm Evaluation & Report Review",
      hi: "मध्यावधि मूल्यांकन और रिपोर्ट समीक्षा",
    },
    "اجتماع مرئي مع المدرب الميداني": {
      en: "Virtual Sync with Industry Mentor",
      hi: "उद्योग मेंटर के साथ वर्चुअल बैठक",
    },
    "المناقشة النهائية والاعتماد الأكاديمي": {
      en: "Final Defense & Academic Approval",
      hi: "अंतिम प्रस्तुति और शैक्षणिक अनुमोदन",
    },
  }

  const statusMap: Record<string, { en: string; hi: string }> = {
    "مجدولة": {
      en: "Scheduled",
      hi: "निर्धारित",
    },
    "مكتملة": {
      en: "Completed",
      hi: "पूर्ण",
    },
  }

  return schedules.map((item) => ({
    ...item,
    event_type:
      eventMap[item.event_type]?.[isHi ? "hi" : "en"] || item.event_type,
    status: statusMap[item.status]?.[isHi ? "hi" : "en"] || item.status,
  }))
}

/**
 * Localizes University Academic Departments
 */
export function getLocalizedDepartments(
  departments: UniversityDepartmentItem[],
  lang: Language
): UniversityDepartmentItem[] {
  if (lang === "ar") return departments
  const isHi = lang === "hi"

  const deptTranslations: Record<
    string,
    { en: string; hi: string; faculty_en: string; faculty_hi: string }
  > = {
    "علوم الحاسب وتقنية المعلومات": {
      en: "Computer Science & IT",
      hi: "कंप्यूटर विज्ञान और आईटी",
      faculty_en: "College of Computer & Information Sciences",
      faculty_hi: "कंप्यूटर और सूचना विज्ञान कॉलेज",
    },
    "هندسة البرمجيات": {
      en: "Software Engineering",
      hi: "सॉफ्टवेयर इंजीनियरिंग",
      faculty_en: "College of Computer & Information Sciences",
      faculty_hi: "कंप्यूटर और सूचना विज्ञान कॉलेज",
    },
    "الأمن السيبراني والتحري الرقمي": {
      en: "Cybersecurity & Digital Forensics",
      hi: "साइबर सुरक्षा और डिजिटल फोरेंसिक",
      faculty_en: "College of Computer & Information Sciences",
      faculty_hi: "कंप्यूटर और सूचना विज्ञान कॉलेज",
    },
    "الذكاء الاصطناعي وعلم البيانات": {
      en: "Artificial Intelligence & Data Science",
      hi: "कृत्रिम बुद्धिमत्ता और डेटा विज्ञान",
      faculty_en: "College of Computer & Information Sciences",
      faculty_hi: "कंप्यूटर और सूचना विज्ञान कॉलेज",
    },
    "العلوم الزراعية والأغذية (AgTech)": {
      en: "Agricultural & Food Sciences (AgTech)",
      hi: "कृषि और खाद्य विज्ञान (AgTech)",
      faculty_en: "College of Agricultural & Food Sciences",
      faculty_hi: "कृषि और खाद्य विज्ञान कॉलेज",
    },
    "إدارة الأعمال ونظم المعلومات": {
      en: "Business Administration & MIS",
      hi: "व्यवसाय प्रबंधन और एमआईएस",
      faculty_en: "College of Business Administration",
      faculty_hi: "व्यवसाय प्रबंधन कॉलेज",
    },
    "الهندسة الكهربائية والإلكترونية": {
      en: "Electrical & Electronic Engineering",
      hi: "इलेक्ट्रिकल और इलेक्ट्रॉनिक इंजीनियरिंग",
      faculty_en: "College of Engineering",
      faculty_hi: "इंजीनियरिंग कॉलेज",
    },
    "المالية والمصرفية الإسلامية": {
      en: "Finance & Islamic Banking",
      hi: "वित्त और इस्लामिक बैंकिंग",
      faculty_en: "College of Business Administration",
      faculty_hi: "व्यवसाय प्रबंधन कॉलेज",
    },
  }

  const degreeMap: Record<string, { en: string; hi: string }> = {
    "بكالوريوس": { en: "Bachelor", hi: "बैचलर" },
    "ماجستير": { en: "Master", hi: "मास्टर" },
    "دكتوراه": { en: "PhD", hi: "पीएचडी" },
    "دبلوم": { en: "Diploma", hi: "डिप्लोमा" },
  }

  return departments.map((d) => {
    const match = deptTranslations[d.name_ar] || deptTranslations[d.name_en]
    const localizedName = isHi
      ? (match?.hi || d.name_en || d.name_ar)
      : (d.name_en || match?.en || d.name_ar)
    const localizedFaculty = match
      ? (isHi ? match.faculty_hi : match.faculty_en)
      : d.faculty
    const localizedDegrees = d.degree_levels
      ? d.degree_levels
          .split(",")
          .map((lvl) => {
            const trimmed = lvl.trim()
            return degreeMap[trimmed]?.[isHi ? "hi" : "en"] || trimmed
          })
          .join(", ")
      : d.degree_levels

    return {
      ...d,
      name_ar: localizedName,
      faculty: localizedFaculty,
      degree_levels: localizedDegrees,
    }
  })
}

/**
 * Localizes University Career Opportunities
 */
export function getLocalizedOpportunities(
  opportunities: UniversityOpportunityItem[],
  lang: Language
): UniversityOpportunityItem[] {
  if (lang === "ar") return opportunities
  const isHi = lang === "hi"

  const titleMap: Record<string, { en: string; hi: string }> = {
    "مهندس برمجيات متكامل (Full-Stack)": {
      en: "Full-Stack Software Engineer",
      hi: "फुल-स्टैक सॉफ्टवेयर इंजीनियर",
    },
    "أخصائي أمن سيبراني واختراق أخلاقي": {
      en: "Cybersecurity & Ethical Hacking Specialist",
      hi: "साइबर सुरक्षा और एथिकल हैकिंग विशेषज्ञ",
    },
    "عالم بيانات وتعلم آلة": {
      en: "Data Scientist & Machine Learning Specialist",
      hi: "डेटा वैज्ञानिक और मशीन लर्निंग विशेषज्ञ",
    },
    "مدير مشاريع زراعية رقمية": {
      en: "AgTech Digital Project Manager",
      hi: "एगटेक डिजिटल प्रोजेक्ट मैनेजर",
    },
    "محلل مالي واستثمار": {
      en: "Financial & Investment Analyst",
      hi: "वित्तीय और निवेश विश्लेषक",
    },
    "متدرب تدريب تعاوني في الذكاء الاصطناعي": {
      en: "Co-op Trainee in Artificial Intelligence",
      hi: "आर्टिफिशियल इंटेलिजेंस में को-ऑप प्रशिक्षु",
    },
  }

  const companyMap: Record<string, { en: string; hi: string }> = {
    "أرامكو السعودية": { en: "Saudi Aramco", hi: "सऊदी अरामको" },
    "سابك (SABIC)": { en: "SABIC", hi: "सबिक (SABIC)" },
    "شركة علم (Elm)": { en: "Elm Company", hi: "एल्म कंपनी" },
    "شركة الاتصالات السعودية (stc)": { en: "stc Group", hi: "एसटीसी ग्रुप" },
    "نيوم (NEOM)": { en: "NEOM", hi: "नियोम (NEOM)" },
  }

  const workTypeMap: Record<string, { en: string; hi: string }> = {
    "دوام كامل": { en: "Full Time", hi: "पूर्णकालिक" },
    "دوام جزئي": { en: "Part Time", hi: "अंशकालिक" },
    "عن بعد": { en: "Remote", hi: "रिमोट" },
    "تدريب تعاوني": { en: "Co-op / Internship", hi: "को-ऑप / इंटर्नशिप" },
  }

  const locMap: Record<string, { en: string; hi: string }> = {
    "الرياض": { en: "Riyadh", hi: "रियाद" },
    "الظهران": { en: "Dhahran", hi: "धहरान" },
    "الأحساء": { en: "Al-Ahsa", hi: "अल-अहसा" },
    "الخبر": { en: "Khobar", hi: "खोबार" },
    "جدة": { en: "Jeddah", hi: "जेद्दा" },
  }

  return opportunities.map((opp) => ({
    ...opp,
    title: titleMap[opp.title]?.[isHi ? "hi" : "en"] || opp.title,
    company_name:
      companyMap[opp.company_name]?.[isHi ? "hi" : "en"] || opp.company_name,
    work_type: workTypeMap[opp.work_type]?.[isHi ? "hi" : "en"] || opp.work_type,
    location: locMap[opp.location]?.[isHi ? "hi" : "en"] || opp.location,
    salary_range: isHi
      ? opp.salary_range.replace("ر.س", "रियाल").replace("SAR", "रियाल")
      : opp.salary_range.replace("ر.س", "SAR"),
  }))
}

/**
 * Localizes Student Directory Items
 */
export function getLocalizedStudents(
  students: UniversityStudentItem[],
  lang: Language
): UniversityStudentItem[] {
  if (lang === "ar") return students
  const isHi = lang === "hi"

  const qualMap: Record<string, { en: string; hi: string }> = {
    "بكالوريوس": { en: "Bachelor", hi: "बैचलर" },
    "ماجستير": { en: "Master", hi: "मास्टर" },
    "دكتوراه": { en: "PhD", hi: "पीएचडी" },
    "دبلوم": { en: "Diploma", hi: "डिप्लोमा" },
  }

  const deptMap: Record<string, { en: string; hi: string }> = {
    "علوم الحاسب": { en: "Computer Science", hi: "कंप्यूटर विज्ञान" },
    "علوم الحاسب وتقنية المعلومات": { en: "Computer Science & IT", hi: "कंप्यूटर विज्ञान और आईटी" },
    "هندسة البرمجيات": { en: "Software Engineering", hi: "सॉफ्टवेयर इंजीनियरिंग" },
    "الأمن السيبراني": { en: "Cybersecurity", hi: "साइबर सुरक्षा" },
    "الذكاء الاصطناعي": { en: "Artificial Intelligence", hi: "कृत्रिम बुद्धिमत्ता" },
    "نظم المعلومات": { en: "Information Systems", hi: "सूचना प्रणाली" },
    "إدارة الأعمال": { en: "Business Administration", hi: "व्यवसाय प्रबंधन" },
  }

  return students.map((s) => ({
    ...s,
    educational_qualification:
      qualMap[s.educational_qualification]?.[isHi ? "hi" : "en"] ||
      s.educational_qualification,
    department: deptMap[s.department]?.[isHi ? "hi" : "en"] || s.department,
  }))
}
