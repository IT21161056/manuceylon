/**
 * Manu Ceylon Herbs - Interactive Functionality
 * Handles Carousel, Filters, Modals, Live Clinic Status, Map Switching, and WhatsApp Concierge
 */

// Helper for reliable multi-language controller access
function getActiveLanguage() {
  const i18n = (typeof window !== 'undefined' && window.AppI18n) || (typeof AppI18n !== 'undefined' ? AppI18n : null);
  return (i18n && i18n.getLanguage()) || 'en';
}

function getActiveI18n() {
  return (typeof window !== 'undefined' && window.AppI18n) || (typeof AppI18n !== 'undefined' ? AppI18n : null);
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initProductFilter();
  initQuickViewModal();
  initBookingModal();
  initClinicStatus();
  initLocationTabs();
  initMobileDrawer();
  initContactForm();
  initHeaderScroll();
});

/* ==========================================================================
   1. Hero Carousel
   ========================================================================== */
function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.carousel-indicator-dot');
  const prevBtn = document.querySelector('.carousel-nav-btn.prev');
  const nextBtn = document.querySelector('.carousel-nav-btn.next');
  const heroSection = document.querySelector('.hero-section');

  if (!slides.length) return;

  let currentSlide = 0;
  const slideCount = slides.length;
  let slideInterval = null;
  const autoPlayDelay = 6000;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide]?.classList.remove('active');

    currentSlide = (index + slideCount) % slideCount;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide]?.classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, autoPlayDelay);
  }

  function stopAutoplay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  indicators.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoplay();
    });
  });

  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        startAutoplay();
      }
    }
  }

  startAutoplay();
}

/* ==========================================================================
   2. Product Catalog Data & Category Filtering
   ========================================================================== */
function getProductData(productId) {
  const i18n = (typeof window !== 'undefined' && window.AppI18n) || (typeof AppI18n !== 'undefined' ? AppI18n : null);
  const lang = (i18n && i18n.getLanguage()) || 'en';
  const pI18n = (typeof window !== 'undefined' && window.productsI18n) || (typeof productsI18n !== 'undefined' ? productsI18n : null);
  if (pI18n && pI18n[lang] && pI18n[lang][productId]) {
    return pI18n[lang][productId];
  }
  if (pI18n && pI18n.en && pI18n.en[productId]) {
    return pI18n.en[productId];
  }
  return null;
}


function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. Product Quick View Modal
   ========================================================================== */
function initQuickViewModal() {
  const modal = document.getElementById('quickViewModal');
  const closeBtn = document.getElementById('closeQuickView');
  const quickViewBtns = document.querySelectorAll('.btn-quick-view');

  if (!modal) return;

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.dataset.productId;
      const data = getProductData(productId);
      if (!data) return;

      const lang = getActiveLanguage();

      document.getElementById('qvCategory').textContent = data.categoryName;
      document.getElementById('qvTitle').textContent = data.title;
      document.getElementById('qvSubtitle').textContent = data.subtitle;
      document.getElementById('qvDesc').textContent = data.desc;
      document.getElementById('qvImage').src = data.image;
      document.getElementById('qvImage').alt = data.title;

      const benefitsList = document.getElementById('qvBenefits');
      benefitsList.innerHTML = '';
      data.benefits.forEach(benefit => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'flex-start';
        li.style.gap = '0.5rem';
        li.style.marginBottom = '0.4rem';
        li.style.fontSize = '0.875rem';
        li.style.color = 'var(--color-text-muted)';
        li.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2.5" style="margin-top:2px; flex-shrink:0;">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${benefit}</span>
        `;
        benefitsList.appendChild(li);
      });

      document.getElementById('qvUsage').textContent = data.usage;

      // WhatsApp direct inquiry link in active language
      const waBtn = document.getElementById('qvWhatsAppBtn');
      const waMsgText = lang === 'si'
        ? `ආයුබෝවන් මනූ සිලෝන් හර්බ්ස්! මට ${data.title} නිෂ්පාදනය පිළිබඳව විමසීමට සහ ඇණවුම් කිරීමට අවශ්‍යයි. කරුණාකර මිල ගණන් සහ ලබාගත හැකි ආකාරය දන්වන්න.`
        : `Hello Manu Ceylon Herbs! I would like to inquire and place an order for: ${data.title}. Please provide pricing and availability.`;
      waBtn.href = `https://wa.me/94711017868?text=${encodeURIComponent(waMsgText)}`;

      openModal(modal);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal(modal);
    }
  });
}

/* ==========================================================================
   4. Treatment Booking Modal
   ========================================================================== */
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('closeBooking');
  const bookBtns = document.querySelectorAll('.btn-book-treatment');
  const treatmentSelect = document.getElementById('bookTreatmentSelect');

  if (!modal) return;

  bookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const treatmentName = btn.dataset.treatment;
      if (treatmentSelect && treatmentName) {
        treatmentSelect.value = treatmentName;
      }
      openModal(modal);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal(modal);
    }
  });

  const bookingForm = document.getElementById('appointmentBookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookName').value;
      const phone = document.getElementById('bookPhone').value;
      const date = document.getElementById('bookDate').value;
      const treatmentSelectEl = document.getElementById('bookTreatmentSelect');
      const treatment = treatmentSelectEl ? (treatmentSelectEl.options[treatmentSelectEl.selectedIndex]?.text || treatmentSelectEl.value) : '';
      const notes = document.getElementById('bookNotes').value;
      const lang = getActiveLanguage();

      // WhatsApp reservation dispatch in active language
      const waMsgText = lang === 'si'
        ? `*නව සායන හමුවක් වෙන්කිරීම - මේදිනී ආයුර්වේදය*\n` +
          `• රෝගියාගේ නම: ${name}\n` +
          `• දුරකථනය: ${phone}\n` +
          `• අවශ්‍ය ප්‍රතිකාරය: ${treatment}\n` +
          `• කැමති දිනය: ${date}\n` +
          `• සටහන්: ${notes || 'නැත'}`
        : `*New Appointment Request - Medhini Ayurveda*\n` +
          `• Name: ${name}\n` +
          `• Phone: ${phone}\n` +
          `• Requested Treatment: ${treatment}\n` +
          `• Preferred Date: ${date}\n` +
          `• Patient Notes: ${notes || 'None'}`;

      const confirmDiv = document.getElementById('bookingConfirmation');
      confirmDiv.style.display = 'block';
      bookingForm.style.display = 'none';

      const sendWaBtn = document.getElementById('sendBookingWhatsApp');
      if (sendWaBtn) {
        sendWaBtn.href = `https://wa.me/94711017868?text=${encodeURIComponent(waMsgText)}`;
      }
    });
  }
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   5. Clinic Live Status Calculation
   ========================================================================== */
function initClinicStatus() {
  const statusBadges = document.querySelectorAll('.clinic-live-status');
  if (!statusBadges.length) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTimeDec = hours + minutes / 60;

  // Operating Schedule:
  // Monday & Tuesday: Closed (Days 1 & 2)
  // Wednesday to Sunday: 9:00 AM - 6:00 PM (Days 3, 4, 5, 6, 0; 9.0 to 18.0)

  const isOpenDay = (day === 0 || day >= 3);
  const isOpenTime = (currentTimeDec >= 9.0 && currentTimeDec < 18.0);

  let statusKey = '';
  let isOpen = false;

  if (isOpenDay && isOpenTime) {
    statusKey = 'status.openNow';
    isOpen = true;
  } else if (isOpenDay && currentTimeDec < 9.0) {
    statusKey = 'status.opensToday';
  } else if (day === 1) {
    statusKey = 'status.closedMonday';
  } else if (day === 2) {
    statusKey = 'status.openTomorrow';
  } else {
    statusKey = 'status.closedForDay';
  }

  const i18n = (typeof window !== 'undefined' && window.AppI18n) || (typeof AppI18n !== 'undefined' ? AppI18n : null);
  const statusText = (i18n && i18n.t(statusKey)) || statusKey;

  statusBadges.forEach(badge => {
    badge.innerHTML = `
      <span class="status-indicator" style="background-color: ${isOpen ? '#22c55e' : '#eab308'}; box-shadow: 0 0 8px ${isOpen ? '#22c55e' : '#eab308'};"></span>
      <span class="clinic-status-label" data-i18n="${statusKey}">${statusText}</span>
    `;
  });
}

// Expose on window so AppI18n can trigger status re-calculation
if (typeof window !== 'undefined') {
  window.initClinicStatus = initClinicStatus;
}

// Reactively update clinic status whenever language changes
window.addEventListener('languageChanged', () => {
  initClinicStatus();
});

/* ==========================================================================
   6. Location & Map Tabs
   ========================================================================== */
function initLocationTabs() {
  const tabs = document.querySelectorAll('.location-tab-btn');
  const mapIframe = document.getElementById('locationMapIframe');
  const dirLink = document.getElementById('locationDirectionsLink');

  if (!tabs.length || !mapIframe) return;

  const locations = {
    'hokandara': {
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3960.9289592606324!2d79.95512807499627!3d6.899099993100142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTMnNTYuOCJOIDc5wrA1NycyNy43IkU!5e0!3m2!1sen!2slk!4v1715070729966!5m2!1sen!2slk',
      dirUrl: 'https://maps.google.com/?q=6.899099993100142,79.95512807499627'
    },
    'galle': {
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8687258957444!2d80.2520!3d6.1360!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae173bb4628f411%3A0x6b107e3a95bf08d2!2sNagoda%2C%20Galle!5e0!3m2!1sen!2slk!4v1715070800000!5m2!1sen!2slk',
      dirUrl: 'https://maps.google.com/?q=Nagoda,+Galle,+Sri+Lanka'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const locKey = tab.dataset.location;
      const target = locations[locKey];
      if (target) {
        mapIframe.src = target.embedUrl;
        if (dirLink) dirLink.href = target.dirUrl;
      }
    });
  });
}

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  function toggle() {
    toggleBtn.classList.toggle('active');
    drawer.classList.toggle('open');
    backdrop.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  }

  function close() {
    toggleBtn.classList.remove('active');
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', toggle);
  backdrop.addEventListener('click', close);
  links.forEach(l => l.addEventListener('click', close));
}

/* ==========================================================================
   8. Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('mainContactForm');
  const confirmation = document.getElementById('contactFormConfirmation');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact_name').value;
    const phone = document.getElementById('contact_phone').value;
    const serviceSelectEl = document.getElementById('contact_service');
    const service = serviceSelectEl ? (serviceSelectEl.options[serviceSelectEl.selectedIndex]?.text || serviceSelectEl.value) : '';
    const message = document.getElementById('contact_message').value;
    const lang = getActiveLanguage();

    // Show instant pleasant feedback
    if (confirmation) {
      confirmation.style.display = 'block';
      form.style.display = 'none';

      const waBackupBtn = document.getElementById('contactWhatsAppBackup');
      if (waBackupBtn) {
        const text = lang === 'si'
          ? `*සාමාන්‍ය විමසුම - මනූ සිලෝන් හර්බ්ස්*\n` +
            `• නම: ${name}\n` +
            `• දුරකථනය: ${phone}\n` +
            `• විමසුම් මාතෘකාව: ${service}\n` +
            `• පණිවිඩය: ${message}`
          : `*General Inquiry - Manu Ceylon Herbs*\n` +
            `• Name: ${name}\n` +
            `• Phone: ${phone}\n` +
            `• Subject/Interest: ${service}\n` +
            `• Message: ${message}`;
        waBackupBtn.href = `https://wa.me/94711017868?text=${encodeURIComponent(text)}`;
      }
    }
  });
}

/* ==========================================================================
   9. Header Scroll Effect & Active Section Spy
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}
