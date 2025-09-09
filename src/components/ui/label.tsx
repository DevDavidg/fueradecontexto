import { type HTMLAttributes, type LabelHTMLAttributes } from "react";
import { clsx } from "clsx";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ className, htmlFor, ...props }: LabelProps) => {
  if (!htmlFor) {
    return (
      <span
        className={clsx("text-sm text-neutral-700", className)}
        {...(props as Omit<HTMLAttributes<HTMLSpanElement>, "htmlFor">)}
      />
    );
  }
  return (
    <label
      className={clsx("text-sm text-neutral-700", className)}
      htmlFor={htmlFor}
      {...props}
    />
  );
};
