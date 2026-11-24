import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: ContainerProps) {
  const classes = ["page-shell", className].filter(Boolean).join(" ");

  return <div className={classes} {...props} />;
}
