"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect } from "react";

export function DirectionUpdater() {
    const { direction, language } = useLanguage();

    useEffect(() => {
        // Update html attributes when language changes
        document.documentElement.setAttribute('dir', direction);
        document.documentElement.setAttribute('lang', language);
    }, [direction, language]);

    return null;
}
