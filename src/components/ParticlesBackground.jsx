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

    // Brand colors
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
    const mouse = { x: -1000, y: -1000 };
    let hasMouse = false;
    let lastMoveTime = 0;
    let currentIdleFactor = 0;

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const oldDots = dots;
      dots = [];
      const cols = Math.ceil(canvas.width / CFG.cell) + 1;
      const rows = Math.ceil(canvas.height / CFG.cell) + 1;
      const offsetX = (canvas.width - (cols - 1) * CFG.cell) / 2;
      const offsetY = (canvas.height - (rows - 1) * CFG.cell) / 2;

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
    window.addEventListener('resize', buildGrid);

    /* ── HELPERS ──────────────────────────────── */
    const lerp = (a, b, t) => a + (b - a) * t;

    const lerpColor = (a, b, t) => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];

    const angleDiff = (from, to) => {
      let d = to - from;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return d;
    };

    const smoothstep = (x) => x * x * (3 - 2 * x);

    /* ── RENDER ──────────────────────────────────── */
    const render = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = time * 0.001;
      const now = performance.now();

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

          // ── GRAVITY WELL EFFECT ──
          // Physically pull the particles towards the cursor
          const gravityRadius = revealR * 1.2;
          if (dist < gravityRadius) {
            // Exponential pull: stronger the closer it gets
            let pullForce = Math.pow(Math.max(0, 1 - dist / gravityRadius), 2) * 70;
            // Limit how far a particle can physically travel from its home grid point
            pullForce = Math.min(pullForce, 45);

            px += Math.cos(radialAngle) * pullForce;
            py += Math.sin(radialAngle) * pullForce;
          }

          // Fluid edge: amoeba-like bubble boundary
          const fluidAmp = bubbleR * 0.05;
          const dynamicBubbleR = bubbleR
            + Math.sin(radialAngle * 3 + t * 0.9) * fluidAmp
            + Math.sin(radialAngle * 5 - t * 0.6) * (fluidAmp * 0.8);

          if (dist < revealR) {
            const wobble = Math.sin(t * 1.4 + d.seed) * 0.10;
            targetAngle = radialAngle + wobble;

            const nd = dist / dynamicBubbleR;

            if (dist < dynamicBubbleR) {
              if (nd < 0.45) {
                // Zone 1: Inner (Small dot)
                targetLen = 0.5;
                targetWid = 1.2;
                targetScale = 0.45;
              } else if (nd < 0.85) {
                // Zone 2: Middle ring (Vector dash) - Now significantly larger!
                // Ramps up from dot to thick dash
                const zoneT = (nd - 0.45) / 0.40;
                const edgeT = smoothstep(zoneT);
                targetLen = lerp(0.5, 4.5, edgeT);
                targetWid = lerp(1.2, 3.5, edgeT);
                targetScale = lerp(0.45, 1.0, edgeT);
              } else {
                // Zone 3: Outer edge of bubble (Back to small dot)
                // Shrinks back down quickly on the final 15% of the bubble edge
                const zoneT = (nd - 0.85) / 0.15;
                const edgeT = smoothstep(zoneT);
                targetLen = lerp(4.5, 0.5, edgeT);
                targetWid = lerp(2.5, 1.2, edgeT);
                targetScale = lerp(0.90, 0.45, edgeT);
              }
            } else {
              // Zone 4: Outside bubble (Disappear)
              // Remains a small dot, but fades out to nothing
              const falloff = 1 - (dist - dynamicBubbleR) / (revealR - dynamicBubbleR);
              const fo = Math.max(0, falloff);
              targetLen = 0.5;
              targetWid = 1.2;
              targetScale = 0.45 * fo; // Fade opacity to 0
            }
          }
        }

        // Ambient background drift
        const wavePhase = (px * 0.0018) + (py * 0.0018) - t * 0.4;
        const wave = (Math.sin(wavePhase + d.seed) + 1) / 2;
        const ambientScale = wave * 0.05;

        if (ambientScale > targetScale) {
          targetScale = ambientScale;
          targetLen = 1.5;
          targetWid = 0.8;
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
          const ddx = mx - px;
          const ddy = my - py;
          const dist2 = Math.sqrt(ddx * ddx + ddy * ddy);
          const colorT = Math.min(1, dist2 / bubbleR);
          if (colorT < 0.5) {
            [cr, cg, cb] = lerpColor(COLOR_TEAL, COLOR_CYAN, colorT * 2);
          } else {
            [cr, cg, cb] = lerpColor(COLOR_CYAN, COLOR_BLUE, (colorT - 0.5) * 2);
          }
        } else {
          [cr, cg, cb] = COLOR_BLUE;
        }

        const alpha = Math.min(1, d.scale * 1.5);

        /* ── DRAW CAPSULE at fluid position ───── */
        const half = d.aLen / 2;
        const cosA = Math.cos(d.angle);
        const sinA = Math.sin(d.angle);

        ctx.strokeStyle = `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},${alpha.toFixed(3)})`;
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
      window.removeEventListener('resize', buildGrid);
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
