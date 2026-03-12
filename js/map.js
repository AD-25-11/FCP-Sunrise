(() => {
  const host = document.getElementById('globeCanvas');
  if (!host || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 4.8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(host.clientWidth, host.clientHeight);
  host.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x87ceff, 0.45));
  const sun = new THREE.DirectionalLight(0xffdf88, 1.15);
  sun.position.set(5, 3, 5);
  scene.add(sun);

  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1.35, 64, 64),
    new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg'),
      emissive: 0x0a2c4c,
      emissiveIntensity: 0.3
    })
  );
  scene.add(earth);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.42, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x1498cc, transparent: true, opacity: 0.22 })
  );
  scene.add(atmosphere);

  const stars = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(Array.from({ length: 1500 * 3 }, () => (Math.random() - 0.5) * 60)), 3)),
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.06 })
  );
  scene.add(stars);

  const points = {
    Manila: [14.59, 120.98], Tokyo: [35.68, 139.69], Singapore: [1.35, 103.82], Seoul: [37.57, 126.98], HongKong: [22.3, 114.17]
  };
  const continentAnchors = {
    Asia: [34, 100], Europe: [50, 15], 'North America': [45, -100], 'South America': [-15, -60], Africa: [3, 20], Australia: [-25, 133]
  };

  const llToVec3 = (lat, lon, r = 1.36) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
  };

  const routeMaterial = new THREE.LineBasicMaterial({ color: 0xffdf00, transparent: true, opacity: 0.9 });
  const flightGroup = new THREE.Group();
  scene.add(flightGroup);

  const makeRoute = (a, b) => {
    const v1 = llToVec3(...a), v2 = llToVec3(...b);
    const mid = v1.clone().add(v2).normalize().multiplyScalar(1.9);
    const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
    const pts = curve.getPoints(90);
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), routeMaterial);
    flightGroup.add(line);

    const plane = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffdf00 }));
    flightGroup.add(plane);
    let t = Math.random();
    return () => {
      t += 0.0025;
      if (t > 1) t = 0;
      plane.position.copy(curve.getPoint(t));
    };
  };

  const animFns = [
    makeRoute(points.Manila, points.Tokyo),
    makeRoute(points.Manila, points.Singapore),
    makeRoute(points.Manila, points.Seoul),
    makeRoute(points.Manila, points.HongKong)
  ];

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const getContinentHit = e => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(clickTargets, false)[0];
  };

  const clickTargets = Object.entries(continentAnchors).map(([name, [lat, lon]]) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), new THREE.MeshBasicMaterial({ color: 0x1498cc, transparent: true, opacity: 0.01 }));
    mesh.position.copy(llToVec3(lat, lon, 1.4));
    mesh.userData.continent = name;
    earth.add(mesh);
    return mesh;
  });

  renderer.domElement.addEventListener('mousemove', e => {
    const hit = getContinentHit(e);
    renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
  });

  renderer.domElement.addEventListener('click', e => {
    const hit = getContinentHit(e);
    if (!hit) return;

    const continent = hit.object.userData.continent;
    if (window.updateContinentInfo) window.updateContinentInfo(continent);
    if (window.navigateToContinent) window.navigateToContinent(continent);
  });

  const onResize = () => {
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(host.clientWidth, host.clientHeight);
  };
  window.addEventListener('resize', onResize);

  const loop = () => {
    requestAnimationFrame(loop);
    earth.rotation.y += 0.0018;
    atmosphere.rotation.y += 0.002;
    stars.rotation.y += 0.0003;
    animFns.forEach(fn => fn());
    renderer.render(scene, camera);
  };
  loop();
})();
