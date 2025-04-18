// navigation.js

export function initNavigation() {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  // Toggle del menú móvil
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("active");
    navToggle.innerHTML = mainNav.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Cerrar menú al hacer click en enlace (solo móvil)
  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 992) {
        mainNav.classList.remove("active");
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  // Scroll suave para enlaces
  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
        setTimeout(() => {
          history.pushState(null, null, targetId);
        }, 800);
      }
    });
  });

  // Tabs functionality
  const tabButtons = document.querySelectorAll(".tabs-tab");
  const tabContents = document.querySelectorAll(".tabs-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));
      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });
}

export function initScrollSpy() {
  const navLinks = document.querySelectorAll(".main-nav a");
  const sections = document.querySelectorAll("section[id]");
  let lastHash = "";

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 100;

    if (scrollPosition < 300) {
      if (lastHash !== "#inicio") {
        history.replaceState(null, null, "#inicio");
        setActiveLink("#inicio");
        lastHash = "#inicio";
      }
      return;
    }

    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      if (lastHash !== "#contacto") {
        history.replaceState(null, null, "#contacto");
        setActiveLink("#contacto");
        lastHash = "#contacto";
      }
      return;
    }

    for (const section of sections) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = `#${section.getAttribute("id")}`;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        if (lastHash !== sectionId) {
          history.replaceState(null, null, sectionId);
          setActiveLink(sectionId);
          lastHash = sectionId;
        }
        break;
      }
    }
  }

  function setActiveLink(hash) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === hash) {
        link.classList.add("active");
      }
    });
  }

  // Scroll listener optimizado
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(updateActiveLink);
  });

  // Hash inicial
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "auto",
      });
    }
  } else {
    history.replaceState(null, null, "#inicio");
  }

  updateActiveLink();
}
