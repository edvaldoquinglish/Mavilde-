/* ============================================================
   💚 Para Mavilde — script.js
   Autor: feito com amor
   ============================================================ */

"use strict";

// ─── Utilitários ─────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

const $ = id => document.getElementById(id);

// ─── Canvas de Partículas (estrelas flutuantes) ───────────────

(function initParticles() {
  const canvas = $('canvas-particles');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkStar() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.18 + 0.04,
      opacity: Math.random() * 0.7 + 0.15,
      dir: Math.random() > 0.5 ? 1 : -1,
      drift: (Math.random() - 0.5) * 0.08
    };
  }

  function init() {
    resize();
    stars = Array.from({ length: 180 }, mkStar);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,157,${s.opacity})`;
      ctx.fill();
      s.y -= s.speed;
      s.x += s.drift;
      s.opacity += s.dir * 0.003;
      if (s.opacity > 0.85 || s.opacity < 0.1) s.dir *= -1;
      if (s.y < -4) { s.y = H + 4; s.x = Math.random() * W; }
      if (s.x < -4 || s.x > W + 4) s.x = Math.random() * W;
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

// ─── Tela de Entrada — digitação terminal ────────────────────

async function runEntrance() {
  const terminal = $('terminal-boot');
  const lines = [
    '> iniciando protocolo_amor.exe...',
    '> carregando memórias: ████████ 100%',
    '> compilando sentimentos...',
    '> destino encontrado: Mavilde',
    '> pronto. ❤'
  ];

  for (const line of lines) {
    for (const char of line) {
      terminal.textContent += char;
      await sleep(Math.random() * 40 + 18);
    }
    terminal.textContent += '\n';
    await sleep(280);
  }

  await sleep(500);
  $('enter-btn').classList.remove('hidden');
}

// ─── Player de Música ─────────────────────────────────────────

const player   = $('player');
const musicBar = $('music-bar');
const musicLbl = $('music-label');

const playlist = [
  { src: 'musica1.mp3', label: '♪ primeiro verso' },
  { src: 'musica2.mp3', label: '♪ segunda melodia' }
];

let currentTrack = 0;
let musicStarted  = false;

function loadTrack(idx) {
  const track = playlist[idx];
  player.src    = track.src;
  musicLbl.textContent = track.label;
  player.load();
  player.play().catch(() => {
    /* autoplay bloqueado — silencia o erro */
  });
}

function switchToTrack2() {
  if (currentTrack === 0) {
    currentTrack = 1;
    player.pause();
    loadTrack(1);
  }
}

player.addEventListener('ended', () => {
  // Quando música 1 termina, avança para música 2
  if (currentTrack === 0) switchToTrack2();
});

// ─── Typing effect nas linhas do hero ─────────────────────────

async function typeVerses() {
  const lines = document.querySelectorAll('#section-hero .verse-line');
  for (const line of lines) {
    const text = line.dataset.text;
    line.textContent = '';
    for (const char of text) {
      line.textContent += char;
      await sleep(Math.random() * 45 + 22);
    }
    line.classList.add('done');
    await sleep(Math.random() * 800 + 600); // 600–1400 ms entre versos
  }
}

// ─── IntersectionObserver para scroll reveals ─────────────────

function initScrollReveal() {
  const items = document.querySelectorAll('.poem-card, .transition-frame');
  const obs = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Ativa música 2 quando a seção de transição aparece
        if (e.target.closest('#section-transition')) {
          setTimeout(switchToTrack2, 1200);
        }
      }
    }
  }, { threshold: 0.35 });

  items.forEach(el => obs.observe(el));
}

// ─── Chuva binária ────────────────────────────────────────────

function initBinaryRain() {
  const container = $('binary-rain');
  const cols = Math.floor(window.innerWidth / 22);
  for (let i = 0; i < cols; i++) {
    const col = document.createElement('div');
    col.className = 'binary-col';
    col.style.left = `${(i / cols) * 100}%`;
    const dur  = (Math.random() * 6 + 5).toFixed(2);
    const delay = (Math.random() * 6).toFixed(2);
    col.style.animationDuration = `${dur}s`;
    col.style.animationDelay    = `-${delay}s`;
    col.textContent = Array.from({ length: 28 }, () =>
      Math.random() > 0.5 ? '1' : '0'
    ).join('');
    container.appendChild(col);
  }
}

// ─── Revelar nome final com timesleep poético ─────────────────

function initFinalReveal() {
  const finalSection = $('section-final');
  const finalName    = $('final-name');
  const finalCap     = document.querySelector('.final-caption');
  let revealed = false;

  const obs = new IntersectionObserver(async (entries) => {
    if (entries[0].isIntersecting && !revealed) {
      revealed = true;
      initBinaryRain();
      await sleep(1200);

      // Digita o nome letra por letra
      const name = ' Mavilde ';
      finalName.classList.add('visible');
      finalName.textContent = '';
      for (const char of name) {
        finalName.textContent += char;
        await sleep(char === '💚' ? 400 : Math.random() * 80 + 50);
      }

      await sleep(600);
      finalCap.classList.add('visible');
    }
  }, { threshold: 0.4 });

  obs.observe(finalSection);
}

// ─── Timesleep de versos extras (15–20 s entre cada poema) ────
// Os poemas já aparecem via scroll + IntersectionObserver.
// Este módulo adiciona versos flutuantes estilo "easter egg" que
// aparecem suavemente na tela entre as seções com 15–20 s de delay.

const floatingVerses = [
  'Tu és o meu commit favorito.',
  'Contigo, até o infinito tem fim — em nós.',
  'O meu coração tem um único repositório: tu.',
  'Cada abraço teu é um backup da felicidade.',
  'Se o amor fosse código, o teu seria open-source.',
  'Sem ti, sou apenas um loop sem condição de saída.',
];

let verseIdx = 0;

function showFloatingVerse() {
  if (verseIdx >= floatingVerses.length) return;

  const el = document.createElement('div');
  el.style.cssText = `
    position: fixed;
    bottom: 1.8rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(0,61,38,0.72);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0,196,122,0.25);
    color: #e8f5ee;
    font-family: 'Lora', Georgia, serif;
    font-style: italic;
    font-size: clamp(0.85rem, 2.2vw, 1rem);
    padding: 0.75rem 1.6rem;
    border-radius: 2rem;
    max-width: 90vw;
    text-align: center;
    opacity: 0;
    z-index: 200;
    transition: opacity 0.8s ease, transform 0.8s ease;
    pointer-events: none;
    white-space: nowrap;
  `;
  el.textContent = `"${floatingVerses[verseIdx++]}"`;
  document.body.appendChild(el);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-50%) translateY(-12px)';
    setTimeout(() => el.remove(), 900);
  }, 4500);

  // Próximo verso entre 15 e 20 segundos
  const next = Math.random() * 5000 + 15000;
  setTimeout(showFloatingVerse, next);
}

// ─── Inicialização principal ──────────────────────────────────

$('enter-btn').addEventListener('click', async () => {
  const entrance = $('entrance-screen');

  // Inicia música 1
  loadTrack(0);
  musicStarted = true;
  musicBar.classList.add('visible');

  // Esconde tela de entrada
  entrance.classList.add('fade-out');
  setTimeout(() => entrance.style.display = 'none', 1300);

  // Mostra o site
  $('main-site').classList.remove('hidden');

  await sleep(400);

  // Inicia os efeitos
  initScrollReveal();
  initFinalReveal();
  typeVerses();

  // Inicia versos flutuantes após 18 s
  setTimeout(showFloatingVerse, 18000);
});

// Inicia a sequência do terminal ao carregar
window.addEventListener('DOMContentLoaded', runEntrance);
