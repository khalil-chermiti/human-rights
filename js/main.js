/* ============================================================
   main.js — قائمة الجوّال + حركات Motion (fade / slide / stagger)
   ============================================================ */

"use strict";

/* ---------- زر التنقل العائم وقائمته ----------
   تُبنى القائمة هنا مرة واحدة وتُحقن في كل الصفحات،
   ويُحدد العنصر النشط من اسم الملف الحالي. */

const NAV_LINKS = [
  {
    href: "index.html",
    label: "الرئيسية",
    icon: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  },
  {
    href: "sources.html",
    label: "المصادر",
    icon: "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  },
  {
    href: "categories.html",
    label: "التصنيفات",
    icon: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z",
  },
  {
    href: "guarantees.html",
    label: "الضمانات",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
  },
  {
    href: "mechanisms.html",
    label: "الآليات",
    icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z",
  },
  {
    href: "timeline.html",
    label: "الخط الزمني",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  {
    href: "faq.html",
    label: "أسئلة شائعة",
    icon: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z",
  },
];

const currentPage = location.pathname.split("/").pop() || "index.html";

const navItemHTML = (link) => {
  const isActive = link.href === currentPage;
  const state = isActive
    ? "bg-blue-700 text-white"
    : "text-slate-700 hover:bg-blue-50 hover:text-blue-700";
  return `
    <li>
      <a href="${link.href}" ${isActive ? 'aria-current="page"' : ""}
         class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition duration-300 ${state}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
             stroke="currentColor" class="w-5 h-5 shrink-0" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="${link.icon}" />
        </svg>
        <span>${link.label}</span>
      </a>
    </li>`;
};

const fabRoot = document.createElement("div");
fabRoot.innerHTML = `
  <nav id="floating-menu"
       class="fixed bottom-24 right-6 z-50 w-64 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-blue-100 p-2 origin-bottom-right transition duration-200 opacity-0 scale-95 pointer-events-none"
       aria-label="قائمة التنقل" aria-hidden="true">
    <p class="flex items-center gap-2 px-4 pt-3 pb-2 text-sm font-bold text-blue-700">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
           stroke="currentColor" class="w-5 h-5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 3v17m0 0h4m-4 0H8m-3.5-5 3-7 3 7a4.2 4.2 0 0 1-6 0Zm9 0 3-7 3 7a4.2 4.2 0 0 1-6 0Z" />
      </svg>
      حقوق الإنسان
    </p>
    <ul class="space-y-1">${NAV_LINKS.map(navItemHTML).join("")}</ul>
  </nav>

  <button id="nav-fab" type="button"
          class="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-blue-700 text-white shadow-lg shadow-blue-700/40 hover:bg-blue-800 transition duration-300"
          aria-expanded="false" aria-controls="floating-menu" aria-label="فتح قائمة التنقل">
    <svg id="fab-icon-open" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
         stroke="currentColor" class="w-6 h-6" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
    <svg id="fab-icon-close" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
         stroke="currentColor" class="w-6 h-6 hidden" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  </button>`;
document.body.appendChild(fabRoot);

const fabButton = document.getElementById("nav-fab");
const floatingMenu = document.getElementById("floating-menu");
const fabIconOpen = document.getElementById("fab-icon-open");
const fabIconClose = document.getElementById("fab-icon-close");

const setMenuOpen = (open) => {
  floatingMenu.classList.toggle("opacity-0", !open);
  floatingMenu.classList.toggle("scale-95", !open);
  floatingMenu.classList.toggle("pointer-events-none", !open);
  floatingMenu.setAttribute("aria-hidden", String(!open));
  fabButton.setAttribute("aria-expanded", String(open));
  fabButton.setAttribute("aria-label", open ? "إغلاق قائمة التنقل" : "فتح قائمة التنقل");
  fabIconOpen.classList.toggle("hidden", open);
  fabIconClose.classList.toggle("hidden", !open);
};

fabButton.addEventListener("click", () => {
  setMenuOpen(fabButton.getAttribute("aria-expanded") !== "true");
});

// الإغلاق بمفتاح Escape أو بالنقر خارج القائمة
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && fabButton.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    fabButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (
    fabButton.getAttribute("aria-expanded") === "true" &&
    !event.target.closest("#floating-menu") &&
    !event.target.closest("#nav-fab")
  ) {
    setMenuOpen(false);
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
