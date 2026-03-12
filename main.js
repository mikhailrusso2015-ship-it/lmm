// ===== LOADER =====
let prog = 0;
const fill = document.querySelector('.loader-fill');
const num = document.querySelector('.loader-num');
const ldr = document.querySelector('.loader');
const loadInt = setInterval(() => {
  prog += Math.random() * 15 + 4;
  if (prog > 100) prog = 100;
  fill.style.width = prog + '%';
  num.textContent = Math.floor(prog);
  if (prog >= 100) {
    clearInterval(loadInt);
    setTimeout(() => ldr.classList.add('done'), 350);
  }
}, 70);

// ===== CUSTOM CURSOR (only pointer:fine) =====
if (window.matchMedia('(pointer:fine)').matches) {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function loop() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.hover-trigger,.srv-row,.bento-item,.crew-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
  });
}

// ===== HAMBURGER MENU =====
const burger = document.querySelector('.hamburger');
const mMenu = document.querySelector('.mobile-menu');
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  mMenu.classList.toggle('open');
  document.body.style.overflow = mMenu.classList.contains('open') ? 'hidden' : '';
});
mMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('active');
    mMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== NAV SCROLL GLASS =====
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// ===== SCROLL REVEAL =====
const rvObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));

// ===== BENTO 3D TILT (desktop only) =====
if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.bento-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const r = item.getBoundingClientRect();
      const rotX = ((e.clientY - r.top) / r.height - .5) * -6;
      const rotY = ((e.clientX - r.left) / r.width - .5) * 6;
      item.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(.97)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transition = 'transform .4s ease';
      item.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
      setTimeout(() => item.style.transition = '', 400);
    });
  });
}

// ===== MAGNETIC NAV (desktop) =====
if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mousemove', e => {
      const r = link.getBoundingClientRect();
      link.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .25}px)`;
    });
    link.addEventListener('mouseleave', () => {
      link.style.transition = 'transform .35s ease';
      link.style.transform = 'translate(0,0)';
      setTimeout(() => link.style.transition = '', 350);
    });
  });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== GALLERY TABS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Update content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const target = document.getElementById('tab-' + tabId);
    if (target) {
      target.classList.add('active');
      // Re-trigger reveal animations for newly visible items
      target.querySelectorAll('.rv:not(.vis)').forEach(el => rvObs.observe(el));
    }
  });
});

// ===== VIDEO PLAY/PAUSE =====
document.querySelectorAll('.video-card').forEach(card => {
  const video = card.querySelector('video');
  const playBtn = card.querySelector('.play-btn');
  if (!video || !playBtn) return;

  function togglePlay() {
    if (video.paused) {
      // Pause all other videos first
      document.querySelectorAll('.video-card video').forEach(v => {
        if (v !== video) { v.pause(); v.muted = true; }
      });
      document.querySelectorAll('.play-btn').forEach(b => b.textContent = '▶');
      video.muted = false;
      video.play();
      playBtn.textContent = '⏸';
    } else {
      video.pause();
      video.muted = true;
      playBtn.textContent = '▶';
    }
  }

  playBtn.addEventListener('click', togglePlay);
  card.addEventListener('click', e => {
    if (e.target !== playBtn) togglePlay();
  });
});
