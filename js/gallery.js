/**
 * gallery.js — Gallery rendering, detail view, and lightbox
 */

const Gallery = (() => {
    /* ---- SVG Icons ---- */
    const ICONS = {
        expand: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
        arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
        arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        back: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
        view: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
        image: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
    };

    /* ---- Lazy-load observer ---- */
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.onload = () => img.classList.add('loaded');
                img.onerror = () => {
                    img.classList.add('loaded');
                    img.alt = 'Image could not be loaded';
                };
                imgObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    /* ================================================================
       Gallery Grid (Home)
       ================================================================ */
    /* ================================================================
       Home Page (Hero + Grid)
       ================================================================ */
    function renderHome(container, data) {
        container.innerHTML = '';
        const { hero, galleries } = data;

        // 1. Hero Section
        if (hero) {
            const heroSection = document.createElement('div');
            heroSection.className = 'hero';
            if (hero.backgroundImage) {
                heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${hero.backgroundImage}')`;
            }

            heroSection.innerHTML = `
                <div class="hero-content">
                    <h1 class="hero-title">${hero.title || 'Portfolio'}</h1>
                    ${hero.subtitle ? `<p class="hero-subtitle">${hero.subtitle}</p>` : ''}
                    ${hero.ctaText ? `<button class="hero-cta" id="hero-cta">${hero.ctaText}</button>` : ''}
                </div>
                <div class="hero-scroll-indicator">
                    <span>Scroll</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
                </div>
            `;

            container.appendChild(heroSection);

            // Scroll handler
            const btn = heroSection.querySelector('#hero-cta');
            if (btn) {
                btn.addEventListener('click', () => {
                    Router.navigate('#contact');
                });
            }
        }

        // 2. Gallery Grid
        if (!galleries || Object.keys(galleries).length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.innerHTML = `${ICONS.image}<p>No galleries yet</p>`;
            container.appendChild(empty);
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'gallery-grid';
        if (hero) grid.classList.add('with-hero');

        Object.entries(galleries).forEach(([name, gallery]) => {
            if (!gallery.images || gallery.images.length === 0) return;

            const card = document.createElement('article');
            card.className = 'gallery-card';
            card.setAttribute('role', 'link');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `View gallery: ${name.replace(/-/g, ' ')}`);
            card.id = `gallery-card-${name}`;

            card.innerHTML = `
        <div class="card-thumb">
          <img data-src="${gallery.images[0]}" alt="${name.replace(/-/g, ' ')}" loading="lazy">
          <div class="card-overlay">
            <span class="view-badge">${ICONS.view} View</span>
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-title">${name.replace(/-/g, ' ')}</h3>
          ${gallery.tags ? `<div class="card-tags">${gallery.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
          ${gallery.description ? `<p class="card-desc">${gallery.description}</p>` : ''}
        </div>`;

            // Lazy-load thumbnail
            const img = card.querySelector('img');
            imgObserver.observe(img);

            // Click / Enter to navigate
            const go = () => Router.navigate(`#gallery/${encodeURIComponent(name)}`);
            card.addEventListener('click', go);
            card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });

            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    /* ================================================================
       Gallery Detail Page
       ================================================================ */
    function renderDetail(container, name, gallery) {
        container.innerHTML = '';

        const section = document.createElement('div');
        section.className = 'detail-header';

        section.innerHTML = `
      <a href="#home" class="back-link" id="back-to-galleries">${ICONS.back} Back to Galleries</a>
      <h1 class="detail-title">${name.replace(/-/g, ' ')}</h1>
      <hr class="detail-divider">
      ${gallery.description ? `<p class="detail-desc">${gallery.description}</p>` : ''}
      ${gallery.tags ? `<div class="detail-tags">${gallery.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
    `;

        container.appendChild(section);

        // Images grid
        const grid = document.createElement('div');
        grid.className = 'image-grid';

        gallery.images.forEach((url, idx) => {
            const item = document.createElement('div');
            item.className = 'image-grid-item';
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `View image ${idx + 1} of ${gallery.images.length}`);
            item.id = `image-item-${idx}`;

            item.innerHTML = `
        <img data-src="${url}" alt="${name.replace(/-/g, ' ')} — image ${idx + 1}" loading="lazy">
        <span class="expand-icon">${ICONS.expand}</span>`;

            const img = item.querySelector('img');
            imgObserver.observe(img);

            const openLB = () => Lightbox.open(gallery.images, idx);
            item.addEventListener('click', openLB);
            item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLB(); } });

            grid.appendChild(item);
        });

        container.appendChild(grid);
    }

    return { renderHome, renderDetail };
})();

/* ================================================================
   Lightbox
   ================================================================ */
const Lightbox = (() => {
    let images = [];
    let current = 0;
    let el = null;
    let touchStartX = 0;

    function create() {
        if (el) return;

        el = document.createElement('div');
        el.className = 'lightbox';
        el.id = 'lightbox';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        el.setAttribute('aria-label', 'Image lightbox');

        el.innerHTML = `
      <button class="lb-close" id="lb-close" aria-label="Close lightbox">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <button class="lb-arrow lb-prev" id="lb-prev" aria-label="Previous image">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="lightbox-img-wrapper">
        <img id="lb-img" src="" alt="Lightbox image">
      </div>
      <button class="lb-arrow lb-next" id="lb-next" aria-label="Next image">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
      </button>
      <div class="lb-counter" id="lb-counter"></div>
    `;

        document.body.appendChild(el);

        // Events
        el.querySelector('#lb-close').addEventListener('click', close);
        el.querySelector('#lb-prev').addEventListener('click', prev);
        el.querySelector('#lb-next').addEventListener('click', next);
        el.addEventListener('click', (e) => { if (e.target === el) close(); });

        // Touch swipe
        el.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        el.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? prev() : next();
            }
        }, { passive: true });
    }

    function show() {
        const img = el.querySelector('#lb-img');
        img.src = images[current];
        img.alt = `Image ${current + 1} of ${images.length}`;
        el.querySelector('#lb-counter').textContent = `${current + 1} / ${images.length}`;

        // Re-trigger animation
        const wrapper = el.querySelector('.lightbox-img-wrapper');
        wrapper.style.animation = 'none';
        wrapper.offsetHeight; // reflow
        wrapper.style.animation = '';
    }

    function open(imgs, idx = 0) {
        create();
        images = imgs;
        current = idx;
        show();
        el.classList.add('open');
        document.body.style.overflow = 'hidden';
        el.querySelector('#lb-close').focus();
    }

    function close() {
        if (!el) return;
        el.classList.remove('open');
        document.body.style.overflow = '';
    }

    function prev() {
        current = (current - 1 + images.length) % images.length;
        show();
    }

    function next() {
        current = (current + 1) % images.length;
        show();
    }

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!el || !el.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    return { open, close };
})();
