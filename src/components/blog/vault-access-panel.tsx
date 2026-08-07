"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, LoaderCircle, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/use-language";

type VaultAccessPanelProps = {
  configured: boolean;
  className?: string;
};

export function VaultAccessPanel({
  configured,
  className = "",
}: VaultAccessPanelProps) {
  const { lang } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/blog/vault/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError(
          response.status === 401
            ? lang({ en: "The password is incorrect.", vi: "Mật khẩu không đúng." })
            : lang({
                en: "Private Vault is temporarily unavailable.",
                vi: "Góc riêng hiện tạm thời không khả dụng.",
              }),
        );
        return;
      }

      setPassword("");
      router.refresh();
    } catch {
      setError(
        lang({
          en: "Unable to unlock Private Vault. Please try again.",
          vi: "Không thể mở Góc riêng. Vui lòng thử lại.",
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/70 ${className}`}
    >
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-teal-200 bg-teal-50 text-teal-600 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-300">
        <LockKeyhole aria-hidden="true" className="h-5 w-5" />
      </span>
      <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-slate-50">
        {lang({ en: "Private Vault", vi: "Góc riêng" })}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {configured
          ? lang({
              en: "Enter the password to view these private notes.",
              vi: "Nhập mật khẩu để xem các ghi chép riêng tư.",
            })
          : lang({
              en: "Private Vault is not configured yet.",
              vi: "Góc riêng chưa được cấu hình.",
            })}
      </p>

      {configured ? (
        <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-sm">
          <label className="block text-left">
            <span className="sr-only">
              {lang({ en: "Vault password", vi: "Mật khẩu Góc riêng" })}
            </span>
            <span className="relative block">
              <KeyRound
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                disabled={submitting}
                placeholder={lang({ en: "Password", vi: "Mật khẩu" })}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition-[border-color,box-shadow] placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </span>
          </label>
          {error ? (
            <p role="alert" className="mt-2 text-left text-sm text-rose-600 dark:text-rose-400">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting || password.length === 0}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 text-sm font-bold text-white transition-colors hover:bg-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-950"
          >
            {submitting ? (
              <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <LockKeyhole aria-hidden="true" className="h-4 w-4" />
            )}
            {lang({ en: "Unlock", vi: "Mở khóa" })}
          </button>
        </form>
      ) : null}
    </div>
  );
}
