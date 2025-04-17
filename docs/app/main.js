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

// Configuración del reproductor
const music = document.getElementById("backgroundMusic");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const volumeBtn = document.getElementById("volumeBtn");
const volumeControl = document.getElementById("volumeControl");
const currentSongEl = document.getElementById("currentSong");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const minimizeBtn = document.querySelector(".minimize-btn");
const playlistContainer = document.querySelector(".playlist-container");
const playlist = document.getElementById("playlist");
const musicPlayer = document.querySelector(".music-player");

// Lista de canciones
const songs = [
  {
    title: "Luis Varga - Loco de Amor",
    src: "/audio/song-1.mp3",
  },
  {
    title: "jessi uribe - Si Me Ves Llorando",
    src: "/audio/song-2.mp3",
  },
  {
    title: "La Combinacion vallenate - Quiero Volar",
    src: "/audio/song-3.mp3",
  },
];

let currentSongIndex = 0;
let isPlaying = false;
let isMuted = false;
let isPlaylistVisible = false;

// Inicialización
function init() {
  loadSong(currentSongIndex);
  createPlaylist();
  setupEventListeners();
  updateVolumeIcon();
}

// Cargar canción
function loadSong(index) {
  currentSongIndex = (index + songs.length) % songs.length;
  const song = songs[currentSongIndex];

  // Actualizar UI
  currentSongEl.textContent = song.title;
  music.src = song.src;

  // Resaltar canción actual en playlist
  updatePlaylistHighlight();

  // Resetear progreso
  progressBar.style.width = "0%";
  currentTimeEl.textContent = "0:00";

  // Cargar metadatos
  music.onloadedmetadata = () => {
    durationEl.textContent = formatTime(music.duration);
    if (isPlaying) {
      playSong();
    }
  };
}

// Crear lista de reproducción
function createPlaylist() {
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
      playSong();
    });
    playlist.appendChild(li);
  });
}

// Actualizar resaltado en playlist
function updatePlaylistHighlight() {
  const items = playlist.querySelectorAll("li");
  items.forEach((item, index) => {
    item.classList.toggle("active", index === currentSongIndex);
  });
}

// Reproducir canción
function playSong() {
  music
    .play()
    .then(() => {
      isPlaying = true;
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      playPauseBtn.classList.add("active-effect");
      setTimeout(() => playPauseBtn.classList.remove("active-effect"), 1500);
    })
    .catch((e) => console.log("Error al reproducir:", e));
}

// Pausar canción
function pauseSong() {
  music.pause();
  isPlaying = false;
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// Formatear tiempo (mm:ss)
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Actualizar barra de progreso
function updateProgress() {
  const { currentTime, duration } = music;
  const progressPercent = (currentTime / duration) * 100;
  progressBar.style.width = `${progressPercent}%`;
  currentTimeEl.textContent = formatTime(currentTime);
}

// Establecer posición de la canción
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = music.duration;
  music.currentTime = (clickX / width) * duration;
}

// Configurar event listeners
function setupEventListeners() {
  // Controles principales
  playPauseBtn.addEventListener("click", togglePlay);
  prevBtn.addEventListener("click", prevSong);
  nextBtn.addEventListener("click", nextSong);

  // Barra de progreso
  progressContainer.addEventListener("click", setProgress);

  // Eventos del reproductor
  music.addEventListener("timeupdate", updateProgress);
  music.addEventListener("ended", nextSong);
  music.addEventListener("play", () => {
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  });
  music.addEventListener("pause", () => {
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  });

  // Control de volumen
  volumeControl.addEventListener("input", () => {
    music.volume = volumeControl.value;
    updateVolumeIcon();
  });

  volumeBtn.addEventListener("click", toggleMute);

  // Minimizar/maximizar
  minimizeBtn.addEventListener("click", () => {
    musicPlayer.classList.toggle("minimized");
    minimizeBtn.innerHTML = musicPlayer.classList.contains("minimized")
      ? '<i class="fas fa-expand"></i>'
      : '<i class="fas fa-compress"></i>';
  });

  // Mostrar/ocultar playlist
  currentSongEl.addEventListener("click", () => {
    isPlaylistVisible = !isPlaylistVisible;
    musicPlayer.classList.toggle("show-playlist", isPlaylistVisible);
  });
}

// Funciones de control
function togglePlay() {
  isPlaying ? pauseSong() : playSong();
}

function prevSong() {
  loadSong(currentSongIndex - 1);
  playSong();
}

function nextSong() {
  loadSong(currentSongIndex + 1);
  playSong();
}

function toggleMute() {
  isMuted = !isMuted;
  music.muted = isMuted;
  updateVolumeIcon();

  // Efecto visual
  volumeBtn.classList.add("active-effect");
  setTimeout(() => volumeBtn.classList.remove("active-effect"), 1000);
}

function updateVolumeIcon() {
  if (music.muted || music.volume === 0) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    volumeControl.value = 0;
  } else if (music.volume < 0.5) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  }
}

// Inicializar reproductor
init();

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
