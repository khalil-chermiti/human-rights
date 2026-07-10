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
