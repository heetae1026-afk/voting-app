"use server";

import { redirect } from "next/navigation";
import { isOperatorTokenConfigured, safeReturnPath, signInOperator, signOutOperator } from "@/lib/auth/operator";

export interface SignInState {
  error?: "wrong-token" | "not-configured";
}

export async function signInAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  if (!isOperatorTokenConfigured()) return { error: "not-configured" };
  if (!(await signInOperator(String(formData.get("token") ?? "")))) return { error: "wrong-token" };
  redirect(safeReturnPath(formData.get("next")));
}

export async function signOutAction(): Promise<void> {
  await signOutOperator();
  redirect("/operator/login");
}
