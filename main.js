const SITE = {
  name: "Mahendra Singh Khati",
  role: "Software Engineer — Backend & Platform Systems",
  location: "Pune, Maharashtra",
  title: "Mahendra Singh Khati | Software Engineer",
  description:
    "Software engineer with 6+ years building production backend systems across APIs, event-driven workflows, and distributed messaging.",
  email: "mkhati47@gmail.com",
  github: "https://github.com/mrmahendra27",
  linkedin: "https://www.linkedin.com/in/mahendra-singh-khati",
  portrait: "11316.jpg",
};

const FORM_LIMITS = {
  name: 80,
  email: 254,
  message: 2000,
};

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function sanitizePlainText(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isSafeHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isSafeMailtoAddress(value) {
  return isValidEmail(value) && !/[\s<>"']/.test(value);
}

function isSafeSocialUrl(value, linkType) {
  if (!isSafeHttpUrl(value)) {
    return false;
  }

  const hostname = new URL(value).hostname.toLowerCase();

  if (linkType === "github") {
    return hostname === "github.com";
  }

  if (linkType === "linkedin") {
    return hostname === "linkedin.com" || hostname === "www.linkedin.com";
  }

  return false;
}

function setExternalLink(selector, value, linkType) {
  const element = document.querySelector(selector);
  if (!element || !isSafeSocialUrl(value, linkType)) {
    return;
  }

  element.href = value;
  element.target = "_blank";
  element.rel = "noopener noreferrer";
}

function setMailtoLink(selector, value) {
  const element = document.querySelector(selector);
  if (!element || !isSafeMailtoAddress(value)) {
    return;
  }

  element.href = `mailto:${value}`;
}

function configureContactForm() {
  const form = document.getElementById("contact-form");
  const sendButton = document.getElementById("contact-send");
  const status = document.getElementById("form-status");
  if (!form || !sendButton) {
    return;
  }

  const sendMessage = () => {
    if (!isSafeMailtoAddress(SITE.email)) {
      if (status) {
        status.textContent = "Contact email is not configured yet.";
      }
      return;
    }

    const formData = new FormData(form);
    const name = sanitizePlainText(formData.get("name"), FORM_LIMITS.name);
    const email = sanitizePlainText(formData.get("email"), FORM_LIMITS.email);
    const message = sanitizePlainText(formData.get("message"), FORM_LIMITS.message);

    if (!name || !isValidEmail(email) || !message) {
      if (status) {
        status.textContent = "Enter a valid name, email address, and message.";
      }
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );

    window.location.assign(`mailto:${SITE.email}?subject=${subject}&body=${body}`);

    if (status) {
      status.textContent =
        "Your email app should open with the message draft. If it does not, use the email link in the contact section.";
    }
  };

  sendButton.addEventListener("click", sendMessage);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage();
  });
}

function configureMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("site-nav");
  if (!toggle || !menu) {
    return;
  }

  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
      closeMenu();
    }
  });
}

function configureCaseStudies() {
  const section = document.getElementById("projects");
  const picker = section?.querySelector(".case-study-picker");
  if (!section || !picker) {
    return;
  }

  const triggers = picker.querySelectorAll("[data-case-study]");
  const panels = section.querySelectorAll("[data-case-study-panel]");

  const setActive = (studyId) => {
    triggers.forEach((trigger) => {
      const isActive = trigger.dataset.caseStudy === studyId;
      trigger.classList.toggle("is-active", isActive);
      trigger.setAttribute("aria-selected", String(isActive));
      trigger.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.caseStudyPanel === studyId;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      setActive(trigger.dataset.caseStudy);
    });
  });

  picker.addEventListener("keydown", (event) => {
    const tabs = Array.from(triggers);
    const currentIndex = tabs.findIndex((tab) => tab.classList.contains("is-active"));
    if (currentIndex === -1) {
      return;
    }

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    setActive(nextTab.dataset.caseStudy);
    nextTab.focus();
  });

  const initial = triggers[0];
  if (initial) {
    setActive(initial.dataset.caseStudy);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.title = SITE.title;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", SITE.description);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", SITE.title);
  }

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute("content", SITE.description);
  }

  setText("[data-site-name]", SITE.name);
  setText("[data-site-role]", SITE.role);
  setText("[data-site-location]", SITE.location);

  const portrait = document.getElementById("site-portrait");
  if (portrait && SITE.portrait) {
    portrait.src = SITE.portrait;
    portrait.alt = `Portrait of ${SITE.name}`;
  }

  setExternalLink("#github-link", SITE.github, "github");
  setExternalLink("#linkedin-link", SITE.linkedin, "linkedin");
  setMailtoLink("#email-link", SITE.email);

  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  configureContactForm();
  configureMobileNav();
  configureCaseStudies();
});
