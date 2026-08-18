import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to external service in production
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Đã có lỗi xảy ra
            </h1>
            <p className="text-gray-600 mb-6">
              Xin lỗi, ứng dụng gặp sự cố. Đội ngũ kỹ thuật đã được thông báo.
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="text-left bg-gray-100 rounded-lg p-4 mb-6 text-sm">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  Chi tiết lỗi (Development)
                </summary>
                <pre className="text-red-600 whitespace-pre-wrap break-words">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo &&
                    "\n\n" + this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Tải lại trang
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
