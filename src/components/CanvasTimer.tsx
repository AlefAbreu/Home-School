import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

interface CanvasTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  className?: string;
  isRunning?: boolean;
}

export const CanvasTimer: React.FC<CanvasTimerProps> = ({ 
  duration, 
  onComplete, 
  className,
  isRunning = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isRunning) return;
    
    // Set actual internal dimensions to match CSS dimensions for sharp rendering
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    const startTime = performance.now();
    const durationMs = duration * 1000;
    
    const render = (time: number) => {
      const elapsed = time - startTime;
      const remaining = Math.max(0, durationMs - elapsed);
      const progress = remaining / durationMs;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw background
      ctx.fillStyle = '#e2e8f0'; // slate-200
      ctx.fillRect(0, 0, width, height);
      
      // Draw progress bar
      ctx.fillStyle = progress > 0.3 ? '#3b82f6' : '#ef4444'; // blue-500 or red-500 if < 30%
      ctx.fillRect(0, 0, width * progress, height);
      
      if (remaining > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        onComplete();
      }
    };
    
    animationFrameId = requestAnimationFrame(render);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [duration, onComplete, isRunning]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={cn("w-full h-4 rounded-full overflow-hidden block", className)} 
    />
  );
};
