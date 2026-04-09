import { useEffect, useRef } from 'react';

export function DigitalRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.clientWidth || 800;
    let height = canvas.height = canvas.parentElement?.clientHeight || 600;

    const columns = Math.floor(width / 20);
    const drops: number[] = new Array(columns).fill(0);

    const charSet = "0123456789ABCDEFHIJKLMNOPQRSTUVWXYZ@#$%^&*()";

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 15, 28, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#3b82f633'; // Cyber Blue with transparency
      ctx.font = '14px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = charSet[Math.floor(Math.random() * charSet.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" />;
}
