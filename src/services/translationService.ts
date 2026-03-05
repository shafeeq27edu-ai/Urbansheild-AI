export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'ta' | 'mr';

export interface Translations {
    risk_low: string;
    risk_moderate: string;
    risk_high: string;
    risk_critical: string;
    alert_low: string;
    alert_moderate: string;
    alert_high: string;
    alert_critical: string;
    advice_low: string;
    advice_moderate: string;
    advice_high: string;
    advice_critical: string;
    ui_search: string;
    ui_execute: string;
    ui_telemetry: string;
    ui_confidence: string;
}

const dictionary: Record<SupportedLanguage, Translations> = {
    en: {
        risk_low: "Low Risk",
        risk_moderate: "Moderate Risk",
        risk_high: "High Risk",
        risk_critical: "Critical Risk",
        alert_low: "Systems Stable",
        alert_moderate: "Elevated Awareness",
        alert_high: "Hazard Warning",
        alert_critical: "Emergency Alert",
        advice_low: "No immediate action required.",
        advice_moderate: "Monitor local news and weather updates.",
        advice_high: "Prepare for potential evacuation or shelter.",
        advice_critical: "Immediate evacuation may be required.",
        ui_search: "Search Location",
        ui_execute: "Execute Stress Test",
        ui_telemetry: "Live Telemetry",
        ui_confidence: "AI Confidence"
    },
    hi: {
        risk_low: "कम जोखिम",
        risk_moderate: "सामान्य जोखिम",
        risk_high: "उच्च जोखिम",
        risk_critical: "गंभीर जोखिम",
        alert_low: "प्रणाली स्थिर",
        alert_moderate: "बढ़ी हुई जागरूकता",
        alert_high: "खतरे की चेतावनी",
        alert_critical: "आपातकालीन अलर्ट",
        advice_low: "किसी तत्काल कार्रवाई की आवश्यकता नहीं है।",
        advice_moderate: "स्थानीय समाचार और मौसम अपडेट की निगरानी करें।",
        advice_high: "संभावित निकासी या आश्रय के लिए तैयार रहें।",
        advice_critical: "तत्काल निकासी की आवश्यकता हो सकती है।",
        ui_search: "स्थान खोजें",
        ui_execute: "तनाव परीक्षण चलाएं",
        ui_telemetry: "लाइव टेलीमेट्री",
        ui_confidence: "एआई आत्मविश्वास"
    },
    bn: {
        risk_low: "কম ঝুঁকি",
        risk_moderate: "মাঝারি ঝুঁকি",
        risk_high: "উচ্চ ঝুঁকি",
        risk_critical: "মারাত্মক ঝুঁকি",
        alert_low: "সিস্টেম স্থিতিশীল",
        alert_moderate: "সতর্কতা বৃদ্ধি",
        alert_high: "বিপদ সংকেত",
        alert_critical: "জরুরি সতর্কবার্তা",
        advice_low: "অবিলম্বে কোনো পদক্ষেপের প্রয়োজন নেই।",
        advice_moderate: "স্থানীয় খবর এবং আবহাওয়ার আপডেটের দিকে নজর রাখুন।",
        advice_high: "সম্ভাব্য স্থানান্তর বা আশ্রয়ের জন্য প্রস্তুতি নিন।",
        advice_critical: "অবিলম্বে স্থানান্তরের প্রয়োজন হতে পারে।",
        ui_search: "অবস্থান খুঁজুন",
        ui_execute: "স্ট্রেস টেস্ট চালান",
        ui_telemetry: "লাইভ টেলিমেট্রি",
        ui_confidence: "AI আত্মবিশ্বাস"
    },
    ta: {
        risk_low: "குறைந்த ஆபத்து",
        risk_moderate: "மிதமான ஆபத்து",
        risk_high: "அதிக ஆபத்து",
        risk_critical: "மிகக் கடுமையான ஆபத்து",
        alert_low: "அமைப்புகள் சீராக உள்ளன",
        alert_moderate: "விழிப்புடன் இருக்கவும்",
        alert_high: "அபாய எச்சரிக்கை",
        alert_critical: "அவசரக்கால எச்சரிக்கை",
        advice_low: "உடனடி நடவடிக்கை தேவையில்லை.",
        advice_moderate: "உள்ளூர் செய்திகள் மற்றும் வானிலை நிலவரங்களைக் கவனிக்கவும்.",
        advice_high: "வெளியேற அல்லது தங்குமிடத்திற்குத் தயாராகுங்கள்.",
        advice_critical: "உடனடியாக வெளியேற வேண்டியிருக்கலாம்.",
        ui_search: "இடத்தைத் தேடு",
        ui_execute: "அழுத்த சோதனையை இயக்கு",
        ui_telemetry: "நேரடி தொலைத்தொடர்பு",
        ui_confidence: "AI நம்பிக்கை"
    },
    mr: {
        risk_low: "कमी धोका",
        risk_moderate: "मध्यम धोका",
        risk_high: "उच्च धोका",
        risk_critical: "गंभीर धोका",
        alert_low: "प्रणाली स्थिर",
        alert_moderate: "वर्धित जागरूकता",
        alert_high: "धोक्याची चेतावणी",
        alert_critical: "आणीबाणी अलर्ट",
        advice_low: "कोणत्याही तात्काळ कारवाईची गरज नाही.",
        advice_moderate: "स्थानिक बातम्या आणि हवामान बदलांवर लक्ष ठेवा.",
        advice_high: "संभाव्य स्थलांतर किंवा निवाऱ्यासाठी तयार राहा.",
        advice_critical: "तात्काळ स्थलांतराची आवश्यकता भासू शकते.",
        ui_search: "ठिकाण शोधा",
        ui_execute: "तणाव चाचणी करा",
        ui_telemetry: "थेट टेलीमेट्री",
        ui_confidence: "AI आत्मविश्वास"
    }
};

export const translationService = {
    getTranslations(lang: SupportedLanguage): Translations {
        return dictionary[lang] || dictionary.en;
    },

    getRiskLabel(score: number, lang: SupportedLanguage): string {
        const t = this.getTranslations(lang);
        if (score > 75) return t.risk_critical;
        if (score > 50) return t.risk_high;
        if (score > 25) return t.risk_moderate;
        return t.risk_low;
    },

    getAlertContent(score: number, lang: SupportedLanguage) {
        const t = this.getTranslations(lang);
        if (score > 75) return { title: t.alert_critical, advice: t.advice_critical, color: 'bg-red-600' };
        if (score > 50) return { title: t.alert_high, advice: t.advice_high, color: 'bg-orange-500' };
        if (score > 25) return { title: t.alert_moderate, advice: t.advice_moderate, color: 'bg-amber-400' };
        return { title: t.alert_low, advice: t.advice_low, color: 'bg-green-500' };
    }
};
