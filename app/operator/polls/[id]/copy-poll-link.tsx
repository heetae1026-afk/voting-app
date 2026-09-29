"use client";

import { useRef, useState } from "react";

/** Poll link를 보여주고 복사한다. */
export function CopyPollLink({ url }: { url: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  async function copy() {
    try {
      // HTTPS가 아닌 주소(예: LAN IP)에서는 navigator.clipboard가 없다.
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      inputRef.current?.select();
      setStatus("manual");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          ref={inputRef}
          readOnly
          value={url}
          aria-label="투표 링크"
          onFocus={(e) => e.target.select()}
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="button"
          onClick={copy}
          className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          {status === "copied" ? "복사됨" : "링크 복사"}
        </button>
      </div>
      {status === "manual" && (
        <p role="status" className="text-sm text-zinc-500">
          자동 복사가 안 되는 환경입니다. 선택된 링크를 직접 복사해 주세요.
        </p>
      )}
    </div>
  );
}
