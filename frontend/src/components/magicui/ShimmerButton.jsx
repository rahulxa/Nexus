import React, { forwardRef } from "react";
import { cn } from "../../lib/Utils";

export const ShimmerButton = forwardRef(
    (
        {
            shimmerColor = "#ffffff",
            shimmerSize = "0.05em",
            shimmerDuration = "3s",
            borderRadius,
            roundedClass = "rounded-lg", // Default to rounded-lg if not provided
            background = "rgba(0, 0, 0, 1)",
            className,
            children,
            ...props
        },
        ref
    ) => {
        const borderRadiusClass = borderRadius ? `[border-radius:${borderRadius}]` : roundedClass;

        return (
            <button
                style={{
                    "--spread": "90deg",
                    "--shimmer-color": shimmerColor,
                    "--speed": shimmerDuration,
                    "--cut": shimmerSize,
                    "--bg": background,
                }}
                className={cn(
                    "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white [background:var(--bg)] dark:text-black",
                    borderRadiusClass,
                    "font-semibold", // Apply font-medium here
                    "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-[1px]",
                    className
                )}
                ref={ref}
                {...props}
            >
                {/* spark container */}
                <div
                    className={cn(
                        "-z-30 blur-[2px]",
                        "absolute inset-0 overflow-visible [container-type:size]"
                    )}
                >
                    {/* spark */}
                    <div className="absolute inset-0 h-[100cqh] animate-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
                        {/* spark before */}
                        <div className="animate-spin-around absolute inset-[-100%] w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
                    </div>
                </div>
                {children}

                {/* Highlight */}
                <div
                    className={cn(
                        "insert-0 absolute h-full w-full",
                        "px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
                        borderRadiusClass,
                        // transition
                        "transform-gpu transition-all duration-300 ease-in-out",
                        // on hover
                        "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
                        // on click
                        "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
                    )}
                />

                {/* backdrop */}
                <div
                    className={cn(
                        "absolute -z-20 [background:var(--bg)] [inset:var(--cut)]",
                        borderRadiusClass
                    )}
                />
            </button>
        );
    }
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;