// resources/js/Components/BillboardParticles.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BillboardParticles() {
  const containerRef = useRef();

  useEffect(() => {
    let container = containerRef.current;
    let scene, camera, renderer, particles;
    let width = container.clientWidth;
    let height = container.clientHeight;

    let mouseX = 0, mouseY = 0;
    let windowHalfX = width / 2;
    let windowHalfY = height / 2;

    // Camera
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
    camera.position.z = 1000;

    // Scene
    scene = new THREE.Scene();

    // Geometry
    let geometry = new THREE.BufferGeometry();
    let vertices = [];
    for (let i = 0; i < 10000; i++) {
      vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
      vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
      vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Load sprite texture (blue glowing circle)
    const sprite = new THREE.TextureLoader().load('/textures/sprites/disc.png'); // make sure this exists

    // Material
    let material = new THREE.PointsMaterial({
      size: 20,
      map: sprite,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      color: 0x3399ff,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Mouse movement
    const onMouseMove = (event) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };
    document.addEventListener('mousemove', onMouseMove, false);

    // Handle resize
    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      windowHalfX = width / 2;
      windowHalfY = height / 2;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // Animate
    function animate() {
      requestAnimationFrame(animate);
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }

    animate();

    // Cleanup
    return () => {
      container.removeChild(renderer.domElement);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 w-full h-full" />;
}
