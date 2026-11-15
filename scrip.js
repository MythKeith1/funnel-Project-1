
/* =========================================
   NEXORA — PAGE 01 JAVASCRIPT
========================================= */


/* MOBILE NAVIGATION */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

  menuToggle.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("open");

    menuToggle.classList.toggle("active", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

  });


  // Close menu after selecting a navigation link.

  navLinks.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      navLinks.classList.remove("open");
      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

    });

  });


  // Close menu when clicking outside navigation.

  document.addEventListener("click", event => {

    const clickedInside =
      navLinks.contains(event.target) ||
      menuToggle.contains(event.target);

    if (!clickedInside) {

      navLinks.classList.remove("open");
      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

    }

  });

}


/* SCROLL REVEAL ANIMATIONS */

const revealElements = document.querySelectorAll(
  ".section-heading, .about-intro, .about-copy, " +
  ".challenge-card, .solution-item, .service-card, " +
  ".approach-step, .cta-content"
);

const motionPreference = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

if ("IntersectionObserver" in window && !motionPreference.matches) {

  revealElements.forEach(element => {
    element.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

}


/* AUTOMATIC COPYRIGHT YEAR */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


/* PREVENT EMPTY PAGE LINKS FROM BEING IGNORED */

document.querySelectorAll('a[href^="#"]').forEach(link => {

  link.addEventListener("click", event => {

    const targetId = link.getAttribute("href");

    if (targetId === "#") {
      event.preventDefault();
      return;
    }

    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: motionPreference.matches ? "auto" : "smooth",
        block: "start"
      });

    }

  });

});
