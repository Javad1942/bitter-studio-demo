(() => {
  const options = document.querySelectorAll("[data-note]");
  for (const button of options) {
    button.addEventListener("click", () => {
      for (const option of options)
        option.setAttribute("aria-pressed", String(option === button));
      for (const text of document.querySelectorAll("[data-answer]")) {
        text.hidden = text.dataset.answer !== button.dataset.note;
      }
      if (document.body.classList.contains("bogen")) {
        document.querySelector(".note-layout img").src =
          "work-" + (Number(button.dataset.note) + 1) + ".svg";
      }
    });
  }
  for (const link of document.querySelectorAll("[data-film-filter]")) {
    link.addEventListener("click", () => {
      Array.from(document.querySelectorAll("[data-filter]"))
        .find((button) => button.dataset.filter === link.dataset.filmFilter)
        ?.click();
    });
  }
  const arrive = document.querySelector("#arrive");
  if (!arrive) return;
  const depart = document.querySelector("#depart");
  const add = document.querySelector("#stay-add");
  const label = document.querySelector("#stay-status");
  const numbers = new Intl.NumberFormat("fa");
  let stay = "";
  function updateDates() {
    const nights = (depart.valueAsNumber - arrive.valueAsNumber) / 86400000;
    const valid = Number.isFinite(nights) && nights > 0;
    add.disabled = !valid;
    stay = valid
      ? "اقامت " +
        numbers.format(nights) +
        " شب، از " +
        arrive.value +
        " تا " +
        depart.value
      : "";
    label.textContent =
      stay ||
      (arrive.value && depart.value
        ? "خروج باید بعد از تاریخ ورود باشد."
        : "دو تاریخ را انتخاب کن.");
  }
  arrive.addEventListener("input", updateDates);
  depart.addEventListener("input", updateDates);
  add.addEventListener("click", () => {
    const form = document.querySelector(".contact form");
    if (!form.elements.topic.value) form.elements.topic.value = "اقامت در کلبه";
    const previous = form.elements.note.value
      .split("\n")
      .filter((line) => !line.startsWith("اقامت ") && line.trim());
    form.elements.note.value = [...previous, stay].join("\n");
    document.querySelector("#contact").scrollIntoView();
    form.elements.visitor.focus({ preventScroll: true });
  });
})();
