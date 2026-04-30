/* ============================================================
   AURANOX — main.js
   ============================================================ */

/* ── CUSTOM CURSOR ───────────────────────────────────────────── */
(function initCursor() {
  const cursor    = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  if (!cursor || !cursorRing) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx - 4 + 'px';
    cursor.style.top  = my - 4 + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx - 16 + 'px';
    cursorRing.style.top  = ry - 16 + 'px';
    requestAnimationFrame(animateRing);
  })();

  const interactives = 'button, a, .product-card, .ritual-step, .testimonial-card, input';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      cursorRing.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      cursorRing.classList.remove('hovered');
    });
  });
})();


/* ── NAV SCROLL BEHAVIOUR ────────────────────────────────────── */
(function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();


/* ── SCROLL REVEAL ───────────────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);      // fire once
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ── PARALLAX HERO GRID ──────────────────────────────────────── */
(function initParallax() {
  const grid = document.querySelector('.hero-grid');
  if (!grid) return;
  window.addEventListener('scroll', () => {
    grid.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
})();


/* ── RITUAL STEP HOVER HIGHLIGHT ─────────────────────────────── */
(function initRitualSteps() {
  const steps = document.querySelectorAll('.ritual-step');
  steps.forEach(step => {
    step.addEventListener('mouseenter', () => {
      steps.forEach(s => s.style.opacity = '0.45');
      step.style.opacity = '1';
    });
    step.addEventListener('mouseleave', () => {
      steps.forEach(s => s.style.opacity = '1');
    });
  });
})();


/* ── PRODUCT CARD 3-D TILT ───────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  =  dy * 6;   // degrees
      const tiltY  = -dx * 6;
      card.style.transform = `translateY(-8px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ── NEWSLETTER FORM ─────────────────────────────────────────── */
(function initNewsletter() {
  const form   = document.getElementById('newsletter-form');
  const input  = document.getElementById('newsletter-email');
  const btn    = document.getElementById('newsletter-btn');
  const notice = document.getElementById('newsletter-notice');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      showNotice('Enter a valid email address.', 'error');
      return;
    }
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      input.value = '';
      btn.textContent = 'Subscribe';
      btn.disabled = false;
      showNotice('You\'re on the list. Welcome to the future.', 'success');
    }, 1200);
  });

  function showNotice(msg, type) {
    if (!notice) return;
    notice.textContent = msg;
    notice.style.color = type === 'success' ? 'var(--neon-blue)' : '#ff6b6b';
    notice.style.opacity = '1';
    setTimeout(() => { notice.style.opacity = '0'; }, 4000);
  }
})();


/* ── COUNTER ANIMATION (stats) ───────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const isFloat = target % 1 !== 0;
      const duration = 1400;
      const start = performance.now();

      (function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = target * eased;
        el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
      })(start);

      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
})();


/* ── MARQUEE PAUSE ON HOVER ──────────────────────────────────── */
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();


/* ── GLITCH TEXT ON HOVER ─────────────────────────────────────── */
(function initGlitchHover() {
  const glitchEls = document.querySelectorAll('.nav-logo, .hero-title');
  glitchEls.forEach(el => {
    el.addEventListener('mouseenter', () => el.style.animation = 'glitch 0.4s steps(1) forwards');
    el.addEventListener('animationend', () => el.style.animation = '');
  });
})();


/* ── CART SYSTEM ─────────────────────────────────────────────── */
(function initCart() {
  let cart = [];

  const cartToggle  = document.getElementById('cartToggle');
  const cartDrawer  = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose   = document.getElementById('cartClose');
  const cartBadge   = document.getElementById('cartBadge');
  const cartCount   = document.getElementById('cartCount');
  const cartItems   = document.getElementById('cartItems');
  const cartEmpty   = document.getElementById('cartEmpty');
  const cartFooter  = document.getElementById('cartFooter');
  const cartSubtotal= document.getElementById('cartSubtotal');
  const cartTotal   = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const checkoutOverlay  = document.getElementById('checkoutOverlay');
  const checkoutClose    = document.getElementById('checkoutClose');
  const placeOrderBtn    = document.getElementById('placeOrderBtn');
  const checkoutSummary  = document.getElementById('checkoutSummaryItems');
  const checkoutTotalAmt = document.getElementById('checkoutTotalAmt');

  const successOverlay = document.getElementById('successOverlay');
  const successClose   = document.getElementById('successClose');

  /* ── Open / close cart ── */
  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartToggle.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  /* ── Add to cart ── */
  document.querySelectorAll('.product-btn[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id    = btn.dataset.id;
      const name  = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);

      const existing = cart.find(i => i.id === id);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ id, name, price, qty: 1 });
      }

      // button feedback
      btn.textContent = '✓ Added';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.classList.remove('added');
      }, 1800);

      renderCart();
      openCart();
    });
  });

  /* ── Render cart ── */
  function renderCart() {
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    const totalAmt = cart.reduce((s, i) => s + i.price * i.qty, 0);

    // badge
    cartBadge.textContent = totalQty;
    cartBadge.classList.toggle('has-items', totalQty > 0);

    // count
    cartCount.textContent = totalQty + ' item' + (totalQty !== 1 ? 's' : '');

    // empty / footer
    if (cart.length === 0) {
      cartEmpty.style.display = 'flex';
      cartFooter.style.display = 'none';
    } else {
      cartEmpty.style.display = 'none';
      cartFooter.style.display = 'block';
    }

    // items
    // remove old rows
    cartItems.querySelectorAll('.cart-item').forEach(el => el.remove());

    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-item-visual">
          <svg viewBox="0 0 48 72" width="36" fill="none">
            <rect x="16" y="2" width="16" height="8" rx="1" fill="rgba(79,150,247,0.3)" stroke="rgba(79,150,247,0.5)" stroke-width="0.5"/>
            <rect x="20" y="10" width="8" height="5" rx="0.5" fill="rgba(79,150,247,0.2)"/>
            <rect x="4" y="15" width="40" height="52" rx="2" fill="rgba(10,25,60,0.8)" stroke="rgba(79,150,247,0.4)" stroke-width="0.5"/>
            <rect x="4" y="15" width="1.5" height="52" fill="url(#ciEdge${item.id})"/>
            <rect x="42.5" y="15" width="1.5" height="52" fill="url(#ciEdge${item.id})"/>
            <text x="24" y="44" text-anchor="middle" font-family="sans-serif" font-size="5" fill="rgba(200,225,255,0.8)">${item.name.toUpperCase()}</text>
            <defs>
              <linearGradient id="ciEdge${item.id}" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0%" stop-color="rgba(79,195,247,0)"/>
                <stop offset="45%" stop-color="rgba(79,195,247,0.8)"/>
                <stop offset="100%" stop-color="rgba(79,195,247,0)"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(0)}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
        <button class="cart-item-remove" data-id="${item.id}">✕</button>
      `;
      cartItems.appendChild(row);
    });

    // totals
    cartSubtotal.textContent = '$' + totalAmt.toFixed(0);
    cartTotal.textContent    = '$' + totalAmt.toFixed(0);

    // qty / remove events
    cartItems.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = cart.find(i => i.id === id);
        if (!item) return;
        if (btn.dataset.action === 'inc') item.qty++;
        else { item.qty--; if (item.qty <= 0) cart = cart.filter(i => i.id !== id); }
        renderCart();
      });
    });
    cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart = cart.filter(i => i.id !== btn.dataset.id);
        renderCart();
      });
    });
  }

  /* ── Checkout ── */
  checkoutBtn.addEventListener('click', () => {
    closeCart();
    // populate summary
    checkoutSummary.innerHTML = cart.map(i =>
      `<div class="checkout-summary-item">
        <span>${i.name} × ${i.qty}</span>
        <span>$${(i.price * i.qty).toFixed(0)}</span>
      </div>`
    ).join('');
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    checkoutTotalAmt.textContent = '$' + total.toFixed(0);
    checkoutOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  checkoutClose.addEventListener('click', () => {
    checkoutOverlay.style.display = 'none';
    document.body.style.overflow = '';
  });
  checkoutOverlay.addEventListener('click', e => {
    if (e.target === checkoutOverlay) {
      checkoutOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  /* ── Place Order ── */
  placeOrderBtn.addEventListener('click', () => {
    const email = document.getElementById('co-email').value.trim();
    const name  = document.getElementById('co-name').value.trim();
    if (!email || !email.includes('@') || !name) {
      document.getElementById('co-email').style.borderColor = email && email.includes('@') ? '' : '#ff6b6b';
      document.getElementById('co-name').style.borderColor  = name ? '' : '#ff6b6b';
      return;
    }
    checkoutOverlay.style.display = 'none';
    successOverlay.style.display = 'flex';
    cart = [];
    renderCart();
  });

  successClose.addEventListener('click', () => {
    successOverlay.style.display = 'none';
    document.body.style.overflow = '';
  });

  /* init render */
  renderCart();
})();
