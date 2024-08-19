"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/Utils";

const animationProps = {
    initial: { "--x": "100%" },
    animate: { "--x": "-100%" },
    transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 3,
        ease: "linear",
    },
};

const ShinyButton = ({ text = "shiny-button", className = "font-semibold", children }) => {
    return (
        <motion.button
            {...animationProps}
            className={cn(
                "relative rounded-lg px-6 py-2 backdrop-blur-xl transition-[box-shadow, background] duration-300 ease-in-out hover:shadow-xl",
                "bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)]",
                "hover:bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/30%)_0%,transparent_60%)]", // Enhanced background on hover
                "hover:shadow-[0_0_40px_hsl(var(--primary)/30%)]", // Increased shadow size and brightness
                className
            )}
        >
            <span
                className={cn(
                    "relative flex items-center justify-center h-full w-full text-sm tracking-wide text-[rgb(0,0,0,65%)] dark:font-light dark:text-[rgb(255,255,255,90%)]",
                    className
                )}
                style={{
                    maskImage: "linear-gradient(-75deg, hsl(var(--primary)) calc(var(--x) + 20%), transparent calc(var(--x) + 30%), hsl(var(--primary)) calc(var(--x) + 100%))",
                }}
            >
                {text}
                {children && <span className="ml-2">{children}</span>}
            </span>
            <motion.span
                className="absolute inset-0 z-10 block rounded-[inherit] p-0.5"
                style={{
                    background: "linear-gradient(-75deg, hsl(var(--primary)/10%) calc(var(--x) + 20%), hsl(var(--primary)/50%) calc(var(--x) + 25%), hsl(var(--primary)/10%) calc(var(--x) + 100%))",
                    mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
                    maskComposite: "exclude",
                }}
            />
        </motion.button>
    );
};

export default ShinyButton;
