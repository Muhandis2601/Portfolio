// Navbar scroll state
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

// Mobile menu toggle
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Experience dropdown toggle
const expDropdown = document.getElementById('expDropdown');
const expDropdownBtn = document.getElementById('expDropdownBtn');
if (expDropdown && expDropdownBtn) {
  expDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    expDropdown.classList.toggle('open');
  });
  // Close dropdown when clicking a menu item
  expDropdown.querySelectorAll('.nav-dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      expDropdown.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
  // Close dropdown when clicking outside
  document.addEventListener('click', () => expDropdown.classList.remove('open'));
}

// Back to top button
const backToTop = document.getElementById('backToTop');

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Animated counters for stats
const counters = document.querySelectorAll('.stat h3');
let countersStarted = false;

function animateCounters() {
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count, 10);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const tick = () => {
      current += step;
      if (current >= target) {
        counter.textContent = target;
      } else {
        counter.textContent = current;
        requestAnimationFrame(tick);
      }
    };
    tick();
  });
}

const statsSection = document.querySelector('.stats');
if (statsSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.4 });
  observer.observe(statsSection);
}

// Generic infinite drag-to-scroll carousel (used for internship track)
function setupInfiniteCarousel(track) {
  if (!track || track.dataset.infiniteReady) return;
  track.dataset.infiniteReady = 'true';

  const items = Array.from(track.children);
  const prependFrag = document.createDocumentFragment();
  const appendFrag = document.createDocumentFragment();
  items.forEach(item => {
    prependFrag.appendChild(item.cloneNode(true));
    appendFrag.appendChild(item.cloneNode(true));
  });
  track.insertBefore(prependFrag, track.firstChild);
  track.appendChild(appendFrag);

  let setWidth = 0;
  requestAnimationFrame(() => {
    setWidth = track.scrollWidth / 3;
    track.scrollLeft = setWidth;
  });

  track.addEventListener('scroll', () => {
    if (!setWidth) return;
    if (track.scrollLeft <= 0) {
      track.scrollLeft += setWidth;
    } else if (track.scrollLeft >= setWidth * 2) {
      track.scrollLeft -= setWidth;
    }
  });

  let isDown = false;
  let startX = 0;
  let startScroll = 0;
  let dragDistance = 0;

  track.addEventListener('mousedown', e => {
    isDown = true;
    dragDistance = 0;
    track.classList.add('dragging');
    startX = e.pageX;
    startScroll = track.scrollLeft;
  });
  window.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('dragging');
  });
  window.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    dragDistance = Math.abs(e.pageX - startX);
    track.scrollLeft = startScroll - (e.pageX - startX);
  });

  // Prevent the link under the cursor from navigating after a drag
  track.addEventListener('click', e => {
    if (dragDistance > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

setupInfiniteCarousel(document.getElementById('internTrack'));
setupInfiniteCarousel(document.getElementById('docTrack'));

// Internship carousel nav buttons
const internTrack = document.getElementById('internTrack');
const internPrev  = document.getElementById('internPrev');
const internNext  = document.getElementById('internNext');
if (internTrack && internPrev && internNext) {
  let internSetWidth = 0;
  let internScrolled = false;

  const cardWidth = () => {
    const card = internTrack.querySelector('.package-card');
    if (!card) return 320;
    const gap = parseInt(getComputedStyle(internTrack).gap) || 24;
    return card.offsetWidth + gap;
  };

  const updatePrevBtn = () => {
    const atStart = internTrack.scrollLeft <= internSetWidth + 4;
    internPrev.style.opacity = (internScrolled && !atStart) ? '1' : '0';
    internPrev.style.pointerEvents = (internScrolled && !atStart) ? 'auto' : 'none';
  };

  internTrack.addEventListener('scroll', () => {
    if (!internSetWidth) internSetWidth = internTrack.scrollWidth / 3;
    if (internTrack.scrollLeft > internSetWidth + 10) internScrolled = true;
    updatePrevBtn();
  });

  internPrev.addEventListener('click', () => {
    internTrack.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
  });
  internNext.addEventListener('click', () => {
    internScrolled = true;
    internTrack.scrollBy({ left: cardWidth(), behavior: 'smooth' });
  });
}

// Documentation gallery carousel nav buttons (internship detail pages)
const docTrack = document.getElementById('docTrack');
const docPrev  = document.getElementById('docPrev');
const docNext  = document.getElementById('docNext');
if (docTrack && docPrev && docNext) {
  let docSetWidth = 0;
  let docScrolled = false;

  const docCardWidth = () => {
    const card = docTrack.querySelector('.doc-card');
    if (!card) return 220;
    const gap = parseInt(getComputedStyle(docTrack).gap) || 14;
    return card.offsetWidth + gap;
  };

  const updateDocPrevBtn = () => {
    const atStart = docTrack.scrollLeft <= docSetWidth + 4;
    docPrev.style.opacity = (docScrolled && !atStart) ? '1' : '0';
    docPrev.style.pointerEvents = (docScrolled && !atStart) ? 'auto' : 'none';
  };

  docTrack.addEventListener('scroll', () => {
    if (!docSetWidth) docSetWidth = docTrack.scrollWidth / 3;
    if (docTrack.scrollLeft > docSetWidth + 10) docScrolled = true;
    updateDocPrevBtn();
  });

  docPrev.addEventListener('click', () => {
    docTrack.scrollBy({ left: -docCardWidth(), behavior: 'smooth' });
  });
  docNext.addEventListener('click', () => {
    docScrolled = true;
    docTrack.scrollBy({ left: docCardWidth(), behavior: 'smooth' });
  });
}

// Certificate trigger button + tab filter
const certTriggerBtn = document.getElementById('certTriggerBtn');
const certContent    = document.getElementById('certContent');
if (certTriggerBtn && certContent) {
  certTriggerBtn.addEventListener('click', () => {
    const isOpen = certContent.classList.toggle('open');
    certTriggerBtn.classList.toggle('open', isOpen);
    certTriggerBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

// Cert tab filtering
const certTabs = document.querySelectorAll('.cert-tab');
const certCards = document.querySelectorAll('.cert-card');
certTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    certTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const selected = tab.dataset.tab;
    certCards.forEach(card => {
      if (selected === 'all' || card.dataset.cat === selected) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Fade-in on scroll for cards
const revealEls = document.querySelectorAll('.card, .feature-card, .package-card, .org-card, .edu-card, .timeline-item, .tools-photo-wrap');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});
