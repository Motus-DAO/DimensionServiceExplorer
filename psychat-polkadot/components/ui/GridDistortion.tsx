import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface GridDistortionProps {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  imageSrc: string;
  className?: string;
  fallbackImage?: string;
  onError?: () => void;
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
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}
`;

const GridDistortion: React.FC<GridDistortionProps> = ({
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  imageSrc,
  className = '',
  fallbackImage = '/assets/grid-distortion/default-bg.jpg',
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const dataTextureRef = useRef<THREE.DataTexture | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);
  const mouseMoveHandlerRef = useRef<((e: MouseEvent) => void) | null>(null);
  const mouseLeaveHandlerRef = useRef<(() => void) | null>(null);
  const resizeHandlerRef = useRef<(() => void) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);

  const cleanup = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }

    // Remove document event listeners
    if (mouseMoveHandlerRef.current) {
      document.removeEventListener('mousemove', mouseMoveHandlerRef.current);
    }
    if (mouseLeaveHandlerRef.current) {
      document.removeEventListener('mouseleave', mouseLeaveHandlerRef.current);
    }
    if (resizeHandlerRef.current) {
      window.removeEventListener('resize', resizeHandlerRef.current);
    }

    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    if (sceneRef.current) {
      sceneRef.current.clear();
      sceneRef.current = null;
    }

    if (cameraRef.current) {
      cameraRef.current = null;
    }

    if (materialRef.current) {
      materialRef.current.dispose();
      materialRef.current = null;
    }

    if (dataTextureRef.current) {
      dataTextureRef.current.dispose();
      dataTextureRef.current = null;
    }

    isInitializedRef.current = false;
  };

  useEffect(() => {
    if (!canvasRef.current || isInitializedRef.current) return;

    const canvas = canvasRef.current;
    isInitializedRef.current = true;

    const initThreeJS = async () => {
      try {
        // Create scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Create renderer with canvas
        const renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        rendererRef.current = renderer;

        // Create camera
        const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
        camera.position.z = 2;
        cameraRef.current = camera;

        // Load texture
        const textureLoader = new THREE.TextureLoader();
        let texture: THREE.Texture;

        try {
          texture = await new Promise<THREE.Texture>((resolve, reject) => {
            textureLoader.load(
              currentImageSrc,
              (loadedTexture) => {
                loadedTexture.minFilter = THREE.LinearFilter;
                loadedTexture.magFilter = THREE.LinearFilter;
                loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
                loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
                resolve(loadedTexture);
              },
              undefined,
              (error) => {
                console.error('Texture loading error:', error);
                reject(error);
              }
            );
          });
          setIsLoading(false);
          setHasError(false);
        } catch (error) {
          console.error('Failed to load texture:', error);
          if (fallbackImage && fallbackImage !== currentImageSrc) {
            try {
              texture = await new Promise<THREE.Texture>((resolve, reject) => {
                textureLoader.load(
                  fallbackImage,
                  (loadedTexture) => {
                    loadedTexture.minFilter = THREE.LinearFilter;
                    loadedTexture.magFilter = THREE.LinearFilter;
                    loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
                    loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
                    resolve(loadedTexture);
                  },
                  undefined,
                  reject
                );
              });
              setCurrentImageSrc(fallbackImage);
              setIsLoading(false);
              setHasError(false);
            } catch (fallbackError) {
              console.error('Fallback texture also failed:', fallbackError);
              setHasError(true);
              setIsLoading(false);
              onError?.();
              return;
            }
          } else {
            setHasError(true);
            setIsLoading(false);
            onError?.();
            return;
          }
        }

        // Create uniforms
        const uniforms = {
          time: { value: 0 },
          resolution: { value: new THREE.Vector4() },
          uTexture: { value: texture },
          uDataTexture: { value: null as THREE.DataTexture | null }
        };

        // Create data texture
        const size = grid;
        const data = new Float32Array(4 * size * size);
        for (let i = 0; i < size * size; i++) {
          data[i * 4] = Math.random() * 255 - 125;
          data[i * 4 + 1] = Math.random() * 255 - 125;
        }

        const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
        dataTexture.needsUpdate = true;
        dataTextureRef.current = dataTexture;
        uniforms.uDataTexture.value = dataTexture;

        // Create material
        const material = new THREE.ShaderMaterial({
          side: THREE.DoubleSide,
          uniforms,
          vertexShader,
          fragmentShader,
          transparent: true
        });
        materialRef.current = material;

        // Create geometry and mesh
        const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Mouse state
        const mouseState = {
          x: 0,
          y: 0,
          prevX: 0,
          prevY: 0,
          vX: 0,
          vY: 0
        };

        // Event handlers - use document for full page coverage
        const handleMouseMove = (e: MouseEvent) => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = 1 - (e.clientY - rect.top) / rect.height;
          mouseState.vX = x - mouseState.prevX;
          mouseState.vY = y - mouseState.prevY;
          Object.assign(mouseState, { x, y, prevX: x, prevY: y });
          
          // Mouse movement tracking (debug logs removed for production)
        };

        const handleMouseLeave = () => {
          Object.assign(mouseState, {
            x: 0,
            y: 0,
            prevX: 0,
            prevY: 0,
            vX: 0,
            vY: 0
          });
          // Mouse left event handled
        };

        const handleResize = () => {
          if (!containerRef.current || !renderer || !camera) return;

          const rect = containerRef.current.getBoundingClientRect();
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

        // Store handlers in refs for proper cleanup
        mouseMoveHandlerRef.current = handleMouseMove;
        mouseLeaveHandlerRef.current = handleMouseLeave;
        resizeHandlerRef.current = handleResize;
        
        // Add event listeners - use document for full page coverage
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('resize', handleResize);

        // Initial resize
        handleResize();

        // Animation loop
        const animate = () => {
          if (!renderer || !scene || !camera || !isInitializedRef.current) return;

          uniforms.time.value += 0.05;

          if (dataTexture.image.data instanceof Float32Array) {
            const data: Float32Array = dataTexture.image.data;
            for (let i = 0; i < size * size; i++) {
              data[i * 4] *= relaxation;
              data[i * 4 + 1] *= relaxation;
            }

            const gridMouseX = size * mouseState.x;
            const gridMouseY = size * mouseState.y;
            const maxDist = size * mouse;

            // Animation loop running (debug logs removed for production)

            for (let i = 0; i < size; i++) {
              for (let j = 0; j < size; j++) {
                const distSq = Math.pow(gridMouseX - i, 2) + Math.pow(gridMouseY - j, 2);
                if (distSq < maxDist * maxDist) {
                  const index = 4 * (i + size * j);
                  const power = Math.min(maxDist / Math.sqrt(distSq), 10);
                  // Increased distortion strength for more visible effect
                  data[index] += strength * 200 * mouseState.vX * power;
                  data[index + 1] -= strength * 200 * mouseState.vY * power;
                }
              }
            }

            dataTexture.needsUpdate = true;
          }

          renderer.render(scene, camera);
          animationIdRef.current = requestAnimationFrame(animate);
        };

        animate();

      } catch (error) {
        console.error('Failed to initialize Three.js:', error);
        setHasError(true);
        setIsLoading(false);
        onError?.();
      }
    };

    initThreeJS();

    return () => {
      cleanup();
    };
  }, [grid, mouse, strength, relaxation, currentImageSrc, fallbackImage, onError]);

  // Update image source when prop changes
  useEffect(() => {
    if (imageSrc !== currentImageSrc) {
      setCurrentImageSrc(imageSrc);
      cleanup();
      isInitializedRef.current = false;
    }
  }, [imageSrc, currentImageSrc]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minWidth: '0',
        minHeight: '0'
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: isLoading || hasError ? 'none' : 'block' }}
      />
      
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-2 border-psy-purple border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400">Loading effect...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-red-400 font-medium">Failed to load image</p>
              <p className="text-xs text-slate-500 mt-1">Check image path or try again</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridDistortion;