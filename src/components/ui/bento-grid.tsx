"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ---------------- GRID ---------------- */
const gridStyles = cva("mx-auto", {
    variants: {
        variant: {
            default: "grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
            wide: "grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[16rem] md:grid-cols-4",
            dense:
                "grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[12rem] md:grid-cols-6 md:grid-flow-row-dense",
            masonry: "max-w-7xl columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4",
            auto: "grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-min md:grid-cols-3",
        },
        gap: {
            sm: "gap-2",
            md: "gap-4",
            lg: "gap-8",
        },
        maxWidth: {
            sm: "max-w-3xl",
            md: "max-w-5xl",
            lg: "max-w-7xl",
            full: "max-w-full",
        },
    },
    defaultVariants: {
        variant: "default",
        gap: "md",
        maxWidth: "lg",
    },
});

export interface BentoGridProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
        VariantProps<typeof gridStyles> {}

export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
    ({ children, className, variant, gap, maxWidth, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(gridStyles({ variant, gap, maxWidth }), className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

BentoGrid.displayName = "BentoGrid";

/* ---------------- ITEM ---------------- */
/**
 * base classes intentionally use shadcn-style tokens so ThemeProvider
 * (the one que você mostrou) estilize automaticamente:
 * - bg-card, text-card-foreground, border-border, text-muted-foreground, etc.
 *
 * break-inside-avoid + inline-block + mb-4 são importantes para masonry variant.
 */
const itemStyles = cva(
    "group/bento shadow-input flex flex-col justify-between space-y-4 rounded-xl border border-border bg-card text-card-foreground p-4 transition duration-200 inline-block w-full break-inside-avoid mb-4",
    {
        variants: {
            size: {
                sm: "h-40 md:h-auto md:row-span-1",
                md: "h-60 md:h-auto md:row-span-1",
                lg: "h-96 md:h-auto md:row-span-2",
                auto: "h-auto",
            },
            hoverEffect: {
                none: "transition",
                lift: "transition transform hover:-translate-y-1 hover:shadow-xl",
                float: "transition transform hover:translate-x-2 hover:scale-[1.02] hover:shadow-2xl",
            },
        },
        defaultVariants: {
            size: "md",
            hoverEffect: "lift",
        },
    }
);

/**
 * Omit DOM 'title' para permitir ReactNode `title`.
 */
export interface BentoGridItemProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
        VariantProps<typeof itemStyles> {
    title?: React.ReactNode;
    description?: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    icon?: React.ReactNode;
    /**
     * Quando true, o item passa a ser guiado pelo conteúdo (bom para Grid variant="auto" ou masonry)
     */
    autoRow?: boolean;
}

export const BentoGridItem = React.forwardRef<HTMLDivElement, BentoGridItemProps>(
    (
        {
            title,
            description,
            header,
            footer,
            icon,
            className,
            size,
            hoverEffect,
            autoRow,
            children,
            ...props
        },
        ref
    ) => {
        const autoRowClass = autoRow ? "h-auto md:row-span-1" : "";

        return (
            <article
                ref={ref}
                className={cn(itemStyles({ size, hoverEffect }), autoRowClass, className)}
                {...props}
            >
                {header}

                <div className="transition duration-200 group-hover/bento:translate-x-2">
                    {icon}

                    <div className="mt-2 mb-2 font-sans font-bold text-card-foreground">
                        {title}
                    </div>

                    <div className="font-sans text-xs font-normal text-muted-foreground">
                        {description}
                    </div>

                    {/* children permite <Image /> ou qualquer nó dentro do card */}
                    {children}
                </div>

                {footer ? <div className="mt-3 text-sm">{footer}</div> : null}
            </article>
        );
    }
);

BentoGridItem.displayName = "BentoGridItem";
