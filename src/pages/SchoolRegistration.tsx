import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSiteLanguage } from '../context/SiteLanguageContext';

const SCHOOL_SUBMISSION_DATA_PATH = '/school-submission-data';
const API_BASE_ENDPOINT = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? '/api' : 'https://backend.ascww.org/api');
const API_BASE_ENDPOINT_NORMALIZED = API_BASE_ENDPOINT.replace(/\/$/, '');
const SCHOOL_SUBMISSION_DATA_ENDPOINT = API_BASE_ENDPOINT.replace(/\/$/, '').endsWith(SCHOOL_SUBMISSION_DATA_PATH)
  ? API_BASE_ENDPOINT.replace(/\/$/, '')
  : `${API_BASE_ENDPOINT.replace(/\/$/, '')}${SCHOOL_SUBMISSION_DATA_PATH}`;
const SCHOOL_SUBMISSION_DATA_PROXY_ENDPOINT = `/api${SCHOOL_SUBMISSION_DATA_PATH}`;
const SCHOOL_SUBMISSION_UPLOAD_ENDPOINT = `${API_BASE_ENDPOINT_NORMALIZED}/upload`;
const SCHOOL_SUBMISSION_ADD_STUDENT_ENDPOINT = `${API_BASE_ENDPOINT_NORMALIZED}/addStudent`;
const SCHOOL_SUBMISSION_DOWNLOAD_FALLBACK_PATH = '/api/school/download/ssrf';

type SchoolSubmissionApiPayload = {
  show_submission_form?: boolean | string | number;
  close_message?: string;
  introduction_message?: string;
  submission_terms?: string;
  graduation_years?: string;
};

type SchoolRegistrationData = {
  showSubmissionForm: boolean;
  closeMessage: string;
  introductionMessage: string;
  submissionTerms: string;
  graduationYears: string[];
};

type UploadResponseData = {
  receiptFileName?: string;
  studentFileName?: string;
};

type SubmissionSuccessState = {
  studentName: string;
  registrationLabel: string;
  downloadUrl: string;
};

type FormFieldKey =
  | 'studentName'
  | 'birthDate'
  | 'studentPhone'
  | 'graduationYear'
  | 'guardianPhone'
  | 'address'
  | 'ageOctober'
  | 'certificate'
  | 'nationalId'
  | 'governorate'
  | 'score'
  | 'attachment';

const FIELD_LABELS: Record<FormFieldKey, string> = {
  studentName: 'الاسم',
  birthDate: 'تاريخ الميلاد',
  studentPhone: 'رقم تليفون الطالب',
  graduationYear: 'سنة الحصول على الشهادة الإعدادية',
  guardianPhone: 'رقم تليفون ولي الأمر',
  address: 'العنوان',
  ageOctober: 'السن أول أكتوبر',
  certificate: 'الشهادة',
  nationalId: 'الرقم القومي للطالب',
  governorate: 'المحافظة',
  score: 'مجموع درجات الطالب',
  attachment: 'رفع الملف'
};

const getRequiredFieldMessage = (field: FormFieldKey) => `يجب عليك ملء حقل ${FIELD_LABELS[field]}`;

const getFieldRequiredMessage = (field: FormFieldKey) => {
  if (field === 'graduationYear') return 'يجب عليك اختيار سنة الحصول على الشهادة الإعدادية';
  if (field === 'certificate') return 'يجب عليك اختيار الشهادة';
  return getRequiredFieldMessage(field);
};

const FORM_PANEL_CLASS = 'space-y-5 rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6';
const FORM_FIELD_LABEL_CLASS = 'mb-2 inline-flex items-center gap-1 text-sm font-bold text-[#0a3555] sm:text-base';
const FORM_FIELD_BASE_CLASS = 'w-full rounded-2xl border bg-white px-4 py-3 text-right text-base text-slate-800 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-4';
const FORM_FIELD_DEFAULT_STATE_CLASS = 'border-slate-200 focus:border-[#1170b0] focus:ring-[#1170b0]/10';
const FORM_FIELD_ERROR_STATE_CLASS = 'border-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.12),0_10px_20px_rgba(244,63,94,0.10)] focus:border-rose-600 focus:ring-rose-500/15';
const FORM_HINT_CLASS = 'mt-2 block text-xs leading-6 text-slate-500';
const FORM_ERROR_CLASS = 'mt-2 block text-xs font-semibold text-rose-700';
const FORM_REQUIRED_MARK_CLASS = 'mr-1 text-rose-600';
const PRIMARY_ACTION_BUTTON_CLASS = 'rounded-2xl bg-gradient-to-r from-[#0a3555] to-[#1170b0] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(17,112,176,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(17,112,176,0.28)] disabled:cursor-not-allowed disabled:opacity-70';
const SECONDARY_ACTION_BUTTON_CLASS = 'rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70';

const getFormFieldClassName = (hasError?: boolean) =>
  `${FORM_FIELD_BASE_CLASS} ${hasError ? FORM_FIELD_ERROR_STATE_CLASS : FORM_FIELD_DEFAULT_STATE_CLASS}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toStringValue = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const parseBoolean = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value !== 'string') return false;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return false;
  return ['1', 'true', 'yes', 'open', 'active', 'available', 'متاح', 'مفتوح'].includes(normalized);
};

const sanitizeHtml = (value: string) => {
  if (!value) return '';
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return value;

  const doc = new DOMParser().parseFromString(value, 'text/html');
  doc.querySelectorAll('script, style, iframe, object, embed').forEach((node) => node.remove());
  doc.querySelectorAll('*').forEach((node) => {
    const allowedAttributes = new Set(['class', 'style', 'dir', 'href', 'title']);

    Array.from(node.attributes).forEach((attribute) => {
      const attrName = attribute.name.toLowerCase();
      if (allowedAttributes.has(attrName)) {
        if (attrName !== 'href') return;

        const hrefValue = attribute.value.trim();
        const isSafeHref = /^(https?:|mailto:|tel:|\/|#)/i.test(hrefValue);
        if (isSafeHref) return;
      }

      node.removeAttribute(attribute.name);
    });

    if (node.tagName.toLowerCase() === 'a') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  return doc.body.innerHTML.trim();
};

const parseGraduationYears = (rawValue: string) => {
  if (!rawValue) return [] as string[];

  return rawValue
    .replace(/\s+/g, ' ')
    .split(/[،,\n]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const formatAgeOctoberValue = (years: string, months: string) => `${years} سنة و${months} أشهر`;

const normalizeDecimalNumberInput = (value: string) => {
  const normalizedSeparator = value.replace(/[،,٫]/g, '.').replace(/[^0-9.]/g, '');
  const [integerPart = '', ...decimalParts] = normalizedSeparator.split('.');
  const limitedInteger = integerPart.slice(0, 3);
  const limitedDecimal = decimalParts.join('').slice(0, 2);
  return decimalParts.length > 0 ? `${limitedInteger}.${limitedDecimal}` : limitedInteger;
};

const UPLOAD_FILE_CONTENT_ERROR = 'تأكد من احتواء الملف المرفق على المستندات المطلوبة';

const normalizeUploadFileErrorMessage = (message: string) => {
  const normalized = message.trim();
  if (!normalized) return '';

  const lowerMessage = normalized.toLowerCase();
  if (
    lowerMessage.includes('key.0')
    || lowerMessage.includes('key[0]')
    || lowerMessage.includes('must be a file of type')
    || lowerMessage.includes('must be of type')
  ) {
    return UPLOAD_FILE_CONTENT_ERROR;
  }

  return normalized;
};

const extractErrorMessage = (payload: unknown) => {
  if (typeof payload === 'string' && payload.trim()) return normalizeUploadFileErrorMessage(payload);
  if (!isRecord(payload)) return '';

  const message = payload.message;
  if (typeof message === 'string' && message.trim()) return normalizeUploadFileErrorMessage(message);

  const error = payload.error;
  if (typeof error === 'string' && error.trim()) return normalizeUploadFileErrorMessage(error);
  if (Array.isArray(error)) {
    const firstError = error.find((item) => typeof item === 'string' && item.trim());
    if (typeof firstError === 'string') return normalizeUploadFileErrorMessage(firstError);
  }
  if (isRecord(error)) {
    for (const value of Object.values(error)) {
      if (typeof value === 'string' && value.trim()) return normalizeUploadFileErrorMessage(value);
      if (Array.isArray(value)) {
        const firstNestedError = value.find((item) => typeof item === 'string' && item.trim());
        if (typeof firstNestedError === 'string') return normalizeUploadFileErrorMessage(firstNestedError);
      }
    }
  }

  return '';
};

const extractUploadData = (payload: unknown): UploadResponseData => {
  if (!isRecord(payload)) return {};

  const nestedData = isRecord(payload.data) ? payload.data : null;
  const source = nestedData ?? payload;

  return {
    receiptFileName: typeof source.receiptFileName === 'string' ? source.receiptFileName.trim() : '',
    studentFileName: typeof source.studentFileName === 'string' ? source.studentFileName.trim() : '',
  };
};

const readResponsePayload = async (response: Response) => {
  const contentType = String(response.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('application/json')) {
    return await response.json() as unknown;
  }

  const text = await response.text();
  return text;
};

const buildAbsoluteApiUrl = (pathValue: string) => {
  if (/^https?:\/\//i.test(pathValue)) return pathValue;
  if (!pathValue.startsWith('/')) return `${API_BASE_ENDPOINT_NORMALIZED}/${pathValue.replace(/^\/+/, '')}`;
  return pathValue;
};

const extractSubmissionSuccessState = (
  payload: unknown,
  fallbackStudentName: string,
): SubmissionSuccessState => {
  if (typeof payload === 'string' && payload.trim()) {
    return {
      studentName: fallbackStudentName,
      registrationLabel: payload.trim(),
      downloadUrl: SCHOOL_SUBMISSION_DOWNLOAD_FALLBACK_PATH,
    };
  }

  const fallback: SubmissionSuccessState = {
    studentName: fallbackStudentName,
    registrationLabel: fallbackStudentName,
    downloadUrl: SCHOOL_SUBMISSION_DOWNLOAD_FALLBACK_PATH,
  };

  if (!isRecord(payload)) return fallback;

  const nestedData = isRecord(payload.data) ? payload.data : null;
  const source = nestedData ?? payload;

  const studentName =
    toStringValue(source.name)
    || toStringValue(source.student_name)
    || toStringValue(source.studentName)
    || fallbackStudentName;

  const registrationCode =
    toStringValue(source.code)
    || toStringValue(source.registration_code)
    || toStringValue(source.registrationCode)
    || toStringValue(source.student_id)
    || toStringValue(source.studentId)
    || toStringValue(source.id);

  const explicitDownloadUrl =
    toStringValue(source.download_url)
    || toStringValue(source.downloadUrl)
    || toStringValue(source.url);

  const explicitDownloadPath =
    toStringValue(source.download_path)
    || toStringValue(source.downloadPath)
    || toStringValue(source.path);

  const slugOrToken =
    toStringValue(source.slug)
    || toStringValue(source.token)
    || toStringValue(source.hash)
    || toStringValue(source.reference)
    || toStringValue(source.ref);

  let downloadUrl = SCHOOL_SUBMISSION_DOWNLOAD_FALLBACK_PATH;
  if (explicitDownloadUrl) {
    downloadUrl = buildAbsoluteApiUrl(explicitDownloadUrl);
  } else if (explicitDownloadPath) {
    downloadUrl = buildAbsoluteApiUrl(explicitDownloadPath);
  } else if (slugOrToken) {
    downloadUrl = `${API_BASE_ENDPOINT_NORMALIZED}/school/download/${encodeURIComponent(slugOrToken)}`;
  }

  const registrationLabel = [studentName, registrationCode].filter(Boolean).join(' - ') || fallbackStudentName;

  return {
    studentName,
    registrationLabel,
    downloadUrl,
  };
};

const normalizePayload = (payload: unknown): SchoolRegistrationData => {
  const payloadObject = isRecord(payload) ? payload : {};
  const nestedData = isRecord(payloadObject.data) ? payloadObject.data : {};
  const base: SchoolSubmissionApiPayload = Object.keys(nestedData).length
    ? (nestedData as SchoolSubmissionApiPayload)
    : (payloadObject as SchoolSubmissionApiPayload);

  return {
    showSubmissionForm: parseBoolean(base.show_submission_form),
    closeMessage: toStringValue(base.close_message),
    introductionMessage: toStringValue(base.introduction_message),
    submissionTerms: toStringValue(base.submission_terms),
    graduationYears: parseGraduationYears(toStringValue(base.graduation_years))
  };
};

const fetchSchoolRegistrationData = async (signal: AbortSignal) => {
  let response: Response | null = null;

  try {
    response = await fetch(SCHOOL_SUBMISSION_DATA_ENDPOINT, { signal });
  } catch {
    response = null;
  }

  if ((!response || !response.ok) && SCHOOL_SUBMISSION_DATA_ENDPOINT !== SCHOOL_SUBMISSION_DATA_PROXY_ENDPOINT) {
    response = await fetch(SCHOOL_SUBMISSION_DATA_PROXY_ENDPOINT, { signal });
  }

  if (!response || !response.ok) {
    const status = response ? response.status : 'no-response';
    throw new Error(`School submission data request failed: ${status}`);
  }

  const payload = (await response.json()) as unknown;
  return normalizePayload(payload);
};

function SchoolRegistrationPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const t = (arabic: string, english: string) => (isEnglish ? english : arabic);
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const textDir = isEnglish ? 'ltr' : 'rtl';
  const alignClass = isEnglish ? 'text-left' : 'text-right';
  const [data, setData] = useState<SchoolRegistrationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FormFieldKey, string>>>({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState<SubmissionSuccessState | null>(null);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [isManualReset, setIsManualReset] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const run = async () => {
      setIsLoading(true);
      setError('');

      try {
        const apiData = await fetchSchoolRegistrationData(controller.signal);
        if (!active) return;
        setData(apiData);
      } catch {
        if (!active) return;
        setError('تعذر تحميل بيانات التقديم من واجهة API حالياً.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    run();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const closeMessageHtml = useMemo(() => sanitizeHtml(data?.closeMessage ?? ''), [data?.closeMessage]);
  const introductionHtml = useMemo(() => sanitizeHtml(data?.introductionMessage ?? ''), [data?.introductionMessage]);
  const submissionTermsHtml = useMemo(() => sanitizeHtml(data?.submissionTerms ?? ''), [data?.submissionTerms]);
  const graduationYearOptions = data?.graduationYears ?? [];
  const showSubmissionForm = Boolean(data?.showSubmissionForm);

  const clearFieldError = (field: FormFieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    clearFieldError('attachment');

    if (!file) {
      setFileError('');
      setSelectedFileName('');
      return;
    }

    const lowerName = file.name.toLowerCase();
    const isAllowedExtension = lowerName.endsWith('.pdf') || lowerName.endsWith('.doc') || lowerName.endsWith('.docx');
    if (!isAllowedExtension) {
      setFileError('امتداد الملف يجب أن يكون PDF أو Word (doc / docx).');
      setSelectedFileName('');
      input.value = '';
      return;
    }

    const maxSizeBytes = 3 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFileError('حجم الملف لا يتعدى 3 ميجابايت.');
      setSelectedFileName('');
      input.value = '';
      return;
    }

    setFileError('');
    setSelectedFileName(file.name);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!data?.showSubmissionForm) {
      setSubmitError('التقديم مغلق حالياً.');
      setShowFailureModal(true);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const attachmentInput = form.elements.namedItem('attachment') as HTMLInputElement | null;

    const getValue = (name: string) => String(formData.get(name) ?? '').trim();

    const nextErrors: Partial<Record<FormFieldKey, string>> = {};

    const requiredTextFields: Array<{ field: FormFieldKey; name: string }> = [
      { field: 'studentName', name: 'studentName' },
      { field: 'birthDate', name: 'birthDate' },
      { field: 'studentPhone', name: 'studentPhone' },
      { field: 'graduationYear', name: 'graduationYear' },
      { field: 'guardianPhone', name: 'guardianPhone' },
      { field: 'address', name: 'address' },
      { field: 'certificate', name: 'certificate' },
      { field: 'nationalId', name: 'nationalId' },
      { field: 'governorate', name: 'governorate' },
      { field: 'score', name: 'score' }
    ];

    requiredTextFields.forEach(({ field, name }) => {
      if (!getValue(name)) {
        nextErrors[field] = getFieldRequiredMessage(field);
      }
    });

    const ageOctoberYearsValue = getValue('ageOctoberYears');
    const ageOctoberMonthsValue = getValue('ageOctoberMonths');
    if (!ageOctoberYearsValue || !ageOctoberMonthsValue) {
      nextErrors.ageOctober = getRequiredFieldMessage('ageOctober');
    } else if (!/^\d{1,2}$/.test(ageOctoberYearsValue) || !/^\d{1,2}$/.test(ageOctoberMonthsValue)) {
      nextErrors.ageOctober = 'السن أول أكتوبر يجب أن يحتوي على أرقام فقط';
    } else {
      const ageOctoberMonthsNumber = Number(ageOctoberMonthsValue);
      if (ageOctoberMonthsNumber < 0 || ageOctoberMonthsNumber > 11) {
        nextErrors.ageOctober = 'عدد الشهور يجب أن يكون من 0 إلى 11';
      }
    }

    const studentPhoneValue = getValue('studentPhone');
    if (studentPhoneValue && !/^\d{11}$/.test(studentPhoneValue)) {
      nextErrors.studentPhone = 'رقم الهاتف يجب أن يكون 11 رقمًا';
    }

    const guardianPhoneValue = getValue('guardianPhone');
    if (guardianPhoneValue && !/^\d{11}$/.test(guardianPhoneValue)) {
      nextErrors.guardianPhone = 'رقم الهاتف يجب أن يكون 11 رقمًا';
    }

    const certificateValue = getValue('certificate');
    const scoreValue = normalizeDecimalNumberInput(getValue('score'));
    if (scoreValue && !nextErrors.score) {
      const scoreNum = Number(scoreValue);
      if (!/^\d{1,3}(\.\d{1,2})?$/.test(scoreValue) || isNaN(scoreNum)) {
        nextErrors.score = 'مجموع الدرجات يجب أن يكون رقمًا صحيحًا أو عشريًا';
      } else if (certificateValue === 'الاعدادية الأزهرية' && scoreNum < 474) {
        nextErrors.score = 'مجموع درجات الإعدادية الأزهرية يجب ألا يقل عن 474';
      } else if (certificateValue === 'الاعدادية العامة' && scoreNum < 260) {
        nextErrors.score = 'مجموع درجات الإعدادية العامة يجب ألا يقل عن 260';
      }
    }

    if (!attachmentInput?.files?.length) {
      nextErrors.attachment = 'يجب عليك رفع الملف المطلوب';
    }

    setSubmitError('');
    setSubmitSuccess('');
    setSuccessModal(null);
    setShowFailureModal(false);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || fileError) {
      setShowFailureModal(true);
      return;
    }

    const submitForm = async () => {
      const attachmentFile = attachmentInput?.files?.[0];
      if (!attachmentFile) return;

      setIsSubmitting(true);

      try {
        const uploadFormData = new FormData();
        uploadFormData.append('key[0]', attachmentFile);
        uploadFormData.append('key[1]', attachmentFile);

        const uploadResponse = await fetch(SCHOOL_SUBMISSION_UPLOAD_ENDPOINT, {
          method: 'POST',
          body: uploadFormData,
          credentials: 'same-origin',
        });

        const uploadPayload = await readResponsePayload(uploadResponse);
        if (!uploadResponse.ok) {
          throw new Error(extractErrorMessage(uploadPayload) || 'تعذر رفع الملف. حاول مرة أخرى.');
        }

        const uploadData = extractUploadData(uploadPayload);
        if (!uploadData.receiptFileName || !uploadData.studentFileName) {
          throw new Error('لم يتم استلام أسماء الملفات من خدمة الرفع.');
        }

        const csrfToken = document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute('content')
          ?.trim();

        const payload = {
          name: getValue('studentName'),
          user_id: getValue('nationalId'),
          date: getValue('birthDate'),
          age_in_october: formatAgeOctoberValue(getValue('ageOctoberYears'), getValue('ageOctoberMonths')),
          city: getValue('governorate'),
          year_of_graduated: getValue('graduationYear'),
          phone: getValue('guardianPhone'),
          student_phone: getValue('studentPhone'),
          address: getValue('address'),
          junior_certificate: getValue('certificate') === 'الاعدادية العامة' ? '0' : '1',
          total_grade: normalizeDecimalNumberInput(getValue('score')),
          receipt_file_name: uploadData.receiptFileName,
          file_name: uploadData.studentFileName,
          ...(csrfToken ? { _token: csrfToken } : {}),
        };

        const addStudentResponse = await fetch(SCHOOL_SUBMISSION_ADD_STUDENT_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'same-origin',
        });

        const addStudentPayload = await readResponsePayload(addStudentResponse);
        if (!addStudentResponse.ok) {
          throw new Error(extractErrorMessage(addStudentPayload) || 'تعذر إرسال بيانات الطالب. حاول مرة أخرى.');
        }

        const successState = extractSubmissionSuccessState(addStudentPayload, getValue('studentName'));
        const successMessage = extractErrorMessage(addStudentPayload) || 'تم تسجيل بيانات الطالب ورفع الملف بنجاح.';
        setSubmitSuccess(successMessage);
        setSuccessModal(successState);
        setFieldErrors({});
        setFileError('');
        setSelectedFileName('');
        setShowFailureModal(false);
        form.reset();
      } catch (submitErrorValue) {
        setSubmitError(submitErrorValue instanceof Error ? submitErrorValue.message : 'حدث خطأ غير متوقع أثناء حفظ البيانات.');
      } finally {
        setIsSubmitting(false);
      }
    };

    void submitForm();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50" dir={textDir}>
        {showFailureModal ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0f172a]/30 px-4 backdrop-blur-[1.5px]">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={t('رسالة فشل التسجيل', 'Registration failure message')}
              className="relative w-full max-w-[320px] rounded-md border border-rose-100 bg-white px-5 py-4 text-center shadow-[0_18px_48px_rgba(15,23,42,0.24)]"
            >
              <button
                type="button"
                aria-label={t('إغلاق', 'Close')}
                onClick={() => setShowFailureModal(false)}
                className="absolute left-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-300 transition hover:bg-slate-100 hover:text-slate-600"
              >
                ×
              </button>
              <img
                src="/images/ascww-logo.png"
                alt={t('شعار الشركة', 'Company logo')}
                className="mx-auto mb-3 h-10 w-auto"
              />
              <p className="text-[15px] font-bold leading-7 text-rose-700">
                {t('تسجيل غير ناجح برجاء مراجعة البيانات', 'Registration failed, please review the data')}
              </p>
              <button
                type="button"
                onClick={() => setShowFailureModal(false)}
                className="mt-4 block w-full rounded-md bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                {t('غلق', 'Close')}
              </button>
            </div>
          </div>
        ) : null}
        {successModal ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0f172a]/30 px-4 backdrop-blur-[1.5px]">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={t('رسالة نجاح التسجيل', 'Successful registration message')}
              className="relative w-full max-w-[300px] rounded-md border border-slate-200 bg-white px-5 py-4 text-center shadow-[0_18px_48px_rgba(15,23,42,0.24)]"
            >
              <button
                type="button"
                aria-label={t('إغلاق', 'Close')}
                onClick={() => setSuccessModal(null)}
                className="absolute left-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-300 transition hover:bg-slate-100 hover:text-slate-600"
              >
                ×
              </button>
              <img
                src="/images/ascww-logo.png"
                alt={t('شعار الشركة', 'Company logo')}
                className="mx-auto mb-2 h-10 w-auto"
              />
              <p className="text-[13px] font-medium leading-6 text-slate-600">
                {t('تم التسجيل بنجاح ', 'Registration successful ')}{successModal.registrationLabel}
              </p>
              <p className="mt-1 text-[13px] leading-6 text-slate-500">
                {t('لتحميل استمارة الالتحاق بالمدرسة اضغط', 'To download the school enrollment form, click')}{' '}
                <a
                  href={successModal.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#2f80c0] underline underline-offset-2 transition hover:text-[#0a3555]"
                >
                  {t('هنا', 'here')}
                </a>
                <span
                  aria-hidden="true"
                  className="mr-1 inline-flex h-4 w-4 items-center justify-center rounded-sm bg-[#39a852] text-[9px] font-black leading-none text-white"
                >
                  {t('ملف', 'File')}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setSuccessModal(null)}
                className="mt-4 block w-full rounded-md bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
              >
                {t('غلق', 'Close')}
              </button>
            </div>
          </div>
        ) : null}
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
            <div className={`border-b border-[#d7b05a]/35 bg-white px-6 py-7 text-[#0a3555]`}>
              <h1
                className={`text-2xl font-bold sm:text-3xl ${alignClass}`}
                dir={textDir}
              >
                {t('المدرسة الفنية', 'Technical School')}
              </h1>
            </div>

            <div className="px-4 py-6 sm:px-8 sm:py-8">
              <section dir={textDir} className="mb-8 overflow-hidden rounded-[24px] border border-[#d8e5f0] bg-[#f7fbfe] shadow-[0_18px_45px_rgba(10,53,85,0.08)]">
                <div className={`border-b border-[#d8e5f0] bg-white px-5 py-6 sm:px-8 ${alignClass}`}>
                  <h2 className="text-xl font-black leading-8 text-[#0a3555] sm:text-2xl">
                    {t('تعرف على مدرسة مياه الشرب والصرف الصحي بأسيوط', 'Learn about the Asyut Water and Wastewater School')}
                  </h2>
                  <p className="mt-3 text-sm font-semibold leading-7 text-slate-600 sm:text-base">
                    {t('معلومات مهمة تساعد الطالب وولي الأمر على التعرف على المدرسة ونظام الدراسة قبل التقديم.', 'Important information to help the student and guardian understand the school and the study system before applying.')}
                  </p>
                </div>

                <div className="grid gap-3 bg-[#edf6fb] p-4 sm:grid-cols-3 sm:p-6">
                  {[1, 2, 3].map((imageNumber) => (
                    <img
                      key={imageNumber}
                      src={`/images/school/${imageNumber}.webp`}
                      alt={t(`مدرسة مياه الشرب والصرف الصحي بأسيوط - صورة ${imageNumber}`, `Asyut Water and Wastewater School - image ${imageNumber}`)}
                      className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[0_10px_25px_rgba(10,53,85,0.12)]"
                    />
                  ))}
                </div>

                <div className={`space-y-5 px-5 py-6 text-sm leading-8 text-slate-700 sm:px-8 sm:py-8 sm:text-base ${alignClass}`}>
                  <ul className={`list-disc space-y-2 marker:text-[#1170b0] ${isEnglish ? 'pl-5' : 'pr-5'}`}>
                    <li>{t('تقبل المدرسة طلاب الشهادة الإعدادية العامة والإعدادية الأزهرية بنسبة ٥٪ من محافظات أسيوط والوادي الجديد وسوهاج وقنا والأقصر وأسوان.', 'The school accepts students from the general preparatory certificate and the Azhar preparatory certificate at a rate of 5% from Asyut, New Valley, Sohag, Qena, Luxor, and Aswan governorates.')}</li>
                    <li>{t('المدرسة الثانوية الفنية لمياه الشرب والصرف الصحي للبنين فقط، ويرتدي طلابها الزي الموحد.', 'The technical secondary school for water and wastewater is for boys only, and its students wear a uniform.')}</li>
                    <li>{t('هي مدرسة ثانوية فنية نظام ثلاث سنوات، وبعدها يمنح الخريج شهادة دبلوم فني مياه شرب وصرف صحي.', 'It is a three-year technical secondary school, after which the graduate is awarded a diploma in drinking water and wastewater technology.')}</li>
                  </ul>

                  <p>
                    {t('الدراسة على أعلى مستوى من التعليم. يتم قبول الطلاب الحاصلين على الشهادة الإعدادية العامة بما يعادل ٩٣٪، ويكون مجموع درجات الحد الأدنى للتقديم ٢٦٠ درجة فأعلى، مع أولوية القبول للمجموع الأعلى.', 'Study is carried out at the highest level. Students who hold the general preparatory certificate are admitted at a rate equivalent to 93%, with a minimum required total of 260 marks or higher, with priority given to the highest score.')}
                  </p>

                  <p>
                    {t('يكون التقديم إلكترونيًا عن طريق الإنترنت، من خلال تقديم صورة استمارة النجاح للشهادة الإعدادية وصورة شهادة الميلاد وصورة شخصية. بعد ذلك يخضع الطلاب لاختبارات تحريرية واختبارات كمبيوتر، ثم تتم المقابلة الشخصية، ويُعلن عن الطلاب الناجحين. ويكون القبول بناءً على درجة الشهادة الإعدادية، بالإضافة إلى مجموع الاختبارات الإلكترونية والتحريرية ودرجة المقابلة الشخصية.', 'Applications are submitted online by uploading a copy of the preparatory certificate success form, a birth certificate, and a personal photo. Students then take written and computer tests, followed by a personal interview. Successful students are announced, and admission is based on the preparatory certificate grade, the total of the electronic and written tests, and the interview score.')}
                  </p>

                  <div>
                    <h3 className="mb-2 text-lg font-black text-[#0a3555]">{t('نظام الدراسة والتخصص', 'Study system and specialization')}</h3>
                    <p>
                      {t('تم اختيار طاقم التدريس بعناية وعلى أعلى مستوى. يدرس الطالب مواد المدارس الفنية، ويقوم بتدريسها معلمو التربية والتعليم، بالإضافة إلى مواد تخصصية في مجال مياه الشرب والصرف الصحي، يقوم بتدريسها مهندسون وكيميائيون على أعلى مستوى من شركة مياه الشرب والصرف الصحي بأسيوط.', 'The teaching staff was carefully selected at the highest level. Students study technical school subjects taught by education teachers, alongside specialized subjects in drinking water and wastewater, taught by highly qualified engineers and chemists from Asyut Water and Wastewater Company.')}
                    </p>
                    <p className="mt-3">{t('يتم التخصص في الصف الثالث في أحد التخصصات الثلاثة:', 'Specialization in the third year is in one of three tracks:')}</p>
                    <ul className={`mt-2 list-disc space-y-1 marker:text-[#1170b0] ${isEnglish ? 'pl-6' : 'pr-6'}`}>
                      <li>{t('معالجة وضبط جودة مياه الشرب.', 'Drinking water treatment and quality control.')}</li>
                      <li>{t('تشغيل وصيانة شبكات مياه الشرب والصرف الصحي.', 'Operation and maintenance of drinking water and wastewater networks.')}</li>
                      <li>{t('تشغيل وصيانة محطات مياه الشرب والصرف الصحي.', 'Operation and maintenance of drinking water and wastewater stations.')}</li>
                    </ul>
                  </div>

                  <p>
                    {t('يتم تدريب الطلاب خلال الإجازة الصيفية لمدة ٦ أسابيع في المحطات والشبكات والمعامل التابعة لشركة مياه الشرب والصرف الصحي بأسيوط. وإذا حصل الطالب على تقدير عالٍ، فمن الممكن أن يدرس مواد المعادلة ويلتحق بكلية الهندسة إذا اجتاز المعادلة.', 'Students are trained during the summer vacation for 6 weeks in the stations, networks, and laboratories of Asyut Water and Wastewater Company. If the student achieves a high grade, they may study equivalent subjects and join the engineering college after passing the equivalency exam.')}
                  </p>

                  <p>
                    {t('يتخرج الطالب بدرجة عالية من الاحترافية الفنية، بعد التدريب في شركة مياه الشرب والصرف الصحي بأسيوط على يد أفضل المهندسين والكيميائيين والفنيين. المدرسة تابعة للإدارة العامة للتعليم الفني بأسيوط.', 'The student graduates with a high level of technical professionalism after training at Asyut Water and Wastewater Company under the supervision of the best engineers, chemists, and technicians. The school is affiliated with the General Administration of Technical Education in Asyut.')}
                  </p>

                  <p className="rounded-2xl border border-[#d7b05a]/45 bg-[#fffaf0] px-4 py-3 font-bold text-[#0a3555]">
                    {t('عنوان المدرسة: أسيوط الجديدة، الحي الثاني، بجوار مدرسة اللغات (التجريبي).', 'School address: New Asyut, second district, next to the Languages School (Experimental).')}
                  </p>
                </div>
              </section>

              {isLoading ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  {t('جارٍ تحميل البيانات...', 'Loading data...')}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4 text-center text-sm font-semibold text-rose-700">
                  {error}
                </div>
              ) : null}

              {!isLoading && !error && data ? (
                <div className="space-y-6">
                  <h2 className={`border-b border-[#d7b05a]/45 pb-3 text-xl font-black text-[#0a3555] sm:text-2xl ${alignClass}`}>
                    {t('التقديم في المدرسة الفنية', 'Application to the Technical School')}
                  </h2>

                  {!showSubmissionForm && closeMessageHtml ? (
                    <section className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-700 [&_ul]:list-disc [&_ul]:pr-5 [&_li]:mb-2">
                      <div className="ql-editor text-slate-700" dangerouslySetInnerHTML={{ __html: closeMessageHtml }} />
                    </section>
                  ) : null}

                  {showSubmissionForm && introductionHtml ? (
                    <section className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700 [&_ul]:list-disc [&_ul]:pr-5 [&_li]:mb-2">
                      <div className="ql-editor text-slate-700" dangerouslySetInnerHTML={{ __html: introductionHtml }} />
                    </section>
                  ) : null}

                  {showSubmissionForm && submissionTermsHtml ? (
                    <section className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700 [&_ul]:list-disc [&_ul]:pr-5 [&_li]:mb-2">
                      <div className="ql-editor text-slate-700" dangerouslySetInnerHTML={{ __html: submissionTermsHtml }} />
                    </section>
                  ) : null}

                  {showSubmissionForm ? (
                    <section className="relative overflow-hidden rounded-[16px] border border-[#d8e5f0] bg-[#f7fbfe] px-4 py-5 shadow-[0_22px_50px_rgba(10,53,85,0.08)] sm:px-8 sm:py-8">
                      <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-[#1170b0]/10 blur-3xl" />
                      <div className="pointer-events-none absolute -bottom-8 left-0 h-32 w-32 rounded-full bg-[#d7b05a]/15 blur-3xl" />

                      <div className="relative">
                        {submitError ? (
                          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                            {submitError}
                          </div>
                        ) : null}

                        <div className="mb-2">
                          <span className="inline-flex rounded-full bg-[#0a3555]/8 px-5 py-2 text-sm font-extrabold text-[#0a3555] sm:text-base">
                            {t('نموذج التقديم', 'Application form')}
                          </span>
                        </div>

                        <form
                          dir={textDir}
                          className="grid gap-6 xl:grid-cols-2"
                          onSubmit={handleSubmit}
                          onReset={() => {
                            setFileError('');
                            setSelectedFileName('');
                            setFieldErrors({});
                            setSubmitError('');
                            setSubmitSuccess('');
                            setShowFailureModal(false);
                            if (isManualReset) {
                              setSuccessModal(null);
                              setIsManualReset(false);
                            }
                          }}
                        >
                          <div className={FORM_PANEL_CLASS}>
                            <label className={`block ${alignClass}`}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                {t('الاسم', 'Name')}
                                {fieldErrors.studentName ? <span className={FORM_REQUIRED_MARK_CLASS}>*</span> : null}
                              </span>
                              <input
                                name="studentName"
                                type="text"
                                inputMode="text"
                                maxLength={30}
                                pattern="^[A-Za-z\u0600-\u06FF\s]{1,30}$"
                                title={t('الاسم يجب أن يكون حروف فقط وبحد أقصى 30 حرفًا', 'The name must contain letters only and a maximum of 30 characters')}
                                placeholder={t('ادخل الاسم بالكامل', 'Enter full name')}
                                onChange={() => clearFieldError('studentName')}
                                onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[0-9٠-٩]/g, '').slice(0, 30); }}
                                className={getFormFieldClassName(Boolean(fieldErrors.studentName))}
                              />
                              {fieldErrors.studentName ? <span className={FORM_ERROR_CLASS}>{fieldErrors.studentName}</span> : null}
                              <span className={FORM_HINT_CLASS}>{t('حروف فقط وبحد أقصى 30 حرفًا.', 'Letters only, up to 30 characters.')}</span>
                            </label>

                            <label className={`block ${alignClass}`}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                {t('تاريخ الميلاد', 'Date of birth')}
                                {fieldErrors.birthDate ? <span className={FORM_REQUIRED_MARK_CLASS}>*</span> : null}
                              </span>
                              <input
                                name="birthDate"
                                type="date"
                                onChange={() => clearFieldError('birthDate')}
                                className={getFormFieldClassName(Boolean(fieldErrors.birthDate))}
                              />
                              {fieldErrors.birthDate ? <span className={FORM_ERROR_CLASS}>{fieldErrors.birthDate}</span> : null}
                            </label>

                            <label className={`block ${alignClass}`}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                {t('رقم تليفون الطالب', 'Student phone number')}
                                {fieldErrors.studentPhone ? <span className={FORM_REQUIRED_MARK_CLASS}>*</span> : null}
                              </span>
                              <input
                                name="studentPhone"
                                type="tel"
                                inputMode="numeric"
                                minLength={11}
                                maxLength={11}
                                pattern="^[0-9]{11}$"
                                title={t('رقم الهاتف يجب أن يكون 11 رقمًا', 'Phone number must be 11 digits')}
                                placeholder="01xxxxxxxxx"
                                onChange={() => clearFieldError('studentPhone')}
                                onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 11); }}
                                className={getFormFieldClassName(Boolean(fieldErrors.studentPhone))}
                              />
                              {fieldErrors.studentPhone ? <span className={FORM_ERROR_CLASS}>{fieldErrors.studentPhone}</span> : null}
                              <span className={FORM_HINT_CLASS}>{t('يجب إدخال 11 رقمًا باللغة الإنجليزية.', '11 digits in English must be entered.')}</span>
                            </label>

                            <label className={`block ${alignClass}`}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                {t('الرقم القومي للطالب', 'Student national ID')}
                                {fieldErrors.nationalId ? <span className={FORM_REQUIRED_MARK_CLASS}>*</span> : null}
                              </span>
                              <input
                                name="nationalId"
                                type="text"
                                inputMode="numeric"
                                minLength={14}
                                maxLength={14}
                                pattern="^[0-9]{14}$"
                                title={t('الرقم القومي يجب أن يكون 14 رقمًا', 'National ID must be 14 digits')}
                                placeholder={t('14 رقمًا', '14 digits')}
                                onChange={() => clearFieldError('nationalId')}
                                onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 14); }}
                                className={getFormFieldClassName(Boolean(fieldErrors.nationalId))}
                              />
                              {fieldErrors.nationalId ? <span className={FORM_ERROR_CLASS}>{fieldErrors.nationalId}</span> : null}
                              <span className={FORM_HINT_CLASS}>{t('يجب إدخال 14 رقمًا بدون فواصل أو مسافات.', 'Enter 14 digits without commas or spaces.')}</span>
                            </label>

                            <label className={`block ${alignClass}`}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                {t('العنوان', 'Address')}
                                {fieldErrors.address ? <span className={FORM_REQUIRED_MARK_CLASS}>*</span> : null}
                              </span>
                              <input
                                name="address"
                                type="text"
                                inputMode="text"
                                maxLength={50}
                                pattern="^[A-Za-z0-9\u0660-\u0669\u0621-\u064A\s]{1,50}$"
                                title={t('العنوان يجب أن يكون حروفًا وأرقامًا فقط وبحد أقصى 50 حرفًا', 'Address must contain letters and numbers only, up to 50 characters')}
                                placeholder={t('المدينة - المركز - القرية', 'City - district - village')}
                                onChange={() => clearFieldError('address')}
                                onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^A-Za-z0-9\u0660-\u0669\u0621-\u064A\s]/g, '').slice(0, 50); }}
                                className={getFormFieldClassName(Boolean(fieldErrors.address))}
                              />
                              {fieldErrors.address ? <span className={FORM_ERROR_CLASS}>{fieldErrors.address}</span> : null}
                              <span className={FORM_HINT_CLASS}>{t('بحد أقصى 50 حرفًا.', 'Maximum 50 characters.')}</span>
                            </label>

                            <label className={`block ${alignClass}`}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                {t('المحافظة', 'Governorate')}
                                {fieldErrors.governorate ? <span className={FORM_REQUIRED_MARK_CLASS}>*</span> : null}
                              </span>
                              <select
                                name="governorate"
                                defaultValue=""
                                onChange={() => clearFieldError('governorate')}
                                className={getFormFieldClassName(Boolean(fieldErrors.governorate))}
                              >
                                <option value="" disabled>{t('اختر المحافظة', 'Select governorate')}</option>
                                <option value="سوهاج">{t('سوهاج', 'Sohag')}</option>
                                <option value="قنا">{t('قنا', 'Qena')}</option>
                                <option value="اسيوط">{t('اسيوط', 'Asyut')}</option>
                                <option value="الوادي الجديد">{t('الوادي الجديد', 'New Valley')}</option>
                                <option value="الاقصر">{t('الاقصر', 'Luxor')}</option>
                                <option value="اسوان">{t('اسوان', 'Aswan')}</option>
                              </select>
                              {fieldErrors.governorate ? <span className={FORM_ERROR_CLASS}>{fieldErrors.governorate}</span> : null}
                            </label>

                            <label className={`block ${alignClass}`}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                {t('رقم تليفون ولي الأمر', 'Guardian phone number')}
                                {fieldErrors.guardianPhone ? <span className={FORM_REQUIRED_MARK_CLASS}>*</span> : null}
                              </span>
                              <input
                                name="guardianPhone"
                                type="tel"
                                inputMode="numeric"
                                minLength={11}
                                maxLength={11}
                                pattern="^[0-9]{11}$"
                                title={t('رقم الهاتف يجب أن يكون 11 رقمًا', 'Phone number must be 11 digits')}
                                placeholder="01xxxxxxxxx"
                                onChange={() => clearFieldError('guardianPhone')}
                                onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 11); }}
                                className={getFormFieldClassName(Boolean(fieldErrors.guardianPhone))}
                              />
                              {fieldErrors.guardianPhone ? <span className={FORM_ERROR_CLASS}>{fieldErrors.guardianPhone}</span> : null}
                              <span className={FORM_HINT_CLASS}>{t('يجب إدخال 11 رقمًا للتواصل عند الحاجة.', 'Enter 11 digits for contact when needed.')}</span>
                            </label>

                            <label className={`block ${alignClass}`}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                {t('سنة الحصول على الشهادة الإعدادية', 'Year of obtaining the preparatory certificate')}
                                {fieldErrors.graduationYear ? <span className={FORM_REQUIRED_MARK_CLASS}>*</span> : null}
                              </span>
                              <select
                                name="graduationYear"
                                defaultValue=""
                                onChange={() => clearFieldError('graduationYear')}
                                className={getFormFieldClassName(Boolean(fieldErrors.graduationYear))}
                              >
                                <option value="" disabled>{t('اختر السنة', 'Select year')}</option>
                                {graduationYearOptions.map((year) => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                              {fieldErrors.graduationYear ? <span className={FORM_ERROR_CLASS}>{fieldErrors.graduationYear}</span> : null}
                            </label>

                          </div>

                          <div className={FORM_PANEL_CLASS}>
                            <label className={`block ${alignClass}`}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                {t('الشهادة', 'Certificate')}
                                {fieldErrors.certificate ? <span className={FORM_REQUIRED_MARK_CLASS}>*</span> : null}
                              </span>
                              <select
                                name="certificate"
                                defaultValue=""
                                onChange={() => clearFieldError('certificate')}
                                className={getFormFieldClassName(Boolean(fieldErrors.certificate))}
                              >
                                <option value="" disabled>{t('اختر نوع الشهادة', 'Select certificate type')}</option>
                                <option value="الاعدادية العامة">{t('الإعدادية العامة', 'General preparatory')}</option>
                                <option value="الاعدادية الأزهرية">{t('الإعدادية الأزهرية', 'Azhar preparatory')}</option>
                              </select>
                              {fieldErrors.certificate ? <span className={FORM_ERROR_CLASS}>{fieldErrors.certificate}</span> : null}
                            </label>

                            <label className={`block ${alignClass}`}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                {t('السن أول أكتوبر', 'Age on 1 October')}
                                {fieldErrors.ageOctober ? <span className={FORM_REQUIRED_MARK_CLASS}>*</span> : null}
                              </span>
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  name="ageOctoberYears"
                                  type="text"
                                  inputMode="numeric"
                                  minLength={1}
                                  maxLength={2}
                                  pattern="^[0-9]{1,2}$"
                                  title={t('عدد السنوات يجب أن يكون أرقامًا فقط', 'Years must be numeric only')}
                                  placeholder={t('السنوات', 'Years')}
                                  onChange={() => clearFieldError('ageOctober')}
                                  onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 2); }}
                                  className={getFormFieldClassName(Boolean(fieldErrors.ageOctober))}
                                />
                                <input
                                  name="ageOctoberMonths"
                                  type="text"
                                  inputMode="numeric"
                                  minLength={1}
                                  maxLength={2}
                                  pattern="^(0?[0-9]|1[01])$"
                                  title={t('عدد الشهور يجب أن يكون من 0 إلى 11', 'Months must be from 0 to 11')}
                                  placeholder={t('الشهور', 'Months')}
                                  onChange={() => clearFieldError('ageOctober')}
                                  onInput={(event) => {
                                    const nextValue = event.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 2);
                                    event.currentTarget.value = Number(nextValue) > 11 ? '11' : nextValue;
                                  }}
                                  className={getFormFieldClassName(Boolean(fieldErrors.ageOctober))}
                                />
                              </div>
                              {fieldErrors.ageOctober ? <span className={FORM_ERROR_CLASS}>{fieldErrors.ageOctober}</span> : null}
                              <span className={FORM_HINT_CLASS}>{t('مثال: 15 سنة و7 أشهر، واكتب الشهور من 0 إلى 11.', 'Example: 15 years and 7 months; enter months from 0 to 11.')}</span>
                            </label>

                            <label className={`block ${alignClass}`}>
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                {t('مجموع درجات الطالب في الشهادة الإعدادية', 'Student total score in the preparatory certificate')}
                                {fieldErrors.score ? <span className={FORM_REQUIRED_MARK_CLASS}>*</span> : null}
                              </span>
                              <div className="relative">
                                <input
                                  name="score"
                                  type="text"
                                  inputMode="decimal"
                                  maxLength={6}
                                  pattern="^[0-9]{1,3}([.,٫][0-9]{1,2})?$"
                                  title={t('مجموع الدرجات يمكن أن يكون رقمًا صحيحًا أو عشريًا مثل 474.5', 'The total score may be a whole or decimal number such as 474.5')}
                                  placeholder={t('مثال: 474.5', 'Example: 474.5')}
                                  onChange={() => clearFieldError('score')}
                                  onInput={(event) => { event.currentTarget.value = normalizeDecimalNumberInput(event.currentTarget.value); }}
                                  className={`${getFormFieldClassName(Boolean(fieldErrors.score))} pl-16`}
                                />
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                                  {t('درجة', 'Score')}
                                </span>
                              </div>
                              {fieldErrors.score ? <span className={FORM_ERROR_CLASS}>{fieldErrors.score}</span> : null}
                              <span className={FORM_HINT_CLASS}>{t('يمكن كتابة المجموع كرقم صحيح أو عشري، مثل 260 أو 474.5 درجة.', 'The total can be written as a whole or decimal number, such as 260 or 474.5.')}</span>
                            </label>

                            <div className="rounded-[24px] border border-dashed border-[#8bb9d6] bg-white/95 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)] sm:p-6">
                              <span className={FORM_FIELD_LABEL_CLASS}>
                                {t('رفع الملف', 'Upload file')}
                                {(fieldErrors.attachment || fileError) ? <span className={FORM_REQUIRED_MARK_CLASS}>*</span> : null}
                              </span>
                              <p className="mt-2 text-sm leading-7 text-slate-600">
                                {t('ارفع ملفًا واحدًا يجمع كل المستندات المطلوبة بصيغة PDF أو Word.', 'Upload a single file containing all required documents in PDF or Word format.')}
                              </p>
                              <input
                                name="attachment"
                                type="file"
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleFileChange}
                                className={`mt-4 block w-full rounded-2xl border border-dashed bg-[#f8fbff] px-4 py-4 text-sm text-slate-700 transition file:ml-3 file:rounded-xl file:border-0 file:bg-[#0a3555] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white file:hover:bg-[#1170b0] ${fieldErrors.attachment || fileError
                                    ? 'border-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.12),0_10px_20px_rgba(244,63,94,0.10)] hover:border-rose-600 focus:border-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-500/15'
                                    : 'border-[#b8d3e6] hover:border-[#1170b0]'
                                  }`}
                              />
                              {selectedFileName ? (
                                <p className="mt-3 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                                  {t('الملف المختار:', 'Selected file:')} {selectedFileName}
                                </p>
                              ) : null}
                              {fileError ? (
                                <p className={FORM_ERROR_CLASS}>{fileError}</p>
                              ) : null}
                              {!fileError && fieldErrors.attachment ? (
                                <p className={FORM_ERROR_CLASS}>{fieldErrors.attachment}</p>
                              ) : null}
                              <span className={FORM_HINT_CLASS}>{t('الحد الأقصى لحجم الملف هو 3 ميجابايت.', 'Maximum file size is 3 MB.')}</span>
                            </div>

                            <div className="rounded-[24px] border border-[#d7e6f1] bg-white/85 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)] sm:p-6">
                              <h3 className="text-base font-extrabold text-[#0a3555]">
                                {t('المستندات المطلوبة', 'Required documents')}
                              </h3>
                              <ul className={`mt-4 list-disc space-y-2 text-sm leading-7 text-slate-700 marker:text-[#1170b0] ${isEnglish ? 'pl-5' : 'pr-5'}`}>
                                <li>{t('استمارة النجاح للشهادة الإعدادية معتمدة.', 'Certified preparatory certificate success form.')}</li>
                                <li>{t('بيان نجاح الطالب للصف الأول والثاني الإعدادي معتمد من نفس المحافظة الحاصل منها على الشهادة الإعدادية.', 'Statement of the student’s success in the first and second preparatory grades, certified by the same governorate from which they obtained the preparatory certificate.')}</li>
                                <li>{t('شهادة الميلاد.', 'Birth certificate.')}</li>
                                <li>{t('صورة بطاقة الرقم القومي للطالب وولي الأمر.', 'Copy of the student and guardian national ID cards.')}</li>
                                <li>{t('صورة شخصية 4x6.', '4x6 personal photo.')}</li>
                                <li>{t('يجب أن يكون امتداد الملف المرفق (pdf - word).', 'The uploaded file must be in PDF or Word format.')}</li>
                                <li>{t('حجم الملف لا يتعدى 3 ميجابايت.', 'File size must not exceed 3 MB.')}</li>
                                <li>{t('يفضل أن يكون اسم الملف المرفق بنفس اسم الطالب.', 'It is preferred that the uploaded file name matches the student’s name.')}</li>
                                <li>{t('يجب طباعة الرسالة بعد التسجيل لإرفاقها مع الأوراق المطلوبة يوم المقابلة الشخصية.', 'You must print the message after registration and attach it with the required papers on the personal interview day.')}</li>
                              </ul>
                            </div>
                          </div>

                          <div dir={textDir} className="mt-1 flex flex-wrap justify-start gap-3 xl:col-span-2">
                            <button type="submit" disabled={isSubmitting} className={PRIMARY_ACTION_BUTTON_CLASS}>
                              {isSubmitting ? t('جارٍ التسجيل...', 'Registering...') : t('تسجيل', 'Register')}
                            </button>
                            <button
                              type="reset"
                              disabled={isSubmitting}
                              onClick={() => setIsManualReset(true)}
                              className={SECONDARY_ACTION_BUTTON_CLASS}
                            >
                              {t('مسح البيانات', 'Clear form')}
                            </button>
                          </div>
                        </form>
                      </div>
                    </section>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default SchoolRegistrationPage;



