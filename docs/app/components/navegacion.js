// Navegación móvil
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

export function navegation() {
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("active");
    navToggle.innerHTML = mainNav.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 992) {
        mainNav.classList.remove("active");
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  // Scrollspy premium con smooth scrolling
  document.querySelectorAll(".main-nav a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    });
  });

  // Detección de sección activa
  document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".main-nav a");
    const sections = document.querySelectorAll("section[id]");

    // 1. Función para actualizar el menú según el scroll
    function updateActiveMenu() {
      let fromTop = window.scrollY + 100;

      // Top de página
      if (fromTop < 300) {
        history.replaceState(null, null, "#inicio");
        setActiveLink("#inicio");
        return;
      }

      // Fondo de página
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        history.replaceState(null, null, "#contacto");
        setActiveLink("#contacto");
        return;
      }

      // Secciones
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (fromTop >= sectionTop && fromTop < sectionTop + sectionHeight) {
          const id = section.getAttribute("id");
          history.replaceState(null, null, `#${id}`);
          setActiveLink(`#${id}`);
        }
      });
    }

    // 2. Función auxiliar para activar el link
    function setActiveLink(hash) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === hash) {
          link.classList.add("active");
        }
      });
    }

    // 3. Configurar el smooth scroll con hash en URL
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        // Scroll suave
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: "smooth",
        });

        // Actualizar URL después del scroll
        setTimeout(() => {
          history.pushState(null, null, targetId);
        }, 800);
      });
    });

    // 4. Escuchar eventos
    window.addEventListener("scroll", function () {
      requestAnimationFrame(updateActiveMenu);
    });

    // 5. Inicializar
    if (window.location.hash) {
      const targetSection = document.querySelector(window.location.hash);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: "auto",
        });
      }
    } else {
      history.replaceState(null, null, "#inicio");
    }

    updateActiveMenu();
  });

  // Sistema de pestañas
  const tabs = document.querySelectorAll(".tabs-tab");
  const tabContents = document.querySelectorAll(".tabs-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remover active de todos
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      // Agregar active al seleccionado
      tab.classList.add("active");
      const tabId = tab.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });
}
