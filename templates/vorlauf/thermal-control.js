const scene = document.querySelector('.hero .thermal-scene');
const split = scene.querySelector('.wipe');

// Once the visitor takes over, their slider position owns both the mask and the handle.
function takeControl() {
  scene.setAttribute('data-adjusted', '');
}
split.addEventListener('pointerdown', takeControl);
split.addEventListener('focus', takeControl);
split.addEventListener('input', takeControl);
scene.querySelector('.thermal-hot').addEventListener('animationend', (event) => {
  if (event.animationName !== 'thermal-expose' || scene.hasAttribute('data-adjusted')) return;
  split.value = '100';
  scene.style.setProperty('--split', '100%');
  split.setAttribute('aria-valuetext', '۱۰۰ درصد نمای سرد');
});
