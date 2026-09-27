function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-lime-500" />

        <p className="text-sm text-slate-400">
          {text}
        </p>
      </div>
    </div>
  );
}

export default LoadingSpinner;