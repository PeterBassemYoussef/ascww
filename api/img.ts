import sharp from 'sharp';

const BACKEND_BASE_URL = (process.env.BACKEND_BASE_URL || 'https://backend.ascww.org').replace(/\/+$/, '');
const ALLOWED_IMAGE_PREFIXES = ['/api/news/image/', '/api/image/'];
const ALLOWED_WIDTHS = new Set([480, 800]);
const CACHE_CONTROL = 'public, s-maxage=31536000, max-age=31536000, immutable';

type ApiRequest = {
  method?: string;
  query: Record<string, string | string[] | undefined>;
};

type ApiResponse = {
  status: (statusCode: number) => ApiResponse;
  setHeader: (name: string, value: string) => ApiResponse;
  end: (body?: string | Uint8Array) => void;
};

const getSafeImagePath = (value: string): string | null => {
  if (
    value.length > 2048
    || !value.startsWith('/')
    || value.startsWith('//')
    || value.includes('\\')
    || /[?#\u0000-\u001f]/.test(value)
  ) {
    return null;
  }

  const prefix = ALLOWED_IMAGE_PREFIXES.find((allowedPrefix) => value.startsWith(allowedPrefix));
  if (!prefix) return null;

  const pathSegments = value.slice(prefix.length).split('/');
  if (pathSegments.some((segment) => !segment)) return null;

  try {
    for (const segment of pathSegments) {
      let decodedSegment = segment;
      for (let depth = 0; depth < 3; depth += 1) {
        const nextSegment = decodeURIComponent(decodedSegment);
        if (
          nextSegment === '.'
          || nextSegment === '..'
          || nextSegment.includes('/')
          || nextSegment.includes('\\')
          || /[\u0000-\u001f]/.test(nextSegment)
        ) {
          return null;
        }
        if (nextSegment === decodedSegment) break;
        decodedSegment = nextSegment;
      }
    }
  } catch {
    return null;
  }

  return value;
};

const getUpstreamUrl = (imagePath: string): string => {
  const apiBase = BACKEND_BASE_URL.toLowerCase().endsWith('/api')
    ? BACKEND_BASE_URL
    : `${BACKEND_BASE_URL}/api`;
  return `${apiBase}${imagePath.slice('/api'.length)}`;
};

const sendImage = (res: ApiResponse, statusCode: number, body: Uint8Array, contentType: string): void => {
  res.status(statusCode);
  res.setHeader('Cache-Control', CACHE_CONTROL);
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', String(body.byteLength));
  res.end(body);
};

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.setHeader('Cache-Control', 'no-store');
    res.status(405).end('Method not allowed.');
    return;
  }

  const rawSource = req.query.src;
  const rawWidth = req.query.w;
  const imagePath = typeof rawSource === 'string' ? getSafeImagePath(rawSource) : null;
  const width = rawWidth === '480' ? 480 : rawWidth === '800' ? 800 : Number.NaN;

  if (!imagePath || !ALLOWED_WIDTHS.has(width)) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(400).end('Invalid image source or width.');
    return;
  }

  try {
    const upstream = await fetch(getUpstreamUrl(imagePath), {
      headers: { Accept: 'image/*' },
      redirect: 'error',
    });
    const original = new Uint8Array(await upstream.arrayBuffer());
    const originalContentType = upstream.headers.get('content-type') || 'application/octet-stream';

    if (!upstream.ok || !originalContentType.toLowerCase().startsWith('image/')) {
      sendImage(res, upstream.status, original, originalContentType);
      return;
    }

    try {
      const optimized = await sharp(original)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toBuffer();

      sendImage(res, upstream.status, optimized, 'image/webp');
    } catch (error) {
      console.warn('Image optimization failed; returning the original image:', error);
      sendImage(res, upstream.status, original, originalContentType);
    }
  } catch (error) {
    console.error('Image optimization request failed:', error);
    res.setHeader('Cache-Control', 'no-store');
    res.status(502).end('Image request failed.');
  }
}
