import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * SiteHeader – a flexible header with three layout slots: start, center, end.
 *
 * Usage:
 *   <SiteHeader>
 *     <SiteHeaderSection align="start">
 *       <Logo />
 *     </SiteHeaderSection>
 *     <SiteHeaderSection align="center">
 *       <Nav />
 *     </SiteHeaderSection>
 *     <SiteHeaderSection align="end">
 *       <UserMenu />
 *     </SiteHeaderSection>
 *   </SiteHeader>
 *
 * You can also use the compound helper components:
 *   <SiteHeader.Start>  → shorthand for <SiteHeaderSection align="start">
 *   <SiteHeader.Center> → shorthand for <SiteHeaderSection align="center">
 *   <SiteHeader.End>    → shorthand for <SiteHeaderSection align="end">
 * ────────────────────────────────────────────────────────────────────────── */

// ─── Header Variants ─────────────────────────────────────────────────────────

const headerVariants = cva(
  "sticky top-0 z-50 flex w-full items-center border-b bg-background/80 backdrop-blur-lg transition-colors",
  {
    variants: {
      size: {
        sm: "h-12 px-4",
        default: "h-14 px-4 md:px-6",
        lg: "h-16 px-6 md:px-8",
      },
      variant: {
        default: "border-border",
        transparent: "border-transparent bg-transparent backdrop-blur-none",
        floating:
          "mx-auto mt-3 max-w-7xl rounded-xl border border-border/50 bg-background/70 shadow-sm",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

// ─── Section Variants ────────────────────────────────────────────────────────

const sectionVariants = cva("flex items-center gap-2", {
  variants: {
    align: {
      start: "mr-auto justify-start",
      center: "absolute left-1/2 -translate-x-1/2 justify-center",
      end: "ml-auto justify-end",
    },
  },
  defaultVariants: {
    align: "start",
  },
});

// ─── SiteHeader ──────────────────────────────────────────────────────────────

export interface SiteHeaderProps
  extends React.ComponentProps<"header">, VariantProps<typeof headerVariants> {
  /** Render as a child component for composition  */
  asChild?: boolean;
}

function SiteHeaderRoot({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: SiteHeaderProps) {
  const Comp = asChild ? Slot.Root : "header";

  return (
    <Comp
      data-slot="site-header"
      className={cn(headerVariants({ variant, size, className }))}
      {...props}
    >
      <div className="relative mx-auto flex w-full max-w-9xl items-center">
        {props.children}
      </div>
    </Comp>
  );
}

// ─── SiteHeaderSection ───────────────────────────────────────────────────────

export interface SiteHeaderSectionProps
  extends React.ComponentProps<"div">, VariantProps<typeof sectionVariants> {
  asChild?: boolean;
}

function SiteHeaderSection({
  className,
  align,
  asChild = false,
  ...props
}: SiteHeaderSectionProps) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      data-slot="site-header-section"
      data-align={align}
      className={cn(sectionVariants({ align, className }))}
      {...props}
    />
  );
}

// ─── Compound Shorthands ─────────────────────────────────────────────────────

function SiteHeaderStart({
  className,
  ...props
}: Omit<SiteHeaderSectionProps, "align">) {
  return <SiteHeaderSection align="start" className={className} {...props} />;
}

function SiteHeaderCenter({
  className,
  ...props
}: Omit<SiteHeaderSectionProps, "align">) {
  return <SiteHeaderSection align="center" className={className} {...props} />;
}

function SiteHeaderEnd({
  className,
  ...props
}: Omit<SiteHeaderSectionProps, "align">) {
  return <SiteHeaderSection align="end" className={className} {...props} />;
}

// ─── Assign compound components ──────────────────────────────────────────────

const SiteHeader = Object.assign(SiteHeaderRoot, {
  Section: SiteHeaderSection,
  Start: SiteHeaderStart,
  Center: SiteHeaderCenter,
  End: SiteHeaderEnd,
});

export {
  SiteHeader,
  SiteHeaderSection,
  SiteHeaderStart,
  SiteHeaderCenter,
  SiteHeaderEnd,
  headerVariants,
  sectionVariants,
};
