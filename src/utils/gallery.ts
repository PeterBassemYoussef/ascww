const extractImages = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === 'string');
};

const galleryFolderOverrides: Record<string, string> = {
  labs_dep: 'Photo-Gallery/labs_dep',
  school_dep: 'Photo-Gallery/school_dep',
  sport_dep: 'Photo-Gallery/sport_dep',
  traning_dep: 'Photo-Gallery/traning_dep',
  trip_boss: 'Photo-Gallery/trip_boss',
  waste_dep: 'Photo-Gallery/waste_dep',
};

export const resolveGalleryFolderPath = (galleryKey: string): string =>
  galleryFolderOverrides[galleryKey] ?? galleryKey;

export const resolveGalleryImageSrc = (galleryKey: string, fileName: string): string =>
  `/images/${resolveGalleryFolderPath(galleryKey)}/${encodeURIComponent(fileName)}`;

export const fetchGallerySources = async (
  galleryKey: string,
  signal?: AbortSignal
): Promise<string[]> => {
  const cacheBuster = Date.now();
  const apiUrl = `/api/gallery/${galleryKey}?ts=${cacheBuster}`;
  const manifestUrl = `/gallery-manifest.json?ts=${cacheBuster}`;

  // API first: reflects newly added files in gallery folders without rebuild.
  try {
    const response = await fetch(apiUrl, { signal, cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      const images = extractImages(data?.images);
      if (images.length > 0) return images;
    }
  } catch (error) {
    // Ignore and fallback to manifest.
  }

  // Manifest fallback: useful for static deployments where /api/gallery isn't available.
  try {
    const response = await fetch(manifestUrl, { signal, cache: 'no-store' });
    if (!response.ok) return [];
    const data = await response.json();
    return extractImages(data?.[galleryKey]);
  } catch (error) {
    return [];
  }
};
