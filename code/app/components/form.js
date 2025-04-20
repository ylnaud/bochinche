export function form() {
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
}
