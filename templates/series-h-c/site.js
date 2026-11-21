"use strict";

const one = (selector, root = document) => root.querySelector(selector);
const all = (selector, root = document) => [...root.querySelectorAll(selector)];
const header = one(".topbar");
const menu = one(".menupanel");
const toggle = one(".menutoggle");
function setMenu(open) {
  menu.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "بستن فهرست" : "باز کردن فهرست");
}
toggle.addEventListener("click", () => setMenu(menu.hidden));
menu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("click", (event) => {
  if (
    !menu.hidden &&
    !menu.contains(event.target) &&
    !toggle.contains(event.target)
  )
    setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menu.hidden) {
    setMenu(false);
    toggle.focus();
  }
});
matchMedia("(min-width:761px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});
const scrollMarker = new IntersectionObserver(([entry]) => {
  header.classList.toggle("stuck", !entry.isIntersecting);
  if (!entry.isIntersecting) setMenu(false);
});
scrollMarker.observe(one(".hero"));

const lightbox = one(".lightbox");
all("[data-view]").forEach((button) =>
  button.addEventListener("click", () => {
    const source = one("img", button);
    const enlarged = one("img", lightbox);
    enlarged.src = source.currentSrc;
    enlarged.alt = source.alt;
    one("h2", lightbox).textContent = button.dataset.caption;
    lightbox.showModal();
  }),
);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    const box = lightbox.getBoundingClientRect();
    if (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    )
      lightbox.close();
  }
});

const brief = one(".brief");
function selectTopic(topic, line) {
  brief.elements.topic.value = topic;
  if (line) brief.elements.message.value = line;
  location.hash = "contact";
  brief.elements.name.focus({ preventScroll: true });
}
all("[data-topic]").forEach((button) =>
  button.addEventListener("click", () => selectTopic(button.dataset.topic)),
);
brief.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = new FormData(brief);
  const brand = one("[data-template-brand]").textContent;
  const note = [
    brand,
    "نام: " + fields.get("name"),
    "موضوع: " + fields.get("topic"),
    fields.get("message"),
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob(["\ufeff" + note], { type: "text/plain;charset=utf-8" }),
  );
  const fileLink = document.createElement("a");
  fileLink.href = url;
  fileLink.download = document.body.className + "-request.txt";
  document.body.append(fileLink);
  fileLink.click();
  fileLink.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  one("output", brief).textContent = "فایل خلاصهٔ درخواستت آماده شد.";
});

const story = one(".story");
if (story) {
  const play = one(".storyplay");
  const reduce = matchMedia("(prefers-reduced-motion:reduce)");
  let paused = reduce.matches;
  let index = 0;
  const captions = [
    "تصویرسازی مربی میان گل‌های بهاری",
    "آسمان و چمنزار بهاری",
    "سایه‌های روشن روی تپه",
    "پالت رنگی کارگاه",
  ];
  function renderPause() {
    story.classList.toggle("paused", paused);
    play.textContent = paused ? "پخش ▶" : "مکث Ⅱ";
    play.setAttribute("aria-pressed", String(paused));
  }
  const advanceFrame = () => {
    if (paused || document.hidden) return;
    index = (index + 1) % 4;
    const photo = one("img", story);
    photo.src = "portrait-" + index + ".svg";
    photo.alt = captions[index];
  };
  one(".storyprogress").addEventListener("animationiteration", advanceFrame);
  if (reduce.matches) window.setInterval(advanceFrame, 8000);
  play.addEventListener("click", () => {
    paused = !paused;
    renderPause();
  });
  renderPause();
}

all("[data-hue]").forEach((button) =>
  button.addEventListener("click", () => {
    all("[data-hue]").forEach((swatch) =>
      swatch.setAttribute("aria-pressed", String(button === swatch)),
    );
    one(".robot img").style.filter =
      "hue-rotate(" + button.dataset.hue + "deg)";
  }),
);
const demo = one(".flowpanel");
if (demo) {
  const run = one(".flowrun");
  const choice = one(".flowchoice");
  const steps = all("li", demo);
  const status = one(".flowstatus");
  let current = -1;
  function reset() {
    current = -1;
    steps.forEach((step) => step.classList.remove("active", "done"));
    run.textContent = "اجرای گردش کار ←";
    status.textContent = "";
  }
  choice.addEventListener("change", reset);
  one("[data-demo]").addEventListener("click", () => {
    location.hash = "demo";
    choice.focus({ preventScroll: true });
  });
  run.addEventListener("click", () => {
    if (current === steps.length - 1) {
      reset();
      return;
    }
    current++;
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === current);
      step.classList.toggle("done", index < current);
    });
    status.textContent = choice.value + " — " + steps[current].textContent;
    run.textContent =
      current === steps.length - 1 ? "شروع دوباره ↻" : "مرحلهٔ بعد ←";
  });
}

if (one(".screen")) {
  const films = ["ظهر تابستان", "بعد از غروب", "مسافر آبی"];
  const numerals = ["۱", "۲", "۳"];
  let current = 0;
  function changeFilm(delta) {
    current = (current + delta + films.length) % films.length;
    const frame = one(".screen img");
    frame.src = "film-" + current + ".svg";
    frame.alt = "پوستر فیلم " + films[current];
    one(".filmnumber").textContent = numerals[current] + " از ۳";
    one(".filmname").textContent = films[current];
  }
  one(".nextfilm").addEventListener("click", () => changeFilm(1));
  one(".prevfilm").addEventListener("click", () => changeFilm(-1));
  all("[data-day]").forEach((button) =>
    button.addEventListener("click", () => {
      all("[data-day]").forEach((tab) =>
        tab.setAttribute("aria-pressed", String(tab === button)),
      );
      all("[data-show]").forEach((row) => {
        row.hidden = row.dataset.show !== button.dataset.day;
      });
    }),
  );
  all("[data-ticket]").forEach((button) =>
    button.addEventListener("click", () =>
      selectTopic(button.dataset.ticket, "سانس " + button.dataset.time),
    ),
  );
}
