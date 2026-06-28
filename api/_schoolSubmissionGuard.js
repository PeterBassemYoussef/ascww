const BACKEND_BASE = (process.env.BACKEND_BASE_URL || 'https://backend.ascww.org').replace(/\/+$/, '');

const SKIPPED_UPSTREAM_HEADERS = new Set([
  'content-encoding',
  'transfer-encoding',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'upgrade',
]);

const parseBackendBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value !== 'string') return false;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  return ['1', 'true', 'yes', 'open', 'active', 'available', 'متاح', 'مفتوح'].includes(normalized);
};

const extractSchoolSubmissionFormState = (payload) => {
  const source = payload && typeof payload === 'object' && !Array.isArray(payload)
    ? (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data) ? payload.data : payload)
    : {};

  return parseBackendBoolean(source.show_submission_form);
};

const readRequestBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

const copyUpstreamHeaders = (upstreamHeaders, res) => {
  upstreamHeaders.forEach((value, key) => {
    const normalizedKey = key.toLowerCase();
    if (SKIPPED_UPSTREAM_HEADERS.has(normalizedKey)) return;
    res.setHeader(key, value);
  });
};

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

const ensureSchoolSubmissionIsOpen = async () => {
  const stateUrl = BACKEND_BASE.toLowerCase().endsWith('/api')
    ? `${BACKEND_BASE}/school-submission-data`
    : `${BACKEND_BASE}/api/school-submission-data`;
  const response = await fetch(stateUrl, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`School submission state request failed: ${response.status}`);
  }

  const payload = await response.json();
  return extractSchoolSubmissionFormState(payload);
};

export const proxyGuardedSchoolSubmissionRequest = async (req, res, upstreamPath) => {
  if (req.method === 'GET' || req.method === 'HEAD') {
    sendJson(res, 405, { message: 'Method not allowed.' });
    return;
  }

  try {
    const isSubmissionOpen = await ensureSchoolSubmissionIsOpen();
    if (!isSubmissionOpen) {
      sendJson(res, 403, { message: 'التقديم مغلق حالياً.' });
      return;
    }

    const headers = { ...req.headers };
    delete headers.host;
    delete headers['x-forwarded-host'];
    delete headers['x-forwarded-proto'];
    delete headers['x-vercel-id'];

    const body = await readRequestBody(req);
    const upstreamUrl = BACKEND_BASE.toLowerCase().endsWith('/api')
      ? `${BACKEND_BASE}${upstreamPath}`
      : `${BACKEND_BASE}/api${upstreamPath}`;
    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers,
      body,
    });

    res.statusCode = upstream.status;
    copyUpstreamHeaders(upstream.headers, res);
    const responseBody = Buffer.from(await upstream.arrayBuffer());
    res.end(responseBody);
  } catch (error) {
    sendJson(res, 502, {
      message: 'تعذر التحقق من حالة التقديم حالياً.',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
