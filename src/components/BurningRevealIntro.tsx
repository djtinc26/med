import React, { useEffect, useRef, useState } from 'react';

interface BurningRevealIntroProps {
  onComplete: () => void;
  logoUrl?: string;
}

export const BurningRevealIntro: React.FC<BurningRevealIntroProps> = ({
  onComplete,
  logoUrl = 'https://i.ibb.co/ZpJBtrnv/Gemini-Generated-Image-mgkabimgkabimgka-1-removebg-preview.png',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) {
      onComplete();
      return;
    }

    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 4000; // 4 seconds burning intro

    // Shaders from burning_reveal reference
    const vsSource = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = a_position;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform vec2 u_resolution;
      uniform float u_progress;
      uniform float u_time;
      uniform sampler2D u_text;

      float rand(vec2 n) {
        return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }

      float noise(vec2 n) {
        const vec2 d = vec2(0., 1.);
        vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
        return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
      }

      float fbm(vec2 n) {
        float total = 0.0, amplitude = .4;
        for (int i = 0; i < 4; i++) {
          total += noise(n) * amplitude;
          n += n;
          amplitude *= 0.6;
        }
        return total;
      }

      void main() {
        vec2 uv = vUv;
        uv.x *= min(1., u_resolution.x / u_resolution.y);
        uv.y *= min(1., u_resolution.y / u_resolution.x);

        vec2 screenUv = vUv * 0.5 + 0.5;
        screenUv.y = 1.0 - screenUv.y;

        float t = u_progress;

        vec4 textColor = texture2D(u_text, screenUv);
        vec3 color = textColor.rgb;

        float main_noise = 1. - fbm(.75 * uv + 10. - vec2(.3, .9 * t));

        float paper_darkness = smoothstep(main_noise - .1, main_noise, t);
        color -= vec3(.99, .95, .99) * paper_darkness;

        vec3 fire_color = fbm(6. * uv - vec2(0., .005 * u_time)) * vec3(6., 1.4, .0);
        float show_fire = smoothstep(.4, .9, fbm(10. * uv + 2. - vec2(0., .005 * u_time)));
        show_fire += smoothstep(.7, .8, fbm(.5 * uv + 5. - vec2(0., .001 * u_time)));

        float fire_border = .025 * show_fire;
        float fire_edge = smoothstep(main_noise - fire_border, main_noise - .5 * fire_border, t);
        fire_edge *= (1. - smoothstep(main_noise - .5 * fire_border, main_noise, t));
        color += fire_color * fire_edge;

        float opacity = 1. - smoothstep(main_noise - .0005, main_noise, t);

        gl_FragColor = vec4(color, opacity);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, source: string, type: number) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);
    if (!vertShader || !fragShader) {
      onComplete();
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      onComplete();
      return;
    }
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      onComplete();
      return;
    }

    gl.useProgram(program);

    // Quad buffer
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uProgress = gl.getUniformLocation(program, 'u_progress');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uText = gl.getUniformLocation(program, 'u_text');

    // Texture canvas
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 2048;
    textCanvas.height = 1024;
    const textCtx = textCanvas.getContext('2d')!;

    const textTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    function drawTextCanvas(logoImage?: HTMLImageElement) {
      textCtx.fillStyle = '#0B0F19';
      textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);

      // Radial decorative background
      const grad = textCtx.createRadialGradient(
        textCanvas.width / 2,
        textCanvas.height / 2,
        50,
        textCanvas.width / 2,
        textCanvas.height / 2,
        600
      );
      grad.addColorStop(0, 'rgba(0, 210, 180, 0.25)');
      grad.addColorStop(1, 'rgba(11, 15, 25, 0)');
      textCtx.fillStyle = grad;
      textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);

      if (logoImage && logoImage.complete && logoImage.naturalWidth > 0) {
        const logoSize = 280;
        textCtx.drawImage(
          logoImage,
          textCanvas.width / 2 - logoSize / 2,
          textCanvas.height / 2 - logoSize / 2 - 80,
          logoSize,
          logoSize
        );
      }

      // Title
      textCtx.fillStyle = '#FFFFFF';
      textCtx.font = 'bold 74px "Plus Jakarta Sans", sans-serif';
      textCtx.textAlign = 'center';
      textCtx.textBaseline = 'middle';
      textCtx.fillText('НОВЫЕ ЛЮДИ', textCanvas.width / 2, textCanvas.height / 2 + 120);

      // Subtitle
      textCtx.fillStyle = '#00D2B4';
      textCtx.font = '600 32px "Plus Jakarta Sans", sans-serif';
      textCtx.fillText(
        'МЕДИЦИНСКАЯ КЛИНИКА В РЕСПУБЛИКЕ УЗБЕКИСТАН',
        textCanvas.width / 2,
        textCanvas.height / 2 + 185
      );

      // Micro badge
      textCtx.fillStyle = '#9CA3AF';
      textCtx.font = '500 24px "Plus Jakarta Sans", sans-serif';
      textCtx.fillText(
        '100% БЕСПЛАТНАЯ ГОСПРОГРАММА · ЭЛЕКТРОННЫЕ НАПРАВЛЕНИЯ MY.GOV.UZ',
        textCanvas.width / 2,
        textCanvas.height / 2 + 240
      );

      gl!.bindTexture(gl!.TEXTURE_2D, textTexture);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, textCanvas);
    }

    drawTextCanvas();

    // Load actual logo image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = logoUrl;
    img.onload = () => {
      drawTextCanvas(img);
    };

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.uniform2f(uResolution, canvas.width, canvas.height);
    }

    window.addEventListener('resize', resize);
    resize();

    function easeInOut(t: number) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function renderFrame(now: number) {
      const elapsed = (now - startTime) / duration;

      if (elapsed >= 1.05) {
        onComplete();
        return;
      }

      const progress = 0.15 + 0.9 * easeInOut(Math.min(elapsed, 1));

      gl!.uniform1f(uTime, now);
      gl!.uniform1f(uProgress, progress);

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, textTexture);
      gl!.uniform1i(uText, 0);

      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(renderFrame);
    }

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [logoUrl, onComplete]);

  if (isSkipped) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F19] overflow-hidden pointer-events-auto">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <button
        onClick={() => {
          setIsSkipped(true);
          onComplete();
        }}
        className="absolute bottom-8 right-8 z-[110] px-4 py-2 rounded-xl bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 text-xs font-medium tracking-wide transition-all backdrop-blur-md cursor-pointer"
      >
        Пропустить интро ➔
      </button>
    </div>
  );
};
