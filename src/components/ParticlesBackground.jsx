import { useEffect, useRef } from 'react';

export default function ParticlesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const mouse = { x: null, y: null, radius: 300 };

    const handleMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create particles with Z-depth mapping
    const particles = Array.from({ length: 85 }).map(() => {
      const size = Math.random() * 2 + 1.5;
      // Larger particles move faster (foreground), smaller are slower (background)
      const speedMultiplier = size * 0.1;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speedMultiplier,
        vy: (Math.random() - 0.5) * speedMultiplier,
        radius: size,
        color: Math.random() > 0.5 ? '#7fd9ff' : '#76f7bf' // cyan or teal
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Move particles
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges smoothly
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;

        // Mouse interaction (repulsion)
        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const forceDirectionX = dx / dist;
            const forceDirectionY = dy / dist;
            // gentle push away
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= forceDirectionX * force * 1.5;
            p.y -= forceDirectionY * force * 1.5;
          }
        }

        // Draw particle (Neon Glow)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.radius * 4; // bloom scales with depth
        ctx.shadowColor = p.color;
        ctx.fill();

        // Standard reset for lines and mouse effects so they don't blur overwhelmingly
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          // Connect if close enough
          const maxDistSq = 18000;
          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            // Smooth alpha fading based on distance
            const alpha = 1 - (dist / Math.sqrt(maxDistSq));

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);

            // Linear gradient for the line matches the two particle colors
            const grad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            const color1 = p.color === '#7fd9ff' ? `rgba(127, 217, 255, ${alpha * 0.6})` : `rgba(118, 247, 191, ${alpha * 0.6})`;
            const color2 = p2.color === '#7fd9ff' ? `rgba(127, 217, 255, ${alpha * 0.6})` : `rgba(118, 247, 191, ${alpha * 0.6})`;

            grad.addColorStop(0, color1);
            grad.addColorStop(1, color2);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Connect particles to mouse
        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 25000) {
            const dist = Math.sqrt(distSq);
            const alpha = 1 - (dist / Math.sqrt(25000));

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(127, 217, 255, ${alpha * 0.35})`;
            ctx.stroke();
          }
        }
      });

      // Subtle glowing radius around the mouse pointer itself
      if (mouse.x != null && mouse.y != null) {
        ctx.beginPath();
        const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        mouseGrad.addColorStop(0, 'rgba(127, 217, 255, 0.05)');
        mouseGrad.addColorStop(1, 'rgba(127, 217, 255, 0)');
        ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
        ctx.fillStyle = mouseGrad;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85,
      }}
      aria-hidden="true"
    />
  );
}
