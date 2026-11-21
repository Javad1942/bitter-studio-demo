const specimen = document.querySelector('.typeface');
const controls = document.querySelector('.sliders');
const widthSlider = document.querySelector('#width-range');
const weightSlider = document.querySelector('#weight-range');

function applyAxes() {
  const widthOffset = widthSlider.valueAsNumber - 100;
  const weightOffset = weightSlider.valueAsNumber - 550;
  specimen.style.setProperty('--width-offset', widthOffset);
  specimen.style.setProperty('--weight-offset', weightOffset);
  for (const glyph of specimen.querySelectorAll('.glyph')) {
    const width = Number(glyph.style.getPropertyValue('--width-axis')) + widthOffset;
    const weight = Number(glyph.style.getPropertyValue('--weight-axis')) + weightOffset;
    glyph.dataset.axes = Math.max(75, Math.min(125, width)) + ' · ' + Math.max(200, Math.min(900, weight));
  }
}

controls.addEventListener('input', applyAxes);
document.querySelector('#reset-type').addEventListener('click', applyAxes);
