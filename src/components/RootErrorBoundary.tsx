import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[RootErrorBoundary]', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800"
          dir="rtl"
          role="alert"
        >
          <div className="mx-auto max-w-lg rounded-lg border border-red-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-bold text-red-800">تعذّر تحميل الواجهة</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              حدث خطأ أثناء تشغيل التطبيق. جرّب تحديث الصفحة. إذا استمرّت المشكلة، راجع وحدة التحكم في المتصفح
              (F12) أو تواصل مع الدعم الفني.
            </p>
            <details className="mt-4 text-right text-xs text-slate-500">
              <summary className="cursor-pointer font-medium text-slate-700">تفاصيل تقنية</summary>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded bg-slate-100 p-2 text-left" dir="ltr">
                {this.state.error.message}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
