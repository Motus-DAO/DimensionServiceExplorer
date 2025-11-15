import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// Elegant scroll grid effect - version 3.0 - progressive grid expansion

interface GridDistortionProps {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  imageSrc: string;
  className?: string;
  isActive?: boolean;
}

const vertexShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uDataTexture;
uniform float time;
uniform vec4 resolution;
uniform float scrollIntensity;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  
  // Progressive grid scaling - expands from 12 to 24 lines
  float gridScale = mix(12.0, 24.0, scrollIntensity);
  vec2 grid = abs(fract(uv * gridScale) - 0.5);
  
  // Add horizontal lines that also scale with scroll
  vec2 horizontalGrid = abs(fract(uv * vec2(gridScale, gridScale * 1.33)) - 0.5);
  float horizontalLine = smoothstep(0.0, 0.02, min(horizontalGrid.x, horizontalGrid.y));
  
  // Combine grids
  float gridLine = min(smoothstep(0.0, 0.02, min(grid.x, grid.y)), horizontalLine);
  
  // Pulsating gradient with subtle purple, blue, green
  float pulse = sin(time * 0.5) * 0.3 + 0.7; // Gentle pulse between 0.4 and 1.0
  
  // Base colors for gradient
  vec3 purple = vec3(0.4, 0.2, 0.6) * pulse;  // Light purple
  vec3 blue = vec3(0.2, 0.4, 0.8) * pulse;    // Light blue  
  vec3 green = vec3(0.2, 0.6, 0.4) * pulse;   // Light green
  
  // Create gradient based on UV position
  vec3 gradientColor = mix(
    mix(purple, blue, uv.x * 0.5 + 0.5),  // Purple to blue horizontally
    mix(blue, green, uv.y * 0.5 + 0.5),   // Blue to green vertically
    scrollIntensity * 0.4  // Subtle scroll influence
  );
  
  // Combine with scroll-based color transition
  vec3 baseColor = mix(
    gradientColor,
    vec3(0.3, 0.0, 0.5),  // Dark magenta for scroll
    scrollIntensity * 0.3
  );
  
  // Apply gentle mouse distortion (no scroll amplification)
  vec2 distortedUV = uv - 0.01 * offset.rg;
  
  // Calculate distorted grid with same scaling
  vec2 distortedGrid = abs(fract(distortedUV * gridScale) - 0.5);
  vec2 distortedHorizontalGrid = abs(fract(distortedUV * vec2(gridScale, gridScale * 1.33)) - 0.5);
  float distortedGridLine = min(smoothstep(0.0, 0.02, min(distortedGrid.x, distortedGrid.y)), 
                                smoothstep(0.0, 0.02, min(distortedHorizontalGrid.x, distortedHorizontalGrid.y)));
  
  // Final grid combines static and mouse-distorted
  float finalGrid = min(gridLine, distortedGridLine);
  
  // Elegant color progression
  vec3 gridColor = baseColor * (0.3 + scrollIntensity * 0.4); // Subtle brightness increase
  
  // Subtle dark background with gradient influence
  vec3 darkBackground = mix(
    vec3(0.05, 0.05, 0.08),  // Dark base
    gradientColor * 0.1,      // Subtle gradient influence
    0.3
  );
  vec3 finalResult = mix(darkBackground, gridColor, 1.0 - finalGrid);
  
  // Subtle glow effect
  float glow = 1.0 - finalGrid;
  float glowIntensity = 0.1 + scrollIntensity * 0.15;
  finalResult += baseColor * glow * glowIntensity;
  
  gl_FragColor = vec4(finalResult, 1.0);
}
`;

const GridDistortion: React.FC<GridDistortionProps> = ({
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  imageSrc,
  className = '',
  isActive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const planeRef = useRef<THREE.Mesh | null>(null);
  const imageAspectRef = useRef<number>(1);
  const animationIdRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
    camera.position.z = 2;
    cameraRef.current = camera;

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uDataTexture: { value: null as THREE.DataTexture | null },
      scrollIntensity: { value: 0 }
    };

    const size = grid;
    const data = new Float32Array(4 * size * size);
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = Math.random() * 255 - 125;
      data[i * 4 + 1] = Math.random() * 255 - 125;
    }

    const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false
    });

    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
    const plane = new THREE.Mesh(geometry, material);
    planeRef.current = plane;
    scene.add(plane);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) return;

      const containerAspect = width / height;

      renderer.setSize(width, height);

      if (plane) {
        plane.scale.set(containerAspect, 1, 1);
      }

      const frustumHeight = 1;
      const frustumWidth = frustumHeight * containerAspect;
      camera.left = -frustumWidth / 2;
      camera.right = frustumWidth / 2;
      camera.top = frustumHeight / 2;
      camera.bottom = -frustumHeight / 2;
      camera.updateProjectionMatrix();

      uniforms.resolution.value.set(width, height, 1, 1);
    };

    // Call handleResize after it's defined
    handleResize();

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container);
      resizeObserverRef.current = resizeObserver;
    } else {
      window.addEventListener('resize', handleResize);
    }

    const mouseState = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
      isHovering: false,
      hoverIntensity: 0
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) return;
      
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      mouseState.isHovering = true;
      // Calculate hover intensity based on mouse velocity and position
      const velocity = Math.sqrt(mouseState.vX * mouseState.vX + mouseState.vY * mouseState.vY);
      mouseState.hoverIntensity = Math.min(velocity * 15, 1.0); // Increased multiplier for more sensitivity
      Object.assign(mouseState, { x, y, prevX: x, prevY: y });
      
      // Debug logging
      if (mouseState.hoverIntensity > 0.1) {
        console.log('Hover intensity:', mouseState.hoverIntensity, 'Velocity:', velocity);
      }
    };

    const handleMouseLeave = () => {
      if (!isActive) return;
      
      if (dataTexture) {
        dataTexture.needsUpdate = true;
      }
      Object.assign(mouseState, {
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        vX: 0,
        vY: 0,
        isHovering: false,
        hoverIntensity: 0
      });
    };

    // Elegant scroll event listener - direct mapping with easing
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(scrollTop / scrollHeight, 1.0);
      
      // Direct mapping with quadratic easing for smooth progression
      const easedScroll = scrollPercent * scrollPercent;
      
      // Apply smooth cap to prevent extreme effects at bottom
      const cappedScroll = Math.min(easedScroll, 0.85); // Cap at 85%
      const smoothCap = cappedScroll * (1.0 - cappedScroll * 0.3); // Gentle falloff
      
      uniforms.scrollIntensity.value = smoothCap;
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Add mouse event listeners
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // Initial scroll calculation
    handleScroll();

    handleResize();

    // Animation loop function
    const startAnimation = () => {
      const animate = () => {
        if (!renderer || !scene || !camera) return;

        // Gentle pulsating animation for gradient effect
        uniforms.time.value += 0.01; // Slow, subtle animation

        if (!(dataTexture.image.data instanceof Float32Array)) {
          console.error('dataTexture.image.data is not a Float32Array');
          return;
        }
        const data: Float32Array = dataTexture.image.data;
        for (let i = 0; i < size * size; i++) {
          data[i * 4] *= relaxation;
          data[i * 4 + 1] *= relaxation;
        }

        const gridMouseX = size * mouseState.x;
        const gridMouseY = size * mouseState.y;
        const maxDist = size * mouse;

        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            const distSq = Math.pow(gridMouseX - i, 2) + Math.pow(gridMouseY - j, 2);
            if (distSq < maxDist * maxDist) {
              const index = 4 * (i + size * j);
              const power = Math.min(maxDist / Math.sqrt(distSq), 10);
              
              // Simple mouse distortion without scroll amplification
              const distortionX = strength * 100 * mouseState.vX * power;
              const distortionY = strength * 100 * mouseState.vY * power;
              
              data[index] += distortionX;
              data[index + 1] -= distortionY;
            }
          }
        }

        dataTexture.needsUpdate = true;
        renderer.render(scene, camera);
        
        // Schedule next frame
        animationIdRef.current = requestAnimationFrame(animate);
      };

      // Start the animation loop
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    startAnimation();
    
    // Mark as initialized after a short delay to ensure WebGL is ready
    setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      } else {
        window.removeEventListener('resize', handleResize);
      }

      // Remove scroll listener
      window.removeEventListener('scroll', handleScroll);
      
      // Remove mouse event listeners
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);

      if (renderer) {
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }

      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (dataTexture) dataTexture.dispose();

      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      planeRef.current = null;
    };
  }, [grid, mouse, strength, relaxation, imageSrc]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minWidth: '0',
        minHeight: '0',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -20,
        pointerEvents: 'auto', // Enable mouse interactions for hover effects
        background: isInitialized 
          ? 'transparent' 
          : 'linear-gradient(135deg, rgba(5, 5, 8, 0.95) 0%, rgba(15, 15, 35, 0.95) 50%, rgba(5, 5, 8, 0.95) 100%)', // Dark fallback
        opacity: isInitialized ? 1 : 0.8,
        transition: 'opacity 0.3s ease-in-out'
      }}
    />
  );
};

export default GridDistortion;
