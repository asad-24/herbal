"use client";

import { startTransition, useActionState, type ReactNode } from "react";

export type ProductFormState = { error: string };

export function AdminProductForm({ action, children, editing, saved }: {
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  children: ReactNode;
  editing: boolean;
  saved: boolean;
}) {
  const [state, dispatch, pending] = useActionState(action, { error: "" });

  return (
    <form
      className="mt-6 rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        // Dispatch manually so validation failures preserve all entered fields and the photo.
        const formData = new FormData(event.currentTarget);
        startTransition(() => dispatch(formData));
      }}
      aria-busy={pending}
    >
      <fieldset disabled={pending} className="min-w-0 disabled:opacity-70">
        {children}
        {state.error && <p role="alert" className="mt-4 text-sm text-red-700">{state.error}</p>}
        {saved && !state.error && <p role="status" className="mt-4 text-sm text-emerald-800">Product saved successfully.</p>}
        <button type="submit" className="btn-primary mt-5 disabled:cursor-wait" disabled={pending}>
          {pending ? "Saving product…" : editing ? "Save product" : "Create product"}
        </button>
      </fieldset>
    </form>
  );
}
