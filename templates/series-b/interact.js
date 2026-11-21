(() => {
  const menu = document.querySelector(".menu");
  const nav = document.querySelector("#nav");
  function closeMenu() {
    menu.setAttribute("aria-expanded", "false");
    nav.removeAttribute("data-open");
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") === "false";
    menu.setAttribute("aria-expanded", String(open));
    nav.toggleAttribute("data-open", open);
  });
  document.addEventListener("click", (event) => {
    if (
      !menu.contains(event.target) &&
      (!nav.contains(event.target) || event.target.closest("a"))
    )
      closeMenu();
  });
  window.matchMedia("(max-width:760px)").addEventListener("change", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menu.focus();
    }
  });
  function markSelected(items, selected) {
    for (const item of items)
      item.setAttribute("aria-pressed", String(item === selected));
  }
  const topics = document.querySelector('input[name="topic"]');
  document.querySelectorAll("[data-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      topics.value = button.dataset.pick;
      document.querySelector("#contact").scrollIntoView({ block: "start" });
      document
        .querySelector('input[name="visitor"]')
        .focus({ preventScroll: true });
    });
  });
  const filters = document.querySelectorAll("[data-filter]");
  for (const button of filters) {
    button.addEventListener("click", () => {
      markSelected(filters, button);
      for (const card of document.querySelectorAll("[data-category]")) {
        card.hidden =
          button.dataset.filter !== "همه" &&
          card.dataset.category !== button.dataset.filter;
      }
    });
  }
  const days = document.querySelectorAll("[data-day]");
  for (const button of days) {
    button.addEventListener("click", () => {
      markSelected(days, button);
      for (const row of document.querySelectorAll("[data-slots]"))
        row.hidden = row.dataset.slots !== button.dataset.day;
    });
  }
  const swatches = document.querySelectorAll("[data-bike]");
  for (const button of swatches) {
    button.addEventListener("click", () => {
      markSelected(swatches, button);
      document.querySelector(".bike-show .hero-art").style.filter = [
        "none",
        "hue-rotate(125deg)",
        "hue-rotate(210deg)",
      ][button.dataset.bike];
    });
  }
  const range = document.querySelector("[data-calc]");
  if (range) {
    const numbers = new Intl.NumberFormat("fa", { maximumFractionDigits: 1 });
    range.addEventListener("input", () => {
      const value = Number(range.value);
      document.querySelector("#input-sum").textContent = numbers.format(value);
      document.querySelector("#calc-value b").textContent = numbers.format(
        range.dataset.calc === "groschen" ? Math.ceil(60 / value) : value / 30,
      );
    });
  }
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    const text = [
      document.title,
      "نام: " + values.get("visitor"),
      "موضوع: " + values.get("topic"),
      values.get("note") || "",
    ].join("\n");
    const file = URL.createObjectURL(
      new Blob(["\ufeff", text], { type: "text/plain;charset=utf-8" }),
    );
    const download = document.createElement("a");
    download.href = file;
    download.download =
      "bitter-" + document.body.className.split(" ")[0] + ".txt";
    document.body.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(file), 1500);
    form.querySelector("[role=status]").textContent =
      "خلاصه‌ی درخواست برای دانلود آماده شد.";
  });
})();
