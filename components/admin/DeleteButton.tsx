"use client";

export default function DeleteButton({
  action,
  label = "Delete",
  confirmMessage = "Are you sure? This cannot be undone.",
}: {
  action: () => void;
  label?: string;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="px-6 py-2.5 border border-terra text-terra font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-terra hover:text-paper transition-colors"
      >
        {label}
      </button>
    </form>
  );
}
