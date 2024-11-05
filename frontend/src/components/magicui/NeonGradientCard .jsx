"use client";

import React from "react";
import { cn } from "../../lib/Utils";

const NeonGradientCard = ({
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={cn(
                "relative group h-full w-full transition-all duration-300",
                className
            )}
            {...props}
        >
            {/* Multiple glow layers for stronger effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Outer glow */}
                <div className="absolute -inset-2 rounded-[25px] bg-cyan-900 blur-[30px] opacity-40" />
                {/* Middle glow */}
                <div className="absolute -inset-1 rounded-[22px] bg-cyan-900 blur-[20px] opacity-40" />
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-[20px] bg-cyan-900 blur-[10px] opacity-40" />
                {/* Bright border */}
                <div className="absolute inset-0 rounded-[20px] bg-gradient-to-r from-cyan-700 to-cyan-700 opacity-90" />
            </div>

            {/* Content */}
            <div className="relative h-full bg-gray-900/90 backdrop-blur-sm rounded-[20px] p-6 z-10 transition-transform duration-300 group-hover:scale-[0.99]">
                {children}
            </div>
        </div>
    );
};

export default NeonGradientCard;