export default function LoadingIndicator({ message = 'Đang tải...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      <p className="mt-3 text-gray-600 text-sm">{message}</p>
    </div>
  );
}
