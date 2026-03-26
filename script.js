(function() {
  'use strict';

  function initBurger() {
    var burgerBtn = document.getElementById('burger-btn');
    var headerNav = document.getElementById('header-nav');
    var headerServicesMenu = document.getElementById('header-services-menu');

    if (!burgerBtn || !headerNav) return;

    function closeMobileMenu() {
      burgerBtn.classList.remove('is-active');
      headerNav.classList.remove('is-open');
      document.body.style.overflow = '';
      if (headerServicesMenu) headerServicesMenu.removeAttribute('open');
    }

    burgerBtn.addEventListener('click', function() {
      burgerBtn.classList.toggle('is-active');
      headerNav.classList.toggle('is-open');
      document.body.style.overflow = headerNav.classList.contains('is-open') ? 'hidden' : '';
      if (!headerNav.classList.contains('is-open') && headerServicesMenu) {
        headerServicesMenu.removeAttribute('open');
      }
    });

    var navLinks = headerNav.querySelectorAll('a[href^="#"]');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        closeMobileMenu();
      });
    });
  }

  function initServicesMenus() {
    var headerServicesMenu = document.getElementById('header-services-menu');
    var footerServicesMenu = document.getElementById('footer-services-menu');

    function closeDetailsMenu(detailsNode) {
      if (detailsNode) detailsNode.removeAttribute('open');
    }

    [headerServicesMenu, footerServicesMenu].forEach(function(menuNode) {
      if (!menuNode) return;
      menuNode.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function() {
          closeDetailsMenu(menuNode);
        });
      });
    });

    document.addEventListener('click', function(e) {
      if (headerServicesMenu && !headerServicesMenu.contains(e.target)) {
        closeDetailsMenu(headerServicesMenu);
      }
      if (footerServicesMenu && !footerServicesMenu.contains(e.target)) {
        closeDetailsMenu(footerServicesMenu);
      }
    });
  }

  function initReviewsCarousel() {
    var track = document.getElementById('reviews-track');
    var prevBtn = document.getElementById('reviews-prev');
    var nextBtn = document.getElementById('reviews-next');
    if (!track || !prevBtn || !nextBtn) return;

    var cards = track.querySelectorAll('.reviews__card');
    var totalCards = cards.length;
    var currentIndex = 0;
    var gap = parseInt(window.getComputedStyle(track).gap, 10) || 14;

    function getCardsPerView() {
      var w = window.innerWidth;
      if (w < 768) return 1;
      if (w < 1024) return 2;
      return 3;
    }

    function updatePosition() {
      if (cards.length === 0) return;
      var cardWidth = cards[0].offsetWidth;
      var offset = -(currentIndex * (cardWidth + gap));
      track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
    }

    prevBtn.addEventListener('click', function() {
      currentIndex = Math.max(0, currentIndex - 1);
      updatePosition();
    });

    nextBtn.addEventListener('click', function() {
      var cardsPerView = getCardsPerView();
      var maxIndex = Math.max(0, totalCards - cardsPerView);
      currentIndex = Math.min(maxIndex, currentIndex + 1);
      updatePosition();
    });

    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updatePosition, 70);
    });

    setTimeout(updatePosition, 120);
  }

  function initAccordion() {
    var accordion = document.getElementById('faq-accordion');
    if (!accordion) return;

    var items = accordion.querySelectorAll('.accordion__item');

    items.forEach(function(item) {
      var header = item.querySelector('.accordion__header');
      if (!header) return;

      header.addEventListener('click', function() {
        var isOpen = item.classList.contains('is-open');
        items.forEach(function(i) {
          i.classList.remove('is-open');
          var content = i.querySelector('.accordion__content');
          if (content) content.style.maxHeight = null;
        });

        if (!isOpen) {
          item.classList.add('is-open');
          var content = item.querySelector('.accordion__content');
          if (content) content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  function initProudPhotos() {
    var scroller = document.getElementById('proud-photos-scroller');
    var moreBtn = document.getElementById('proud-photos-more');
    var track = document.getElementById('proud-photos-track');
    if (!scroller || !moreBtn || !track) return;

    function getStep() {
      var firstCard = track.querySelector('.proud-photos__card');
      if (!firstCard) return 0;
      var styles = window.getComputedStyle(track);
      var localGap = parseFloat(styles.columnGap || styles.gap) || 14;
      return firstCard.getBoundingClientRect().width + localGap;
    }

    moreBtn.addEventListener('click', function() {
      var step = getStep();
      if (!step) return;
      var index = Math.round(scroller.scrollLeft / step);
      var targetLeft = (index + 1) * step;
      var maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      scroller.scrollTo({
        left: Math.min(targetLeft, maxLeft),
        behavior: 'smooth'
      });
    });

    var isDragging = false;
    var startX = 0;
    var startScrollLeft = 0;

    scroller.addEventListener('pointerdown', function(e) {
      if (e.pointerType === 'touch') return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      startScrollLeft = scroller.scrollLeft;
      scroller.classList.add('is-dragging');
      try { scroller.setPointerCapture(e.pointerId); } catch (err) {}
    });

    scroller.addEventListener('pointermove', function(e) {
      if (!isDragging) return;
      var deltaX = e.clientX - startX;
      scroller.scrollLeft = startScrollLeft - deltaX;
      e.preventDefault();
    });

    function stopDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      scroller.classList.remove('is-dragging');
      if (e && typeof e.pointerId === 'number') {
        try { scroller.releasePointerCapture(e.pointerId); } catch (err) {}
      }
    }

    scroller.addEventListener('pointerup', stopDrag);
    scroller.addEventListener('pointercancel', stopDrag);
    scroller.addEventListener('pointerleave', function(e) {
      if (e.pointerType === 'mouse') stopDrag(e);
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        var header = document.querySelector('.header');
        var headerHeight = header ? header.offsetHeight : 120;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      });
    });
  }

  function initContactsLightbox() {
    var photosContainer = document.getElementById('contacts-photos');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var closeBtn = lightbox && lightbox.querySelector('.lightbox__close');
    var prevBtn = lightbox && lightbox.querySelector('.lightbox__prev');
    var nextBtn = lightbox && lightbox.querySelector('.lightbox__next');
    if (!photosContainer || !lightbox || !lightboxImg) return;

    var images = [];
    var currentIndex = 0;

    function collectImages() {
      images = [];
      photosContainer.querySelectorAll('.contacts__photo-btn img').forEach(function(img) {
        images.push({
          src: img.getAttribute('data-lightbox-src') || img.currentSrc || img.src,
          alt: img.alt || 'Фотостудия'
        });
      });
    }

    function showImage(index) {
      if (images.length === 0) return;
      currentIndex = ((index % images.length) + images.length) % images.length;
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.alt = images[currentIndex].alt;
    }

    function openLightbox(index) {
      collectImages();
      if (images.length === 0) return;
      showImage(index);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    photosContainer.querySelectorAll('.contacts__photo-btn').forEach(function(btn, index) {
      btn.addEventListener('click', function() {
        openLightbox(index);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
    if (nextBtn) nextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  function init() {
    initBurger();
    initServicesMenus();
    initProudPhotos();
    initReviewsCarousel();
    initAccordion();
    initSmoothScroll();
    initContactsLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
