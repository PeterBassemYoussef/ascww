import { useEffect, useState } from 'react';
import type { SiteVideoLinks } from '../types';
import { DEFAULT_SITE_VIDEO_LINKS, SITE_VIDEO_LINKS_PATH } from '../utils/helpers';

const pickVideoLink = (value: unknown, fallback: string) => {
    const normalized = String(value || '').trim();
    return normalized || fallback;
};

export const useSiteVideoLinks = () => {
    const [videoLinks, setVideoLinks] = useState<SiteVideoLinks>(DEFAULT_SITE_VIDEO_LINKS);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadVideoLinks = async () => {
            try {
                const response = await fetch(SITE_VIDEO_LINKS_PATH, {
                    signal: controller.signal,
                    cache: 'no-store'
                });
                if (!response.ok) return;

                const payload = (await response.json()) as Partial<SiteVideoLinks>;
                if (!active) return;

                setVideoLinks({
                    companyIntro: pickVideoLink(payload.companyIntro, DEFAULT_SITE_VIDEO_LINKS.companyIntro),
                    hotlineApp: pickVideoLink(payload.hotlineApp, DEFAULT_SITE_VIDEO_LINKS.hotlineApp),
                    kidsWaterUse: pickVideoLink(payload.kidsWaterUse, DEFAULT_SITE_VIDEO_LINKS.kidsWaterUse),
                    kidsNoraWater: pickVideoLink(payload.kidsNoraWater, DEFAULT_SITE_VIDEO_LINKS.kidsNoraWater),
                    kidsWaterTips: pickVideoLink(payload.kidsWaterTips, DEFAULT_SITE_VIDEO_LINKS.kidsWaterTips),
                    kidsSaveWater: pickVideoLink(payload.kidsSaveWater, DEFAULT_SITE_VIDEO_LINKS.kidsSaveWater),
                });
            } catch {
                if (!active) return;
            }
        };

        loadVideoLinks();

        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    return videoLinks;
};
