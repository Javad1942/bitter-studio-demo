'use strict';

window.BitterSelect = (() => {
  const instances = new WeakMap();
  let current = null;
  let serial = 0;

  function element(tag, name) {
    const node = document.createElement(tag);
    if (name) node.className = 'bitter-pick-' + name;
    return node;
  }

  function searchableText(value) {
    return value.toLocaleLowerCase('fa').replace(/ي|ى/g, 'ی').replace(/ك/g, 'ک')
      .replace(/[\u064B-\u065F\u0670]/g, '').replace(/[\s\u200C\u200D-]+/g, '');
  }

  function enhance(select, {searchable = false, label, placeholder = 'جست‌وجو…'} = {}) {
    if (instances.has(select)) return instances.get(select);
    const id = 'bitter-choice-' + (++serial);
    const caption = label || select.getAttribute('aria-label') || select.name;
    const trigger = element('button', 'trigger');
    const value = element('span');
    const panel = element('div', 'panel');
    const list = element('div', 'list');
    const empty = element('div', 'empty');
    const search = searchable ? element('input') : null;
    let rows = [];
    let active = -1;
    let listeners;
    let frame = 0;
    let aboveAnchor = null;

    trigger.type = 'button';
    trigger.id = id;
    trigger.setAttribute('aria-haspopup', searchable ? 'dialog' : 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', id + (searchable ? '-panel' : '-list'));
    trigger.append(value);
    panel.id = id + '-panel';
    panel.hidden = true;
    panel.dir = 'rtl';
    if (typeof panel.showPopover === 'function') panel.popover = 'manual';
    list.id = id + '-list';
    list.tabIndex = -1;
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', caption);
    if (search) {
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', caption);
      const searchWrap = element('div', 'search');
      search.type = 'text';
      search.dir = 'rtl';
      search.autocomplete = 'off';
      search.spellcheck = false;
      search.placeholder = placeholder;
      search.setAttribute('aria-label', placeholder);
      search.setAttribute('role', 'combobox');
      search.setAttribute('aria-autocomplete', 'list');
      search.setAttribute('aria-expanded', 'true');
      search.setAttribute('aria-controls', list.id);
      searchWrap.append(search);
      panel.append(searchWrap);
      search.addEventListener('input', () => draw(true));
    }
    empty.textContent = 'طرحی پیدا نشد. یه اسم یا زمینهٔ دیگه رو امتحان کن.';
    empty.setAttribute('role', 'status');
    panel.append(list, empty);
    const labels = [...select.labels];
    const wrap = select.closest('label');
    select.after(trigger);
    (wrap || trigger).after(panel);
    labels.forEach(node => { node.htmlFor = trigger.id; });
    select.hidden = true;
    select.dataset.bitterSelect = '';

    function refresh() {
      const option = select.selectedOptions[0];
      value.textContent = option?.dataset.title || option?.textContent || caption;
      trigger.disabled = select.disabled;
      trigger.setAttribute('aria-label', caption + '، ' + value.textContent);
      if (!panel.hidden) {
        if (select.disabled) close();
        else draw(false);
      }
    }

    function highlight(index, scroll) {
      rows[active]?.removeAttribute('data-active');
      active = index;
      const row = rows[index];
      for (const focusTarget of [list, search].filter(Boolean)) {
        if (row) focusTarget.setAttribute('aria-activedescendant', row.id);
        else focusTarget.removeAttribute('aria-activedescendant');
      }
      if (!row) return;
      row.dataset.active = '';
      if (scroll) {
        const offset = row.getBoundingClientRect().top - list.getBoundingClientRect().top;
        if (offset < 0) list.scrollTop += offset;
        else if (offset + row.offsetHeight > list.clientHeight) list.scrollTop += offset + row.offsetHeight - list.clientHeight;
      }
    }

    function draw(filtered) {
      const query = searchableText(search?.value || '');
      const items = document.createDocumentFragment();
      for (const option of select.options) {
        const searchParts = [option.text, option.dataset.detail, option.dataset.search, option.value];
        if (option.disabled || (query && (!option.value || !searchableText(searchParts.join(' ')).includes(query)))) continue;
        const row = element('div', 'option');
        row.id = id + '-option-' + option.index;
        row.dataset.index = option.index;
        row.setAttribute('role', 'option');
        row.setAttribute('aria-selected', String(option.selected));
        if (option.dataset.color) {
          const dot = element('span','dot');
          dot.style.backgroundColor = option.dataset.color;
          row.append(dot);
        }
        const text = element('span');
        const name = element('strong');
        name.textContent = option.dataset.title || option.text;
        text.append(name);
        if (option.dataset.detail) {
          const detail = element('small');
          detail.textContent = option.dataset.detail;
          text.append(detail);
        }
        row.append(text);
        items.append(row);
      }
      list.replaceChildren(items);
      rows = [...list.children];
      empty.hidden = !!rows.length;
      const selected = filtered ? -1 : rows.findIndex(row => Number(row.dataset.index) === select.selectedIndex);
      if (aboveAnchor !== null) place(true);
      highlight(rows.length ? Math.max(selected, 0) : -1, true);
    }

    function place(keepSide = false) {
      frame = 0;
      if (panel.hidden) return;
      const rect = trigger.getBoundingClientRect();
      const viewport = window.visualViewport;
      const top = viewport?.offsetTop || 0;
      const left = viewport?.offsetLeft || 0;
      const height = viewport?.height || document.documentElement.clientHeight;
      const width = viewport?.width || document.documentElement.clientWidth;
      const below = top + height - rect.bottom - 16;
      const above = rect.top - top - 16;
      if (!rect.width || !rect.height || rect.bottom <= top || rect.top >= top + height) { close(false); return; }
      const desired = Math.min(356, panel.scrollHeight + list.scrollHeight - list.clientHeight + 2);
      const flip = keepSide && aboveAnchor !== null ? aboveAnchor : below < desired && above > below;
      aboveAnchor = flip;
      const available = Math.max(64, flip ? above : below);
      const panelWidth = Math.min(Math.max(rect.width, searchable ? 280 : 235), width - 16);
      panel.style.width = panelWidth + 'px';
      panel.style.maxHeight = Math.min(356, available) + 'px';
      panel.style.left = Math.max(left + 8, Math.min(rect.right - panelWidth, left + width - panelWidth - 8)) + 'px';
      const y = flip ? rect.top - panel.offsetHeight - 6 : rect.bottom + 6;
      panel.style.top = Math.max(top + 6, Math.min(y, top + height - panel.offsetHeight - 6)) + 'px';
      panel.style.setProperty('--origin', flip ? 'bottom' : 'top');
      panel.style.setProperty('--enter', flip ? '3px' : '-3px');
    }

    function queuePlace(event) {
      if (panel.contains(event.target instanceof Node ? event.target : null)) return;
      if (!frame) frame = requestAnimationFrame(() => place());
    }

    function close(focus = false) {
      if (panel.hidden) return;
      listeners.abort();
      cancelAnimationFrame(frame);
      frame = 0;
      if (panel.popover) panel.hidePopover();
      panel.hidden = true;
      aboveAnchor = null;
      trigger.setAttribute('aria-expanded', 'false');
      current = null;
      if (focus) trigger.focus({preventScroll:true});
    }

    function open() {
      if (trigger.matches(':disabled') || !panel.hidden) return;
      current?.close();
      current = api;
      listeners = new AbortController();
      const options = {signal:listeners.signal};
      const capture = {...options, capture:true};
      if (search) search.value = '';
      panel.hidden = false;
      if (panel.popover) panel.showPopover();
      trigger.setAttribute('aria-expanded','true');
      draw(false);
      place();
      if (panel.hidden) return;
      highlight(active,true);
      // On touch, the list opens first. Tapping the search box then opens the keyboard.
      const focusTarget = search && !matchMedia('(hover: none) and (pointer: coarse)').matches ? search : list;
      focusTarget.focus({preventScroll:true});
      document.addEventListener('pointerdown', event => {
        if (!panel.contains(event.target) && !trigger.contains(event.target)) close();
      },capture);
      document.addEventListener('focusin', event => {
        if (!panel.contains(event.target) && !trigger.contains(event.target)) close();
      },capture);
      select.closest('dialog')?.addEventListener('close', () => close(),options);
      window.addEventListener('scroll',queuePlace,capture);
      window.addEventListener('resize',queuePlace,options);
      window.visualViewport?.addEventListener('resize',queuePlace,options);
      window.visualViewport?.addEventListener('scroll',queuePlace,options);
    }

    function choose(row) {
      if (!row) return;
      const index = Number(row.dataset.index);
      const changed = select.selectedIndex !== index;
      select.selectedIndex = index;
      close(true);
      refresh();
      if (changed) {
        select.dispatchEvent(new Event('input',{bubbles:true}));
        select.dispatchEvent(new Event('change',{bubbles:true}));
      }
    }

    trigger.addEventListener('click', () => panel.hidden ? open() : close(true));
    trigger.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        open();
      }
    });
    panel.addEventListener('keydown', event => {
      if (event.isComposing) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close(true);
      } else if (event.key === 'Enter' || (event.key === ' ' && event.target !== search)) {
        event.preventDefault();
        choose(rows[active]);
      } else if (event.key === 'Tab') {
        // Let the browser continue from the trigger in the form's natural tab order.
        close(true);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const move = event.key === 'ArrowDown' ? 1 : -1;
        highlight(rows.length ? Math.max(0,Math.min(rows.length-1,active+move)) : -1,true);
      } else if (event.target !== search && ['Home','End'].includes(event.key)) {
        event.preventDefault();
        highlight(event.key === 'Home' ? 0 : rows.length-1,true);
      }
    });
    list.addEventListener('pointermove', event => {
      const row = event.target.closest('[role=option]');
      if (event.pointerType === 'mouse' && row) highlight(rows.indexOf(row),false);
    });
    list.addEventListener('click', event => choose(event.target.closest('[role=option]')));
    select.addEventListener('change', refresh);
    select.form?.addEventListener('reset', () => queueMicrotask(refresh));
    const api = {refresh, close, trigger};
    instances.set(select, api);
    refresh();
    return api;
  }

  return {enhance};
})();
