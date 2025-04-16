// Navegación móvil
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

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

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
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

// Formularios
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.");
  e.target.reset();
});

document.getElementById("reservationForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("¡Reserva confirmada! Te esperamos en la fecha y hora seleccionada.");
  e.target.reset();
});

// Música de ambiente
const music = document.getElementById("backgroundMusic");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const volumeBtn = document.getElementById("volumeBtn");
const currentSongEl = document.getElementById("currentSong");

// Lista de canciones (simuladas)
const songs = [
  {
    title: "Vallenato Clásico",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Salsa Colombiana",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "Cumbia Tradicional",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

let currentSongIndex = 0;
let isPlaying = false;
let isMuted = false;

// Cargar canción
function loadSong(index) {
  currentSongIndex = index;
  currentSongEl.textContent = songs[currentSongIndex].title;
  music.src = songs[currentSongIndex].src;

  if (isPlaying) {
    music.play().catch((e) => console.log("Autoplay prevented:", e));
  }
}

// Reproducir/pausar
playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    music.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  } else {
    music.play().catch((e) => console.log("Autoplay prevented:", e));
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  }
  isPlaying = !isPlaying;
});

// Canción anterior
prevBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
});

// Siguiente canción
nextBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
});

// Control de volumen
volumeBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  music.muted = isMuted;
  volumeBtn.innerHTML = isMuted
    ? '<i class="fas fa-volume-mute"></i>'
    : '<i class="fas fa-volume-up"></i>';
});

// Cambiar canción al terminar (aunque loop está activado)
music.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
});

// Cargar primera canción
loadSong(0);

// Cambiar fondo según la hora del día
function updateBackgroundBasedOnTime() {
  const now = new Date();
  const hours = now.getHours();
  const timeBg = document.getElementById("timeBackground");

  if (hours >= 6 && hours < 12) {
    // Mañana
    timeBg.style.backgroundImage =
      "url(https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80)";
    timeBg.style.opacity = "0.05";
  } else if (hours >= 12 && hours < 18) {
    // Tarde
    timeBg.style.backgroundImage =
      "url(https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80)";
    timeBg.style.opacity = "0.08";
  } else if (hours >= 18 && hours < 24) {
    // Noche temprana
    timeBg.style.backgroundImage =
      "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80)";
    timeBg.style.opacity = "0.1";
  } else {
    // Madrugada
    timeBg.style.backgroundImage =
      "url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80)";
    timeBg.style.opacity = "0.15";
  }

  // Detener música después de las 12 de la noche
  if (hours >= 0 && hours < 6) {
    if (isPlaying) {
      music.pause();
      isPlaying = false;
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  }
}

// Actualizar fondo al cargar y cada hora
updateBackgroundBasedOnTime();
setInterval(updateBackgroundBasedOnTime, 3600000); // Cada hora

// Animaciones al hacer scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll(".animate");

  elements.forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;

    if (elementPosition < screenPosition) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }
  });
};

window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);
