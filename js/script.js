'use strict';

// ── THEME TOGGLE ──────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ── NAVBAR SCROLL ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ── MOBILE NAV ────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  const spans = navToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── SCROLL REVEAL ─────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ── ACTIVE NAV HIGHLIGHT ──────────────────────────────────
const sections = document.querySelectorAll('section[id]');
function highlightNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const navLink = document.querySelector(`.nav__links a[href="#${id}"]`);
    if (navLink) {
      navLink.style.color = (scrollY >= top && scrollY < top + height) ? 'var(--accent)' : '';
    }
  });
}
window.addEventListener('scroll', highlightNav, { passive: true });
highlightNav();

// ── CARD TILT ─────────────────────────────────────────────
const tiltCards = document.querySelectorAll('.project-card, .service-card, .skill-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const dx   = (e.clientX - rect.left - rect.width  / 2) / rect.width;
    const dy   = (e.clientY - rect.top  - rect.height / 2) / rect.height;
    card.style.transform  = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
});

// ══════════════════════════════════════════════════════════
// ── TYPEWRITER EFFECT ─────────────────────────────────────
// ══════════════════════════════════════════════════════════
function setupTypewriter() {
  const nameEl = document.querySelector('.hero__name');
  if (!nameEl) return;

  const lines = ['Karen', 'Kamal'];
  nameEl.innerHTML = '';

  const karenSpan = document.createElement('span');
  karenSpan.className = 'tw-line';

  const kamalSpan = document.createElement('em');
  kamalSpan.className = 'tw-line tw-italic';
  kamalSpan.style.display = 'block';

  nameEl.appendChild(karenSpan);
  nameEl.appendChild(kamalSpan);

  const cursor = document.createElement('span');
  cursor.className   = 'tw-cursor';
  cursor.textContent = '|';
  nameEl.appendChild(cursor);

  let charIndex = 0;
  let lineIndex = 0;
  const targets = [karenSpan, kamalSpan];
  const delay   = 80;

  function type() {
    if (lineIndex >= lines.length) {
      setTimeout(() => {
        cursor.style.animation  = 'none';
        cursor.style.opacity    = '0';
        cursor.style.transition = 'opacity 0.5s';
      }, 1200);
      return;
    }

    const currentLine   = lines[lineIndex];
    const currentTarget = targets[lineIndex];

    if (charIndex < currentLine.length) {
      currentTarget.textContent += currentLine[charIndex];
      charIndex++;
      setTimeout(type, delay);
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(type, delay * 3);
    }
  }

  setTimeout(type, 500);
}

// ══════════════════════════════════════════════════════════
// ── FLOATING PARTICLES ────────────────────────────────────
// ══════════════════════════════════════════════════════════
function setupParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.className  = 'hero__particles';
  canvas.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
  `;
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let particles = [];

  const ACCENT_DARK  = [200, 169, 110];
  const ACCENT_LIGHT = [155, 124, 64];

  function getAccent() {
    return document.documentElement.getAttribute('data-theme') !== 'light'
      ? ACCENT_DARK : ACCENT_LIGHT;
  }

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size:   Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -(Math.random() * 0.4 + 0.1),
      opacity: Math.random() * 0.6 + 0.1,
      life: 0,
      maxLife: Math.random() * 300 + 200
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 60; i++) {
      const p = createParticle();
      p.life = Math.floor(Math.random() * p.maxLife);
      particles.push(p);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const [r, g, b] = getAccent();

    particles.forEach((p, i) => {
      p.life++;
      p.x += p.speedX;
      p.y += p.speedY;

      const progress = p.life / p.maxLife;
      const fade     = progress < 0.1 ? progress / 0.1 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
      const alpha    = p.opacity * fade;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fill();

      if (p.life >= p.maxLife) particles[i] = createParticle();
    });

    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx   = p1.x - p2.x;
        const dy   = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.08;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();

  window.addEventListener('resize', () => { resize(); initParticles(); });
}

// ══════════════════════════════════════════════════════════
// ── PROJECT DATA ──────────────────────────────────────────
// ══════════════════════════════════════════════════════════
const projectsData = {
  'season': {
    num: '04',
    title: 'Season App',
    type: 'Smart Travel Management System',
    tags: ['Laravel', 'Gemini AI', 'GPS'],
    stack: ['Laravel', 'FilamentPHP', 'Firebase', 'MySQL', 'Gemini AI', 'SendGrid', 'GPS'],
    desc: `An API-driven travel platform with AI-powered bag analysis via Google Gemini, real-time GPS tracking, SOS emergency alerts, smart reminders, multilingual Filament dashboard, and full trip/group management backed by Laravel Queues and Scheduler.`,
    features: [
      'AI-powered bag analysis using Google Gemini',
      'Real-time GPS tracking & SOS emergency alerts',
      'Bilingual Arabic/English admin dashboard',
      'Digital travel guide with countries & cities directory',
      'Emergency numbers & location-based safety services',
      'Role-based access control & secure authentication',
      'Distance calculation using the Haversine formula',
      'Laravel Queues & Scheduler optimization'
    ],
    images: [
      'images/season_1.jpg','images/season_2.jpg','images/season_3.jpg',
      'images/season_4.jpg','images/season_5.jpeg','images/season_6.jpeg',
      'images/season_7.jpeg','images/season_8.jpeg','images/season_9.png',
      'images/season_10.png','images/season_11.png','images/season_12.png',
      'images/season_13.png','images/season_14.png'
    ],
    link: null, linkLabel: null, status: 'In Development'
  },

  'hymns': {
    num: '01',
    title: 'Coptic Hymns School',
    type: 'E-Learning Platform',
    tags: ['Laravel', 'FilamentPHP', 'Firebase'],
    stack: ['Laravel', 'FilamentPHP', 'Flutter Web', 'Firebase', 'MySQL'],
    desc: `Bilingual e-learning platform serving users across Egypt and the USA with location-based pricing, smart approval workflows, customizable admin controls, and Flutter-integrated Laravel backend services.`,
    features: [
      'Location-based pricing using IP geolocation',
      'Automatic regional pricing for Egypt & USA',
      'Customizable dashboard themes & color controls',
      'Smart course approval & rejection workflows',
      'Bilingual Arabic/English learning platform',
      'Flutter Web integration with Laravel backend',
      'Firebase notification system',
      'Custom Filament admin dashboard'
    ],
    images: [
      'images/Coptic1.png','images/Coptic2.png','images/Coptic3.png',
      'images/Coptic4.png','images/Coptic5.png'
    ],
    link: 'https://coptichymnsschool.com',
    linkLabel: 'View Live Site'
  },

  'wahb': {
    num: '02',
    title: 'Wahb',
    type: 'Blood & Organ Donation SOS Platform',
    tags: ['Laravel', 'FilamentPHP', 'GPS'],
    stack: ['Laravel', 'FilamentPHP', 'Firebase', 'MySQL'],
    desc: `Real-time emergency donation platform connecting patients, donors, and hospitals with GPS-based hospital matching, SOS request management, secure approval workflows, and bilingual Arabic/English dashboards built with Laravel and Filament.`,
    features: [
      'GPS-based hospital & donor matching',
      'Real-time SOS blood & organ donation requests',
      'Role-based hospital & admin dashboards',
      'Secure donation approval & confirmation workflows',
      'Firebase Cloud Messaging (FCM) notifications',
      'Bilingual Arabic/English localization support',
      'API authentication using Laravel Guards & Policies',
      'Audit-friendly request tracking & status lifecycle'
    ],
    images: [
      'images/wehb1.jpeg','images/wehb2.jpeg','images/wehb3.jpeg',
      'images/wehb4.jpeg','images/wehb5.jpeg','images/wehb6.jpeg',
      'images/wehb7.jpeg','images/wehb8.jpeg','images/wehb9.jpeg',
      'images/wehb10.jpeg','images/wehb11.jpeg'
    ],
    link: null, linkLabel: null, status: 'In Development'
  },

  'twintip': {
    num: '03',
    title: 'Twintip',
    type: 'Sports Training Booking Platform',
    tags: ['Laravel', 'Sanctum', 'Firebase', 'QR Check-in'],
    stack: ['Laravel', 'MySQL', 'Firebase', 'Laravel Sanctum', 'Twilio', 'Spatie Permissions', 'Queues & Caching'],
    desc: `A scalable sports training platform connecting coaches and athletes through an advanced booking and subscription system with QR-based attendance, secure authentication, automated notifications, payment processing, and real-time scheduling optimization.`,
    features: [
      'Secure OTP & Google OAuth authentication system',
      'Role-based access control using Sanctum & Spatie Permissions',
      'Private and group session booking management',
      'Seasonal subscriptions and training package system',
      'Advanced scheduling engine with slot capacity handling',
      'Automatic slot reactivation and waitlist management',
      'QR code check-in and attendance tracking',
      'Online and on-site payment integration',
      'Coupons, discounts, and promotional offers support',
      'Coach payout and revenue management workflows',
      'Multi-channel notifications (Push, SMS, Email)',
      'Firebase Cloud Messaging (FCM) integration',
      'Twilio SMS integration for reminders and OTP',
      'Parent–child athlete account management',
      'Background jobs, queues, and scheduled task automation',
      'Excel export and reporting system'
    ],
    images: [
      'images/twintip7.jpg','images/twin1.jpg','images/twin2.jpg',
      'images/twintip3.jpg','images/twintip4.jpg','images/twintp5.jpg','images/twintip6.jpg'
    ],
    link: 'https://play.google.com/store/apps/details?id=com.twintip.club',
    linkLabel: 'View on Google Play'
  },

  'elgent_steps': {
    num: '05',
    title: 'Elgent Steps',
    type: "Men's Clothing E-Commerce & Delivery Management System",
    tags: ['Laravel', 'FilamentPHP', 'SendGrid'],
    stack: ['Laravel', 'FilamentPHP', 'MySQL', 'SendGrid', 'REST APIs'],
    desc: `A full-featured men's clothing e-commerce platform with advanced order and delivery management, customizable T-shirt printing, real-time order notifications, and a powerful FilamentPHP dashboard for managing products, users, and delivery operations efficiently.`,
    features: [
      "Complete e-commerce system for men's fashion products",
      'Advanced order and delivery management workflows',
      'Custom delivery control panel for assigning and tracking orders',
      'Real-time order status notifications using SendGrid',
      'Customizable T-shirt printing and product personalization',
      'FilamentPHP admin dashboard for products, orders, and users',
      'Delivery tracking and order management system',
      'Responsive and scalable backend architecture',
      'RESTful API integration for system operations',
      'Optimized database structure and performance handling'
    ],
    images: [
      'images/elegent1.png','images/elegent2.png','images/elegent3.png',
      'images/elegent4.png','images/elegent5.png','images/elegent6.png'
    ],
    link: null, linkLabel: null, status: 'Completed'
  }
};

// ══════════════════════════════════════════════════════════
// ── MODAL & SLIDER ────────────────────────────────────────
// ══════════════════════════════════════════════════════════
let sliderCurrent = 0;
let sliderTotal   = 0;

function sliderMove(dir) {
  if (sliderTotal <= 1) return;
  sliderGoTo((sliderCurrent + dir + sliderTotal) % sliderTotal);
}

function sliderGoTo(next) {
  const slides = document.querySelectorAll('.proj-slide');
  const dots   = document.querySelectorAll('.proj-dot');

  const leaving  = slides[sliderCurrent];
  const entering = slides[next];
  const goRight  = next > sliderCurrent || (sliderCurrent === sliderTotal - 1 && next === 0);

  leaving.classList.add(goRight ? 'exit-left' : 'exit-right');
  entering.style.transform = goRight ? 'translateX(100%)' : 'translateX(-100%)';
  entering.classList.remove('hidden');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      entering.style.transform = 'translateX(0)';
      entering.style.opacity   = '1';
    });
  });

  leaving.addEventListener('transitionend', () => {
    leaving.classList.add('hidden');
    leaving.classList.remove('exit-left', 'exit-right');
    leaving.style.transform = '';
    leaving.style.opacity   = '';
  }, { once: true });

  dots.forEach((d, i) => d.classList.toggle('active', i === next));
  sliderCurrent = next;
  document.getElementById('projSlideBadge').textContent = (next + 1) + ' / ' + sliderTotal;

  const prevBtn = document.getElementById('projPrev');
  const nextBtn = document.getElementById('projNext');
  const vis = sliderTotal > 1 ? '1' : '0';
  prevBtn.style.opacity       = vis;
  nextBtn.style.opacity       = vis;
  prevBtn.style.pointerEvents = sliderTotal > 1 ? '' : 'none';
  nextBtn.style.pointerEvents = sliderTotal > 1 ? '' : 'none';
}

function buildSlider(images) {
  const slidesEl = document.getElementById('projSlides');
  const dotsEl   = document.getElementById('projDots');
  const badge    = document.getElementById('projSlideBadge');
  const empty    = document.getElementById('projGalleryEmpty');
  const wrap     = document.getElementById('projSliderWrap');

  slidesEl.innerHTML = '';
  dotsEl.innerHTML   = '';
  sliderCurrent = 0;

  if (!images || images.length === 0) {
    wrap.style.display   = 'none';
    dotsEl.style.display = 'none';
    empty.style.display  = 'flex';
    sliderTotal = 0;
    return;
  }

  wrap.style.display   = '';
  dotsEl.style.display = images.length > 1 ? 'flex' : 'none';
  empty.style.display  = 'none';
  sliderTotal = images.length;
  badge.textContent = '1 / ' + sliderTotal;

  images.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'proj-slide' + (i === 0 ? '' : ' hidden');
    const img   = document.createElement('img');
    img.src     = src;
    img.alt     = 'Screenshot ' + (i + 1);
    img.loading = i === 0 ? 'eager' : 'lazy';
    slide.appendChild(img);
    slidesEl.appendChild(slide);

    if (images.length > 1) {
      const dot = document.createElement('button');
      dot.className = 'proj-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', () => sliderGoTo(i));
      dotsEl.appendChild(dot);
    }
  });

  const vis = images.length > 1 ? '1' : '0';
  document.getElementById('projPrev').style.opacity = vis;
  document.getElementById('projNext').style.opacity = vis;
}

function buildModal() {
  const overlay = document.createElement('div');
  overlay.className = 'proj-overlay';
  overlay.id        = 'projOverlay';
  overlay.innerHTML = `
    <div class="proj-modal" id="projModal" role="dialog" aria-modal="true">
      <button class="proj-close" id="projClose" aria-label="Close">&times;</button>
      <div class="proj-modal__inner">

        <!-- LEFT: Slider -->
        <div class="proj-gallery" id="projGallery">
          <div class="proj-gallery__main" id="projSliderWrap">
            <div class="proj-slide-badge" id="projSlideBadge">1 / 1</div>
            <div class="proj-slides" id="projSlides"></div>
            <button class="proj-slide-nav proj-slide-nav--prev" id="projPrev" aria-label="Previous">&#8592;</button>
            <button class="proj-slide-nav proj-slide-nav--next" id="projNext" aria-label="Next">&#8594;</button>
          </div>
          <div class="proj-slide-dots" id="projDots"></div>
          <div class="proj-gallery__empty" id="projGalleryEmpty" style="display:none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p id="projEmptyText">Screenshots coming soon</p>
          </div>
        </div>

        <!-- RIGHT: Details -->
        <div class="proj-details">
          <div class="proj-details__header">
            <span class="proj-num" id="projNum">01</span>
            <div class="proj-tags" id="projTags"></div>
          </div>
          <h2 class="proj-title" id="projTitle"></h2>
          <p class="proj-type"  id="projType"></p>
          <p class="proj-desc"  id="projDesc"></p>
          <div class="proj-section">
            <h4>Key Features</h4>
            <ul class="proj-features" id="projFeatures"></ul>
          </div>
          <div class="proj-section">
            <h4>Tech Stack</h4>
            <div class="proj-stack" id="projStack"></div>
          </div>
          <div class="proj-actions" id="projActions"></div>
        </div>

      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('projClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowLeft')   sliderMove(-1);
    if (e.key === 'ArrowRight')  sliderMove(1);
  });
  document.getElementById('projPrev').addEventListener('click', () => sliderMove(-1));
  document.getElementById('projNext').addEventListener('click', () => sliderMove(1));
}

function openModal(projectId) {
  const data = projectsData[projectId];
  if (!data) return;

  const overlay = document.getElementById('projOverlay');
  const modal   = document.getElementById('projModal');

  document.getElementById('projNum').textContent   = data.num;
  document.getElementById('projTitle').textContent = data.title;
  document.getElementById('projType').textContent  = data.type;
  document.getElementById('projDesc').textContent  = data.desc;

  document.getElementById('projTags').innerHTML =
    data.tags.map(t => `<span>${t}</span>`).join('');

  document.getElementById('projFeatures').innerHTML =
    data.features.map(f => `<li>${f}</li>`).join('');

  document.getElementById('projStack').innerHTML =
    data.stack.map(s => `<code>${s}</code>`).join('');

  buildSlider(data.images || []);

  const actionsEl = document.getElementById('projActions');
  if (data.link) {
    actionsEl.innerHTML = `
      <a href="${data.link}" target="_blank" rel="noopener" class="btn btn--primary proj-btn">
        ${data.linkLabel}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
        </svg>
      </a>`;
  } else if (data.status) {
    actionsEl.innerHTML = `<span class="proj-status">${data.status}</span>`;
  } else {
    actionsEl.innerHTML = '';
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.classList.add('open'), 10);
}

function closeModal() {
  const overlay = document.getElementById('projOverlay');
  const modal   = document.getElementById('projModal');
  modal.classList.remove('open');
  setTimeout(() => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }, 350);
}

function setupProjectCards() {
  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      openModal(card.dataset.project);
    });
  });
}

// ── HERO ENTRANCE ─────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Instantly reveal all hero elements except the name (typewriter handles it)
  document.querySelectorAll('.hero .reveal:not(.hero__name)').forEach(el => {
    el.classList.add('visible');
  });

  setupTypewriter();
  setupParticles();
  buildModal();
  setupProjectCards();
});