/* =====================================================
   MADRID SECRETS — script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll progress bar ── */
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      progressBar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── Nav: solid on scroll ── */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMenu(open) {
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    const [s1, s2, s3] = hamburger.querySelectorAll('span');
    s1.style.transform = open ? 'rotate(45deg) translate(5px,5px)'  : '';
    s2.style.opacity   = open ? '0' : '';
    s3.style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
    mobileLinks.forEach(l => l.addEventListener('click', () => toggleMenu(false)));
  }

  /* ── Hero: ken-burns entrance ── */
  const hero = document.querySelector('.hero');
  if (hero) {
    const img = hero.querySelector('.hero__img');
    if (img) {
      const done = () => hero.classList.add('loaded');
      img.complete ? done() : img.addEventListener('load', done);
    }
  }

  /* ── Scroll reveal (Intersection Observer) ── */
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObs.observe(el));

  /* ── Staggered card reveals ── */
  document.querySelectorAll('.locations__grid .location-card').forEach((card, i) => {
    card.style.setProperty('--delay', `${i * 0.08}s`);
  });

  /* ── Testimonials carousel ── */
  const outer  = document.querySelector('.testimonials__outer');
  const track  = document.getElementById('testimonialsTrack');
  const dotsEl = document.getElementById('testimonialDots');
  const prevBtn= document.getElementById('prevBtn');
  const nextBtn= document.getElementById('nextBtn');

  if (track && dotsEl) {
    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    let current = 0;

    function perView() {
      return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    }

    function maxIdx() { return Math.max(0, cards.length - perView()); }

    function setWidths() {
      const pv = perView();
      const gap = 24; // 1.5rem
      cards.forEach(c => {
        c.style.flex = `0 0 calc(${100/pv}% - ${gap*(pv-1)/pv}px)`;
      });
    }

    function goTo(n) {
      current = Math.max(0, Math.min(n, maxIdx()));
      const cardW = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${current * cardW}px)`;
      dotsEl.querySelectorAll('.testimonials__dot')
        .forEach((d, i) => d.classList.toggle('active', i === current));
    }

    // Build dots
    const numDots = cards.length;
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('button');
      dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i+1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }

    setWidths();
    window.addEventListener('resize', () => { setWidths(); goTo(current); });

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Auto-play
    let timer = setInterval(() => goTo((current + 1) > maxIdx() ? 0 : current + 1), 5000);
    outer.addEventListener('mouseenter', () => clearInterval(timer));
    outer.addEventListener('mouseleave', () => {
      timer = setInterval(() => goTo((current + 1) > maxIdx() ? 0 : current + 1), 5000);
    });

    // Touch / swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq__item').forEach(item => {
    item.querySelector('.faq__question').addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  /* ── Contact form ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      const msg = form.querySelector('.form-success');
      btn.textContent = '✓ Verstuurd!';
      btn.style.background = '#22c55e';
      btn.style.pointerEvents = 'none';
      if (msg) msg.classList.add('show');
      setTimeout(() => {
        btn.textContent = 'Verstuur bericht';
        btn.style.background = '';
        btn.style.pointerEvents = '';
        if (msg) msg.classList.remove('show');
        form.reset();
      }, 3500);
    });
  }

  /* ── Lightbox ── */
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox) {
    document.querySelectorAll('.gallery__item img, .loc-gallery__item img').forEach(img => {
      img.parentElement.addEventListener('click', () => {
        lightboxImg.src = img.src.replace(/w=\d+/, 'w=1600');
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeLB = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };
    lightboxClose.addEventListener('click', closeLB);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
  }

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
