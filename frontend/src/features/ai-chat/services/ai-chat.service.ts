/**
 * features/ai-chat/services/ai-chat.service.ts
 *
 * Client service connecting to the Flask backend Groq AI Chatbot endpoint (POST /api/chat).
 * Includes intelligent local fallback knowledge engine when backend is offline or unreachable.
 */
import { API_CONFIG } from "@/config/api"
import type { AiChatMessage, QuickPrompt } from "../types/ai-chat.types"
import { ROUTES } from "@/config/routes"

export const DEFAULT_QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: "mv-calculator",
    text_ar: "كيف أحسب قيمتي السوقية والراتب العادل؟",
    text_en: "How is my market value and salary calculated?",
    text_hi: "मेरा बाजार मूल्य और वेतन कैसे आंका जाता है?",
    category: "market-value",
  },
  {
    id: "ats-cv",
    text_ar: "كيف أجهز سيرتي الذاتية لاجتياز فحص ATS؟",
    text_en: "How do I optimize my resume for ATS screening?",
    text_hi: "एटीएस (ATS) स्क्रीनिंग के लिए बायोडाटा कैसे बनाएं?",
    category: "cv",
  },
  {
    id: "top-jobs",
    text_ar: "ما هي الوظائف الأكثر طلباً في السوق السعودي حالياً؟",
    text_en: "What are the most in-demand roles in Saudi Arabia?",
    text_hi: "सऊदी अरब में सबसे अधिक मांग वाली नौकरियां कौन सी हैं?",
    category: "jobs",
  },
  {
    id: "team-marketplace",
    text_ar: "ما هي ميزة التوظيف الجماعي وفرق العمل (Squads)؟",
    text_en: "How does the Team Marketplace and Squad hiring work?",
    text_hi: "टीम मार्केटप्लेस और समूह भर्ती कैसे काम करती है?",
    category: "teams",
  },
]

class AiChatService {
  async sendMessage(userMessage: string, lang: string = "ar"): Promise<{ reply: string; quickLinks?: AiChatMessage["quickLinks"] }> {
    const trimmed = userMessage.trim()
    if (!trimmed) {
      throw new Error("Message cannot be empty")
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.reply) {
          return { reply: data.reply }
        }
      }
    } catch {
      // Backend is offline or fetch error — gracefully fall back to local knowledge engine
    }

    // Smart Local Knowledge Engine Fallback (Groq AI Persona for Faeda Jobs)
    return this.generateSmartFallbackReply(trimmed, lang)
  }

  private generateSmartFallbackReply(
    query: string,
    lang: string
  ): { reply: string; quickLinks?: AiChatMessage["quickLinks"] } {
    const q = query.toLowerCase()

    // 1. Market Value / Salary inquiries
    if (
      q.includes("market") ||
      q.includes("salary") ||
      q.includes("value") ||
      q.includes("راتب") ||
      q.includes("قيمة") ||
      q.includes("سوقية") ||
      q.includes("فلوس") ||
      q.includes("वेतन") ||
      q.includes("मूल्य")
    ) {
      if (lang === "ar") {
        return {
          reply: `تقوم منصة فائدة وظائف باحتساب القيمة السوقية التقديرية (Market Value) بالاعتماد على خوارزمية ذكية تتكون من 5 عوامل رئيسية (حتى 100 نقطة):

1. **المؤهل العلمي** (حتى 25 نقطة): بكالوريوس، ماجستير، أو دكتوراه.
2. **علاوة تصنيف QS للجامعات** (حتى 20 نقطة إضافية): خريجو أفضل 500 جامعة عالمياً (مثل جامعة الملك فهد KFUPM وجامعة الملك سعود).
3. **سنوات الخبرة العملية** (حتى 25 نقطة): تصنيف من 0-2، 3-5، و5+ سنوات.
4. **المعدل التراكمي GPA** (حتى 10 نقاط): تميز أكاديمي بدرجة 3.75+ من 5.
5. **الشهادات الاحترافية المعتمدة** (حتى 15 نقطة): مثل AWS, PMP, CKA, CISSP.

يمكنك تجربة **حاسبة القيمة السوقية التفاعلية ومحاكي الرواتب** مباشرة لاكتشاف راتبك المتوقع ومعرفة كم سيزداد عند إضافة شهادات جديدة!`,
          quickLinks: [
            {
              label_ar: "فتح حاسبة القيمة السوقية",
              label_en: "Open Market Value Calculator",
              label_hi: "बाजार मूल्य कैलकुलेटर खोलें",
              url: ROUTES.CANDIDATE.MARKET_VALUE,
            },
            {
              label_ar: "تحديث ملفي المهني",
              label_en: "Update Profile Factors",
              label_hi: "प्रोफ़ाइल अपडेट करें",
              url: ROUTES.CANDIDATE.PROFILE,
            },
          ],
        }
      } else if (lang === "hi") {
        return {
          reply: `फ़ायदा जॉब्स 5 प्रमुख कारकों (100 अंकों की प्रणाली) के आधार पर आपके वास्तविक बाजार मूल्य (Market Value) और अपेक्षित वेतन की गणना करता है:

1. **शैक्षणिक डिग्री** (25 अंक तक): बैचलर, मास्टर, या पीएचडी।
2. **क्यूएस (QS) विश्व विश्वविद्यालय रैंकिंग बोनस** (20 अंक तक): शीर्ष 500 विश्वविद्यालयों (जैसे KFUPM, KSU) के स्नातकों के लिए।
3. **कार्य अनुभव** (25 अंक तक): 0-2, 3-5, या 5+ वर्ष।
4. **जीपीए (GPA) उत्कृष्टता** (10 अंक तक): 3.75+ / 5.0।
5. **सत्यापित प्रमाणपत्र** (15 अंक तक): AWS, PMP, Kubernetes CKA आदि।

आप हमारे नए **इंटरैक्टिव एआई मार्केट वैल्यू कैलकुलेटर** में जाकर तुरंत अपना वेतन अनुमान और व्हाट-इफ सिम्युलेटर देख सकते हैं!`,
          quickLinks: [
            {
              label_ar: "فتح حاسبة القيمة السوقية",
              label_en: "Open Market Value Calculator",
              label_hi: "बाजार मूल्य कैलकुलेटर खोलें",
              url: ROUTES.CANDIDATE.MARKET_VALUE,
            },
          ],
        }
      } else {
        return {
          reply: `Faeda Jobs calculates your estimated Market Value and compensation range using a transparent 5-factor scoring model (up to 100 points):

1. **Academic Degree** (up to 25 pts): Bachelor's, Master's, or PhD.
2. **QS World University Ranking Bonus** (up to 20 pts): Automatic tier bonus for graduates of top 500 institutions (e.g. KFUPM, KSU).
3. **Experience Tier** (up to 25 pts): Entry (0-2y), Mid (3-5y), or Senior (5+y).
4. **Academic GPA Distinction** (up to 10 pts): Honors (3.75+/5.0).
5. **Verified Professional Certifications** (up to 15 pts): AWS, PMP, CKA, CISSP.

You can visit our dedicated **AI Market Value Calculator & Salary Benchmark Page** to see your standing and test what-if salary simulations!`,
          quickLinks: [
            {
              label_ar: "فتح حاسبة القيمة السوقية",
              label_en: "Open Market Value Calculator",
              label_hi: "बाजार मूल्य कैलकुलेटर खोलें",
              url: ROUTES.CANDIDATE.MARKET_VALUE,
            },
            {
              label_ar: "تحديث ملفي المهني",
              label_en: "Update Profile Factors",
              label_hi: "प्रोफ़ाइल अपडेट करें",
              url: ROUTES.CANDIDATE.PROFILE,
            },
          ],
        }
      }
    }

    // 2. Jobs & Opportunities inquiries
    if (
      q.includes("job") ||
      q.includes("وظائف") ||
      q.includes("وظيفة") ||
      q.includes("عمل") ||
      q.includes("فرص") ||
      q.includes("تقديم") ||
      q.includes("नौकरी") ||
      q.includes("अवसर")
    ) {
      if (lang === "ar") {
        return {
          reply: `تتوفر في منصة فائدة وظائف العديد من الفرص المهنية النشطة والمعتمدة بالمملكة العربية السعودية، لا سيما في قطاعات:

- **هندسة البرمجيات والحلول السحابية (Full-Stack & Cloud)**: رواتب تتراوح بين 18,000 إلى 32,000 ريال شهرياً بالرياض.
- **الذكاء الاصطناعي وعلم البيانات (AI & ML)**: فرص ممتازة في مشاريع رؤية 2030 والجهات الحكومية والخاصة.
- **التقنية المالية (FinTech)**: منصات المدفوعات والخدمات المصرفية المفتوحة بالرياض وجدة.
- **الأمن السيبراني والبنية التحتية**: طلب متزايد مع حزم مزايا ممتازة.

يمكنك تصفح الفرص والتقديم المباشر بضغطة زر باستخدام ملفك الموثق.`,
          quickLinks: [
            {
              label_ar: "استكشاف الوظائف المتاحة",
              label_en: "Explore Jobs Directory",
              label_hi: "नौकरियां देखें",
              url: ROUTES.JOBS.LIST,
            },
            {
              label_ar: "دليل الشركات المعتمدة",
              label_en: "Browse Companies",
              label_hi: "कंपनियां देखें",
              url: ROUTES.COMPANIES.LIST,
            },
          ],
        }
      } else if (lang === "hi") {
        return {
          reply: `फ़ायदा जॉब्स पर सऊदी अरब (विशेषकर रियाध और जेद्दा) में सक्रिय सत्यापित नौकरियां उपलब्ध हैं:

- **सॉफ्टवेयर और क्लाउड इंजीनियरिंग**: 18,000 से 32,000 SAR मासिक वेतन।
- **आर्टिफिशियल इंटेलिजेंस और डेटा साइंस**: विज़न 2030 पहलों में उच्च मांग।
- **फिनटेक (Fintech) और साइबर सुरक्षा**: अग्रणी बैंकिंग व टेक संस्थानों में।

आप अपनी सत्यापित प्रोफ़ाइल के साथ तुरंत एक क्लिक में आवेदन कर सकते हैं!`,
          quickLinks: [
            {
              label_ar: "استكشاف الوظائف المتاحة",
              label_en: "Explore Jobs Directory",
              label_hi: "नौकरियां देखें",
              url: ROUTES.JOBS.LIST,
            },
          ],
        }
      } else {
        return {
          reply: `Faeda Jobs features high-impact opportunities across leading employers in Saudi Arabia:

- **Software Engineering & Cloud**: Compensation ranges from 18,000 to 32,000 SAR/month in Riyadh & hybrid setups.
- **AI & Data Science**: Strategic roles aligned with Vision 2030 national initiatives.
- **FinTech & Open Banking**: High-growth financial platforms in Riyadh and Jeddah.
- **Cybersecurity & Infrastructure**: Enterprise security engineering with top tier benefits.

Explore verified roles and apply instantly with your verified talent passport.`,
          quickLinks: [
            {
              label_ar: "استكشاف الوظائف المتاحة",
              label_en: "Explore Jobs Directory",
              label_hi: "नौकरियां देखें",
              url: ROUTES.JOBS.LIST,
            },
            {
              label_ar: "دليل الشركات المعتمدة",
              label_en: "Browse Companies",
              label_hi: "कंपनियां देखें",
              url: ROUTES.COMPANIES.LIST,
            },
          ],
        }
      }
    }

    // 3. CV / Resume / ATS inquiries
    if (
      q.includes("cv") ||
      q.includes("resume") ||
      q.includes("ats") ||
      q.includes("سيرة") ||
      q.includes("ذاتية") ||
      q.includes("ملف") ||
      q.includes("बायोडाटा") ||
      q.includes("सीवी")
    ) {
      if (lang === "ar") {
        return {
          reply: `لتحقيق أعلى نسبة توافق في فحص السير الذاتية الآلي (ATS) في منصة فائدة:

1. **استخدم كلمات مفتاحية دقيقة**: اذكر التقنيات والأدوات الأساسية مثل (React, TypeScript, AWS, Docker).
2. **أضف أرقاماً وإنجازات محددة**: مثلاً "تحسين سرعة تحميل التطبيق بنسبة 35%" أو "إدارة نظام يخدم 100K مستخدم".
3. **وثّق مشاريعك الفعلية**: أضف روابط حية لمشاريعك على GitHub أو الروابط المباشرة في صفحة معرض أعمالك (Portfolio).
4. **تأكد من مطابقة مسمى وظيفتك**: استخدم المسميات المهنية المعيارية بالسوق السعودي.`,
          quickLinks: [
            {
              label_ar: "تعديل السيرة والملف المهني",
              label_en: "Edit Profile & CV",
              label_hi: "प्रोफ़ाइल संपादित करें",
              url: ROUTES.CANDIDATE.PROFILE,
            },
            {
              label_ar: "قراءة مقال: اجتياز فحص ATS",
              label_en: "Read ATS Guide Post",
              label_hi: "एटीएस गाइड पढ़ें",
              url: ROUTES.POSTS.LIST,
            },
          ],
        }
      } else {
        return {
          reply: `To maximize your ATS screening score and recruiter visibility on Faeda Jobs:

1. **Use Exact Keywords**: Highlight primary tools and technologies (e.g., React, TypeScript, Python, Cloud).
2. **Quantify Your Achievements**: Frame accomplishments with concrete numbers (e.g., "Reduced latency by 40%").
3. **Link Live Projects**: Add GitHub and production URLs to your public candidate portfolio.
4. **Align Job Titles**: Use standardized Saudi market titles matching job requisition standards.`,
          quickLinks: [
            {
              label_ar: "تعديل السيرة والملف المهني",
              label_en: "Edit Profile & CV",
              label_hi: "प्रोफ़ाइल संपादित करें",
              url: ROUTES.CANDIDATE.PROFILE,
            },
            {
              label_ar: "قراءة مقال: اجتياز فحص ATS",
              label_en: "Read ATS Guide Post",
              label_hi: "एटीएस गाइड पढ़ें",
              url: ROUTES.POSTS.LIST,
            },
          ],
        }
      }
    }

    // 4. Team Marketplace & Squads
    if (
      q.includes("team") ||
      q.includes("squad") ||
      q.includes("فريق") ||
      q.includes("فرق") ||
      q.includes("جماعي") ||
      q.includes("टीम") ||
      q.includes("समूह")
    ) {
      if (lang === "ar") {
        return {
          reply: `ميزة **سوق فرق العمل (Team Marketplace)** هي إحدى الابتكارات الحصرية في منصة فائدة:

- تمكّن الكفاءات والمهندسين من تشكيل **فرق متكاملة (Squads)** تضم مطورين، مصممين، ومديري مشاريع عملوا معاً سابقاً.
- تتيح للشركات وصناديق الاستثمار استقطاب فريق عمل كامل ومتناغم دفعة واحدة، مما يقلل وقت التأسيس والانخراط إلى الصفر.
- تزيد من جاذبية المرشحين وقوتهم التفاوضية في عقود المشاريع الكبرى بالمملكة.`,
          quickLinks: [
            {
              label_ar: "استعراض سوق فرق العمل",
              label_en: "Explore Team Marketplace",
              label_hi: "टीम मार्केटप्लेस देखें",
              url: ROUTES.TEAMS.LIST,
            },
          ],
        }
      } else {
        return {
          reply: `The **Team Marketplace** is a unique innovation on Faeda Jobs:

- Enables professionals to form **cohesive squads** (e.g. Frontend + Backend + DevOps + UI/UX) that have proven collaboration history.
- Allows Saudi enterprises to hire complete, ready-to-deploy teams in a single contract, reducing onboarding friction to zero.
- Significantly boosts collective compensation and negotiation power for major enterprise projects.`,
          quickLinks: [
            {
              label_ar: "استعراض سوق فرق العمل",
              label_en: "Explore Team Marketplace",
              label_hi: "टीम मार्केटप्लेस देखें",
              url: ROUTES.TEAMS.LIST,
            },
          ],
        }
      }
    }

    // 5. General / Greeting Fallback
    if (lang === "ar") {
      return {
        reply: `أهلاً بك! أنا مساعدك الذكي في منصة **فائدة وظائف**، المدعوم بتقنيات الذكاء الاصطناعي (Groq Llama 3.3).

أنا هنا لمساعدتك في:
- 📈 احتساب **قيمتك السوقية والراتب المتوقع** بناءً على مؤشرات سوق العمل السعودي.
- 💼 استكشاف **أفضل الوظائف والشركات** وفرق العمل المتكاملة.
- 📝 تحسين سيرتك الذاتية لاجتياز **أنظمة التقييم الذكي (ATS)**.
- 🎓 معرفة أثر تصنيفات الجامعات والشهادات الاحترافية على مسارك الوظيفي.

كيف يمكنني مساعدتك اليوم؟`,
      }
    } else if (lang === "hi") {
      return {
        reply: `नमस्ते! मैं **फ़ायदा जॉब्स** का आधिकारिक एआई सलाहकार हूँ (Groq Llama 3.3 द्वारा संचालित)।

मैं आपकी इनमें मदद कर सकता हूँ:
- 📈 सऊदी बाजार के अनुसार अपना **बाजार मूल्य और अपेक्षित वेतन** जांचें।
- 💼 शीर्ष सत्यापित **नौकरियों और कंपनियों** की खोज करें।
- 📝 अपने बायोडाटा (CV) को **एटीएस (ATS)** के अनुकूल बनाएं।
- 👥 सहयोगात्मक प्रोजेक्ट्स के लिए **टीम मार्केटप्लेस** का उपयोग करें।

मैं आज आपकी क्या सहायता कर सकता हूँ?`,
      }
    } else {
      return {
        reply: `Hello! I am your AI Career Advisor on **Faeda Jobs**, powered by Groq Llama 3.3 intelligence.

I can assist you with:
- 📈 Calculating your **expected Market Value and salary benchmark** in Saudi Arabia.
- 💼 Discovering **verified job opportunities, top employers, and squad hiring**.
- 📝 Optimizing your resume for **ATS readiness and recruiter visibility**.
- 🎓 Understanding how university ranking bonuses and certifications impact your valuation.

How can I help you today?`,
      }
    }
  }
}

export const aiChatService = new AiChatService()
