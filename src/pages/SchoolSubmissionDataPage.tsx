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

type SchoolSubmissionData = {
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

const parseQueryBooleanOverride = (value: string | null) => {
  if (value === null) return null;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (['1', 'true', 'yes', 'open', 'active', 'available', 'متاح', 'مفتوح'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'closed', 'inactive', 'unavailable', 'غير متاح', 'مغلق'].includes(normalized)) return false;
  return null;
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

const extractErrorMessage = (payload: unknown) => {
  if (typeof payload === 'string' && payload.trim()) return payload.trim();
  if (!isRecord(payload)) return '';

  const message = payload.message;
  if (typeof message === 'string' && message.trim()) return message.trim();

  const error = payload.error;
  if (typeof error === 'string' && error.trim()) return error.trim();

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

const normalizePayload = (payload: unknown): SchoolSubmissionData => {
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

const fetchSchoolSubmissionData = async (signal: AbortSignal) => {
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

function SchoolSubmissionDataPage() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';
  const headerGradientClass = isEnglish ? 'bg-gradient-to-r from-[#0a3555] to-[#1170b0]' : 'bg-gradient-to-l from-[#0a3555] to-[#1170b0]';
  const [data, setData] = useState<SchoolSubmissionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FormFieldKey, string>>>({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState<SubmissionSuccessState | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const run = async () => {
      setIsLoading(true);
      setError('');

      try {
        const apiData = await fetchSchoolSubmissionData(controller.signal);
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
  const previewSubmissionOverride = typeof window !== 'undefined'
    ? (() => {
      const searchParams = new URLSearchParams(window.location.search);
      return parseQueryBooleanOverride(searchParams.get(''))
        ?? parseQueryBooleanOverride(searchParams.get('preview_submission'));
    })()
    : null;
  const showSubmissionForm = previewSubmissionOverride ?? Boolean(data?.showSubmissionForm);

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
      { field: 'ageOctober', name: 'ageOctober' },
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

    const studentPhoneValue = getValue('studentPhone');
    if (studentPhoneValue && !/^\d{11}$/.test(studentPhoneValue)) {
      nextErrors.studentPhone = 'رقم الهاتف يجب أن يكون 11 رقمًا';
    }

    const guardianPhoneValue = getValue('guardianPhone');
    if (guardianPhoneValue && !/^\d{11}$/.test(guardianPhoneValue)) {
      nextErrors.guardianPhone = 'رقم الهاتف يجب أن يكون 11 رقمًا';
    }

    if (!attachmentInput?.files?.length) {
      nextErrors.attachment = 'يجب عليك رفع الملف المطلوب';
    }

    setSubmitError('');
    setSubmitSuccess('');
    setSuccessModal(null);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || fileError) {
      return;
    }

    const submitForm = async () => {
      const attachmentFile = attachmentInput?.files?.[0];
      if (!attachmentFile) return;

      setIsSubmitting(true);

      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', attachmentFile);

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
          age_in_october: getValue('ageOctober'),
          city: getValue('governorate'),
          year_of_graduated: getValue('graduationYear'),
          phone: getValue('guardianPhone'),
          student_phone: getValue('studentPhone'),
          address: getValue('address'),
          junior_certificate: getValue('certificate') === 'الاعدادية العامة' ? '0' : '1',
          total_grade: getValue('score'),
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
      <main className="min-h-screen bg-slate-50" dir="rtl">
        {successModal ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-[2px]">
            <div className="relative w-full max-w-sm rounded-2xl bg-white px-6 py-5 text-center shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
              <button
                type="button"
                aria-label="إغلاق"
                onClick={() => setSuccessModal(null)}
                className="absolute left-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
              <img
                src="/images/ascww-logo.png"
                alt="شعار الشركة"
                className="mx-auto mb-3 h-12 w-auto"
              />
              <p className="text-sm font-semibold text-slate-700">
                تم التسجيل بنجاح
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {successModal.registrationLabel}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                لتحميل استمارة الالتحاق بالمدرسة اضغط
                {' '}
                <a
                  href={successModal.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#1170b0] underline underline-offset-2 transition hover:text-[#0a3555]"
                >
                  هنا
                </a>
              </p>
              <a
                href={successModal.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto mt-4 inline-flex items-center gap-2 rounded-lg bg-[#eef7fb] px-4 py-2 text-sm font-bold text-[#0a3555] transition hover:bg-[#dff1f8]"
              >
                <span aria-hidden="true" className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#27ae60] text-xs font-black text-white">PDF</span>
                تحميل الاستمارة
              </a>
              <button
                type="button"
                onClick={() => setSuccessModal(null)}
                className="mt-4 block w-full rounded-lg bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
              >
                غلق
              </button>
            </div>
          </div>
        ) : null}
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
            <div className={`${headerGradientClass} px-6 py-7 text-white`}>
              <h1
                className={`text-lg font-semibold sm:text-xl ${isEnglish ? 'text-left' : 'text-right'}`}
                dir={isEnglish ? 'ltr' : 'rtl'}
              >
                {isEnglish
                  ? 'Technical School Student Results Search for Assiut and New Valley Water and Wastewater'
                  : 'البحث عن نتيجة طلاب المدرسة الفنية لمياه الشرب والصرف الصحي بأسيوط والوادي الجديد'}
              </h1>
            </div>

            <div className="px-4 py-6 sm:px-8 sm:py-8">
              {isLoading ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-semibold text-slate-600">
                  جاري تحميل البيانات...
                </div>
              ) : null}

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4 text-center text-sm font-semibold text-rose-700">
                  {error}
                </div>
              ) : null}

              {!isLoading && !error && data ? (
                <div className="space-y-6">

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
                    <section className="rounded-xl border border-[#d8cec1] bg-[#e7ded3] px-4 py-5 sm:px-8 sm:py-7">
                      {submitSuccess ? (
                        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                          {submitSuccess}
                        </div>
                      ) : null}
                      {submitError ? (
                        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                          {submitError}
                        </div>
                      ) : null}
                      <form
                        className="grid gap-x-6 gap-y-5 md:grid-cols-2"
                        onSubmit={handleSubmit}
                        onReset={() => {
                          setFileError('');
                          setSelectedFileName('');
                          setFieldErrors({});
                          setSubmitError('');
                          setSubmitSuccess('');
                          setSuccessModal(null);
                        }}
                      >
                        <div className="space-y-5 md:col-span-1">
                          <label className="block text-right">
                            <span className="text-lg text-slate-700">
                              الاسم
                              {fieldErrors.studentName ? <span className="mr-1 text-rose-600">*</span> : null}
                            </span>
                            <input name="studentName" type="text" inputMode="text" maxLength={30} pattern="^[A-Za-z\u0600-\u06FF\s]{1,30}$" title="الاسم يجب أن يكون حروف فقط وبحد أقصى 30 حرفًا" onChange={() => clearFieldError('studentName')} onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[0-9٠-٩]/g, '').slice(0, 30); }} className="w-full border-0 border-b border-[#8f887f] bg-transparent px-0 py-2 text-right text-base text-slate-800 focus:border-[#6f675f] focus:outline-none" />
                            {fieldErrors.studentName ? <span className="mt-1 block text-xs font-semibold text-rose-700">{fieldErrors.studentName}</span> : null}
                            <span className="mt-1 block text-xs text-slate-500">0 / 30</span>
                          </label>

                          <label className="block text-right">
                            <span className="text-lg text-slate-700">
                              تاريخ الميلاد
                              {fieldErrors.birthDate ? <span className="mr-1 text-rose-600">*</span> : null}
                            </span>
                            <input name="birthDate" type="date" onChange={() => clearFieldError('birthDate')} className="w-full border-0 border-b border-[#8f887f] bg-transparent px-0 py-2 text-right text-base text-slate-800 focus:border-[#6f675f] focus:outline-none" />
                            {fieldErrors.birthDate ? <span className="mt-1 block text-xs font-semibold text-rose-700">{fieldErrors.birthDate}</span> : null}
                          </label>

                          <label className="block text-right">
                            <span className="text-lg text-slate-700">
                              رقم تليفون الطالب
                              {fieldErrors.studentPhone ? <span className="mr-1 text-rose-600">*</span> : null}
                            </span>
                            <input name="studentPhone" type="tel" inputMode="numeric" minLength={11} maxLength={11} pattern="^[0-9]{11}$" title="رقم الهاتف يجب أن يكون 11 رقمًا" onChange={() => clearFieldError('studentPhone')} onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 11); }} className="w-full border-0 border-b border-[#8f887f] bg-transparent px-0 py-2 text-right text-base text-slate-800 focus:border-[#6f675f] focus:outline-none" />
                            {fieldErrors.studentPhone ? <span className="mt-1 block text-xs font-semibold text-rose-700">{fieldErrors.studentPhone}</span> : null}
                            <span className="mt-1 block text-xs text-slate-500">0 / 11</span>
                          </label>

                          <label className="block text-right">
                            <span className="text-lg text-slate-700">
                              الرقم القومي للطالب
                              {fieldErrors.nationalId ? <span className="mr-1 text-rose-600">*</span> : null}
                            </span>
                            <input name="nationalId" type="text" inputMode="numeric" minLength={14} maxLength={14} pattern="^[0-9]{14}$" title="الرقم القومي يجب أن يكون 14 رقمًا" onChange={() => clearFieldError('nationalId')} onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 14); }} className="w-full border-0 border-b border-[#8f887f] bg-transparent px-0 py-2 text-right text-base text-slate-800 focus:border-[#6f675f] focus:outline-none" />
                            {fieldErrors.nationalId ? <span className="mt-1 block text-xs font-semibold text-rose-700">{fieldErrors.nationalId}</span> : null}
                            <span className="mt-1 block text-xs text-slate-500">0 / 14</span>
                          </label>

                          <label className="block text-right">
                            <span className="text-lg text-slate-700">
                              العنوان
                              {fieldErrors.address ? <span className="mr-1 text-rose-600">*</span> : null}
                            </span>
                            <input name="address" type="text" inputMode="text" maxLength={50} pattern="^[A-Za-z0-9\u0660-\u0669\u0621-\u064A\s]{1,50}$" title="العنوان يجب أن يكون حروفًا وأرقامًا فقط وبحد أقصى 50 حرفًا" onChange={() => clearFieldError('address')} onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^A-Za-z0-9\u0660-\u0669\u0621-\u064A\s]/g, '').slice(0, 50); }} className="w-full border-0 border-b border-[#8f887f] bg-transparent px-0 py-2 text-right text-base text-slate-800 focus:border-[#6f675f] focus:outline-none" />
                            {fieldErrors.address ? <span className="mt-1 block text-xs font-semibold text-rose-700">{fieldErrors.address}</span> : null}
                            <span className="mt-1 block text-xs text-slate-500">0 / 50</span>
                          </label>

                          <label className="block text-right">
                            <span className="text-lg text-slate-700">
                              المحافظة
                              {fieldErrors.governorate ? <span className="mr-1 text-rose-600">*</span> : null}
                            </span>
                            <select name="governorate" defaultValue="" onChange={() => clearFieldError('governorate')} className="w-full border-0 border-b border-[#8f887f] bg-transparent px-0 py-2 text-right text-base text-slate-800 focus:border-[#6f675f] focus:outline-none">
                              <option value="" disabled>اختر المحافظة</option>
                              <option value="سوهاج">سوهاج</option>
                              <option value="قنا">قنا</option>
                              <option value="اسيوط">اسيوط</option>
                              <option value="الاقصر">الاقصر</option>
                              <option value="اسوان">اسوان</option>
                            </select>
                            {fieldErrors.governorate ? <span className="mt-1 block text-xs font-semibold text-rose-700">{fieldErrors.governorate}</span> : null}
                          </label>

                          <label className="block text-right">
                            <span className="text-lg text-slate-700">
                              رقم تليفون ولي الأمر
                              {fieldErrors.guardianPhone ? <span className="mr-1 text-rose-600">*</span> : null}
                            </span>
                            <input name="guardianPhone" type="tel" inputMode="numeric" minLength={11} maxLength={11} pattern="^[0-9]{11}$" title="رقم الهاتف يجب أن يكون 11 رقمًا" onChange={() => clearFieldError('guardianPhone')} onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 11); }} className="w-full border-0 border-b border-[#8f887f] bg-transparent px-0 py-2 text-right text-base text-slate-800 focus:border-[#6f675f] focus:outline-none" />
                            {fieldErrors.guardianPhone ? <span className="mt-1 block text-xs font-semibold text-rose-700">{fieldErrors.guardianPhone}</span> : null}
                            <span className="mt-1 block text-xs text-slate-500">0 / 11</span>
                          </label>
                        </div>

                        <div className="space-y-5 md:col-span-1">
                          <label className="block text-right">
                            <span className="text-lg text-slate-700">
                              سنة الحصول على الشهادة الإعدادية
                              {fieldErrors.graduationYear ? <span className="mr-1 text-rose-600">*</span> : null}
                            </span>
                            <select name="graduationYear" defaultValue="" onChange={() => clearFieldError('graduationYear')} className="w-full border-0 border-b border-[#8f887f] bg-transparent px-0 py-2 text-right text-base text-slate-800 focus:border-[#6f675f] focus:outline-none">
                              <option value="" disabled>اختر السنة</option>
                              {graduationYearOptions.map((year) => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </select>
                            {fieldErrors.graduationYear ? <span className="mt-1 block text-xs font-semibold text-rose-700">{fieldErrors.graduationYear}</span> : null}
                          </label>

                          <label className="block text-right">
                            <span className="text-lg text-slate-700">
                              السن أول أكتوبر
                              {fieldErrors.ageOctober ? <span className="mr-1 text-rose-600">*</span> : null}
                            </span>
                            <input name="ageOctober" type="text" inputMode="numeric" minLength={2} maxLength={2} pattern="^[0-9]{2}$" title="السن أول أكتوبر يجب أن يكون رقمين فقط" onChange={() => clearFieldError('ageOctober')} onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 2); }} className="w-full border-0 border-b border-[#8f887f] bg-transparent px-0 py-2 text-right text-base text-slate-800 focus:border-[#6f675f] focus:outline-none" />
                            {fieldErrors.ageOctober ? <span className="mt-1 block text-xs font-semibold text-rose-700">{fieldErrors.ageOctober}</span> : null}
                          </label>

                          <label className="block text-right">
                            <span className="text-lg text-slate-700">
                              الشهادة
                              {fieldErrors.certificate ? <span className="mr-1 text-rose-600">*</span> : null}
                            </span>
                            <select name="certificate" defaultValue="" onChange={() => clearFieldError('certificate')} className="w-full border-0 border-b border-[#8f887f] bg-transparent px-0 py-2 text-right text-base text-slate-800 focus:border-[#6f675f] focus:outline-none">
                              <option value="" disabled>اختر نوع الشهادة</option>
                              <option value="الاعدادية العامة">الإعدادية العامة</option>
                              <option value="الاعدادية الأزهرية">الإعدادية الأزهرية</option>
                            </select>
                            {fieldErrors.certificate ? <span className="mt-1 block text-xs font-semibold text-rose-700">{fieldErrors.certificate}</span> : null}
                          </label>

                          <label className="block text-right">
                            <span className="text-lg text-slate-700">
                              مجموع درجات الطالب في الشهادة الإعدادية
                              {fieldErrors.score ? <span className="mr-1 text-rose-600">*</span> : null}
                            </span>
                            <input name="score" type="text" inputMode="numeric" minLength={3} maxLength={3} pattern="^[0-9]{3}$" title="مجموع الدرجات يجب أن يكون 3 أرقام فقط" onChange={() => clearFieldError('score')} onInput={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 3); }} className="w-full border-0 border-b border-[#8f887f] bg-transparent px-0 py-2 text-right text-base text-slate-800 focus:border-[#6f675f] focus:outline-none" />
                            {fieldErrors.score ? <span className="mt-1 block text-xs font-semibold text-rose-700">{fieldErrors.score}</span> : null}
                          </label>

                          <div>
                            <span className="text-lg text-slate-700">
                              رفع الملف
                              {(fieldErrors.attachment || fileError) ? <span className="mr-1 text-rose-600">*</span> : null}
                            </span>
                            <input
                              name="attachment"
                              type="file"
                              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              onChange={handleFileChange}
                              className="mt-2 block w-full text-sm text-slate-700 file:ml-3 file:rounded file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
                            />
                            {selectedFileName ? (
                              <p className="mt-2 text-xs font-semibold text-emerald-700">الملف المختار: {selectedFileName}</p>
                            ) : null}
                            {fileError ? (
                              <p className="mt-2 text-xs font-semibold text-rose-700">{fileError}</p>
                            ) : null}
                            {!fileError && fieldErrors.attachment ? (
                              <p className="mt-2 text-xs font-semibold text-rose-700">{fieldErrors.attachment}</p>
                            ) : null}

                            <ul className="mt-3 list-disc space-y-1 pr-5 text-sm leading-7 text-slate-700">
                              <li>استمارة النجاح للشهادة الإعدادية معتمدة.</li>
                              <li>بيان نجاح الطالب للصف الأول والثاني الإعدادي معتمد من نفس المحافظة الحاصل منها على الشهادة الإعدادية.</li>
                              <li>شهادة الميلاد.</li>
                              <li>صورة بطاقة الرقم القومي للطالب وولي الأمر.</li>
                              <li>صورة شخصية 4x6.</li>
                              <li>يجب أن يكون امتداد الملف المرفق (pdf - word).</li>
                              <li>حجم الملف لا يتعدى 3 ميجابايت.</li>
                              <li>يفضل أن يكون اسم الملف المرفق بنفس اسم الطالب.</li>
                              <li>يجب طباعة الرسالة بعد التسجيل لإرفاقها مع الأوراق المطلوبة يوم المقابلة الشخصية.</li>
                            </ul>
                          </div>
                        </div>

                        <div dir="ltr" className="md:col-span-2 mt-2 flex justify-start gap-3">
                          <button type="submit" disabled={isSubmitting} className="rounded bg-[#d08a2f] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#b97824] disabled:cursor-not-allowed disabled:bg-[#d08a2f]/70">
                            {isSubmitting ? 'جارٍ التسجيل...' : 'تسجيل'}
                          </button>
                          <button type="reset" disabled={isSubmitting} className="rounded bg-slate-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-400">
                            مسح البيانات
                          </button>
                        </div>
                      </form>
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

export default SchoolSubmissionDataPage;











