import { memo } from 'react';
import type { AdminInfoResponse } from '../types';
import { ADMIN_IMAGE_ENDPOINT, sanitizeBossSpeechHtml } from '../utils/helpers';

type BossWordProps = {
    adminInfo: AdminInfoResponse | null;
    adminInfoLoading: boolean;
    adminInfoError: string | null;
};

function BossWord({ adminInfo, adminInfoLoading, adminInfoError }: BossWordProps) {
    const bossTitle = adminInfo?.boss_title?.trim() || 'السيد المهندس';
    const bossName = adminInfo?.boss_name?.trim() || 'رئيس مجلس الإدارة';
    const speechHtml = adminInfo?.boss_speech?.trim()
        ? sanitizeBossSpeechHtml(adminInfo.boss_speech)
        : '<p>نسعى دائمًا إلى تقديم خدمات مياه الشرب والصرف الصحي بأعلى جودة، مع التطوير المستمر للبنية التحتية ورفع كفاءة التشغيل لخدمة المواطنين.</p>';
    const bossImageName = (adminInfo?.boss_image || 'boss.jpg').split('/').pop() || 'boss.jpg';
    const bossImageUrl = `${ADMIN_IMAGE_ENDPOINT}/${encodeURIComponent(bossImageName)}`;

    return (
        <section id="boss-word" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="boss-word-card animate-on-scroll" data-delay="70">
                <div className="boss-word-grid">
                    <div className="boss-word-content order-2 p-5 sm:p-8 lg:order-2">
                        <p className="boss-word-kicker">كلمة السيد رئيس مجلس الإداره والعضو المنتدب</p>
                        <div className="boss-word-body" aria-live="polite">
                            {adminInfoLoading ? (
                                <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">جاري تحميل كلمة السيد رئيس مجلس الإداره والعضو المنتدب...</p>
                            ) : adminInfoError ? (
                                <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{adminInfoError}</p>
                            ) : (
                                <>
                                    <div className="boss-speech-content" dangerouslySetInnerHTML={{ __html: speechHtml }}></div>
                                    <div className="boss-word-signature">
                                        <p>{bossTitle}</p>
                                        <p>{bossName}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="boss-word-media order-1 relative overflow-hidden bg-slate-100 lg:order-1">
                        <img
                            src={bossImageUrl}
                            alt={`صورة ${bossName}`}
                            className="boss-word-photo h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                            onError={(event) => {
                                const image = event.currentTarget;
                                if (image.dataset.fallbackApplied) return;
                                image.dataset.fallbackApplied = 'true';
                                image.src = `${ADMIN_IMAGE_ENDPOINT}/boss.jpg`;
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default memo(BossWord);
