import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';

type DiceSize = 'small' | 'medium' | 'large' | 'xl';

interface Dice3DProps {
  result: number | null;
  isRolling: boolean;
  animationSpeed: number;
  onRoll: () => void;
  sides: number;
  size: DiceSize;
}

interface DiceMeshProps {
  result: number | null;
  isRolling: boolean;
  animationSpeed: number;
  onRoll: () => void;
  sides: number;
}

const createWoodTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, '#8B5A2B');
  gradient.addColorStop(0.3, '#A0522D');
  gradient.addColorStop(0.5, '#8B4513');
  gradient.addColorStop(0.7, '#A0522D');
  gradient.addColorStop(1, '#6B4423');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(60, 30, 10, 0.3)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < 80; i++) {
    const y = Math.random() * 512;
    const amplitude = 5 + Math.random() * 15;
    const frequency = 0.01 + Math.random() * 0.02;
    
    ctx.beginPath();
    ctx.moveTo(0, y);
    
    for (let x = 0; x < 512; x += 2) {
      const newY = y + Math.sin(x * frequency + Math.random() * 0.5) * amplitude;
      ctx.lineTo(x, newY);
    }
    ctx.stroke();
  }

  for (let i = 0; i < 5; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = 10 + Math.random() * 25;
    
    const knotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    knotGradient.addColorStop(0, 'rgba(40, 20, 10, 0.6)');
    knotGradient.addColorStop(0.5, 'rgba(60, 30, 15, 0.3)');
    knotGradient.addColorStop(1, 'rgba(80, 40, 20, 0)');
    
    ctx.fillStyle = knotGradient;
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const imageData = ctx.getImageData(0, 0, 512, 512);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 15;
    imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));
    imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + noise));
    imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

const createWoodBumpMap = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 50; i++) {
    const y = Math.random() * 256;
    const amplitude = 2 + Math.random() * 5;
    
    ctx.strokeStyle = `rgba(${100 + Math.random() * 50}, ${100 + Math.random() * 50}, ${100 + Math.random() * 50}, 0.5)`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    
    for (let x = 0; x < 256; x += 2) {
      const newY = y + Math.sin(x * 0.02) * amplitude;
      ctx.lineTo(x, newY);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

const createTrapezohedronD10Geometry = (): THREE.BufferGeometry => {
  const n = 5;
  const beltCount = 2 * n;
  const apexY = 1.15;
  const beltY = 0.38;
  const r = 1.0;
  const positions: number[] = [];

  positions.push(0, apexY, 0);
  positions.push(0, -apexY, 0);

  for (let i = 0; i < beltCount; i++) {
    const angle = (i * Math.PI) / n;
    const y = i % 2 === 0 ? beltY : -beltY;
    positions.push(r * Math.cos(angle), y, r * Math.sin(angle));
  }

  const indices: number[] = [];
  const beltStart = 2;

  for (let i = 0; i < beltCount; i++) {
    const a = beltStart + i;
    const b = beltStart + ((i + 1) % beltCount);
    indices.push(0, a, b);
    indices.push(1, b, a);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.center();
  return geometry;
};

const createGeometryForSides = (sides: number): THREE.BufferGeometry => {
  switch (sides) {
    case 3: return new THREE.CylinderGeometry(1, 1, 0.9, 3, 1);
    case 4: return new THREE.TetrahedronGeometry(1.2, 0);
    case 6: return new THREE.BoxGeometry(1.5, 1.5, 1.5);
    case 8: return new THREE.OctahedronGeometry(1.1, 0);
    case 10: return createTrapezohedronD10Geometry();
    case 12: return new THREE.DodecahedronGeometry(1.1, 0);
    case 20:
    default: return new THREE.IcosahedronGeometry(1.1, 0);
  }
};

const DiceMesh: React.FC<DiceMeshProps> = ({ result, isRolling, animationSpeed, onRoll, sides }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0, z: 0 });

  const geometry = useMemo(() => createGeometryForSides(sides), [sides]);
  const woodTexture = useMemo(() => createWoodTexture(), []);
  const bumpMap = useMemo(() => createWoodBumpMap(), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      woodTexture.dispose();
      bumpMap.dispose();
    };
  }, [geometry, woodTexture, bumpMap]);

  useEffect(() => {
    if (isRolling && meshRef.current) {
      rotationVelocityRef.current = {
        x: (Math.random() - 0.5) * 18 * animationSpeed,
        y: (Math.random() - 0.5) * 18 * animationSpeed,
        z: (Math.random() - 0.5) * 18 * animationSpeed,
      };
    } else if (!isRolling && result !== null && meshRef.current) {
      const targetRotation = (result / sides) * Math.PI * 2;
      rotationRef.current = {
        x: targetRotation * 0.7,
        y: targetRotation,
        z: targetRotation * 0.5,
      };
      rotationVelocityRef.current = { x: 0, y: 0, z: 0 };
    }
  }, [isRolling, result, animationSpeed, sides]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      if (isRolling) {
        rotationRef.current.x += rotationVelocityRef.current.x * delta;
        rotationRef.current.y += rotationVelocityRef.current.y * delta;
        rotationRef.current.z += rotationVelocityRef.current.z * delta;

        rotationVelocityRef.current.x *= 0.985;
        rotationVelocityRef.current.y *= 0.985;
        rotationVelocityRef.current.z *= 0.985;

        meshRef.current.rotation.x = rotationRef.current.x;
        meshRef.current.rotation.y = rotationRef.current.y;
        meshRef.current.rotation.z = rotationRef.current.z;
      } else {
        meshRef.current.rotation.x += (rotationRef.current.x - meshRef.current.rotation.x) * 0.08;
        meshRef.current.rotation.y += (rotationRef.current.y - meshRef.current.rotation.y) * 0.08;
        meshRef.current.rotation.z += (rotationRef.current.z - meshRef.current.rotation.z) * 0.08;
      }
    }
  });

  const handleClick = (): void => {
    if (!isRolling) onRoll();
  };

  const handlePointerOver = (e: THREE.Event): void => {
    if (!isRolling) {
      (e as { stopPropagation: () => void }).stopPropagation();
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (): void => {
    document.body.style.cursor = 'default';
  };

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          map={woodTexture}
          bumpMap={bumpMap}
          bumpScale={0.02}
          color="#CD853F"
          metalness={0.05}
          roughness={0.75}
        />
        
        {/* Show result number on dice - ALWAYS visible when result exists */}
        {result !== null && (
          <Html
            center
            distanceFactor={3.5}
            zIndexRange={[0, 40]}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            <div
              style={{
                fontSize: isRolling ? '2rem' : '3rem',
                fontWeight: 900,
                color: '#1a0800',
                fontFamily: '"Times New Roman", Georgia, serif',
                textShadow: '0 0 4px rgba(255, 248, 220, 0.9), 1px 1px 0 rgba(210, 180, 140, 0.6)',
                letterSpacing: '-1px',
                opacity: isRolling ? 0.7 : 1,
                transition: 'all 0.3s ease',
              }}
            >
              {result}
            </div>
          </Html>
        )}
      </mesh>

      <ambientLight intensity={0.5} color="#fff8dc" />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fffaf0" />
      <directionalLight position={[-3, 3, -3]} intensity={0.4} color="#ffecd2" />
      <pointLight position={[0, 2, 4]} intensity={0.4} color="#ffcc80" distance={10} />
      <hemisphereLight args={['#ffecd2', '#8B4513', 0.3]} />
    </>
  );
};

const Dice3D: React.FC<Dice3DProps> = ({
  result,
  isRolling,
  animationSpeed,
  onRoll,
  sides,
  size,
}) => {
  const sizeClass =
    size === 'small' ? 'w-40 h-40' : 
    size === 'large' ? 'w-80 h-80' : 
    size === 'xl' ? 'w-[28rem] h-[28rem]' : 
    'w-64 h-64';

  const handleClick = (): void => {
    if (!isRolling) onRoll();
  };

  return (
    <div className={`${sizeClass} cursor-pointer`} onClick={handleClick}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <DiceMesh
          result={result}
          isRolling={isRolling}
          animationSpeed={animationSpeed}
          onRoll={onRoll}
          sides={sides}
        />
      </Canvas>
    </div>
  );
};

export default Dice3D;
