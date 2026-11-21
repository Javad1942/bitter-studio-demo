const template = document.getElementById('slug');
const device = document.getElementById('size');
const position = document.getElementById('position');
const pair = document.getElementById('pair');
const selection = new URLSearchParams(location.hash.slice(1));
if ([...template.options].some(option => option.value === selection.get('name'))) {
  template.value = selection.get('name');
}
device.value = selection.get('view') || (matchMedia('(max-width: 620px)').matches ? 'mobile' : 'desktop');
if (!device.value) device.value = 'desktop';
function renderComparison() {
  const slug = template.value;
  pair.src = slug + '-' + device.value + position.value + '.jpg';
  pair.alt = template.selectedOptions[0].text + '، مودو سمت چپ و بیتر سمت راست';
  const root = location.protocol === 'file:' ? 'https://bitter-studio-concept.blackeel23.chatgpt.site/' : '../../';
  document.getElementById('site').href = root + 'design.html?name=' + slug;
  document.getElementById('ref').href = 'https://app.moodo.studio/seite/' + slug;
  if (location.protocol !== 'file:') history.replaceState(null, '', '#' + new URLSearchParams({name:slug,view:device.value}));
}
for (const select of [template, device, position]) select.addEventListener('change', renderComparison);
renderComparison();
