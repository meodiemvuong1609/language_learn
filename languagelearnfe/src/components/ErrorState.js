/**
 * ErrorState Component - Reusable error display
 * Usage: <ErrorState message="Failed to load" onRetry={handleRetry} />
 */
const ErrorState = ({
  title = "Đã có lỗi xảy ra",
  message = "Không thể tải dữ liệu. Vui lòng thử lại.",
  onRetry,
  retryText = "Thử lại",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary"
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
