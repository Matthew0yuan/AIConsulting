import { useEffect, useRef } from 'react';

export default function ParticlesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    /* ── RESPONSIVE CONFIG ──────────────────────── */
    const getConfig = () => {
      const w = window.innerWidth;
      if (w >= 1200) {
        return { cell: 50, bubbleR: 400, revealR: 600 };
      } else if (w >= 720) {
        return { cell: 40, bubbleR: 250, revealR: 420 };
      } else {
        return { cell: 30, bubbleR: 180, revealR: 280 };
      }
    };

    let CFG = getConfig();

    // Brand colors (Original)
    const COLOR_TEAL = [118, 247, 191];
    const COLOR_CYAN = [127, 217, 255];
    const COLOR_BLUE = [78, 161, 255];

    // Easing
    const EASE_IN = 0.06;
    const EASE_OUT = 0.04;
    const EASE_ANGLE = 0.10;

    // ── FLUID FLOW NOISE ──────────────────────────
    // Layered sine waves give each dot a smooth, organic drift
    const FLOW_AMP = 6;     // max px drift from home position
    const FLOW_FREQ = 0.002;  // very low = huge swirl regions (groups move together)
    const FLOW_FREQ2 = 0.0003;  // second layer, also low for coherent motion
    const FLOW_SPEED = 0.4;    // temporal speed
    const FLOW_SPEED2 = 0.25;   // second layer speed

    /* ── MOUSE STATE ───────────────────────────── */
    const actualMouse = { x: -1000, y: -1000 };
    const mouse = { x: -1000, y: -1000 };
    let hasMouse = false;
    let lastMoveTime = 0;
    let currentIdleFactor = 0;

    const onMove = (e) => {
      actualMouse.x = e.clientX;
      actualMouse.y = e.clientY;
      if (!hasMouse) {
        // Snap instantly the very first time they touch the canvas
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
      hasMouse = true;
      lastMoveTime = performance.now();
    };
    const onOut = () => { hasMouse = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onOut);

    /* ── GRID ───────────────────────────────────── */
    let dots = [];

    const buildGrid = () => {
      CFG = getConfig();
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const oldDots = dots;
      dots = [];
      const cols = Math.ceil(w / CFG.cell) + 1;
      const rows = Math.ceil(h / CFG.cell) + 1;
      const offsetX = (w - (cols - 1) * CFG.cell) / 2;
      const offsetY = (h - (rows - 1) * CFG.cell) / 2;

      let idx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const jiggleX = (Math.random() - 0.5) * 6;
          const jiggleY = (Math.random() - 0.5) * 6;
          const old = oldDots[idx];
          dots.push({
            // Home position on grid
            x: offsetX + c * CFG.cell + jiggleX,
            y: offsetY + r * CFG.cell + jiggleY,
            seed: old ? old.seed : Math.random() * Math.PI * 2,
            seedB: old ? old.seedB : Math.random() * 100,
            scale: old ? old.scale : 0,
            angle: old ? old.angle : Math.random() * Math.PI * 2,
            aLen: old ? old.aLen : 0,
            aWid: old ? old.aWid : 0,
          });
          idx++;
        }
      }
    };

    buildGrid();

    // Debounce resize to avoid excessive grid rebuilds and GC pressure
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildGrid, 150);
    };
    window.addEventListener('resize', onResize);

    /* ── HELPERS ──────────────────────────────── */
    const lerp = (a, b, t) => a + (b - a) * t;

    const lerpColor = (a, b, t) => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];

    const angleDiff = (from, to) => Math.atan2(Math.sin(to - from), Math.cos(to - from));

    const smoothstep = (x) => x * x * (3 - 2 * x);

    /* ── RENDER ──────────────────────────────────── */
    const render = (time) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const t = time * 0.001;
      const now = performance.now();

      if (hasMouse) {
        // ── RUBBER-BANDING LAG DELAY ──
        const dxMatch = actualMouse.x - mouse.x;
        const dyMatch = actualMouse.y - mouse.y;
        const distFromMouse = Math.sqrt(dxMatch * dxMatch + dyMatch * dyMatch);

        // Base trail speed (very lazy and smooth)
        let lagFactor = 0.02; // Reduced from 0.04

        // If the bubble falls more than 30 pixels behind, exponentially increase speed to rubber-band it forward!
        if (distFromMouse > 30) {
          // Maxes out at 0.20 (slower catch-up) and accelerates much more gently (0.001)
          lagFactor = Math.min(0.20, 0.02 + (distFromMouse - 30) * 0.001);
        }

        mouse.x += dxMatch * lagFactor;
        mouse.y += dyMatch * lagFactor;
      }

      // Target idle factor based on time since moved
      const timeSinceMove = now - lastMoveTime;
      const idleT = Math.min(1, Math.max(0, (timeSinceMove - 100) / 1000));
      const targetIdleFactor = smoothstep(idleT);

      // Smoothly ease currentIdleFactor toward target
      // This ensures coming BACK to the cursor from a wander is smooth, not an instant snap
      currentIdleFactor += (targetIdleFactor - currentIdleFactor) * 0.005;

      // Huge wander area when fully idle, exactly on cursor when moving
      const wanderX1 = Math.sin(t * 1.8) * 50 * currentIdleFactor;
      const wanderX2 = Math.sin(t * 1.2) * 200 * currentIdleFactor;
      const wanderY1 = Math.cos(t * 1.5) * 50 * currentIdleFactor;
      const wanderY2 = Math.cos(t * 1.4) * 200 * currentIdleFactor;

      const mx = hasMouse ? mouse.x + wanderX1 + wanderX2 : mouse.x;
      const my = hasMouse ? mouse.y + wanderY1 + wanderY2 : mouse.y;

      ctx.lineCap = 'round';

      const { bubbleR: baseBubbleR, revealR: baseRevealR } = CFG;

      // ── HEARTBEAT PULSE ──────────────────────────
      // Sharp rhythmic pulse: "lub-dub" feel
      const beatPhase = t * 2.0;
      const pulse = Math.pow((Math.sin(beatPhase) + 1) / 2, 8) * 0.3 + //the last number for rate of expansion
        Math.pow((Math.sin(beatPhase - 0.4) + 1) / 2, 0.5) * 0.08;

      const bubbleR = baseBubbleR * (1 + pulse);
      const revealR = baseRevealR * (1 + pulse);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // ── FLUID POSITION OFFSET ───────────────────
        // Two layers of sine/cos waves create organic, non-repeating drift
        // Nearby dots get similar offsets → coherent flow patterns
        const flowX = Math.sin(d.x * FLOW_FREQ + t * FLOW_SPEED + d.seed) * FLOW_AMP
          + Math.sin(d.y * FLOW_FREQ2 - t * FLOW_SPEED2 + d.seedB) * (FLOW_AMP * 0.6);

        const flowY = Math.cos(d.y * FLOW_FREQ + t * FLOW_SPEED + d.seed) * FLOW_AMP
          + Math.cos(d.x * FLOW_FREQ2 + t * FLOW_SPEED2 + d.seedB) * (FLOW_AMP * 0.6);

        // Effective position = home + fluid drift
        let px = d.x + flowX;
        let py = d.y + flowY;

        let targetScale = 0;
        let targetAngle = d.angle;
        let targetLen = 0;
        let targetWid = 0;

        if (hasMouse) {
          const dx = mx - px;
          const dy = my - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radialAngle = Math.atan2(dy, dx);

          // ── REPULSION WAVE EFFECT ──
          // Push each particle toward the wall distance so they all pile up
          const wallDist = bubbleR * 1.05;
          if (dist < wallDist) {
            // Push 45% of the way to the wall → visible compression without collapsing
            const pushAmount = (wallDist - dist) * 0.4;
            px -= Math.cos(radialAngle) * pushAmount;
            py -= Math.sin(radialAngle) * pushAmount;
          }

          // Recalculate distance & angle after repulsion
          const dx2 = mx - px;
          const dy2 = my - py;
          const newDist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          const newRadialAngle = Math.atan2(dy2, dx2);

          // Fluid edge: amoeba-like bubble boundary
          const fluidAmp = bubbleR * 0.05;
          const dynamicBubbleR = bubbleR
            + Math.sin(radialAngle * 3 + t * 0.9) * fluidAmp
            + Math.sin(radialAngle * 5 - t * 0.6) * (fluidAmp * 0.8);

          // Use ORIGINAL distance for zone shapes (not post-repulsion)
          // With repulsion, inner particles land at outer ring → dot-dash-dot from cursor outward
          if (dist < revealR) {
            const wobble = Math.sin(t * 1.4 + d.seed) * 0.10;
            targetAngle = newRadialAngle + wobble;

            const nd = dist / dynamicBubbleR;

            if (dist < dynamicBubbleR) {
              if (nd < 0.45) {
                // Zone 1: Originally inner → pushed to outer ring → small dots
                targetLen = 0.5;
                targetWid = 1.2;
                targetScale = 0.45;
              } else if (nd < 0.85) {
                // Zone 2: Middle ring → dashes
                const zoneT = (nd - 0.45) / 0.40;
                const edgeT = smoothstep(zoneT);
                targetLen = lerp(0.5, 4.5, edgeT);
                targetWid = lerp(1.2, 3.5, edgeT);
                targetScale = lerp(0.45, 1.0, edgeT);
              } else {
                // Zone 3: Originally outer → barely pushed → closest to cursor → tiny dots
                const zoneT = (nd - 0.85) / 0.15;
                const edgeT = smoothstep(zoneT);
                targetLen = lerp(4.5, 0, edgeT);
                targetWid = lerp(2.5, 0.6, edgeT);
                targetScale = lerp(0.90, 0.45, edgeT);
              }
            } else {
              // Zone 4: Outside bubble
              const falloff = 1 - (dist - dynamicBubbleR) / (revealR - dynamicBubbleR);
              const fo = Math.max(0, falloff);
              targetLen = 0;
              targetWid = 0.6;
              targetScale = lerp(0.08, 0.45, fo);
            }
          }
        }

        // Ambient background drift
        const wavePhase = (px * 0.0018) + (py * 0.0018) - t * 0.4;
        const wave = (Math.sin(wavePhase + d.seed) + 1) / 2;
        let ambientScale = wave * 0.05;

        // Reuse post-repulsion distance instead of recalculating
        if (hasMouse) {
          const adx = mx - px;
          const ady = my - py;
          const aDist2 = adx * adx + ady * ady; // squared dist — no sqrt needed!
          const revealR2 = revealR * revealR;
          if (aDist2 < revealR2) {
            ambientScale = 0;
          } else {
            const aDist = Math.sqrt(aDist2);
            const ambientT = Math.min(1, (aDist - revealR) / 100);
            ambientScale *= ambientT;
          }
        }

        if (ambientScale > targetScale) {
          targetScale = ambientScale;
          targetLen = 0.5;
          targetWid = 1.2;
        }

        if (!hasMouse || targetScale < 0.08) {
          targetAngle = d.seed + t * 0.15;
        }

        /* ── SMOOTH EASING ────────────────────── */
        const scaleEase = targetScale > d.scale ? EASE_IN : EASE_OUT;
        d.scale += (targetScale - d.scale) * scaleEase;
        d.angle += angleDiff(d.angle, targetAngle) * EASE_ANGLE;
        d.aLen += (targetLen - d.aLen) * 0.12;
        d.aWid += (targetWid - d.aWid) * 0.12;

        if (d.scale < 0.01) continue;

        /* ── DISTANCE-BASED COLOR ──────────────── */
        let cr, cg, cb;
        if (hasMouse) {
          // Reuse dx/dy from repulsion block instead of recalculating
          const cdx = mx - px;
          const cdy = my - py;
          const colorDist2 = cdx * cdx + cdy * cdy;
          const colorT = Math.min(1, Math.sqrt(colorDist2) / bubbleR);
          if (colorT < 0.5) {
            const t2 = colorT * 2;
            cr = COLOR_TEAL[0] + (COLOR_CYAN[0] - COLOR_TEAL[0]) * t2;
            cg = COLOR_TEAL[1] + (COLOR_CYAN[1] - COLOR_TEAL[1]) * t2;
            cb = COLOR_TEAL[2] + (COLOR_CYAN[2] - COLOR_TEAL[2]) * t2;
          } else {
            const t2 = (colorT - 0.5) * 2;
            cr = COLOR_CYAN[0] + (COLOR_BLUE[0] - COLOR_CYAN[0]) * t2;
            cg = COLOR_CYAN[1] + (COLOR_BLUE[1] - COLOR_CYAN[1]) * t2;
            cb = COLOR_CYAN[2] + (COLOR_BLUE[2] - COLOR_CYAN[2]) * t2;
          }
        } else {
          cr = COLOR_BLUE[0]; cg = COLOR_BLUE[1]; cb = COLOR_BLUE[2];
        }

        const alpha = Math.min(1, d.scale * 1.5);

        /* ── DRAW CAPSULE at fluid position ───── */
        const half = d.aLen / 2;
        const cosA = Math.cos(d.angle);
        const sinA = Math.sin(d.angle);

        ctx.strokeStyle = `rgba(${cr + 0.5 | 0},${cg + 0.5 | 0},${cb + 0.5 | 0},${alpha.toFixed(3)})`;
        ctx.lineWidth = Math.max(0.5, d.aWid);

        ctx.beginPath();
        ctx.moveTo(px - cosA * half, py - sinA * half);
        ctx.lineTo(px + cosA * half, py + sinA * half);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onOut);
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
        opacity: 0.9,
      }}
      aria-hidden="true"
    />
  );
}
