import { useSiteVideoLinks } from './useSiteVideoLinks';
import { normalizeYouTubeEmbedUrl } from '../utils/helpers';

export const useCompanyVideoUrl = () => {
    const { companyIntro } = useSiteVideoLinks();
    return normalizeYouTubeEmbedUrl(companyIntro);
};
