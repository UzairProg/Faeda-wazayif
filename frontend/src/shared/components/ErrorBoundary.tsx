import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error in component tree:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-400" />
          </div>
          <h1 className="text-xl font-bold mb-2">حدث خطأ أثناء تحميل الصفحة</h1>
          <p className="text-sm text-gray-400 max-w-md mb-6 leading-relaxed">
            حدث خطأ غير متوقع في واجهة المستخدم. يرجى إعادة تحميل الصفحة أو تسجيل الدخول من جديد.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg hover:brightness-110 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة التحميل (Reload)
            </button>
            <button
              onClick={() => {
                localStorage.clear()
                sessionStorage.clear()
                window.location.href = "/company/billing"
              }}
              className="px-4 py-2.5 rounded-xl border border-gray-700 hover:border-gray-500 text-xs text-gray-300 font-medium transition-all"
            >
              مسح الذاكرة المؤقتة (Clear Cache)
            </button>
          </div>
          {this.state.error && (
            <pre className="mt-8 p-4 rounded-xl bg-black/60 border border-gray-800 text-left text-xs text-rose-300 max-w-xl overflow-x-auto">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
