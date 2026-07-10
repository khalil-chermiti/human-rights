/* ============================================================
   main.js — قائمة الجوّال + حركات Motion (fade / slide / stagger)
   ============================================================ */

"use strict";

/* ---------- قائمة الجوّال ---------- */

const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");

menuButton.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("hidden") === false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

// إغلاق القائمة بعد اختيار رابط
mobileMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mobileMenu.classList.add("hidden");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

/* ---------- الأكورديون (الأسئلة الشائعة) ---------- */
// داخل المجموعة الواحدة يُفتح سؤال واحد فقط في كل مرة

document.querySelectorAll(".accordion-item").forEach((item) => {
  const trigger = item.querySelector(".accordion-trigger");
  if (!trigger) return;

  trigger.addEventListener("click", () => {
    const isOpen = item.dataset.open === "true";

    const group = item.closest("[data-accordion-group]");
    if (group && !isOpen) {
      group.querySelectorAll('.accordion-item[data-open="true"]').forEach((other) => {
        other.dataset.open = "false";
        other.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      });
    }

    item.dataset.open = String(!isOpen);
    trigger.setAttribute("aria-expanded", String(!isOpen));
  });
});

/* ---------- الخط الزمني: شريط تقدم يمتلئ مع التمرير ---------- */
// لا يعمل إلا في الصفحات التي تحتوي على الخط الزمني

const timelineWrap = document.getElementById("timeline");
const timelineProgress = document.getElementById("timeline-progress");

if (timelineWrap && timelineProgress) {
  const events = Array.from(timelineWrap.querySelectorAll(".timeline-event"));
  let ticking = false;

  const updateTimeline = () => {
    const rect = timelineWrap.getBoundingClientRect();
    // نقطة القياس: منتصف الشاشة تقريبًا
    const marker = window.innerHeight * 0.55;
    const passed = Math.min(Math.max(marker - rect.top, 0), rect.height);

    timelineProgress.style.height = `${(passed / rect.height) * 100}%`;

    events.forEach((event) => {
      const top = event.getBoundingClientRect().top;
      event.classList.toggle("is-passed", top < marker);
    });

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateTimeline);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", updateTimeline);
  updateTimeline();
}

/* ---------- الحركات ---------- */
// تُنفَّذ فقط إذا توفرت مكتبة Motion ولم يطلب المستخدم تقليل الحركة،
// وبذلك يبقى المحتوى ظاهرًا دائمًا في كل الأحوال.

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (window.Motion && !reducedMotion) {
  const { animate, inView, stagger } = window.Motion;

  // حركة دخول عناصر الواجهة الرئيسية (متتابعة)
  animate(
    "[data-hero]",
    { opacity: [0, 1], y: [30, 0] },
    { duration: 0.7, delay: stagger(0.15), easing: "ease-out" }
  );

  // ظهور تدريجي للأقسام عند بلوغها بالتمرير
  document.querySelectorAll("[data-reveal]").forEach((element) => {
    element.style.opacity = "0";
    inView(
      element,
      () => {
        animate(
          element,
          { opacity: [0, 1], y: [30, 0] },
          { duration: 0.6, easing: "ease-out" }
        );
      },
      { margin: "0px 0px -80px 0px" }
    );
  });

  // شبكات البطاقات: ظهور متتابع (stagger)
  document.querySelectorAll("[data-stagger]").forEach((grid) => {
    const cards = Array.from(grid.children);
    cards.forEach((card) => (card.style.opacity = "0"));
    inView(
      grid,
      () => {
        animate(
          cards,
          { opacity: [0, 1], y: [24, 0] },
          { duration: 0.5, delay: stagger(0.08), easing: "ease-out" }
        );
      },
      { margin: "0px 0px -80px 0px" }
    );
  });
}
