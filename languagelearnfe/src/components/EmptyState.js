/**
 * EmptyState Component - Reusable empty state display
 * Usage: <EmptyState title="No data" message="Start by..." actionLabel="Create" onAction={() => {}} />
 */
const EmptyState = ({
  title = "Chưa có dữ liệu",
  message = "Bắt đầu bằng cách thêm mục mới.",
  icon = "📭",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-300 text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
