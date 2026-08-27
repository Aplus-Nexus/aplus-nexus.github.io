/**
 * Jiajun Wan — Academic Homepage Scripts
 * Theme switching · reading progress · scroll animations
 * mobile nav · BibTeX modal · back-to-top · blog filtering
 */
(function () {
    'use strict';

    var docEl = document.documentElement;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =====================================================
     * Theme (light / dark), applied before paint via inline
     * snippet in <head>; this part only wires the toggle.
     * ===================================================== */
    function initThemeToggle() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;

        btn.addEventListener('click', function () {
            var next = docEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            docEl.setAttribute('data-theme', next);
            try { localStorage.setItem('site-theme', next); } catch (e) { /* private mode */ }
        });
    }

    /* =====================================================
     * Reading progress bar
     * ===================================================== */
    function initProgressBar() {
        var bar = document.querySelector('.progress-bar');
        if (!bar) return;

        var ticking = false;
        function update() {
            var scrollTop = window.pageYOffset || docEl.scrollTop || 0;
            var height = docEl.scrollHeight - docEl.clientHeight;
            var ratio = height > 0 ? Math.min(scrollTop / height, 1) : 0;
            bar.style.transform = 'scaleX(' + ratio + ')';
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(update);
            }
        }, { passive: true });
        update();
    }

    /* =====================================================
     * Mobile navigation
     * ===================================================== */
    function initNavigation() {
        var toggle = document.getElementById('menu-toggle');
        var nav = document.getElementById('main-nav');
        if (!toggle || !nav) return;

        function setOpen(open) {
            nav.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            var icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', !open);
                icon.classList.toggle('fa-times', open);
            }
        }

        toggle.addEventListener('click', function () {
            setOpen(!nav.classList.contains('active'));
        });

        // Close when a nav link is clicked or clicking outside
        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) setOpen(false);
        });
        document.addEventListener('click', function (e) {
            if (nav.classList.contains('active') &&
                !toggle.contains(e.target) && !nav.contains(e.target)) {
                setOpen(false);
            }
        });

        // Active item by path
        var path = window.location.pathname;
        nav.querySelectorAll('a').forEach(function (link) {
            var href = link.getAttribute('href') || '';
            if (href.indexOf('#') === -1 && href.length > 0 && path.indexOf(href.replace(/\.html$/, '')) !== -1) {
                link.classList.add('active');
            }
        });
    }

    /* =====================================================
     * Scroll-in reveal animations
     * ===================================================== */
    function initAnimations() {
        var targets = document.querySelectorAll('[data-animate]');
        if (!targets.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            targets.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        docEl.classList.add('js-anim');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        targets.forEach(function (el) {
            el.classList.add('pre-animate');
            observer.observe(el);
        });
    }

    /* =====================================================
     * Smooth anchor scrolling (offset by fixed navbar)
     * ===================================================== */
    function initSmoothScroll() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;
            var id = link.getAttribute('href');
            if (!id || id === '#') return;
            var target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();
            var navEl = document.querySelector('.top-nav');
            var offset = navEl ? navEl.offsetHeight + 16 : 80;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: top,
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
            history.replaceState(null, '', id);
        });
    }

    /* =====================================================
     * Back to top
     * ===================================================== */
    function initBackToTop() {
        var btn = document.getElementById('back-to-top');
        if (!btn) return;

        var visible = false;
        window.addEventListener('scroll', function () {
            var show = window.pageYOffset > 480;
            if (show !== visible) {
                visible = show;
                btn.classList.toggle('show', show);
            }
        }, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    /* =====================================================
     * BibTeX modal
     * ===================================================== */
    function buildBibtex(d) {
        var lines = [
            '@inproceedings{' + d.key + ',',
            '  title     = {' + d.title + '},',
            '  author    = {' + d.author + '},',
            '  booktitle = {' + d.venue + '},',
            '  year      = {' + d.year + '}'
        ];
        if (d.url) lines.push('  url       = {' + d.url + '}');
        lines.push('}');
        return lines.join('\n');
    }

    function copyText(text, onDone, onError) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(onDone, function () { legacyCopy(text, onDone, onError); });
        } else {
            legacyCopy(text, onDone, onError);
        }
    }

    function legacyCopy(text, onDone, onError) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy') ? onDone() : onError();
        } catch (err) {
            onError();
        } finally {
            document.body.removeChild(ta);
        }
    }

    function initBibtexModal() {
        var modal = document.getElementById('bibtex-modal');
        var textarea = document.getElementById('bibtex-textarea');
        var closeBtn = document.getElementById('modal-close');
        var copyBtn = document.getElementById('copy-bibtex');
        var hint = document.getElementById('copy-hint');
        if (!modal || !textarea || !closeBtn || !copyBtn || !hint) return;

        var lastFocus = null;

        function openModal(data) {
            lastFocus = document.activeElement;
            textarea.value = buildBibtex(data);
            hint.textContent = '';
            modal.hidden = false;
            document.body.classList.add('modal-open');
            requestAnimationFrame(function () {
                modal.classList.add('is-open');
                copyBtn.focus();
            });
        }

        function closeModal() {
            modal.classList.remove('is-open');
            document.body.classList.remove('modal-open');
            setTimeout(function () {
                modal.hidden = true;
                if (lastFocus && lastFocus.focus) lastFocus.focus();
            }, 220);
        }

        // Openers (event delegation — works for dynamically added papers)
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('.bibtex-btn');
            if (!btn) return;
            openModal({
                key: btn.dataset.bibtexKey || 'paper2026',
                title: btn.dataset.bibtexTitle || '',
                author: btn.dataset.bibtexAuthor || '',
                venue: btn.dataset.bibtexVenue || '',
                year: btn.dataset.bibtexYear || '',
                url: btn.dataset.bibtexUrl || ''
            });
        });

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !modal.hidden) closeModal();
        });

        copyBtn.addEventListener('click', function () {
            copyText(textarea.value,
                function () {
                    hint.classList.remove('err');
                    hint.textContent = '✓ Copied to clipboard';
                    setTimeout(function () { hint.textContent = ''; }, 2400);
                },
                function () {
                    hint.classList.add('err');
                    hint.textContent = 'Copy failed — please select & copy manually';
                });
        });
    }

    /* =====================================================
     * Blog list (filtering on blog/index.html)
     * Kept compatible with the previous post registry.
     * ===================================================== */
    var BlogSystem = {
        posts: [
            {
                title: 'Welcome to My Blog',
                slug: 'welcome',
                date: '2024-01-01',
                category: 'General',
                excerpt: 'Welcome to my personal blog where I share my thoughts on machine learning, AI security, and research.'
            },
            {
                title: 'Notes on Differential Privacy',
                slug: 'differential-privacy-notes',
                date: '2024-02-15',
                category: 'Research',
                excerpt: 'Some notes on differential privacy theory and its applications in machine learning.'
            },
            {
                title: 'Understanding Attention Mechanisms',
                slug: 'attention-mechanisms',
                date: '2024-03-10',
                category: 'Paper Reading',
                excerpt: 'A deep dive into attention mechanisms in transformers and their theoretical properties.'
            }
        ],

        categories: ['All', 'General', 'Research', 'Paper Reading', 'Thoughts'],

        init: function () {
            this.renderPosts();
            this.renderCategories();
        },

        renderPosts: function (postsToRender) {
            var container = document.getElementById('blog-list');
            if (!container) return;

            var posts = postsToRender || this.posts;
            container.innerHTML = posts.map(function (post) {
                return '' +
                    '<a href="posts/' + post.slug + '.html" class="blog-card">' +
                    '<h3 class="blog-card-title">' + post.title + '</h3>' +
                    '<p class="blog-card-excerpt">' + post.excerpt + '</p>' +
                    '<div class="blog-card-meta">' +
                    '<span class="blog-card-date"><i class="fa-regular fa-calendar"></i>' + post.date + '</span>' +
                    '<span class="blog-card-category">' + post.category + '</span>' +
                    '</div></a>';
            }).join('');
        },

        renderCategories: function () {
            var container = document.getElementById('blog-categories');
            if (!container) return;

            var self = this;
            container.innerHTML = this.categories.map(function (category) {
                return '<button class="blog-category-tag' + (category === 'All' ? ' active' : '') +
                    '" data-category="' + category + '">' + category + '</button>';
            }).join('');

            container.querySelectorAll('.blog-category-tag').forEach(function (tag) {
                tag.addEventListener('click', function () {
                    container.querySelectorAll('.blog-category-tag').forEach(function (t) {
                        t.classList.remove('active');
                    });
                    tag.classList.add('active');

                    var category = tag.getAttribute('data-category');
                    self.renderPosts(category === 'All'
                        ? null
                        : self.posts.filter(function (p) { return p.category === category; }));
                });
            });
        }
    };

    /* =====================================================
     * Boot
     * ===================================================== */
    function boot() {
        initThemeToggle();
        initProgressBar();
        initNavigation();
        initAnimations();
        initSmoothScroll();
        initBackToTop();
        initBibtexModal();
        if (document.getElementById('blog-list')) BlogSystem.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    // Export for debugging / external use
    window.AcademicSite = { BlogSystem: BlogSystem };
})();
