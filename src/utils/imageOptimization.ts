const IMAGE_WIDTHS = [480, 800] as const;

export const getOptimizedImageUrl = (src: string, width = 800): string => {
    if (!import.meta.env.PROD) return src;

    if (width !== 480 && width !== 800) return src;

    let imagePath: string;
    try {
        const parsed = new URL(src, 'https://image-source.invalid');
        imagePath = `${parsed.pathname}${parsed.search}`;
    } catch {
        return src;
    }

    if (!/^\/api\/(?:news\/image|image)\//.test(imagePath)) return src;

    return `/api/img?src=${encodeURIComponent(imagePath)}&w=${width}`;
};

export const getOptimizedImageSrcSet = (src: string): string | undefined => {
    if (!import.meta.env.PROD) return undefined;

    return IMAGE_WIDTHS
        .map((width) => `${getOptimizedImageUrl(src, width)} ${width}w`)
        .join(', ');
};

export const fallbackToOriginalImage = (image: HTMLImageElement, originalSrc: string): void => {
    if (
        image.dataset.optimizationFallback === 'true'
        || image.src === new URL(originalSrc, image.ownerDocument.baseURI).href
    ) {
        image.style.display = 'none';
        return;
    }

    image.dataset.optimizationFallback = 'true';
    image.removeAttribute('srcset');
    image.src = originalSrc;
};
