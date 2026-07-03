// ── NAV SCROLL ──────────────────────────────────
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('sc',window.scrollY>60);
});

// ── COUNTERS ────────────────────────────────────
function cnt(el, target, dur, isFloat, decimals) {
  if (el._cntTimer) clearInterval(el._cntTimer);
  var s = 0;
  var steps = Math.max(dur / 16, 1);
  var step = target / steps;
  el.textContent = isFloat ? (0).toFixed(decimals) : '0';
  el._cntTimer = setInterval(function() {
    s = Math.min(s + step, target);
    el.textContent = isFloat ? s.toFixed(decimals) : Math.round(s);
    if (s >= target) {
      el.textContent = isFloat ? target.toFixed(decimals) : target;
      clearInterval(el._cntTimer);
      el._cntTimer = null;
    }
  }, 16);
}

// Observer that triggers counter animation when element scrolls into view
var cntObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var el = entry.target;
      var rawTarget = el.getAttribute('data-target');
      var targetVal = parseFloat(rawTarget);
      var duration = parseInt(el.getAttribute('data-duration') || '2500', 10);
      if (!isNaN(targetVal)) {
        var isFloat = rawTarget && rawTarget.indexOf('.') !== -1;
        var decimals = isFloat ? rawTarget.split('.')[1].length : 0;
        cnt(el, targetVal, duration, isFloat, decimals);
      }
      cntObs.unobserve(el);
    }
  });
}, { threshold: 0.2 });

// Observe counters only inside a given container
function observeCounters(container) {
  container.querySelectorAll('.counter-val').forEach(function(el) {
    var rawTarget = el.getAttribute('data-target') || '0';
    var isFloat = rawTarget.indexOf('.') !== -1;
    var decimals = isFloat ? rawTarget.split('.')[1].length : 0;
    el.textContent = isFloat ? (0).toFixed(decimals) : '0';
    cntObs.unobserve(el); // ensure no duplicate observation
    cntObs.observe(el);
  });
}

// ── SCROLL REVEAL ───────────────────────────────
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
},{threshold:0.08});

// ── PAGE NAVIGATION ─────────────────────────────
function go(id, anchor){
  const current = document.querySelector('.pg.on');
  const target = document.getElementById('pg-'+id);
  if(!target) return;
  
  // Close mobile menu if open
  document.getElementById('mob').classList.remove('on');

  if(current && current !== target) {
    const overlay = document.getElementById('transition-overlay');
    const logo = overlay ? overlay.querySelector('.transition-logo') : null;
    
    // 1. Show overlay (fade to navy) & scale up logo
    if (overlay) overlay.classList.add('active');
    if (logo) logo.classList.add('active');
    
    current.classList.add('fade-out');
    
    // 2. Perform page switch after overlay is fully visible (300ms)
    setTimeout(() => {
      current.classList.remove('on', 'fade-out');
      target.classList.add('on', 'fade-in');
      
      // Scroll handling
      if(anchor){
        const el = document.getElementById(anchor);
        if(el) {
          el.scrollIntoView({behavior:'auto', block:'start'});
        } else {
          window.scrollTo({top:0, behavior:'auto'});
        }
      } else {
        window.scrollTo({top:0, behavior:'auto'});
      }
      
      // Re-observe fade elements in new page
      target.querySelectorAll('.fd').forEach(el => {
        el.classList.remove('in');
        obs.observe(el);
      });

      // Re-observe counters in new page (they fire when scrolled into view)
      observeCounters(target);
    }, 300);
    
    // 3. Scale down the logo (after 1200ms - giving it ~1 second stay time)
    setTimeout(() => {
      if (logo) logo.classList.remove('active');
    }, 1200);
    
    // 4. Fade out the overlay (at 1300ms) and clean up new page classes (at 1600ms)
    setTimeout(() => {
      if (overlay) overlay.classList.remove('active');
      
      setTimeout(() => {
        target.classList.remove('fade-in');
      }, 300);
    }, 1300);
    
  } else {
    // If no current page or same page, show immediately
    document.querySelectorAll('.pg').forEach(p=>p.classList.remove('on', 'fade-in', 'fade-out'));
    target.classList.add('on');
    if(anchor){
      const el = document.getElementById(anchor);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    } else {
      window.scrollTo({top:0, behavior:'smooth'});
    }
    
    target.querySelectorAll('.fd').forEach(el => {
      el.classList.remove('in');
      obs.observe(el);
    });

    // Re-observe counters
    observeCounters(target);
  }
}

// ── INIT: observe only visible page ─────────────
document.querySelectorAll('.pg.on .fd').forEach(el=>obs.observe(el));
var initPage = document.querySelector('.pg.on');
if (initPage) observeCounters(initPage);



// ── PROGRAM FILTER ──────────────────────────────
function fprog(type,btn){
  document.querySelectorAll('.ptabs .ptab').forEach(t=>t.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('#pgrid .pc-card-container').forEach(c=>{
    if(type==='all'){ c.style.display=''; return; }
    c.style.display = c.classList.contains(type) ? '' : 'none';
  });
}

// ── REQ TABS ────────────────────────────────────
function swrq(showId,hideId,btn){
  const tabs = btn.closest('.rqtabs').querySelectorAll('.rqtab');
  tabs.forEach(t=>t.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById(showId).style.display='';
  document.getElementById(hideId).style.display='none';
}

// ── ACCORDION ───────────────────────────────────
function accToggle(head){
  const body=head.nextElementSibling;
  const arrow=head.querySelector('.ac-a');
  const open=body.classList.contains('op');
  body.classList.toggle('op',!open);
  arrow.classList.toggle('op',!open);
}

// ── MOBILE MENU ─────────────────────────────────
function toggleMob(){
  document.getElementById('mob').classList.toggle('on');
}

// ── HERO VIDEO SYNCHRONIZED OVERLAYS ────────────────
document.addEventListener('DOMContentLoaded', () => {
  // ── STICKY WHATSAPP BUSINESS FLOATING WIDGET ────────
  const stickyWa = document.getElementById('stickyWa');
  const stickyWaClose = document.getElementById('stickyWaClose');
  const floatingWaButton = document.querySelector('.wab');

  // Show sticky-wa after 2 seconds
  setTimeout(() => {
    if (stickyWa) {
      stickyWa.classList.remove('hidden');
      if (floatingWaButton) floatingWaButton.classList.add('up');
    }
  }, 2000);

  // Close button
  stickyWaClose?.addEventListener('click', () => {
    stickyWa?.classList.add('hidden');
    if (floatingWaButton) floatingWaButton.classList.remove('up');
  });

  // ── CARD HOVER TILT EFFECT ──────────────────────────
  const tiltElements = document.querySelectorAll(
    '.ppcard, .tcard, .vc, .cc, .cib, .card-tilt, .img-frame'
  );

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `
        perspective(800px)
        rotateY(${x * 4}deg)
        rotateX(${-y * 4}deg)
        translateY(-4px)
      `;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // ── FORM INTERACTIVE VALIDATION & SUCCESS OVERLAYS ──
  const shakeElement = (el) => {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => { el.style.animation = ''; }, 400);
  };

  // Add keyframes dynamically if not present
  if (!document.getElementById('shake-style-js')) {
    const style = document.createElement('style');
    style.id = 'shake-style-js';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // Setup form submit handlers
  const setupForm = (formId, submitBtnId, successHtml, isDark = false) => {
    const form = document.getElementById(formId);
    const btn = document.getElementById(submitBtnId);
    if (!form || !btn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate fields
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#C8232A';
          valid = false;
        }
      });

      if (!valid) {
        shakeElement(btn);
        return;
      }

      // Loading state
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18" style="stroke: currentColor; animation: spin 0.8s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.25"/>
          <path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>Enviando...</span>
      `;
      btn.disabled = true;
      btn.style.opacity = '0.8';

      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success
      form.innerHTML = successHtml;
    });
  };

  // 1. Contact Form
  setupForm(
    'contactForm',
    'contactSubmitBtn',
    `
    <div class="form-success">
      <div class="success-icon">✅</div>
      <h4>¡Mensaje Enviado!</h4>
      <p>Un asesor académico de FBTU se pondrá en contacto contigo por WhatsApp o Email en las próximas 24 horas para ayudarte con tu solicitud.</p>
    </div>
    `
  );

  // 2. Admission Form (Apply Now)
  setupForm(
    'applyForm',
    'applySubmitBtn',
    `
    <div class="form-success">
      <div class="success-icon">🎓</div>
      <h4>¡Solicitud Recibida!</h4>
      <p>Hemos recibido tus datos de admisión correctamente. Un orientador de FBTU se pondrá en contacto contigo dentro de las próximas 24 horas hábiles para guiarte en la carga de documentos.</p>
    </div>
    `
  );

  // 3. Request Information Form
  setupForm(
    'requestInfoForm',
    'requestInfoSubmitBtn',
    `
    <div class="form-success dark">
      <div class="success-icon">✉️</div>
      <h4>¡Información Solicitada!</h4>
      <p>Tu solicitud de información se ha procesado con éxito. Te enviaremos el brochure oficial y detalles de becas a tu correo electrónico y WhatsApp.</p>
    </div>
    `,
    true
  );

  // ── METHODOLOGY BACKGROUND SLIDESHOW & INTERACTION ──
  const methSection = document.querySelector('.methodology-section');
  const methSlides = document.querySelectorAll('.methodology-slide');
  const methItems = document.querySelectorAll('.methodology-item');
  
  if (methSection && methSlides.length > 0) {
    let currentMethSlide = 0;
    let methInterval = null;
    let isHovered = false;

    const showMethSlide = (index) => {
      methSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      currentMethSlide = index;
    };

    const startMethSlideshow = () => {
      if (methInterval) clearInterval(methInterval);
      methInterval = setInterval(() => {
        if (!isHovered) {
          let nextSlide = (currentMethSlide + 1) % methSlides.length;
          showMethSlide(nextSlide);
        }
      }, 3000);
    };

    const stopMethSlideshow = () => {
      if (methInterval) clearInterval(methInterval);
    };

    methItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        isHovered = true;
        stopMethSlideshow();
        showMethSlide(index);
      });
      item.addEventListener('mouseleave', () => {
        isHovered = false;
        startMethSlideshow();
      });
    });

    // Start automated cycle
    startMethSlideshow();
  }
});