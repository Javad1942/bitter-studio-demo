for (const map of document.querySelectorAll('.demo-location')) {
  const zoom = map.querySelector('button');
  zoom.addEventListener('click', () => {
    const enlarged = map.toggleAttribute('data-zoom');
    zoom.setAttribute('aria-pressed', String(enlarged));
    zoom.textContent = enlarged ? 'نمای کلی نقشه' : 'بزرگ‌نمایی نقشه';
  });
}
