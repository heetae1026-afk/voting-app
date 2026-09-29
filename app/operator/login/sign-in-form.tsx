"use client";

import { useActionState } from "react";
import { signInAction, type SignInState } from "../auth-actions";

const ERROR_MESSAGES: Record<NonNullable<SignInState["error"]>, string> = {
  "wrong-token": "운영자 토큰이 맞지 않습니다.",
  "not-configured": "서버에 운영자 토큰(OPERATOR_TOKEN)이 설정되지 않아 로그인할 수 없습니다.",
};

export function SignInForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signInAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}
      <label className="flex flex-col gap-2">
        <span className="font-medium">운영자 토큰</span>
        <input
          type="password"
          name="token"
          required
          autoComplete="current-password"
          className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>
      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-red-700 dark:bg-red-950 dark:text-red-300">
          {ERROR_MESSAGES[state.error]}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
