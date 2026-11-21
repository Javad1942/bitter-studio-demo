"use strict";
const one = (s) => document.querySelector(s);
const all = (s) => [...document.querySelectorAll(s)];
const menu = one(".menut"),
  nav = one("#mobile-links"),
  header = one(".hero header"),
  dialog = one("#inspector");
function closeMenu() {
  nav.hidden = true;
  menu.setAttribute("aria-expanded", "false");
}
menu.addEventListener("click", () => {
  nav.hidden = !nav.hidden;
  menu.setAttribute("aria-expanded", String(!nav.hidden));
});
nav.addEventListener("click", closeMenu);
document.addEventListener("pointerdown", (e) => {
  if (!header.contains(e.target)) closeMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !nav.hidden) {
    closeMenu();
    menu.focus();
  }
});
new IntersectionObserver(
  ([entry]) => {
    header.classList.toggle(
      "stuck",
      !entry.isIntersecting && entry.boundingClientRect.bottom < 0,
    );
    closeMenu();
  },
  { threshold: 0 },
).observe(one(".hero"));
function inspect(button) {
  const im = button.querySelector("img"),
    name = button.dataset.item || im.alt,
    desc = button.querySelector("small")?.textContent;
  one(".dialog-art").replaceChildren(im.cloneNode());
  dialog.querySelector("h2").textContent = name;
  dialog.querySelector("p").textContent = desc || "";
  const action = dialog.querySelector("a");
  action.hidden = !desc;
  action.onclick = () => {
    dialog.close();
    one("textarea").value = "برای " + name + " اطلاعات بیشتری می‌خوام.";
    one("textarea").dispatchEvent(new Event("input", { bubbles: true }));
  };
  dialog.showModal();
}
all("[data-item],[data-photo]").forEach((b) =>
  b.addEventListener("click", () => inspect(b)),
);
dialog.querySelector(".x").onclick = () => dialog.close();
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
const names = ["قایق پدالی", "کانو", "تختهٔ پارویی", "قایق بادبانی"];
let slide = 0;
all("[data-turn]").forEach(
  (b) =>
    (b.onclick = () => {
      slide = (slide + Number(b.dataset.turn) + names.length) % names.length;
      one("#lake-cover").src = "lake" + slide + ".svg";
      one("#lake-next").src = "lake" + ((slide + 1) % 4) + ".svg";
      one("#boat-name").textContent = names[slide];
      one("#counter").textContent =
        (slide + 1).toLocaleString("fa-IR") + " از ۴";
    }),
);
all("[data-map]").forEach(
  (b) =>
    (b.onclick = () => {
      const open = b.closest(".map").classList.toggle("open");
      b.nextElementSibling.hidden = !open;
      b.textContent = open ? "جمع کردن نقشه" : "نمایش نقشهٔ شماتیک";
      b.setAttribute("aria-expanded", String(open));
    }),
);
one("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const text = [
    "درخواست پیش‌نمایش " + document.title,
    "نام: " + data.get("name"),
    "ایمیل: " + data.get("email"),
    data.get("note"),
  ].join("\n");
  const u = URL.createObjectURL(
    new Blob(["\ufeff" + text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = u;
  a.download = "درخواست.txt";
  a.click();
  one("form output").textContent = "فایل درخواست آماده شد. این فرم نمایشی است.";
  setTimeout(() => URL.revokeObjectURL(u), 5000);
});

const rail = one(".offers");
const railControls = all("[data-step]");
function syncRail() {
  const position = Math.abs(rail.scrollLeft);
  const limit = rail.scrollWidth - rail.clientWidth;
  railControls[0].disabled = position < 2;
  railControls[1].disabled = position >= limit - 2;
}
railControls.forEach((control) =>
  control.addEventListener("click", () => {
    const distance =
      rail.firstElementChild.getBoundingClientRect().width +
      parseFloat(getComputedStyle(rail).gap);
    rail.scrollBy({
      left: -Number(control.dataset.step) * distance,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }),
);
rail.addEventListener("scroll", syncRail, { passive: true });
new ResizeObserver(syncRail).observe(rail);
syncRail();
all("[data-place]").forEach((control, index) =>
  control.addEventListener("click", () => {
    const map = control.closest(".branch-map");
    map.classList.toggle("alternate", index === 1);
    map
      .querySelectorAll("button")
      .forEach((other) =>
        other.setAttribute("aria-pressed", String(other === control)),
      );
    map.querySelector("output").textContent =
      index === 1
        ? "شعبهٔ باغ، کنار درِ حیاط"
        : "شعبهٔ بازار، کنار ورودی بازار";
  }),
);

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add("entering");
      target.addEventListener(
        "animationend",
        () => target.classList.remove("entering"),
        { once: true },
      );
      reveal.unobserve(target);
    });
  });
  all("main > .section").forEach((section) => reveal.observe(section));
}
