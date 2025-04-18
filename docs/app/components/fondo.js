// Cambiar fondo según la hora del día
function updateBackgroundBasedOnTime() {
  const now = new Date();
  const hours = now.getHours();
  const timeBg = document.getElementById("timeBackground");
  //const isPlaying = false;

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
  let isPlaying;
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
