document.addEventListener('DOMContentLoaded', () => {

  // ---- Sticky Nav ----
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ---- Hero Slideshow ----
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-locations span');
  let current = 0;
  let slideInterval;

  function preloadHeroImages(callback) {
    let loaded = 0;
    const total = slides.length;
    if (!total) { if (callback) callback(); return; }
    slides.forEach(s => {
      const url = s.style.backgroundImage.replace(/url\(['"]?(.+?)['"]?\)/i, '$1');
      if (!url) { loaded++; if (loaded === total && callback) callback(); return; }
      const img = new Image();
      img.onload = () => { loaded++; if (loaded === total && callback) callback(); };
      img.onerror = () => { loaded++; if (loaded === total && callback) callback(); };
      img.src = url;
    });
  }

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startSlideshow() {
    slideInterval = setInterval(() => {
      goToSlide((current + 1) % slides.length);
    }, 6000);
  }

  function stopSlideshow() {
    clearInterval(slideInterval);
  }

  if (slides.length) {
    preloadHeroImages(() => {
      goToSlide(0);
      startSlideshow();
    });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopSlideshow();
        goToSlide(i);
        startSlideshow();
      });
    });
  }

  // ---- Map ----
  const mapContainer = document.getElementById('map');
  if (mapContainer && typeof L !== 'undefined') {
    const map = L.map('map', { zoomControl: true }).setView([-19.0, 29.9], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const locations = [
      { name: 'Harare', coords: [-17.8252, 31.0335], desc: '1,240 listings · From $80/mo', price: '$650 avg' },
      { name: 'Victoria Falls', coords: [-17.9244, 25.8567], desc: '860 listings · From $45/night', price: '$120 avg' },
      { name: 'Bulawayo', coords: [-20.1486, 28.5717], desc: '610 listings · From $55/mo', price: '$68 avg' },
      { name: 'Kariba', coords: [-16.5216, 28.7611], desc: '280 listings · From $80/night', price: '$240 avg' },
      { name: 'Nyanga', coords: [-18.2167, 32.7500], desc: '340 listings · From $65/night', price: '$120 avg' },
    ];

    var blueIcon = L.divIcon({
      className: 'map-marker-custom',
      html: '<div style="background:#1E4FD6;color:#fff;padding:6px 12px;border-radius:100px;font-size:12px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,0.2);white-space:nowrap;">●</div>',
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    setTimeout(() => map.invalidateSize(), 300);

    locations.forEach(loc => {
      const marker = L.marker(loc.coords).addTo(map);
      marker.bindPopup(
        '<div style="font-family:Noto Sans,sans-serif;min-width:180px;">' +
          '<b style="font-size:15px;">' + loc.name + '</b><br>' +
          '<span style="font-size:12px;color:#5B6472;">' + loc.desc + '</span><br>' +
          '<span style="display:inline-block;margin-top:8px;padding:4px 12px;border-radius:100px;background:#1E4FD6;color:#fff;font-size:12px;font-weight:700;">' + loc.price + '</span>' +
        '</div>'
      );
      marker.on('click', () => {
        map.setView(loc.coords, 8, { animate: true });
        openModal({
          img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
          title: loc.name,
          location: 'Zimbabwe',
          rating: '★ Verified',
          meta: [loc.desc.split('·')[0].trim(), '✓ Verified listings', '📋 Book online'],
          desc: 'Explore verified properties in ' + loc.name + '. HomeLink offers inspected, confirmed listings with real photos and honest reviews from previous guests.',
          price: loc.price,
          priceLabel: ''
        });
      });
    });
  }

  // ---- Filter Chips ----
  const filterChips = document.querySelectorAll('.filter-chips .chip');
  const propCards = document.querySelectorAll('.prop-card');

  function filterProperties(category) {
    propCards.forEach(card => {
      if (!category || category === 'All') {
        card.style.display = '';
      } else {
        card.style.display = card.dataset.category === category ? '' : 'none';
      }
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const category = chip.textContent.trim();
      filterProperties(category);
    });
  });

  // ---- View All Properties ----
  document.getElementById('viewAllBtn')?.addEventListener('click', e => {
    e.preventDefault();
    filterChips.forEach(c => c.classList.remove('active'));
    filterChips[0]?.classList.add('active');
    filterProperties('All');
  });

  // ---- Browse Student Housing ----
  document.querySelector('.student-hero .btn')?.addEventListener('click', e => {
    e.preventDefault();
    filterChips.forEach(c => c.classList.remove('active'));
    filterChips.forEach(c => { if (c.textContent.trim() === 'Student') c.classList.add('active'); });
    filterProperties('Student');
    document.querySelector('.featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ---- Toggle Switches ----
  document.querySelectorAll('.toggle').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('on'));
  });

  // ---- Nav Search ----
  const searchTrigger = document.querySelector('.search-trigger');
  const searchWrap = document.querySelector('.nav-search-wrap');
  const searchInput = document.getElementById('navSearchInput');
  const searchClose = document.querySelector('.search-close');

  function openNavSearch() {
    if (!searchWrap) return;
    searchWrap.classList.add('open');
    setTimeout(() => searchInput && searchInput.focus(), 350);
    searchTrigger && (searchTrigger.style.display = 'none');
  }

  function closeNavSearch() {
    if (!searchWrap) return;
    searchWrap.classList.remove('open');
    if (searchInput) searchInput.value = '';
    searchTrigger && (searchTrigger.style.display = '');
  }

  if (searchTrigger) searchTrigger.addEventListener('click', openNavSearch);
  if (searchClose) searchClose.addEventListener('click', closeNavSearch);
  if (searchInput) searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNavSearch();
    if (e.key === 'Enter' && searchInput.value.trim()) {
      showToast('Searching: "' + searchInput.value.trim() + '"', '🔍');
      closeNavSearch();
    }
  });

  // ---- Profile Dropdown ----
  const profileTrigger = document.querySelector('.profile-trigger');
  const profileDropdown = document.querySelector('.profile-dropdown');

  if (profileTrigger && profileDropdown) {
    profileTrigger.addEventListener('click', e => {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('open');
      }
    });
    profileDropdown.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => profileDropdown.classList.remove('open'));
    });
  }

  // ---- Mobile Menu ----
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');
  const overlayBlur = document.querySelector('.overlay-blur');

  function openMobileNav() {
    mobileNav.classList.add('active');
    overlayBlur.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('active');
    overlayBlur.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  if (overlayBlur) overlayBlur.addEventListener('click', closeMobileNav);

  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // ---- Toast Notification ----
  const toast = document.getElementById('toast');

  function showToast(message, icon) {
    if (!toast) return;
    toast.innerHTML = (icon || '✓') + ' ' + message;
    toast.classList.add('show');
    clearTimeout(toast._hide);
    toast._hide = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // ---- Like / Save System ----
  const likedItems = new Set(JSON.parse(localStorage.getItem('homelink_liked') || '[]'));

  function toggleLike(id, btn) {
    if (likedItems.has(id)) {
      likedItems.delete(id);
      btn.classList.remove('liked');
      if (btn.classList.contains('prop-save')) {
        btn.classList.remove('liked');
      } else {
        btn.classList.remove('liked');
      }
      showToast('Removed from saved', '♡');
    } else {
      likedItems.add(id);
      btn.classList.add('liked');
      if (btn.classList.contains('prop-save')) {
        btn.classList.add('liked');
      } else {
        btn.classList.add('liked');
      }
      showToast('Saved to wishlist', '♡');
    }
    localStorage.setItem('homelink_liked', JSON.stringify([...likedItems]));
  }

  function restoreLikedStates() {
    likedItems.forEach(id => {
      const btn = document.querySelector('[data-like-id="' + id + '"]');
      if (btn) btn.classList.add('liked');
    });
  }

  // Property card save buttons
  document.querySelectorAll('.prop-card').forEach((card, i) => {
    const id = 'prop-' + (i + 1);
    const saveBtn = card.querySelector('.prop-save');
    if (saveBtn) {
      saveBtn.setAttribute('data-like-id', id);
      if (likedItems.has(id)) saveBtn.classList.add('liked');
      saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLike(id, saveBtn);
      });
    }
  });

  // Nav wishlist heart
  const wishlistBtn = document.querySelector('.icon-btn[title="Wishlist"]');
  if (wishlistBtn) {
    const wId = 'wishlist-nav';
    wishlistBtn.setAttribute('data-like-id', wId);
    if (likedItems.has(wId)) wishlistBtn.classList.add('liked');
    wishlistBtn.addEventListener('click', () => {
      const count = likedItems.size;
      showToast(count + ' saved ' + (count === 1 ? 'property' : 'properties'), '♡');
    });
  }

  // ---- Modal System ----
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  const modalImg = document.querySelector('.modal-img');
  const modalTitle = document.querySelector('.modal-head h2');
  const modalRating = document.querySelector('.modal-rating');
  const modalLoc = document.querySelector('.modal-loc');
  const modalMeta = document.querySelector('.modal-meta');
  const modalDesc = document.querySelector('.modal-desc');
  const modalPrice = document.querySelector('.modal-price');

  // Contact host elements
  const contactOverlay = document.querySelector('.contact-modal-overlay');
  const contactClose = document.querySelector('.contact-close');
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  const sendBtn = document.getElementById('sendMessageBtn');
  const doneBtn = document.getElementById('contactDoneBtn');

  const propertyDetails = {
    'card-1': {
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      title: 'Modern 4-Bed Family Home',
      rating: '★ 4.9',
      location: 'Borrowdale, Harare',
      meta: ['🛏 4 Beds', '🛁 3 Baths', '📶 Wi-Fi', '🚗 Parking'],
      desc: 'A beautifully furnished family home in the heart of Borrowdale. Features spacious living areas, a modern kitchen, landscaped garden, and 24-hour security. Walking distance to Borrowdale Village shops and restaurants.',
      price: '$650/month',
      priceLabel: '/month'
    },
    'card-2': {
      img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
      title: 'Serviced City Apartment',
      rating: '★ 4.7',
      location: 'Avondale, Harare',
      meta: ['🛏 2 Beds', '🛁 1 Bath', '💧 Water 24/7', '⚡ Backup Power'],
      desc: 'Modern serviced apartment in a prime Avondale location. Includes backup power, water storage, high-speed Wi-Fi, and weekly cleaning. Perfect for professionals and small families looking for a turnkey rental.',
      price: '$45/night',
      priceLabel: '/night'
    },
    'card-3': {
      img: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?auto=format&fit=crop&w=900&q=80',
      title: 'Riverside Lodge & Deck',
      rating: '★ 5.0',
      location: 'Victoria Falls',
      meta: ['🛏 3 Beds', '🛁 2 Baths', '📶 Wi-Fi', '🏊 Pool'],
      desc: 'Stunning riverside lodge with private deck overlooking the Zambezi. Just minutes from Victoria Falls. Includes pool, outdoor braai area, and guided tour arrangements. A truly unforgettable stay.',
      price: '$120/night',
      priceLabel: '/night'
    },
    'card-4': {
      img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80',
      title: 'Bulawayo Central Hotel',
      rating: '★ 4.6',
      location: 'Bulawayo CBD',
      meta: ['🛏 1 King Bed', '🍳 Breakfast', '📶 Wi-Fi', '🚗 Parking'],
      desc: 'Premium hotel accommodation in the centre of Bulawayo. Features en-suite rooms with king-size beds, complimentary breakfast, conference facilities, and secure parking. Ideal for business travellers.',
      price: '$68/night',
      priceLabel: '/night'
    },
    'card-5': {
      img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
      title: 'Student Studio near UZ',
      rating: '★ 4.8',
      location: 'Mount Pleasant, Harare',
      meta: ['🛏 1 Bed', '📶 Wi-Fi', '🔒 Secure Gate', '🍽 Shared Kitchen'],
      desc: 'Affordable, secure studio within walking distance of the University of Zimbabwe. Includes high-speed internet, 24-hour security, shared kitchen facilities, and a quiet study environment.',
      price: '$180/month',
      priceLabel: '/month'
    },
    'card-6': {
      img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      title: 'Lakeview Villa & Jetty',
      rating: '★ 4.9',
      location: 'Kariba',
      meta: ['🛏 5 Beds', '🛁 4 Baths', '⛵ Private Jetty', '🏊 Pool'],
      desc: 'Exclusive lakeside villa with private jetty on Lake Kariba. Perfect for large groups and special getaways. Features a pool, outdoor deck, fully equipped kitchen, and boat hire available.',
      price: '$240/night',
      priceLabel: '/night'
    }
  };

  const destDetails = {
    'dest-1': {
      img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80',
      title: 'Harare',
      location: 'Capital City',
      meta: ['1,240 listings', '🏙 Urban', '🌳 30+ parks'],
      desc: 'Zimbabwe\'s vibrant capital. Home to world-class restaurants, art galleries, golf courses, and the stunning Mukuvisi Woodlands. Find everything from city apartments to suburban family homes.',
      price: 'From $80/month',
      priceLabel: ''
    },
    'dest-2': {
      img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80',
      title: 'Victoria Falls',
      location: 'Matabeleland North',
      meta: ['860 listings', '🌊 The Falls', '🦁 Safari'],
      desc: 'Home to one of the Seven Natural Wonders of the World. Experience bungee jumping, white-water rafting, and sunset cruises while staying in verified lodges, hotels, and guesthouses.',
      price: 'From $45/night',
      priceLabel: ''
    },
    'dest-3': {
      img: 'https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?auto=format&fit=crop&w=900&q=80',
      title: 'Bulawayo',
      location: 'Matabeleland South',
      meta: ['610 listings', '🏛 Heritage', '🎭 Arts'],
      desc: 'Zimbabwe\'s second city, known for its wide tree-lined boulevards and colonial architecture. Home to the Natural History Museum, Matobo National Park, and a thriving arts scene.',
      price: 'From $55/month',
      priceLabel: ''
    },
    'dest-4': {
      img: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
      title: 'Nyanga',
      location: 'Manicaland',
      meta: ['340 listings', '⛰ Highlands', '🌲 Hiking'],
      desc: 'Zimbabwe\'s premier highlands destination. Cool climate, rolling green hills, trout fishing, and hiking trails. Perfect for weekend getaways and nature lovers.',
      price: 'From $65/night',
      priceLabel: ''
    }
  };

  function openModal(data) {
    if (!modalOverlay) return;
    modalImg.src = data.img;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalRating.textContent = data.rating || '★ Verified';
    modalLoc.textContent = data.location;
    modalDesc.textContent = data.desc;
    modalPrice.innerHTML = data.price + ' <span>' + (data.priceLabel || '') + '</span>';

    if (modalMeta) {
      modalMeta.innerHTML = '';
      (data.meta || []).forEach(m => {
        const span = document.createElement('span');
        span.textContent = m;
        modalMeta.appendChild(span);
      });
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Property card clicks
  document.querySelectorAll('.prop-card').forEach((card, i) => {
    const key = 'card-' + (i + 1);
    card.addEventListener('click', (e) => {
      if (e.target.closest('.prop-save')) return;
      if (propertyDetails[key]) {
        openModal(propertyDetails[key]);
      }
    });
  });

  // Destination card clicks
  document.querySelectorAll('.dest-card').forEach((card, i) => {
    const key = 'dest-' + (i + 1);
    card.addEventListener('click', () => {
      if (destDetails[key]) {
        openModal(destDetails[key]);
      }
    });
  });

  // Explore card clicks
  document.querySelectorAll('.explore-card').forEach(card => {
    card.addEventListener('click', () => {
      const label = card.querySelector('.explore-label');
      if (label) {
        openModal({
          img: card.querySelector('img').src,
          title: label.textContent,
          location: 'Zimbabwe',
          rating: '★ Featured',
          meta: ['📍 Must-visit', '🏆 Verified'],
          desc: 'Explore ' + label.textContent + ' — one of Zimbabwe\'s most remarkable destinations. Book a verified stay nearby through HomeLink and experience the best the country has to offer.',
          price: 'Find stays',
          priceLabel: ''
        });
      }
    });
  });

  // Close modal events
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeContactModal();
      closeHostReg();
    }
  });

  // ---- Contact Host Modal ----
  const contactBtn = document.querySelector('.modal-actions .btn-primary');

  function openContactModal() {
    if (!contactOverlay) return;
    contactOverlay.classList.add('active');
    contactForm.style.display = '';
    contactSuccess.classList.remove('show');
    document.body.style.overflow = 'hidden';
  }

  function closeContactModal() {
    if (!contactOverlay) return;
    contactOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  }

  if (contactClose) contactClose.addEventListener('click', closeContactModal);
  if (contactOverlay) contactOverlay.addEventListener('click', (e) => {
    if (e.target === contactOverlay) closeContactModal();
  });

  // Send message demo
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      contactForm.style.display = 'none';
      contactSuccess.classList.add('show');
    });
  }

  if (doneBtn) {
    doneBtn.addEventListener('click', closeContactModal);
  }

  // Save to wishlist in modal
  const saveWishlistBtn = document.querySelector('.modal-actions .btn-outline');
  if (saveWishlistBtn) {
    saveWishlistBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = modalTitle?.textContent;
      if (title) {
        saveWishlistBtn.classList.toggle('liked');
        if (saveWishlistBtn.classList.contains('liked')) {
          showToast('"' + title + '" saved to wishlist', '♡');
        } else {
          showToast('Removed from wishlist', '♡');
        }
      }
    });
  }

  // ---- Newsletter ----
  const newsForm = document.querySelector('.news-form');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsForm.querySelector('input');
      if (input.value.trim()) {
        showToast('Subscribed! Check your inbox.', '✉');
        input.value = '';
      }
    });
  }

  // ---- Search ----
  document.querySelectorAll('.search-field').forEach(field => {
    field.addEventListener('click', () => {
      field.querySelector('.val').classList.remove('muted');
    });
  });

  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const dest = document.querySelector('.search-field:first-child .val');
      if (dest) {
        openModal({
          img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=80',
          title: 'Search Results',
          location: dest.textContent,
          rating: '★ Verified',
          meta: ['📋 3,240+ listings', '✓ All verified'],
          desc: 'Browse verified properties in your chosen destination. HomeLink ensures every listing has been inspected by our local team before going live.',
          price: 'Filter & explore',
          priceLabel: ''
        });
      }
    });
  }

  // ---- Become a Host - Registration Modal ----
  const hostRegOverlay = document.getElementById('hostRegOverlay');
  const hostRegClose = document.getElementById('hostRegClose');
  const hostRegForm = document.getElementById('hostRegForm');
  const hostRegSubmit = document.getElementById('hostRegSubmit');
  const hostRegSuccess = document.getElementById('hostRegSuccess');
  const hostRegDone = document.getElementById('hostRegDone');

  function openHostReg() {
    if (!hostRegOverlay) return;
    hostRegOverlay.classList.add('active');
    if (hostRegForm) hostRegForm.style.display = '';
    if (hostRegSuccess) hostRegSuccess.classList.remove('show');
    document.body.style.overflow = 'hidden';
  }

  function closeHostReg() {
    if (!hostRegOverlay) return;
    hostRegOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[href="#host"], .host-banner .btn-white').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openHostReg();
    });
  });

  if (hostRegClose) hostRegClose.addEventListener('click', closeHostReg);
  if (hostRegOverlay) hostRegOverlay.addEventListener('click', (e) => {
    if (e.target === hostRegOverlay) closeHostReg();
  });

  if (hostRegSubmit) {
    hostRegSubmit.addEventListener('click', () => {
      if (hostRegForm) hostRegForm.style.display = 'none';
      if (hostRegSuccess) hostRegSuccess.classList.add('show');
    });
  }

  if (hostRegDone) hostRegDone.addEventListener('click', closeHostReg);

  // ---- Smooth scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileNav();
      }
    });
  });

  // ---- University row clicks ----
  document.querySelectorAll('.uni-row').forEach(row => {
    row.addEventListener('click', () => {
      const name = row.querySelector('.uni-name')?.textContent?.trim() || 'University';
      const count = row.querySelector('.uni-tag')?.textContent?.trim() || '';
      openModal({
        img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
        title: name,
        location: 'Zimbabwe',
        rating: '★ Student Verified',
        meta: [count || 'Available now', '🔒 Secure', '📶 Wi-Fi included'],
        desc: 'Browse verified student accommodation near ' + name + '. All listings are inspected for safety, cleanliness, and proximity to campus.',
        price: 'Browse rooms',
        priceLabel: ''
      });
    });
  });

  // Restore liked states
  restoreLikedStates();
});
