import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import { X } from "lucide-react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 disabled:pointer-events-none disabled:opacity-45",
        {
          "bg-emerald-400 text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.15)] hover:bg-emerald-300":
            variant === "primary",
          "border border-white/15 bg-white/[0.08] text-slate-100 hover:border-white/20 hover:bg-white/[0.13]":
            variant === "secondary",
          "text-slate-300 hover:bg-white/[0.08] hover:text-white": variant === "ghost",
          "border border-red-400/20 bg-red-400/10 text-red-200 hover:bg-red-400/15":
            variant === "danger",
          "h-9 px-3 text-xs": size === "sm",
          "h-11 px-4 text-sm": size === "md",
          "h-13 px-6 text-base": size === "lg",
          "size-10 p-0": size === "icon",
        },
        className,
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.12] bg-[#0d1420] shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/15 bg-white/[0.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300",
        className,
      )}
      {...props}
    />
  );
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm data-[state=open]:animate-in" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[min(900px,calc(100vw-40px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/15 bg-[#0b121e] shadow-2xl outline-none",
            className,
          )}
        >
          <header className="flex items-start justify-between border-b border-white/[0.11] px-7 py-6">
            <div>
              <DialogPrimitive.Title className="text-lg font-semibold text-white">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="mt-1 text-sm text-slate-300">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close dialog">
                <X className="size-4" />
              </Button>
            </DialogPrimitive.Close>
          </header>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
