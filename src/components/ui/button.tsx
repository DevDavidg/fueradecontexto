"use client";

import { type ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

export const Button = ({
  className,
  variant = "primary",
  fullWidth = false,
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-cta focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors h-10 px-4 py-2";
  const variants = {
    primary:
      "bg-[#C2187A] text-white hover:bg-pink-700 focus-visible:ring-[#C2187A]",
    secondary:
      "bg-transparent text-[#ededed] border border-[#333333] hover:bg-[#1a1a1a] focus-visible:ring-neutral-700",
    ghost:
      "bg-transparent text-[#ededed] hover:bg-[#1a1a1a] focus-visible:ring-neutral-700",
  } as const;
  const width = fullWidth ? "w-full" : "";
  return (
    <button
      className={clsx(base, variants[variant], width, className)}
      {...props}
    />
  );
};
