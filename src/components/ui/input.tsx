"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { clsx } from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  fullWidth?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, fullWidth = false, ...props },
  ref
) {
  const base =
    "h-10 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300";
  const width = fullWidth ? "w-full" : "";
  return (
    <input ref={ref} className={clsx(base, width, className)} {...props} />
  );
});
