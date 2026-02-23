import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

type DiceSize = 'small' | 'medium' | 'large';

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

const DiceMesh: React.FC<DiceMeshProps> = ({ result, isRolling, animationSpeed, onRoll, sides }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (isRolling && meshRef.current) {
      // Set random initial rotation velocities
      rotationVelocityRef.current = {
        x: (Math.random() - 0.5) * 20 * animationSpeed,
        y: (Math.random() - 0.5) * 20 * animationSpeed,
        z: (Math.random() - 0.5) * 20 * animationSpeed,
      };
    } else if (!isRolling && result && meshRef.current) {
      // Snap to a position that represents the result
      // For simplicity, we'll use a consistent rotation based on result
      const targetRotation = (result / sides) * Math.PI * 2;
      rotationRef.current = {
        x: targetRotation * 0.7,
        y: targetRotation,
        z: targetRotation * 0.5,
      };
      rotationVelocityRef.current = { x: 0, y: 0, z: 0 };
    }
  }, [isRolling, result, animationSpeed]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isRolling) {
        // Update rotation with velocity and damping
        rotationRef.current.x += rotationVelocityRef.current.x * delta;
        rotationRef.current.y += rotationVelocityRef.current.y * delta;
        rotationRef.current.z += rotationVelocityRef.current.z * delta;

        // Apply damping
        rotationVelocityRef.current.x *= 0.98;
        rotationVelocityRef.current.y *= 0.98;
        rotationVelocityRef.current.z *= 0.98;

        meshRef.current.rotation.x = rotationRef.current.x;
        meshRef.current.rotation.y = rotationRef.current.y;
        meshRef.current.rotation.z = rotationRef.current.z;
      } else {
        // Smoothly transition to result position
        const targetX = rotationRef.current.x;
        const targetY = rotationRef.current.y;
        const targetZ = rotationRef.current.z;

        meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.1;
        meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.1;
        meshRef.current.rotation.z += (targetZ - meshRef.current.rotation.z) * 0.1;
      }
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        onClick={!isRolling ? onRoll : undefined}
        onPointerOver={(e) => {
          if (!isRolling) {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.7}
          roughness={0.3}
          emissive="#1e40af"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <mesh>
        <icosahedronGeometry args={[1.01, 0]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          opacity={0.3}
          transparent
        />
      </mesh>

      {/* Ambient and directional lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
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
    size === 'small' ? 'w-40 h-40' : size === 'large' ? 'w-80 h-80' : 'w-64 h-64';

  return (
    <div className={`${sizeClass} cursor-pointer`} onClick={!isRolling ? onRoll : undefined}>
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
