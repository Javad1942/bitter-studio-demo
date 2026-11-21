'use strict';

(() => {
  const stage = document.querySelector('#bitter-object');
  if (!stage) return;
  const load = async () => {
    try {
      const { mountSculpture } = await import('./scene.js');
      await mountSculpture(stage);
    } catch {
      // The poster is a render of the same mesh, available without a GPU.
      stage.dataset.renderer = 'poster';
    }
  };
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      load();
    },
    { rootMargin: '160px' }
  );
  observer.observe(stage);
})();
