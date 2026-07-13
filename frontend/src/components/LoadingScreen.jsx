export default function LoadingScreen() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-3 bg-white px-4"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#006948]" />
      <p className="text-sm font-medium text-[#6B7280]">Loading...</p>
    </div>
  );
}