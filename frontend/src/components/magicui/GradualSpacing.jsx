"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
};

const GradualSpacing = ({
    children,
    duration = 0.5,
    delayMultiple = 0.1,
    framerProps = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    },
    className,
}) => {
    return (
        <div className="flex justify-center space-x-1">
            <AnimatePresence>
                {React.Children.map(children, (child, i) => (
                    <motion.div
                        key={i}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={framerProps}
                        transition={{ duration, delay: i * delayMultiple, ease: "easeOut" }}
                        className={cn("drop-shadow-sm", className)}
                    >
                        {child}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default GradualSpacing;
