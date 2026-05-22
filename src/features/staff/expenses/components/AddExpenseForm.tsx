import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createExpenseMutationOptions } from "../mutationOptions";
import { useAppForm } from "@/integrations/tanstack-form";
import { CreateExpenseSchema } from "../schemas/expense";

export function AddExpenseForm() {
  const mutation = useMutation(createExpenseMutationOptions);

  const form = useAppForm({
    defaultValues: {
      type: "CASH_OUT" as "CASH_IN" | "CASH_OUT",
      description: "",
      amount: "",
    },
    validators: {
      onSubmit: CreateExpenseSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6"
    >
      <form.AppField name="type">
        {(field) => (
          <>
            <h2 className="mb-4 text-lg font-semibold text-(--deep-forest)">
              {field.state.value === "CASH_IN" ? "Add Cash In" : "Add Cash Out"}
            </h2>

            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-(--deep-forest)">Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => field.handleChange("CASH_OUT")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                    field.state.value === "CASH_OUT"
                      ? "border-(--deep-forest) bg-(--deep-forest) text-(--pale-yellow)"
                      : "border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:border-(--medium-gray)",
                  )}
                >
                  <ArrowDownRight weight="bold" className="size-4" />
                  Cash Out
                </button>
                <button
                  type="button"
                  onClick={() => field.handleChange("CASH_IN")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                    field.state.value === "CASH_IN"
                      ? "border-(--deep-forest) bg-(--deep-forest) text-(--pale-yellow)"
                      : "border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:border-(--medium-gray)",
                  )}
                >
                  <ArrowUpRight weight="bold" className="size-4" />
                  Cash In
                </button>
              </div>
            </div>
          </>
        )}
      </form.AppField>

      <form.AppField name="description">
        {(field) => (
          <div className="mb-4">
            <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium text-(--deep-forest)">
              Description
            </label>
            <input
              id={field.name}
              placeholder="What is this for?"
              value={field.state.value}
              onChange={(e) => {
                if (e.target.value.length <= 50) field.handleChange(e.target.value);
              }}
              onBlur={field.handleBlur}
              className="flex h-10 w-full rounded-lg border border-(--light-gray) bg-(--pure-white) px-3 py-2 text-sm placeholder:text-(--medium-gray) focus:outline-none focus:ring-2 focus:ring-(--deep-forest)"
            />
            <p
              className={cn(
                "mt-1 text-right text-xs",
                field.state.value.length >= 45 ? "text-(--error)" : "text-(--medium-gray)",
              )}
            >
              {field.state.value.length} / 50
            </p>
          </div>
        )}
      </form.AppField>

      <form.AppField name="amount">
        {(field) => (
          <div className="mb-6">
            <label htmlFor={field.name} className="mb-1.5 block text-sm font-medium text-(--deep-forest)">
              Amount
            </label>
            <input
              id={field.name}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={field.state.value}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) field.handleChange(val);
              }}
              onBlur={field.handleBlur}
              className="flex h-10 w-full rounded-lg border border-(--light-gray) bg-(--pure-white) px-3 py-2 text-sm placeholder:text-(--medium-gray) focus:outline-none focus:ring-2 focus:ring-(--deep-forest)"
            />
          </div>
        )}
      </form.AppField>

      <form.AppForm>
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
            type: state.values.type,
          })}
        >
          {({ canSubmit, isSubmitting, type }) => (
            <Button type="submit" disabled={!canSubmit} className="w-full">
              {isSubmitting
                ? "Saving..."
                : type === "CASH_IN"
                  ? "Record Cash In"
                  : "Record Cash Out"}
            </Button>
          )}
        </form.Subscribe>
      </form.AppForm>
    </form>
  );
}
