"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  children: React.ReactNode;
  tiltEnabled?: boolean;
  shineEnabled?: boolean;
  tiltMaxAngle?: number;
  shineOpacityMax?: number;
}

export function TiltCard({
  children,
  className,
  tiltEnabled = true,
  shineEnabled = true,
  tiltMaxAngle = 8,
  shineOpacityMax = 0.2,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const isHovered = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springHover = useSpring(isHovered, springConfig);

  const rotateX = useTransform(springY, [0, 1], [tiltMaxAngle, -tiltMaxAngle]);
  const rotateY = useTransform(springX, [0, 1], [-tiltMaxAngle, tiltMaxAngle]);

  const shineOpacity = useTransform(springHover, [0, 1], [0, shineOpacityMax]);

  // Convert 0-1 to percentage 0-100 for the gradient position
  const percentageX = useTransform(springX, [0, 1], [0, 100]);
  const percentageY = useTransform(springY, [0, 1], [0, 100]);

  const background = useMotionTemplate`radial-gradient(circle at ${percentageX}% ${percentageY}%, rgba(255,255,255,0.8) 0%, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseEnter = () => {
    isHovered.set(1);
  };

  const handleMouseLeave = () => {
    isHovered.set(0);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX: tiltEnabled ? rotateX : 0,
        rotateY: tiltEnabled ? rotateY : 0,
      }}
      className={cn("relative transition-colors", className)}
      {...props}
    >
      {children}
      {shineEnabled && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 rounded-[inherit] mix-blend-overlay"
          style={{
            opacity: shineOpacity,
            background,
          }}
        />
      )}
    </motion.div>
  );
}
