function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
      <p className="text-sm text-red-400">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;