const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");
const sonido = document.getElementById("sonidoGolpe");
const martillo = document.getElementById("martillo");
const tiempoDisplay = document.getElementById("tiempo");
const vidasDisplay = document.getElementById("vidas");

let score = 0;
let velocidad = 1000;
let intervalo;
let intervaloTiempo;
let tiempoRestante = 30;
let vidas = 3;
let modo = "tiempo";
let juegoActivo = false;

function randomHole() {
  return holes[Math.floor(Math.random() * holes.length)];
}

function showAmiga() {
  const hole = randomHole();
  const amiga = hole.querySelector(".amiga");
  amiga.style.display = "block";

  const desaparecer = () => {
    amiga.style.display = "none";
    amiga.onclick = null;
  };

  amiga.onclick = (e) => {
    e.stopPropagation();
    score++;
    scoreDisplay.textContent = score;
    sonido.currentTime = 0;
    sonido.play();
    martillo.classList.add("golpe");
    setTimeout(() => martillo.classList.remove("golpe"), 100);
    desaparecer();
  };

  setTimeout(() => {
    desaparecer();
  }, velocidad);
}

function iniciarJuego() {
  console.log("iniciando juego...");
  document.getElementById("menuInicio").style.display = "none";

  velocidad = parseInt(document.getElementById("dificultad").value);
  modo = document.getElementById("modo").value; // ← corregido aquí

  const volumen = document.getElementById("volumen").value;
  const musica = document.getElementById("musicaFondo");
  musica.volume = volumen;

  musica.play().catch(err => {
    console.error("No se pudo reproducir la música:", err);
  });

  comenzarJuego();
}

function comenzarJuego() {
  juegoActivo = true;
  intervalo = setInterval(showAmiga, velocidad);

  if (modo === "tiempo") {
    tiempoRestante = 30;
    vidas = 3;
    tiempoDisplay.textContent = tiempoRestante;
    document.getElementById("tiempoJuego").textContent = tiempoRestante;
    vidasDisplay.textContent = vidas;

    intervaloTiempo = setInterval(() => {
      tiempoRestante--;
      tiempoDisplay.textContent = tiempoRestante;
      document.getElementById("tiempoJuego").textContent = tiempoRestante;

      if (tiempoRestante <= 0) {
        terminarJuego();
      }
    }, 1000);
  }
}

function terminarJuego() {
  juegoActivo = false;
  clearInterval(intervalo);
  clearInterval(intervaloTiempo);
  alert("¡Juego terminado! Tu puntaje fue: " + score);
  location.reload();
}

document.addEventListener("click", (e) => {
  if (!juegoActivo) return;

  const esHoyo = e.target.classList.contains("amiga");

  if (!esHoyo && modo !== "infinito") {
    vidas--;
    vidasDisplay.textContent = vidas;

    if (vidas <= 0) {
      terminarJuego();
    }
  }
});

document.addEventListener("mousemove", (e) => {
  martillo.style.left = e.pageX + "px";
  martillo.style.top = e.pageY + "px";
});
