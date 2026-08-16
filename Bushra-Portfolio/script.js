// ===============================
// Dark / Light Theme Toggle
// ===============================
const themeToggle = document.getElementById('themeToggle');

function updateThemeUI(isLight) {
  if (isLight) {
    document.body.classList.add('light-theme');
    themeToggle.setAttribute('aria-pressed', 'true');
    themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    themeToggle.innerHTML = '<span class="theme-toggle__icon" aria-hidden="true">🌙</span><span class="theme-toggle__label">Dark</span>';
  } else {
    document.body.classList.remove('light-theme');
    themeToggle.setAttribute('aria-pressed', 'false');
    themeToggle.setAttribute('aria-label', 'Switch to light theme');
    themeToggle.innerHTML = '<span class="theme-toggle__icon" aria-hidden="true">☀️</span><span class="theme-toggle__label">Light</span>';
  }
}

// Check saved theme or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
  updateThemeUI(true);
} else {
  updateThemeUI(false);
}

themeToggle.addEventListener('click', () => {
  const isLightNow = document.body.classList.contains('light-theme');
  const newLightState = !isLightNow;
  updateThemeUI(newLightState);
  localStorage.setItem('theme', newLightState ? 'light' : 'dark');
});

// ===============================
// Mobile navigation toggle
// ===============================
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

function closeNav() {
  primaryNav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

function toggleNav() {
  const isOpen = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
}

navToggle.addEventListener('click', toggleNav);

// Close nav after tapping a link (mobile)
primaryNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) closeNav();
  });
});

// Close nav on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNav();
});

// Reset nav state if the viewport grows past the mobile breakpoint
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) closeNav();
});

// ===============================
// Active nav link on scroll
// ===============================
const sections = document.querySelectorAll('main .section, .hero');
const navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const isCurrent = link.getAttribute('href') === `#${id}`;
        link.style.opacity = isCurrent ? '1' : '';
        if (isCurrent) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => {
  if (section.id) sectionObserver.observe(section);
});

// ===============================
// Entrance Animations on Scroll
// ===============================
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!isReducedMotion) {
  const revealElements = document.querySelectorAll('.section-head, .about-grid, .skill-card, .project-card, .contact-grid');
  
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
}

// ===============================
// Animated Skill Progress Bars
// ===============================
const skillFills = document.querySelectorAll('.skill-progress-fill');

if (isReducedMotion) {
  skillFills.forEach(fill => {
    fill.style.width = fill.getAttribute('data-progress');
  });
} else {
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillsInCard = entry.target.querySelectorAll('.skill-progress-fill');
        fillsInCard.forEach(fill => {
          fill.style.width = fill.getAttribute('data-progress');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-card').forEach(card => {
    skillObserver.observe(card);
  });
}

// ===============================
// Discipline Mode — Dev / Editor / Security
// Re-tints the page (via body[data-mode], see CSS) and
// swaps the hero copy + typewriter phrases to match.
// ===============================
const modeContent = {
  dev: {
    eyebrow: 'Available for new builds — 2026',
    titlePrefix: 'I build interfaces that',
    titleSuffix: 'at every screen size.',
    sub: "Full stack developer focused on semantic markup, deliberate layout systems, and code that stays readable long after the deadline passes. Also editing video and learning to break into systems, ethically — switch modes above to see each side.",
    role: 'Full Stack',
    phrases: ['hold up', 'scale cleanly', 'stay accessible', 'just work']
  },
  editor: {
    eyebrow: 'Cutting reels, one timeline at a time — 2026',
    titlePrefix: 'I cut footage that',
    titleSuffix: 'at every screen size.',
    sub: "Video editor working in Premiere Pro, After Effects, and DaVinci Resolve — pacing, sound, and color that hold attention. Also a full stack developer and a security learner — switch modes above to see each side.",
    role: 'Video Editor',
    phrases: ['holds attention', 'cuts on the beat', 'never drags', 'tells the story']
  },
  security: {
    eyebrow: 'Learning to think like an attacker — 2026',
    titlePrefix: 'I build systems that',
    titleSuffix: 'against the basics, at least.',
    sub: "Security learner working through TryHackMe rooms and OWASP fundamentals, one room at a time. Also a full stack developer and video editor — switch modes above to see each side.",
    role: 'Security Learner',
    phrases: ['hold up', 'resist enumeration', 'get patched fast', 'stay honest about gaps']
  }
};

const typewriterText = document.getElementById('typewriterText');
const heroEyebrow = document.getElementById('heroEyebrow');
const heroSub = document.getElementById('heroSub');
const heroRole = document.getElementById('heroRole');
const modeButtons = document.querySelectorAll('.mode-switch button');

let typewriterTimer = null;

function runTypewriter(phrases) {
  clearTimeout(typewriterTimer);
  if (!typewriterText) return;

  if (isReducedMotion) {
    typewriterText.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];
    let typingDelay = 100;

    if (isDeleting) {
      charIndex--;
      typingDelay = 50;
    } else {
      charIndex++;
      typingDelay = 100;
    }

    typewriterText.textContent = currentPhrase.substring(0, charIndex);

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingDelay = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingDelay = 400;
    }

    typewriterTimer = setTimeout(typeLoop, typingDelay);
  }

  typewriterTimer = setTimeout(typeLoop, 300);
}

function setMode(mode) {
  const content = modeContent[mode] || modeContent.dev;

  document.body.setAttribute('data-mode', mode);
  if (heroEyebrow) heroEyebrow.textContent = content.eyebrow;
  if (heroSub) heroSub.textContent = content.sub;
  if (heroRole) heroRole.textContent = content.role;

  modeButtons.forEach(btn => {
    const isCurrent = btn.dataset.mode === mode;
    btn.classList.toggle('is-active', isCurrent);
    btn.setAttribute('aria-pressed', String(isCurrent));
  });

  runTypewriter(content.phrases);
  localStorage.setItem('mode', mode);
}

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => setMode(btn.dataset.mode));
});

const savedMode = localStorage.getItem('mode') || 'dev';
setMode(savedMode);

// ===============================
// Project Filter Tabs
// ===============================
const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
const projectCards = document.querySelectorAll('#projectGrid .project-card');

projectFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    projectFilterBtns.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.hidden = !show;
    });

    if (typeof updateCursorHoverListeners === 'function') {
      updateCursorHoverListeners();
    }
  });
});

// ===============================
// 3D Parallax & Mouse Tilt Micro-Interactions (Throttled)
// ===============================
if (!isReducedMotion && !('ontouchstart' in window)) {
  // Card Mouse Tilt
  const tiltCards = document.querySelectorAll('.skill-card, .project-card, .timeline-content');

  tiltCards.forEach(card => {
    let tiltFrame;
    card.addEventListener('mousemove', (e) => {
      if (tiltFrame) cancelAnimationFrame(tiltFrame);
      tiltFrame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      if (tiltFrame) cancelAnimationFrame(tiltFrame);
      card.style.transform = '';
    });
  });

  // Hero Parallax Tilt
  const heroPanel = document.querySelector('.hero-panel');
  const heroSection = document.querySelector('.hero');

  if (heroPanel && heroSection) {
    let heroFrame;
    heroSection.addEventListener('mousemove', (e) => {
      if (heroFrame) cancelAnimationFrame(heroFrame);
      heroFrame = requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        heroPanel.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      if (heroFrame) cancelAnimationFrame(heroFrame);
      heroPanel.style.transform = '';
    });
  }
}

// ===============================
// Canvas Ambient Background Particles
// ===============================
const canvas = document.getElementById('canvas-ambient');

if (canvas && !isReducedMotion) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width = 0, height = 0;
  
  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      const isLightTheme = document.body.classList.contains('light-theme');
      ctx.fillStyle = isLightTheme ? 'rgba(109, 40, 217, 0.12)' : 'rgba(139, 92, 246, 0.22)';
      ctx.fill();
    }
  }
  
  const particleCount = Math.min(60, Math.floor((width * height) / 25000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function drawFrame() {
    ctx.clearRect(0, 0, width, height);
    
    const isLightTheme = document.body.classList.contains('light-theme');
    ctx.strokeStyle = isLightTheme ? 'rgba(79, 70, 229, 0.03)' : 'rgba(6, 182, 212, 0.05)';
    ctx.lineWidth = 0.8;
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(drawFrame);
  }
  
  drawFrame();
}

// ===============================
// Custom Glowing Cursor Follower
// ===============================
const cursor = document.getElementById('custom-cursor');
let updateCursorHoverListeners;

if (cursor && !isReducedMotion) {
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animateCursor() {
    const lerpFactor = 0.12;
    cursorX += (mouseX - cursorX) * lerpFactor;
    cursorY += (mouseY - cursorY) * lerpFactor;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  updateCursorHoverListeners = function() {
    const interactives = document.querySelectorAll('a, button, input, textarea, .skill-card, .project-card, .timeline-content, .skills-tab-btn, .stat-badge, .editor-mockup');
    interactives.forEach(el => {
      el.removeEventListener('mouseenter', addCursorHover);
      el.removeEventListener('mouseleave', removeCursorHover);
      
      el.addEventListener('mouseenter', addCursorHover);
      el.addEventListener('mouseleave', removeCursorHover);
    });
  };
  
  function addCursorHover() {
    cursor.classList.add('hovered');
  }
  
  function removeCursorHover() {
    cursor.classList.remove('hovered');
  }
  
  updateCursorHoverListeners();
}

// ===============================
// Skills Tab Navigation Logic
// ===============================
const tabButtons = document.querySelectorAll('.skills-tab-btn');
const skillsGroups = document.querySelectorAll('.skills-group');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    skillsGroups.forEach(group => group.classList.remove('is-active'));
    
    const targetId = btn.getAttribute('data-target');
    const targetGroup = document.getElementById(targetId);
    if (targetGroup) {
      targetGroup.classList.add('is-active');
      
      // Re-trigger progress fill animations inside this group
      const fills = targetGroup.querySelectorAll('.skill-progress-fill');
      fills.forEach(fill => {
        const targetWidth = fill.getAttribute('data-progress');
        fill.style.width = '0%';
        setTimeout(() => {
          fill.style.width = targetWidth;
        }, 50);
      });
    }
    
    if (typeof updateCursorHoverListeners === 'function') {
      updateCursorHoverListeners();
    }
  });
});

// ===============================
// Contact form (client-side validation with success style)
// ===============================
const form = document.getElementById('contactForm');
const statusMsg = document.getElementById('formStatus');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    statusMsg.textContent = 'Please fill in every field before sending.';
    statusMsg.style.color = '#EF4444'; // Cyber Red
    statusMsg.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
    statusMsg.style.borderColor = 'rgba(239, 68, 68, 0.2)';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    statusMsg.textContent = 'That email address doesn\'t look right — please check it.';
    statusMsg.style.color = '#EF4444';
    statusMsg.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
    statusMsg.style.borderColor = 'rgba(239, 68, 68, 0.2)';
    return;
  }

  statusMsg.textContent = `Thanks, ${name}! Your message is prepared. Form service connection is mock-active.`;
  statusMsg.style.color = '#10B981'; // Cyber Emerald Green
  statusMsg.style.backgroundColor = 'rgba(16, 185, 129, 0.08)';
  statusMsg.style.borderColor = 'rgba(16, 185, 129, 0.2)';
  form.reset();
  
  if (typeof updateCursorHoverListeners === 'function') updateCursorHoverListeners();
});

// ===============================
// Footer year + back to top
// ===============================
document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('toTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================================================================
// INTRO SPLASH ANIMATION CONTROLLER
// ==========================================================================
(function initIntroOverlay() {
  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  const skipBtn = document.getElementById('skipIntroBtn');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');

  // Function to dismiss intro and reveal portfolio
  function dismissIntro(immediate = false) {
    sessionStorage.setItem('hasSeenIntro', 'true');
    document.body.classList.remove('intro-active');

    if (immediate) {
      overlay.style.display = 'none';
      overlay.remove();
      return;
    }

    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.remove();
    }, 800); // Matches CSS transition 0.8s ease
  }

  // Respect reduced motion preference or prior session load
  if (prefersReducedMotion || hasSeenIntro) {
    dismissIntro(true);
    return;
  }

  // Set active scroll lock
  document.body.classList.add('intro-active');

  // Skip button click handler
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dismissIntro(false);
    });
  }

  // Auto-dismiss when animation ends (~6s)
  const introTimer = setTimeout(() => {
    dismissIntro(false);
  }, 6000);

  // Keyboard accessibility: ESC key to skip
  window.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') {
      clearTimeout(introTimer);
      dismissIntro(false);
      window.removeEventListener('keydown', onEsc);
    }
  });
})();


