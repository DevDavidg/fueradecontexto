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
    "inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-colors h-10 px-4 py-2";
  const variants = {
    primary:
      "bg-black text-white hover:bg-neutral-800 focus-visible:ring-black",
    secondary:
      "bg-white text-black border border-neutral-200 hover:bg-neutral-100 focus-visible:ring-neutral-300",
    ghost:
      "bg-transparent text-black hover:bg-neutral-100 focus-visible:ring-neutral-300",
  } as const;
  const width = fullWidth ? "w-full" : "";
  return (
    <button
      className={clsx(base, variants[variant], width, className)}
      {...props}
    />
  );
};
