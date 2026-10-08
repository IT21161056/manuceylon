/**
 * Manu Ceylon Herbs - Interactive Functionality
 * Handles Carousel, Filters, Modals, Live Clinic Status, Map Switching, and WhatsApp Concierge
 */

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
const productsData = {
  'hair-oil': {
    title: 'Murdhini Hair Oil',
    subtitle: 'Signature Ayurvedic Hair Elixir',
    category: 'hair',
    categoryName: 'Hair Care',
    image: 'assets/images/hair-oil.webp',
    desc: 'Crafted with an authentic heritage formula enriched with 43+ rare indigenous herbs and medicated botanical oils. Penetrates deeply to fortify hair roots, soothe itchy scalp, and stimulate lush healthy growth.',
    benefits: [
      'Enriched with 43+ hand-selected Ayurvedic herbs',
      'Significantly reduces hair fall and strengthens root follicles',
      'Combats stubborn dandruff and flakiness',
      'Prevents pre-mature hair greying with cooling botanicals'
    ],
    usage: 'Warm a small amount between your palms. Gently massage into scalp and hair lengths in circular motions. Leave for at least 1 hour or overnight before washing.'
  },
  'shampoo-conditioner': {
    title: 'Herbal Shampoo & Conditioner',
    subtitle: 'Nourishing Dual Botanic Care',
    category: 'hair',
    categoryName: 'Hair Care',
    image: 'assets/images/shampoo-and-conditioner.jpg',
    desc: 'A gentle, sulfate-free botanical formulation designed for all hair types. Infused with Ceylon herbal cleansers that purify without stripping natural essential oils.',
    benefits: [
      'Gentle daily scalp detox and purification',
      'Deeply conditions strands to reduce dryness and frizz',
      'Natural herbal anti-fungal properties eliminate dandruff',
      'Leaves hair silky, voluminous, and subtly scented'
    ],
    usage: 'Apply to wet hair, lather gently into scalp and rinse thoroughly. For best results, pair with Murdhini Hair Oil.'
  },
  'body-lotion': {
    title: 'Ayurvedic Body Lotion',
    subtitle: 'Cellular Radiance & Sun Soother',
    category: 'skin',
    categoryName: 'Skin Care',
    image: 'assets/images/body-lotion.jpg',
    desc: 'Enriched with therapeutic herbal extracts that replenish lost moisture, calm sun-exposed skin, and restore healthy epidermal radiance.',
    benefits: [
      'Soothes sunburned, peeling, or irritated skin',
      'Delivers 24-hour velvety moisture without greasiness',
      'Enhances natural complexion luminosity and tone',
      'Packed with natural antioxidants against environmental stressors'
    ],
    usage: 'Smooth generously over cleansed body skin morning and evening, paying special attention to dry areas like elbows, knees, and shoulders.'
  },
  'day-night-cream': {
    title: 'Day & Night Facial Cream',
    subtitle: 'Luxurious Regenerative Face Elixir',
    category: 'skin',
    categoryName: 'Skin Care',
    image: 'assets/images/day-night-cream.jpg',
    desc: 'An exquisite 24-hour facial cream infused with precious Ceylon herbs. Protects and balances skin during the day while delivering cellular restorative therapy overnight.',
    benefits: [
      'Deeply hydrates and restores epidermal barrier moisture',
      'Softens fine expression lines and improves suppleness',
      'Fades dullness and evens out skin tone',
      'Lightweight, fast-absorbing texture suitable for all skin types'
    ],
    usage: 'Dot onto cleansed face and neck morning and night. Smooth in upward gentle motions until completely absorbed.'
  },
  'pimple-cream': {
    title: 'Pimple & Blemish Cream',
    subtitle: 'Targeted Herbal Acne Purifier',
    category: 'skin',
    categoryName: 'Skin Care',
    image: 'assets/images/pimple-cream.jpg',
    desc: 'A potent Ayurvedic targeted treatment specifically formulated for acne-prone skin. Clarifies congested pores, curbs excess sebum, and heals existing blemishes gently.',
    benefits: [
      'Rapidly reduces inflammation and redness of breakouts',
      'Balances sebum production without drying skin',
      'Prevents post-acne dark marks and hyperpigmentation',
      'Contains natural antibacterial and antiseptic herbal extracts'
    ],
    usage: 'Apply directly onto clean affected areas or pimples twice daily until skin clears.'
  },
  'herbal-soap': {
    title: 'Artisanal Herbal Soap Collection',
    subtitle: 'Pure Botanic Bar Cleansers',
    category: 'skin',
    categoryName: 'Skin Care',
    image: 'assets/images/soap.webp',
    desc: 'Handcrafted cold-processed soaps made with pure botanical oils and traditional herbs including Neem, Ubtan, Saffron, and Activated Bamboo Charcoal.',
    benefits: [
      'Neem Soap: Clears active acne and soothes sensitive skin',
      'Ubtan Soap: Gently exfoliates and lightens underarm darkness',
      'Saffron Soap: Imparts an opulent glowing complexion',
      'Charcoal Soap: Purifies pores and eliminates deep pollutants'
    ],
    usage: 'Work into a creamy rich lather with water. Gently massage over face and body, then rinse clean.'
  },
  'beard-oil': {
    title: 'Herbal Beard Oil',
    subtitle: 'Follicle Nourishment & Conditioning',
    category: 'grooming',
    categoryName: 'Grooming & Lips',
    image: 'assets/images/beard-oil.webp',
    desc: 'A tailored botanical conditioning blend designed for men who appreciate authentic herbal care. Nourishes facial hair follicles, tames coarse texture, and supports healthy density.',
    benefits: [
      'Stimulates even beard growth and fills patchy areas',
      'Softens coarse whiskers and relieves beard itch',
      'Slows down premature facial hair greying',
      'Gives a polished, healthy sheen without oily residue'
    ],
    usage: 'Dispense 3 to 5 drops into palms and work evenly through clean beard from roots to tips.'
  },
  'lip-balm-scrub': {
    title: 'Lip Balm & Exfoliating Scrub',
    subtitle: 'Herbal Secret for Rosy Soft Lips',
    category: 'grooming',
    categoryName: 'Grooming & Lips',
    image: 'assets/images/lip-balm-scrub.jpg',
    desc: 'A complete dual herbal lip treatment. The gentle sugar-botanic scrub buffs away dead dry flakes, while the rich balm locks in moisture and revives natural pink radiance.',
    benefits: [
      'Removes stubborn dryness, flakiness, and chapping',
      'Reverses smoker darkening and sun pigmentation',
      'Infused with pure beeswax and herbal extracts',
      'Keeps lips plump, supple, and naturally tinted'
    ],
    usage: 'Use scrub 2 to 3 times weekly with gentle circular finger rubbing. Apply lip balm daily as needed.'
  }
};

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
      const data = productsData[productId];
      if (!data) return;

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

      // WhatsApp direct inquiry link
      const waBtn = document.getElementById('qvWhatsAppBtn');
      const waMessage = encodeURIComponent(`Hello Manu Ceylon Herbs! I would like to inquire and place an order for: ${data.title}. Please provide pricing and availability.`);
      waBtn.href = `https://wa.me/94741837868?text=${waMessage}`;

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
      const treatment = document.getElementById('bookTreatmentSelect').value;
      const notes = document.getElementById('bookNotes').value;

      // WhatsApp reservation dispatch
      const waMsg = encodeURIComponent(
        `*New Appointment Request - Medhini Ayurveda*\n` +
        `• Name: ${name}\n` +
        `• Phone: ${phone}\n` +
        `• Requested Treatment: ${treatment}\n` +
        `• Preferred Date: ${date}\n` +
        `• Patient Notes: ${notes || 'None'}`
      );

      const confirmDiv = document.getElementById('bookingConfirmation');
      confirmDiv.style.display = 'block';
      bookingForm.style.display = 'none';

      const sendWaBtn = document.getElementById('sendBookingWhatsApp');
      if (sendWaBtn) {
        sendWaBtn.href = `https://wa.me/94743607868?text=${waMsg}`;
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
  // Monday: Closed (Day 1)
  // Wednesday: 9:30 AM - 6:00 PM (Day 3, 9.5 to 18)
  // Saturday: 9:30 AM - 6:00 PM (Day 6, 9.5 to 18)
  // Sunday: 9:30 AM - 6:00 PM (Day 0, 9.5 to 18)
  // Other days (Tue, Thu, Fri): By Appointment / Closed for Walk-ins

  const isOpenDay = (day === 0 || day === 3 || day === 6);
  const isOpenTime = (currentTimeDec >= 9.5 && currentTimeDec < 18.0);

  let statusText = '';
  let isOpen = false;

  if (isOpenDay && isOpenTime) {
    statusText = 'Clinic Open Today (Until 6:00 PM)';
    isOpen = true;
  } else if (isOpenDay && currentTimeDec < 9.5) {
    statusText = 'Opens Today at 9:30 AM';
  } else if (day === 1) {
    statusText = 'Closed on Mondays - Reopens Wednesday';
  } else if (day === 2) {
    statusText = 'Open Tomorrow (Wednesday 9:30 AM)';
  } else if (day === 4 || day === 5) {
    statusText = 'Consultations Available by Appointment (Next Clinic: Saturday)';
  } else {
    statusText = 'Closed for the Day - Next Clinic: 9:30 AM';
  }

  statusBadges.forEach(badge => {
    badge.innerHTML = `
      <span class="status-indicator" style="background-color: ${isOpen ? '#22c55e' : '#eab308'}; box-shadow: 0 0 8px ${isOpen ? '#22c55e' : '#eab308'};"></span>
      <span>${statusText}</span>
    `;
  });
}

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
    const service = document.getElementById('contact_service').value;
    const message = document.getElementById('contact_message').value;

    // Show instant pleasant feedback
    if (confirmation) {
      confirmation.style.display = 'block';
      form.style.display = 'none';

      const waBackupBtn = document.getElementById('contactWhatsAppBackup');
      if (waBackupBtn) {
        const text = encodeURIComponent(
          `*General Inquiry - Manu Ceylon Herbs*\n` +
          `• Name: ${name}\n` +
          `• Phone: ${phone}\n` +
          `• Subject/Interest: ${service}\n` +
          `• Message: ${message}`
        );
        waBackupBtn.href = `https://wa.me/94741837868?text=${text}`;
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
