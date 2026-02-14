/**
 * main.js — App initialisation, data fetching, and route handling
 */

(async () => {
    'use strict';

    /* ---- DOM refs ---- */
    const header = document.getElementById('site-header');
    const logoEl = document.getElementById('site-logo');
    const navContainer = document.getElementById('site-nav');
    const menuToggle = document.getElementById('menu-toggle');
    const mainEl = document.getElementById('app');

    /* ---- Page containers (created once) ---- */
    const pages = {};
    ['home', 'gallery', 'contact'].forEach(id => {
        const div = document.createElement('section');
        div.className = 'page';
        div.id = `page-${id}`;
        mainEl.appendChild(div);
        pages[id] = div;
    });

    /* ---- State ---- */
    let data = null;

    /* ---- Helpers ---- */
    function showPage(name) {
        Object.values(pages).forEach(p => p.classList.remove('active'));
        if (pages[name]) pages[name].classList.add('active');

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.route === name);
        });

        // Close mobile menu
        navContainer.classList.remove('open');
        menuToggle.classList.remove('open');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    function showLoading() {
        mainEl.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading portfolio…</p>
      </div>`;
    }

    function showError(msg) {
        mainEl.innerHTML = `
      <div class="error-state">
        <h2>Something went wrong</h2>
        <p>${msg}</p>
      </div>`;
    }

    /* ---- Fetch content.json ---- */
    showLoading();

    try {
        const res = await fetch('content.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
    } catch (err) {
        showError('Could not load content. Please make sure <code>content.json</code> is present and valid.');
        console.error('Failed to load content.json:', err);
        return;
    }

    /* ---- Build header ---- */
    if (!data.pageName) {
        header.classList.add('hidden');
    } else {
        logoEl.innerHTML = data.pageName;
    }

    /* ---- Re-create page containers (loading state cleared the DOM) ---- */
    mainEl.innerHTML = '';
    ['home', 'gallery', 'contact'].forEach(id => {
        const div = document.createElement('section');
        div.className = 'page container';
        div.id = `page-${id}`;
        mainEl.appendChild(div);
        pages[id] = div;
    });

    /* ---- Pre-render home & contact ---- */
    Gallery.renderHome(pages.home, data);
    Contact.render(pages.contact, data.contact);

    /* ---- Mobile menu toggle ---- */
    menuToggle.addEventListener('click', () => {
        navContainer.classList.toggle('open');
        menuToggle.classList.toggle('open');
    });

    /* ---- Route handler ---- */
    Router.on(({ route, params }) => {
        switch (route) {
            case 'gallery': {
                const name = params[0];
                const gallery = data.galleries && data.galleries[name];
                if (!gallery) {
                    // Fallback to home
                    showPage('home');
                    return;
                }
                Gallery.renderDetail(pages.gallery, name, gallery);
                showPage('gallery');
                break;
            }

            case 'contact':
                showPage('contact');
                break;

            case 'home':
            default:
                showPage('home');
                break;
        }
    });

    /* ---- Initial route ---- */
    Router.emit();
})();
