// ========== CORAZONES FLOTANTES ==========
const particles = document.getElementById("particles");
const heartCount = window.innerWidth < 600 ? 25 : 35;
for (let i = 0; i < heartCount; i++) {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.innerHTML = "❤";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (Math.random() * 16 + 8) + "px";
  heart.style.animationDuration = (Math.random() * 9 + 7) + "s";
  heart.style.opacity = Math.random() * 0.5 + 0.2;
  particles.appendChild(heart);
}

// ========== MENSAJE ESPECIAL ==========
const showMessageBtn = document.getElementById('showMessageBtn');
const specialMessageDiv = document.getElementById('specialMessage');
let currentTimeout = null;

function showMessageWithTyping() {
  if (currentTimeout) clearTimeout(currentTimeout);
  const text = "Eres mi persona favorita en este mundo ❤️";
  specialMessageDiv.innerHTML = "";
  specialMessageDiv.classList.remove('typing');
  void specialMessageDiv.offsetWidth;
  specialMessageDiv.classList.add('typing');
  let i = 0;
  function typeNextChar() {
    if (i < text.length) {
      specialMessageDiv.innerHTML += text.charAt(i);
      i++;
      currentTimeout = setTimeout(typeNextChar, 55);
    } else {
      specialMessageDiv.classList.remove('typing');
      currentTimeout = null;
    }
  }
  typeNextChar();
}

showMessageBtn.addEventListener('click', showMessageWithTyping);

// ========== TIMER DE AVANCE ==========
const startDate = new Date(2026, 1, 2, 0, 0, 0);

function updateElapsedTimer() {
  const now = new Date();
  let diff = now - startDate;
  if (diff < 0) diff = 0;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  document.getElementById('elapsedDays').textContent = days;
  document.getElementById('elapsedHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('elapsedMins').textContent = String(minutes).padStart(2, '0');
  document.getElementById('elapsedSecs').textContent = String(seconds).padStart(2, '0');
}

updateElapsedTimer();
setInterval(updateElapsedTimer, 1000);

// ========== MÚSICA ==========
const music = document.getElementById("music");
let playing = false;
window.toggleMusic = function() {
  if (!playing) {
    music.play().catch(e => console.log("Audio error:", e));
    playing = true;
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn) musicBtn.innerHTML = '⏸️';
  } else {
    music.pause();
    playing = false;
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn) musicBtn.innerHTML = '🎵';
  }
};

music.addEventListener('ended', () => {
  playing = false;
  const musicBtn = document.getElementById('musicBtn');
  if (musicBtn) musicBtn.innerHTML = '🎵';
});

// ========== MODAL CARTA ==========
const modal = document.getElementById('letterModal');
const openBtn = document.getElementById('openLetterBtn');
const closeBtn = document.getElementById('closeModalBtn');

function openModal() {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
const modalContainer = document.querySelector('.modal-container');
if (modalContainer) modalContainer.addEventListener('click', (e) => e.stopPropagation());
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

// ========== PALABRAS INTERACTIVAS CON MENSAJE FIJO POR TAG ==========
const wordTags = document.querySelectorAll('.word-tag');
const toast = document.createElement('div');
toast.className = 'toast-notification';
document.body.appendChild(toast);

let toastTimeout = null;

function showToastWithReset(message) {
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }
  
  toast.textContent = message;
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
  
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    toastTimeout = null;
  }, 2800);
}

// Asignar mensaje fijo a cada palabra usando el atributo data-message
wordTags.forEach(tag => {
  // Animación aleatoria para que no todas floten al mismo tiempo
  const randomDelay = Math.random() * -3; // Negativo para que empiecen en diferentes puntos
  const randomDuration = 3 + Math.random() * 2;
  tag.style.animationDelay = `${randomDelay}s`;
  tag.style.animationDuration = `${randomDuration}s`;

  // Obtener el mensaje personalizado del atributo data-message
  const customMessage = tag.getAttribute('data-message');
  
  tag.addEventListener('click', (e) => {
    e.stopPropagation();
    // Usar el mensaje personalizado o uno por defecto si no existe
    const message = customMessage || `✨ ¡Eso eres tú, ${tag.textContent}! ✨`;
    showToastWithReset(message);
    
    // Animación de latido
    tag.style.transform = 'scale(1.1)';
    setTimeout(() => {
      tag.style.transform = '';
    }, 200);
  });
  
  // Efectos táctiles
  tag.addEventListener('touchstart', function(e) {
    this.style.transform = 'scale(0.97)';
  });
  tag.addEventListener('touchend', function() {
    this.style.transform = '';
  });
});

// Efectos táctiles botones
const letterBtn = document.getElementById('openLetterBtn');
if (letterBtn) {
  letterBtn.addEventListener('touchstart', function() { this.style.transform = 'scale(0.96)'; });
  letterBtn.addEventListener('touchend', function() { this.style.transform = ''; });
}

if (showMessageBtn) {
  showMessageBtn.addEventListener('touchstart', function() { this.style.transform = 'scale(0.96)'; });
  showMessageBtn.addEventListener('touchend', function() { this.style.transform = ''; });
  showMessageBtn.addEventListener('mouseleave', function() { this.style.transform = ''; });
}

// ========== PANTALLA DE CARGA CON BLOQUEO DE SCROLL ==========
const loadingScreen = document.getElementById('loadingScreen');
const progressBar = document.getElementById('progressBar');
const loadingPercent = document.getElementById('loadingPercent');
const loadingSub = document.querySelector('.loading-sub');
const enterBtn = document.getElementById('enterBtn');

// Mensajes dinámicos de carga
const loadingMessages = [
  "Cargando magia...",
  "Invocando sonrisas...",
  "Guardando promesas...",
  "Preparando sorpresas...",
  "Casi listo para ti...",
  "¡Todo listo! ✨"
];

// Bloquear scroll al cargar la página
document.body.classList.add('no-scroll');

let progress = 0;
const interval = setInterval(() => {
  // Incremento más pequeño para que tarde más
  progress += Math.floor(Math.random() * 2) + 1;
  
  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);
    if (enterBtn) enterBtn.classList.add('show');
    if (loadingSub) loadingSub.textContent = loadingMessages[loadingMessages.length - 1];
  } else {
    // Cambiar mensaje según el progreso
    const msgIndex = Math.floor((progress / 100) * (loadingMessages.length - 1));
    if (loadingSub) loadingSub.textContent = loadingMessages[msgIndex];
  }
  
  if (progressBar) progressBar.style.width = progress + '%';
  if (loadingPercent) loadingPercent.textContent = progress + '%';
}, 160); // Intervalo un poco más largo

// Botón Entrar: oculta pantalla y HABILITA scroll
if (enterBtn) {
  enterBtn.addEventListener('click', () => {
    if (loadingScreen) loadingScreen.classList.add('hide');
    document.body.classList.remove('no-scroll');
    setTimeout(() => {
      if (loadingScreen) loadingScreen.style.display = 'none';
    }, 1300);
  });
}
