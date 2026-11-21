document.querySelector('.print-gallery').addEventListener('click', (event) => {
  const tile = event.target.closest('[data-pick-print]');
  if (!tile) return;
  const choice = document.querySelector(`.choices [data-print="${tile.dataset.pickPrint}"]`);
  choice?.click();
});
