"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";

interface CircularTextProps {
    text: string;
    spinDuration?: number;
    onHover?: "slowDown" | "speedUp" | "pause" | "goBonkers";
    className?: string;
    radius?: number;
}

const CircularText: React.FC<CircularTextProps> = ({
                                                       text,
                                                       spinDuration = 20,
                                                       onHover = "speedUp",
                                                       className = "",
                                                       radius = 45,
                                                   }) => {
    const letters = Array.from(text);
    const controls = useAnimation();
    const rotation = useMotionValue(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const start = rotation.get();
        controls.start({
            rotate: start + 360,
            transition: {
                ease: "linear",
                duration: spinDuration,
                repeat: Infinity,
            },
        });
    }, [mounted, spinDuration, controls, rotation]);

    const handleHoverStart = () => {
        const start = rotation.get();
        if (!onHover) return;

        let duration = spinDuration;
        switch (onHover) {
            case "slowDown":
                duration = spinDuration * 2;
                break;
            case "speedUp":
                duration = spinDuration / 4;
                break;
            case "pause":
                controls.stop();
                return;
            case "goBonkers":
                duration = spinDuration / 10;
                break;
            default:
                duration = spinDuration;
        }

        controls.start({
            rotate: start + 360,
            transition: {
                ease: "linear",
                duration: duration,
                repeat: Infinity,
            },
        });
    };

    const handleHoverEnd = () => {
        const start = rotation.get();
        controls.start({
            rotate: start + 360,
            transition: {
                ease: "linear",
                duration: spinDuration,
                repeat: Infinity,
            },
        });
    };

    if (!mounted) return null;

    return (
        <motion.div
            className={`absolute inset-0 h-full w-full ${className}`}
            style={{ rotate: rotation }}
            initial={{ rotate: 0 }}
            animate={controls}
            onMouseEnter={handleHoverStart}
            onMouseLeave={handleHoverEnd}
        >
            {letters.map((letter, i) => {
                const rotationDeg = (360 / letters.length) * i;
                const radians = (rotationDeg * Math.PI) / 180;
                const x = Math.cos(radians) * radius;
                const y = Math.sin(radians) * radius;

                return (
                    <span
                        key={i}
                        className="font-kinetika absolute text-[8px] tracking-wide text-white uppercase"
                        style={{
                            left: "50%",
                            top: "50%",
                            transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${
                                rotationDeg + 90
                            }deg)`,
                            transformOrigin: "center",
                            fontWeight: 850,
                        }}
                    >
            {letter}
          </span>
                );
            })}
        </motion.div>
    );
};

const PrizePoolCircle = () => {
    const text = "TOTAL PRIZE POOL • TOTAL PRIZE POOL • ";

    return (
        <div
            className="relative"
            style={{
                width: "106.52px",
                height: "108.41px",
                background: "#D9D9D91A",
                backdropFilter: "blur(51.37px)",
                borderRadius: "50%",
                position: "absolute",
                zIndex: 20,
                top: "23px",
                right: "100px",
                transform: "translate(40%, -40%)",
            }}
        >
            <CircularText
                text={text}
                spinDuration={15}
                onHover="speedUp"
                radius={45}
            />
            <div className="absolute inset-0 flex items-center justify-center">
        <span
            className="text-2xl font-bold text-white"
            style={{ transform: "rotate(-15.51deg)" }}
        >
          ₹5L+
        </span>
            </div>
        </div>
    );
};

export default PrizePoolCircle;