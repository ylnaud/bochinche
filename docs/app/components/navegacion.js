export function navigation() {
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
      }
    });
  });

  // Scrollspy para resaltar enlaces
  document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".main-nav a");
    const sections = document.querySelectorAll("section[id]");

    function updateActiveLink() {
      let scrollPosition = window.scrollY + 100;

      // Caso especial para la parte superior
      if (scrollPosition < 300) {
        history.replaceState(null, null, "#inicio");
        setActiveLink("#inicio");
        return;
      }

      // Caso especial para el final de la página
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        history.replaceState(null, null, "#contacto");
        setActiveLink("#contacto");
        return;
      }

      // Revisar cada sección
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          const sectionId = section.getAttribute("id");
          history.replaceState(null, null, `#${sectionId}`);
          setActiveLink(`#${sectionId}`);
        }
      });
    }

    function setActiveLink(hash) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === hash) {
          link.classList.add("active");
        }
      });
    }

    // Configurar click en enlaces
    navLinks.forEach((link) => {
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

    // Configurar scroll listener
    window.addEventListener("scroll", () => {
      requestAnimationFrame(updateActiveLink);
    });

    // Manejar hash inicial
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
  });

  // Tabs functionality
  const tabButtons = document.querySelectorAll(".tabs-tab");
  const tabContents = document.querySelectorAll(".tabs-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remover activo de todos
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Activar el seleccionado
      button.classList.add("active");
      const tabId = button.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });
}
