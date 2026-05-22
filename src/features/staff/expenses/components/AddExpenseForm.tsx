import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createExpenseMutationOptions } from "../mutationOptions";

export function AddExpenseForm() {
  const [type, setType] = useState<"CASH_IN" | "CASH_OUT">("CASH_OUT");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const mutation = useMutation(createExpenseMutationOptions);

  const descChars = description.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;
    mutation.mutate(
      { type, description: description.trim(), amount },
      {
        onSuccess: () => {
          setDescription("");
          setAmount("");
          setType("CASH_OUT");
        },
      },
    );
  };

  const canSubmit =
    description.trim().length > 0 && amount.length > 0 && Number(amount) > 0 && !mutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-(--light-gray) bg-(--pure-white) p-6">
      {type ==="CASH_IN" ? (
        <h2 className="mb-4 text-lg font-semibold text-(--deep-forest)">Add Cash In </h2>
      ):(
        <h2 className="mb-4 text-lg font-semibold text-(--deep-forest)">Add Cash Out</h2>
      )}
      

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-(--deep-forest)">Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("CASH_OUT")}
            className={cn(  
              "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
              type === "CASH_OUT"
                ? "border-(--deep-forest) bg-(--deep-forest) text-(--pale-yellow)"
                : "border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:border-(--medium-gray)",
            )}
          >
            <ArrowDownRight weight="bold" className="size-4" />
            Cash Out
          </button>
          <button
            type="button"
            onClick={() => setType("CASH_IN")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
              type === "CASH_IN"
                ? "border-(--deep-forest) bg-(--deep-forest) text-(--pale-yellow)"
                : "border-(--light-gray) bg-(--pure-white) text-(--medium-gray) hover:border-(--medium-gray)",
            )}
          >
            <ArrowUpRight weight="bold" className="size-4" />
            Cash In
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="desc" className="mb-1.5 block text-sm font-medium text-(--deep-forest)">
          Description
        </label>
        <Input
          id="desc"
          placeholder="What is this for?"
          value={description}
          onChange={(e) => {
            if (e.target.value.length <= 50) setDescription(e.target.value);
          }}
        />
        <p className={cn("mt-1 text-right text-xs", descChars >= 45 ? "text-(--error)" : "text-(--medium-gray)")}>
          {descChars} / 50
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-(--deep-forest)">
          Amount
        </label>
        <Input
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) setAmount(val);
          }}
        />
      </div>

      <Button type="submit" disabled={!canSubmit} className="w-full">
        {type === "CASH_IN" ? "Record Cash In" : "Record Cash Out"}
      </Button>
    </form>
  );
}
