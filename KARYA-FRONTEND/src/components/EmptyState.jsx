function EmptyState({
  title = "Nothing here yet",
  message = "There is no data to display.",
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
        <span className="text-xl text-slate-400">∅</span>
      </div>

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        {message}
      </p>
    </div>
  );
}

export default EmptyState;