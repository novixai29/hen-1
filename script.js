"use strict";

/* ==========================================================
   ليلة الرشيد — RASHEED NIGHT

   غيّر معلومات الدعوة من هذا القسم فقط.
========================================================== */

const eventConfig = {

  fatherName: "أحمد محمود",

  groomName: "يوسف",

  dayName: "الجمعة",

  dateText: "23 أكتوبر 2026",

  dateDay: "23",

  dateMonth: "أكتوبر",

  dateYear: "2026",

  timeText: "7:30 مساءً",

  venue: "قاعة دجلة للمناسبات",

  city: "بغداد",

  address: "بغداد - شارع الكرادة",

  /*
    التاريخ بصيغة:
    YYYY-MM-DDTHH:mm:ss+03:00

    العراق = +03:00
  */
  eventDate: "2026-10-23T19:30:00+03:00",

  /*
    مدة الحفل المستخدمة داخل ملف التقويم.
  */
  eventDurationHours: 4,

  /*
    ضع هنا رابط Google Maps الحقيقي.
  */
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Baghdad",

  /*
    إذا تركته فارغاً سيستخدم رابط الصفحة الحالية تلقائياً.
  */
  invitationUrl: "",

  calendarTitle: "حنة يوسف",

  calendarDescription:
    "يتشرف السيد أحمد محمود بدعوتكم لمشاركته فرحة حنة ابنه يوسف. حضوركم يزيد أفراحنا سروراً."

};


/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  applyInvitationData();

  setupGate();

  setupRevealAnimations();

  setupJourneyAnimation();

  setupCountdown();

  setupMapsButton();

  setupCalendarButton();

  setupShareButton();

});


/* ==========================================================
   APPLY DATA
========================================================== */

function applyInvitationData() {

  const bindings = document.querySelectorAll("[data-bind]");

  bindings.forEach((element) => {

    const key = element.dataset.bind;

    if (key === "fatherFull") {

      element.textContent =
        `السيد ${eventConfig.fatherName}`;

      return;

    }

    if (
      Object.prototype.hasOwnProperty.call(
        eventConfig,
        key
      )
    ) {

      element.textContent =
        eventConfig[key];

    }

  });


  document.title =
    `ليلة الرشيد | حنة ${eventConfig.groomName}`;

}


/* ==========================================================
   BAGHDAD GATE
========================================================== */

function setupGate() {

  const gate =
    document.getElementById("baghdadGate");

  const button =
    document.getElementById("gateEnter");

  if (!gate || !button) {
    return;
  }

  document.body.classList.add("gate-active");


  function openGate() {

    if (
      gate.classList.contains("is-open")
    ) {
      return;
    }

    gate.classList.add("is-open");

    gate.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "gate-active"
    );


    window.setTimeout(() => {

      if (gate.parentNode) {
        gate.remove();
      }

    }, 1700);

  }


  button.addEventListener(
    "click",
    openGate
  );


  /*
    السماح بالفتح عبر Enter أو Space
  */
  button.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        openGate();

      }

    }
  );

}


/* ==========================================================
   REVEAL ANIMATIONS
========================================================== */

function setupRevealAnimations() {

  const elements =
    document.querySelectorAll(
      "[data-reveal]"
    );


  /*
    دعم prefers-reduced-motion
  */
  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduceMotion) {

    elements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;

  }


  if (
    !("IntersectionObserver" in window)
  ) {

    elements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;

  }


  const observer =
    new IntersectionObserver(

      (entries, currentObserver) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(
            "is-visible"
          );

          currentObserver.unobserve(
            entry.target
          );

        });

      },

      {
        threshold: 0.13,

        rootMargin:
          "0px 0px -35px 0px"
      }

    );


  elements.forEach((element, index) => {

    /*
      فرق بسيط جداً بين العناصر المتتالية
    */
    element.style.transitionDelay =
      `${Math.min(index % 4, 3) * 65}ms`;

    observer.observe(element);

  });

}


/* ==========================================================
   JOURNEY LINE
========================================================== */

function setupJourneyAnimation() {

  const journey =
    document.querySelector(".journey");

  if (!journey) {
    return;
  }


  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduceMotion) {

    journey.classList.add("is-visible");

    return;

  }


  if (
    !("IntersectionObserver" in window)
  ) {

    journey.classList.add("is-visible");

    return;

  }


  const observer =
    new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            journey.classList.add(
              "is-visible"
            );

            observer.disconnect();

          }

        });

      },

      {
        threshold: 0.15
      }

    );


  observer.observe(journey);

}


/* ==========================================================
   COUNTDOWN
========================================================== */

function setupCountdown() {

  const daysElement =
    document.getElementById("days");

  const hoursElement =
    document.getElementById("hours");

  const minutesElement =
    document.getElementById("minutes");

  const secondsElement =
    document.getElementById("seconds");

  const countdownElement =
    document.getElementById("countdown");

  const startedElement =
    document.getElementById("eventStarted");


  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }


  const target =
    new Date(eventConfig.eventDate);


  if (
    Number.isNaN(target.getTime())
  ) {

    console.warn(
      "eventConfig.eventDate is invalid."
    );

    return;

  }


  function updateCountdown() {

    const now =
      new Date();

    const distance =
      target.getTime() -
      now.getTime();


    if (distance <= 0) {

      daysElement.textContent =
        "00";

      hoursElement.textContent =
        "00";

      minutesElement.textContent =
        "00";

      secondsElement.textContent =
        "00";


      if (countdownElement) {
        countdownElement.hidden = true;
      }

      if (startedElement) {
        startedElement.hidden = false;
      }

      return false;

    }


    const dayMs =
      1000 * 60 * 60 * 24;

    const hourMs =
      1000 * 60 * 60;

    const minuteMs =
      1000 * 60;


    const days =
      Math.floor(
        distance / dayMs
      );

    const hours =
      Math.floor(
        (distance % dayMs) /
        hourMs
      );

    const minutes =
      Math.floor(
        (distance % hourMs) /
        minuteMs
      );

    const seconds =
      Math.floor(
        (distance % minuteMs) /
        1000
      );


    daysElement.textContent =
      formatNumber(days);

    hoursElement.textContent =
      formatNumber(hours);

    minutesElement.textContent =
      formatNumber(minutes);

    secondsElement.textContent =
      formatNumber(seconds);


    return true;

  }


  const active =
    updateCountdown();


  if (!active) {
    return;
  }


  const timer =
    window.setInterval(() => {

      const stillActive =
        updateCountdown();

      if (!stillActive) {
        window.clearInterval(timer);
      }

    }, 1000);

}


/* ==========================================================
   NUMBER FORMAT
========================================================== */

function formatNumber(value) {

  return String(value).padStart(2, "0");

}


/* ==========================================================
   MAPS
========================================================== */

function setupMapsButton() {

  const button =
    document.getElementById(
      "mapsButton"
    );

  if (!button) {
    return;
  }


  button.href =
    eventConfig.mapUrl;

}


/* ==========================================================
   CALENDAR
========================================================== */

function setupCalendarButton() {

  const button =
    document.getElementById(
      "calendarButton"
    );

  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    downloadCalendarEvent
  );

}


function downloadCalendarEvent() {

  const startDate =
    new Date(eventConfig.eventDate);


  if (
    Number.isNaN(
      startDate.getTime()
    )
  ) {

    showToast(
      "تعذر إنشاء الموعد"
    );

    return;

  }


  const endDate =
    new Date(
      startDate.getTime() +
      (
        eventConfig
          .eventDurationHours *
        60 *
        60 *
        1000
      )
    );


  /*
    نستخدم UTC داخل ملف ICS
    حتى يعمل على مختلف الأجهزة.
  */
  const startICS =
    toICSDate(startDate);

  const endICS =
    toICSDate(endDate);

  const nowICS =
    toICSDate(new Date());


  const location =
    `${eventConfig.venue} - ${eventConfig.city} - ${eventConfig.address}`;


  const description =
    `${eventConfig.calendarDescription}\n${getInvitationUrl()}`;


  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rasheed Night//Henna Invitation//AR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",

    "BEGIN:VEVENT",

    `UID:${Date.now()}@rasheed-night`,

    `DTSTAMP:${nowICS}`,

    `DTSTART:${startICS}`,

    `DTEND:${endICS}`,

    `SUMMARY:${escapeICSText(eventConfig.calendarTitle)}`,

    `DESCRIPTION:${escapeICSText(description)}`,

    `LOCATION:${escapeICSText(location)}`,

    "STATUS:CONFIRMED",

    "END:VEVENT",

    "END:VCALENDAR"

  ].join("\r\n");


  const blob =
    new Blob(
      [icsContent],
      {
        type:
          "text/calendar;charset=utf-8"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const anchor =
    document.createElement("a");

  anchor.href = url;

  anchor.download =
    `henna-${slugify(eventConfig.groomName)}.ics`;


  document.body.appendChild(
    anchor
  );

  anchor.click();

  anchor.remove();


  window.setTimeout(() => {

    URL.revokeObjectURL(url);

  }, 1000);


  showToast(
    "تم إنشاء موعد التقويم"
  );

}


function toICSDate(date) {

  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

}


function escapeICSText(text) {

  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

}


/* ==========================================================
   SHARE
========================================================== */

function setupShareButton() {

  const button =
    document.getElementById(
      "shareButton"
    );

  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    shareInvitation
  );

}


async function shareInvitation() {

  const url =
    getInvitationUrl();


  const title =
    `حنة ${eventConfig.groomName}`;


  const text =
    `يتشرف السيد ${eventConfig.fatherName} بدعوتكم لمشاركته فرحة حنة ابنه ${eventConfig.groomName}، ${eventConfig.dayName} ${eventConfig.dateText} الساعة ${eventConfig.timeText}.`;


  /*
    Web Share API
    يعمل بصورة ممتازة على iPhone و Android
  */
  if (navigator.share) {

    try {

      await navigator.share({
        title,
        text,
        url
      });

      return;

    }
    catch (error) {

      /*
        المستخدم قد يغلق نافذة المشاركة.
        لا نعرض Error في هذه الحالة.
      */
      if (
        error &&
        error.name === "AbortError"
      ) {
        return;
      }

    }

  }


  /*
    Clipboard fallback
  */
  const shareText =
    `${text}\n${url}`;


  const copied =
    await copyToClipboard(
      shareText
    );


  if (copied) {

    showToast(
      "تم نسخ رابط الدعوة"
    );

  }
  else {

    showToast(
      "تعذر النسخ تلقائياً"
    );

  }

}


/* ==========================================================
   CLIPBOARD
========================================================== */

async function copyToClipboard(text) {

  /*
    الطريقة الحديثة
  */
  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {

    try {

      await navigator.clipboard.writeText(
        text
      );

      return true;

    }
    catch (error) {

      console.warn(
        "Clipboard API failed:",
        error
      );

    }

  }


  /*
    Fallback للمتصفحات القديمة
  */
  try {

    const textarea =
      document.createElement(
        "textarea"
      );

    textarea.value = text;

    textarea.setAttribute(
      "readonly",
      ""
    );

    textarea.style.position =
      "fixed";

    textarea.style.opacity =
      "0";

    textarea.style.pointerEvents =
      "none";


    document.body.appendChild(
      textarea
    );


    textarea.select();

    textarea.setSelectionRange(
      0,
      textarea.value.length
    );


    const successful =
      document.execCommand(
        "copy"
      );


    textarea.remove();

    return successful;

  }
  catch (error) {

    console.warn(
      "Clipboard fallback failed:",
      error
    );

    return false;

  }

}


/* ==========================================================
   INVITATION URL
========================================================== */

function getInvitationUrl() {

  if (
    eventConfig.invitationUrl &&
    eventConfig.invitationUrl.trim()
  ) {

    return eventConfig
      .invitationUrl
      .trim();

  }


  return window.location.href
    .split("#")[0];

}


/* ==========================================================
   TOAST
========================================================== */

let toastTimer = null;


function showToast(message) {

  const toast =
    document.getElementById("toast");

  const toastText =
    document.getElementById(
      "toastText"
    );


  if (!toast || !toastText) {
    return;
  }


  toastText.textContent =
    message;


  toast.classList.add(
    "show"
  );


  if (toastTimer) {

    window.clearTimeout(
      toastTimer
    );

  }


  toastTimer =
    window.setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2600);

}


/* ==========================================================
   SIMPLE FILE NAME
========================================================== */

function slugify(value) {

  return String(value)
    .trim()
    .replace(/\s+/g, "-")
    .replace(
      /[^\u0600-\u06FFa-zA-Z0-9-_]/g,
      ""
    ) || "event";

}
