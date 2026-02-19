import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./Tooltip.module.css";

interface Props {
  children: ReactNode;
  content: ReactNode;
  delay?: number;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  children,
  content,
  delay = 200,
  position = "top",
  className = "",
}: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const updatePosition = () => {
    const container = containerRef.current;
    const tooltip = tooltipRef.current;
    if (!container || !tooltip) return;

    const containerRect = container.getBoundingClientRect();
    const tooltipWidth = 300;
    const tooltipHeight = 150;
    const margin = 20;
    const padding = 10;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const spaceAbove = containerRect.top;
    const spaceBelow = screenHeight - containerRect.bottom;
    const spaceLeft = containerRect.left;
    const spaceRight = screenWidth - containerRect.right;

    let horizontalPos = "center";
    let verticalPos = "top";

    if (spaceBelow >= tooltipHeight + margin * 2) {
      verticalPos = "bottom";
    } else if (spaceAbove >= tooltipHeight + margin * 2) {
      verticalPos = "top";
    } else if (spaceBelow > spaceAbove) {
      verticalPos = "bottom";
    } else {
      verticalPos = "top";
    }

    if (spaceRight >= tooltipWidth + margin * 2) {
      horizontalPos = "left";
    } else if (spaceLeft >= tooltipWidth + margin * 2) {
      horizontalPos = "right";
    } else if (spaceRight > spaceLeft) {
      horizontalPos = "left";
    } else {
      horizontalPos = "right";
    }

    let top = 0;
    let left = 0;

    switch (verticalPos) {
      case "top":
        top = containerRect.top - tooltipHeight - margin + padding;
        break;
      case "bottom":
        top = containerRect.bottom + margin;
        break;
    }

    switch (horizontalPos) {
      case "left":
        left = Math.min(
          containerRect.left,
          screenWidth - tooltipWidth - margin
        );
        break;
      case "right":
        left = Math.max(
          containerRect.right - tooltipWidth,
          margin
        );
        break;
      case "center":
        left = containerRect.left + containerRect.width / 2 - tooltipWidth / 2;
        break;
    }

    if (top < margin) {
      top = margin;
    }
    if (top + tooltipHeight > screenHeight - margin) {
      top = screenHeight - tooltipHeight - margin;
    }
    if (left < margin) {
      left = margin;
    }
    if (left + tooltipWidth > screenWidth - margin) {
      left = screenWidth - tooltipWidth - margin;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  };

  const handleMouseEnter = () => {
    const id = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
    timeoutRef.current = id;
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      const handleResize = () => updatePosition();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
      </div>

      {isVisible && (
        <>
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(${position === "top" ? "8px" : "-8px"});
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes fadeInLeft {
              from {
                opacity: 0;
                transform: translateX(-8px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @keyframes fadeInRight {
              from {
                opacity: 0;
                transform: translateX(8px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
          <div
            ref={tooltipRef}
            className={styles.goaTooltip}
            style={{
              position: "fixed",
              zIndex: 9999,
              opacity: 0,
              transform: "translateY(0)",
              animation: "fadeIn 0.2s ease-out forwards",
              pointerEvents: "none",
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "6px",
              padding: "12px",
              maxWidth: "300px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              color: "#e0e0e0",
              fontSize: "13px",
              lineHeight: "1.4",
            }}
          >
            {content}
          </div>
        </>
      )}
    </>
  );
}
