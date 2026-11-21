import { gsap } from './gsap-core.js';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  DataTexture,
  DirectionalLight,
  FloatType,
  Group,
  MeshPhysicalMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Mesh,
  MeshBasicMaterial,
  PMREMGenerator,
  RGBAFormat,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
  CanvasTexture,
  EquirectangularReflectionMapping,
  LinearFilter,
  GLTFLoader
} from './three-runtime.js';

// An HDR studio: broad windows, a narrow kicker, a lilac bounce card and a dark flag.
// We bake it once into the roughness mip chain. No environment download is needed.
function studioLighting(renderer) {
  const width = 256,
    height = 128,
    pixels = new Float32Array(width * height * 4);
  const softboxes = [
    [0.16, 0.67, 0.041, 0.19, [7.8, 6.7, 5.6]],
    [0.68, 0.7, 0.11, 0.043, [6.0, 6.5, 7.5]],
    [0.81, 0.35, 0.04, 0.22, [2.9, 2.4, 3.8]],
    [0.41, 0.41, 0.014, 0.18, [3.8, 2.6, 1.9]],
    [0.56, 0.78, 0.14, 0.033, [4.5, 4.6, 5.3]],
    [0.31, 0.87, 0.075, 0.06, [1.1, 1.6, 2.8]]
  ];
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const u = x / width,
        v = y / height,
        index = (y * width + x) * 4;
      const base = 0.1 + 0.19 * v * v;
      pixels.set([base * 1.09, base * 0.99, base * 1.15, 1], index);
      for (const [cx, cy, rx, ry, rgb] of softboxes) {
        const horizontal =
          Math.min(Math.abs(u - cx), 1 - Math.abs(u - cx)) / rx;
        const vertical = Math.abs(v - cy) / ry;
        const light =
          1 / (1 + Math.pow(horizontal, 12) + Math.pow(vertical, 12));
        for (let k = 0; k < 3; k++) pixels[index + k] += light * rgb[k];
      }
    }
  const texture = new DataTexture(pixels, width, height, RGBAFormat, FloatType);
  texture.mapping = EquirectangularReflectionMapping;
  texture.needsUpdate = true;
  const filter = new PMREMGenerator(renderer);
  const studio = filter.fromEquirectangular(texture);
  filter.dispose();
  texture.dispose();
  return studio;
}

function contactShadow() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const context = canvas.getContext('2d');
  context.scale(2.66, 1);
  const gradient = context.createRadialGradient(48, 48, 0, 48, 48, 47);
  gradient.addColorStop(0, 'rgba(39,19,46,.28)');
  gradient.addColorStop(0.42, 'rgba(46,27,53,.16)');
  gradient.addColorStop(1, 'rgba(55,33,60,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 96, 96);
  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  const shadow = new Mesh(
    new PlaneGeometry(2.34, 0.39),
    new MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      toneMapped: false
    })
  );
  shadow.position.set(0.04, -1.25, -0.56);
  return shadow;
}

export async function mountSculpture(stage) {
  const pane = stage.querySelector('.cacao-viewport'),
    controls = stage.querySelector('.cacao-controls');
  const canvas = document.createElement('canvas');
  const attributes = {
    antialias: true,
    alpha: true,
    powerPreference: 'low-power'
  };
  let renderer;
  try {
    const context = canvas.getContext('webgl2', attributes);
    if (!context) return;
    renderer = new WebGLRenderer({ canvas, context, ...attributes });
  } catch {
    return;
  }
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.14;
  renderer.setClearColor(0, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
  const scene = new Scene();
  const camera = new OrthographicCamera(-2, 2, 1.55, -1.55, 0.1, 20);
  camera.position.set(0, 0, 5);
  let model;
  try {
    model = await new GLTFLoader().loadAsync(
      new URL('./bitter-cacao.glb', import.meta.url).href
    );
  } catch (error) {
    renderer.dispose();
    throw error;
  }
  let lighting = studioLighting(renderer);
  scene.environment = lighting.texture;
  const material = new MeshPhysicalMaterial({
    metalness: 0.7,
    roughness: 0.23,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.04
  });
  model.scene.traverse((node) => {
    if (node.isMesh) {
      node.material.dispose();
      node.material = material;
    }
  });
  const root = new Group();
  root.add(model.scene);
  scene.add(root);
  scene.add(contactShadow());
  scene.add(new AmbientLight(0xe9dbeb, 0.35));
  const key = new DirectionalLight(0xffebd6, 2.3);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const rim = new DirectionalLight(0xd2dcff, 2);
  rim.position.set(4, 2, -1);
  scene.add(rim);
  const presets = {
    cacao: {
      color: 0xaf715b,
      metalness: 0.78,
      roughness: 0.21,
      iridescence: 0.15,
      clearcoat: 1
    },
    opal: {
      color: 0xc1b2e9,
      metalness: 0.44,
      roughness: 0.19,
      iridescence: 0.72,
      clearcoat: 1
    },
    silver: {
      color: 0xd9dddf,
      metalness: 0.98,
      roughness: 0.17,
      iridescence: 0,
      clearcoat: 0.7
    }
  };
  material.setValues(presets.cacao);
  pane.append(canvas);
  pane.tabIndex = 0;
  pane.setAttribute('aria-describedby', 'cacao-keys');
  pane.setAttribute('role', 'group');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const home = { x: -0.14, y: -0.23 };
  let x = home.x,
    y = home.y,
    targetX = x,
    targetY = y,
    frame = 0,
    previous = 0,
    visible = false,
    lost = false,
    manual = false,
    phase = 0,
    drag = null,
    dirty = true;
  let finishTransition;
  function size() {
    const width = pane.clientWidth,
      height = pane.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const aspect = width / height,
      halfHeight = Math.max(1.42, 1.55 / aspect);
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.left = -halfHeight * aspect;
    camera.right = -camera.left;
    camera.updateProjectionMatrix();
    dirty = true;
    request();
  }
  function request() {
    if (!frame && visible && !lost && !document.hidden)
      frame = requestAnimationFrame(tick);
  }
  function tick(time) {
    frame = 0;
    if (!visible || lost || document.hidden) return;
    const dt = Math.min((time - (previous || time)) / 1000, 0.055);
    previous = time;
    // Use the renderer's clock for both motion and material so an offscreen
    // or hidden stage suspends the transition at its current frame.
    if (finishTransition) {
      const next = reduce.matches ? finishTransition.duration() : finishTransition.time() + dt;
      finishTransition.time(next);
      dirty = true;
      if (next >= finishTransition.duration()) {
        finishTransition.kill();
        finishTransition = null;
        material.needsUpdate = true;
      }
    }
    const idle = !reduce.matches && !manual;
    if (idle) {
      phase += dt;
      targetY = home.y + 0.16 * Math.sin(phase * 0.54);
      targetX = home.x + 0.045 * Math.sin(phase * 0.65);
    }
    const ease = reduce.matches ? 1 : 1 - Math.exp(-dt * 13);
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    root.rotation.set(x, y, -0.04, 'YXZ');
    root.position.y = idle ? 0.065 + 0.032 * Math.sin(phase * 0.85) : 0.065;
    if (
      dirty ||
      idle ||
      Math.abs(targetX - x) + Math.abs(targetY - y) > 0.0001
    ) {
      renderer.render(scene, camera);
      dirty = false;
    }
    if (finishTransition || idle || Math.abs(targetX - x) + Math.abs(targetY - y) > 0.0001)
      request();
  }
  const move = (dx, dy) => {
    manual = true;
    targetY += dx;
    targetX = Math.max(-1.13, Math.min(1.13, targetX + dy));
    dirty = true;
    request();
  };
  pane.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      active: false
    };
  });
  pane.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x,
      dy = event.clientY - drag.y;
    if (!drag.active) {
      if (Math.abs(dx) + Math.abs(dy) < 4) return;
      if (event.pointerType === 'touch' && Math.abs(dx) < Math.abs(dy)) {
        drag = null;
        return;
      }
      pane.setPointerCapture(event.pointerId);
      stage.setAttribute('data-dragging', '');
      drag.active = true;
    }
    move(dx * 0.014, dy * 0.012);
    drag.x = event.clientX;
    drag.y = event.clientY;
  });
  function release(event) {
    if (event.pointerId === drag?.id) {
      drag = null;
      stage.removeAttribute('data-dragging');
    }
  }
  window.addEventListener('pointerup', release);
  pane.addEventListener('pointercancel', release);
  pane.addEventListener('keydown', (event) => {
    const steps = {
      ArrowLeft: [-0.27, 0],
      ArrowRight: [0.27, 0],
      ArrowUp: [0, -0.2],
      ArrowDown: [0, 0.2]
    };
    if (steps[event.key]) {
      event.preventDefault();
      move(...steps[event.key]);
    } else if (event.key === 'Home') {
      event.preventDefault();
      targetX = home.x;
      targetY = home.y;
      phase = 0;
      manual = false;
      dirty = true;
      request();
    }
  });
  for (const button of controls.querySelectorAll('button')) {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      const { color, ...finish } = presets[button.dataset.finish];
      finishTransition?.kill();
      finishTransition = null;
      if (reduce.matches) {
        material.setValues({ color, ...finish });
      } else {
        const { r, g, b } = material.color.clone().setHex(color);
        finishTransition = gsap.timeline({
          paused: true, defaults: { duration: 0.65, ease: 'sine.inOut' }
        });
        finishTransition.to(material.color, { r, g, b }, 0).to(material, finish, 0);
      }
      material.needsUpdate = true;
      controls
        .querySelectorAll('button')
        .forEach((other) =>
          other.setAttribute('aria-pressed', String(other === button))
        );
      dirty = true;
      request();
    });
  }
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    lost = true;
    stage.dataset.renderer = 'poster';
    controls.hidden = true;
    pane.removeAttribute('tabindex');
    pane.setAttribute('role', 'img');
    pane.removeAttribute('aria-describedby');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    lighting.dispose();
    lighting = studioLighting(renderer);
    scene.environment = lighting.texture;
    lost = false;
    dirty = true;
    pane.tabIndex = 0;
    pane.setAttribute('role', 'group');
    pane.setAttribute('aria-describedby', 'cacao-keys');
    controls.hidden = false;
    stage.dataset.renderer = 'webgl';
    request();
  });
  new ResizeObserver(size).observe(pane);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    previous = 0;
    if (visible) {
      dirty = true;
      request();
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }).observe(stage);
  document.addEventListener('visibilitychange', () => {
    previous = 0;
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else request();
  });
  reduce.addEventListener('change', () => {
    dirty = true;
    request();
  });
  size();
  root.rotation.set(x, y, -0.04, 'YXZ');
  root.position.y = 0.065;
  renderer.render(scene, camera);
  stage.dataset.renderer = 'webgl';
  controls.hidden = false;
}
