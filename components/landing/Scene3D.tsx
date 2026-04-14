"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const count = 2000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#fce075"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GlowingSphere() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.1;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={[3, 0.5, -2]} scale={1.8}>
        <icosahedronGeometry args={[1, 3]} />
        <MeshDistortMaterial
          color="#fce075"
          emissive="#fce075"
          emissiveIntensity={0.15}
          roughness={0.3}
          metalness={0.8}
          distort={0.25}
          speed={2}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function GlassTorus() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.08;
    ref.current.rotation.z = state.clock.elapsedTime * 0.12;
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref} position={[-3, -1, -3]} scale={1.2}>
        <torusGeometry args={[1, 0.3, 32, 64]} />
        <meshStandardMaterial
          color="#ea580c"
          emissive="#ea580c"
          emissiveIntensity={0.1}
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.12}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function GridPlane() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!ref.current) return;
    (ref.current.material as THREE.MeshStandardMaterial).opacity =
      0.05 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[40, 40, 40, 40]} />
      <meshStandardMaterial
        color="#fce075"
        transparent
        opacity={0.05}
        wireframe
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function DataStreams() {
  const count = 30;
  const ref = useRef<THREE.Group>(null!);

  const lineObjects = useMemo(() => {
    const arr: THREE.Line[] = [];
    for (let i = 0; i < count; i++) {
      const points: THREE.Vector3[] = [];
      const x = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 10 - 3;
      for (let j = 0; j < 20; j++) {
        points.push(
          new THREE.Vector3(x + Math.sin(j * 0.3) * 0.3, -5 + j * 0.5, z),
        );
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: "#fce075",
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geometry, material);
      arr.push(line);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    lineObjects.forEach((line, i) => {
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity =
        0.05 + Math.sin(state.clock.elapsedTime * (0.5 + i * 0.05) + i) * 0.04;
    });
  });

  return (
    <group ref={ref}>
      {lineObjects.map((lineObj, i) => (
        <primitive key={i} object={lineObj} />
      ))}
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#fce075" />
        <pointLight position={[-5, -5, 3]} intensity={0.3} color="#ea580c" />

        <ParticleField />
        <GlowingSphere />
        <GlassTorus />
        <GridPlane />
        <DataStreams />
      </Canvas>
    </div>
  );
}
