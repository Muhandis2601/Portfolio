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
  const cardWidth = () => {
    const card = internTrack.querySelector('.package-card');
    if (!card) return 320;
    const gap = parseInt(getComputedStyle(internTrack).gap) || 24;
    return card.offsetWidth + gap;
  };
  internPrev.addEventListener('click', () => {
    internTrack.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
  });
  internNext.addEventListener('click', () => {
    internTrack.scrollBy({ left: cardWidth(), behavior: 'smooth' });
  });
}

// Certificate folder toggle + infinite drag carousel
const certFolder = document.getElementById('certFolder');
const certCarousel = document.getElementById('certCarousel');
const certTrack = document.getElementById('certTrack');
const folderHint = document.getElementById('folderHint');

if (certFolder && certCarousel && certTrack && folderHint) {
  certFolder.addEventListener('click', () => {
    const isOpen = certFolder.classList.toggle('open');
    certCarousel.classList.toggle('open', isOpen);
    certFolder.setAttribute('aria-expanded', String(isOpen));
    folderHint.textContent = isOpen
      ? 'Klik folder untuk menutup'
      : 'Klik folder untuk melihat sertifikat';
    if (isOpen) setupInfiniteCarousel(certTrack);
  });
}

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
