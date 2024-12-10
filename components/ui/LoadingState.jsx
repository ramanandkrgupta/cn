export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <div className="loading loading-spinner loading-lg text-primary"></div>
      <p className="mt-4 text-sm text-gray-500">{message}</p>
    </div>
  );
} 