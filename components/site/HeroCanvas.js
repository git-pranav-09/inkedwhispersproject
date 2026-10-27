'use client';

import { useEffect, useRef } from 'react';

/**
 * Floating golden dust. Lightweight 2D canvas, paused when off-screen or when
 * the tab is hidden, and rendered as a single still frame for reduced motion.
 */
export default function HeroCanvas({ density = 70 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let particles = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(density * Math.min(1, w / 1400) + 18);
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: Math.random() * 1.6 + 0.3,
      vy: Math.random() * 0.22 + 0.05,
      vx: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.6 + 0.15,
      t: Math.random() * Math.PI * 2,
    });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.t += 0.012;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.t));
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(244, 211, 94, ${alpha})`);
        g.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      if (!running) return;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.vy;
        p.x += p.vx + Math.sin(p.t) * 0.05;
        if (p.y < -10 || p.x < -10 || p.x > w + 10) particles[i] = spawn(false);
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    resize();
    if (reduce) {
      draw();
    } else {
      raf = requestAnimationFrame(step);
    }

    const io = new IntersectionObserver(([entry]) => {
      if (reduce) return;
      running = entry.isIntersecting && !document.hidden;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(step);
    });
    io.observe(canvas);

    const onVis = () => {
      if (reduce) return;
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(step);
    };
    document.addEventListener('visibilitychange', onVis);

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduce) draw();
      }, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onResize);
    };
  }, [density]);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
