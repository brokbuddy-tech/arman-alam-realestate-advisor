"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface InfiniteSliderProps {
  children: React.ReactNode;
  direction?: "horizontal" | "vertical";
  speed?: number;
  speedOnHover?: number;
  className?: string;
}

export function InfiniteSlider({
  children,
  direction = "horizontal",
  speed = 30,
  speedOnHover = 15,
  className,
}: InfiniteSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentSize, setContentSize] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const pos = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      const element = containerRef.current.children[0] as HTMLElement;
      if (element) {
        // use ResizeObserver for more robust sizing
        const observer = new ResizeObserver((entries) => {
          setContentSize(direction === "vertical" ? element.offsetHeight : element.offsetWidth);
        });
        observer.observe(element);
        return () => observer.disconnect();
      }
    }
  }, [direction, children]);

  useAnimationFrame((t, delta) => {
    if (contentSize === 0) return;
    
    const currentSpeed = isHovered ? speedOnHover : speed;
    const moveBy = (currentSpeed * delta) / 1000;
    
    let newPos = pos.get() - moveBy;
    
    if (newPos <= -contentSize) {
      newPos += contentSize;
    }
    
    pos.set(newPos);
  });

  const isVertical = direction === "vertical";

  return (
    <div 
      className={cn("overflow-hidden h-full flex flex-col", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        maskImage: isVertical ? 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' : 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: isVertical ? 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' : 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
      }}
    >
      <motion.div 
        ref={containerRef}
        style={isVertical ? { y: pos } : { x: pos }}
        className={cn(
          "flex",
          isVertical ? "flex-col" : "flex-row"
        )}
      >
        <div className={cn("flex shrink-0", isVertical ? "flex-col gap-6 mb-6" : "flex-row gap-6 mr-6")}>
          {children}
        </div>
        <div className={cn("flex shrink-0", isVertical ? "flex-col gap-6 mb-6" : "flex-row gap-6 mr-6")}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
