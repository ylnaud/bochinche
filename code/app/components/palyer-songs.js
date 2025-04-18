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
export function initMusic() {
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
