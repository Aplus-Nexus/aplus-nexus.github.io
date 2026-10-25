/**
 * Jiajun Wan — Academic Homepage Scripts
 * i18n (zh/en) · theme switching · reading progress · scroll animations
 * mobile nav · BibTeX modal · back-to-top · blog filtering
 */
(function () {
    'use strict';

    var docEl = document.documentElement;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =====================================================
     * i18n dictionary
     * ===================================================== */
    var I18N = {
        zh: {
            'nav.home': '首页',
            'nav.about': '关于',
            'nav.updates': '动态',
            'nav.publications': '论文',
            'nav.awards': '荣誉',
            'nav.blog': '博客',
            'bio': '科研 × 科技 × 人文。<br>关注 <b>多模态</b>、<b>AI agents</b> 与 <b>有人的技术</b>。',
            'loc': '广州，中国',
            'cv': '个人简历',
            'about.title': '关于我',
            'about.p1': '你好，我是<b>万家骏 (Jiajun Wan)</b>，广东工业大学电子信息工程专业本科生。我的研究兴趣围绕<b>自然语言处理</b>与<b>多模态学习</b>，同时对 <b>AI 安全</b>（对抗攻击 / 深度伪造检测）有浓厚兴趣——我的第一篇工作 <a href="#publications">ISPCloak</a> 就从“真实相机的物理成像指纹”出发，重新审视了深度伪造检测器的鲁棒性边界。',
            'about.p2': '我习惯以长期主义的节奏做研究——耐心、专注、保持稳定输出。当下我正为 <b>2028 Fall</b> 的研究生申请做准备，希望加入与方向契合的团队，在导师的指导下把问题做深做透。',
            'chip.nlp': '自然语言处理',
            'chip.mm': '多模态学习',
            'chip.security': 'AI 安全',
            'chip.forensics': '深度伪造取证',
            'updates.title': '动态',
            'updates.i1': '🎉 论文 <b>ISPCloak</b> 被 <span class="venue-badge venue-mm">ACM MM 2026</span> 接收！',
            'updates.i2': 'ISPCloak 预印本上线 <a href="https://arxiv.org/abs/2607.21897" target="_blank" rel="noopener noreferrer">arXiv:2607.21897</a>。',
            'pubs.title': '论文',
            'pub.venuenote': '被第 34 届 ACM 国际多媒体大会接收',
            'awards.title': '荣誉与奖项',
            'award.1': 'ISC.AI 创新独角兽沙盒大赛国家级三等奖',
            'award.2': '华为昇腾 AI 创新大赛华南赛区铜奖',
            'award.3': 'ISC.AI 创新独角兽沙盒大赛创新公益独角兽奖',
            'award.4': '校级一等奖学金',
            'blog.title': '博客',
            'blog.viewall': '查看全部',
            'blog.subtitle': '记录学习笔记、研究思考和生活感悟',
            'blog.excerpt.1': '欢迎来到我的博客，这里记录我对机器学习和 AI 安全的研究与思考。',
            'blog.excerpt.2': '关于差分隐私理论及其在机器学习中应用的笔记。',
            'blog.excerpt.3': '深入剖析 Transformer 中注意力机制及其理论性质。',
            'blogcat.all': '全部',
            'blogcat.pg': '通用',
            'blogcat.research': '研究',
            'blogcat.pr': '论文阅读',
            'blogcat.thoughts': '随笔',
            'footer.rights': '保留所有权利',
            'modal.copy': '复制',
            'modal.copied': '✓ 已复制到剪贴板',
            'modal.copyfail': '复制失败，请手动选择复制'
        },
        en: {
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.updates': 'Updates',
            'nav.publications': 'Publications',
            'nav.awards': 'Awards',
            'nav.blog': 'Blog',
            'bio': 'Research × Technology × Humanity.<br>Building <b>multimodal</b>, <b>agentic</b>, human-centered tools.',
            'loc': 'Guangzhou, China',
            'cv': 'Curriculum Vitae',
            'about.title': 'About Me',
            'about.p1': "Hi, I'm <b>Jiajun Wan（万家骏）</b>, an undergraduate student in Electronic Information Engineering at Guangdong University of Technology. My research interests center on <b>Natural Language Processing</b> and <b>Multimodal Learning</b>, along with a growing interest in <b>AI Security</b> (adversarial attacks / deepfake detection) — my first work, <a href=\"#publications\">ISPCloak</a>, re-examines the robustness boundary of deepfake detectors from the physical imaging fingerprints of real cameras.",
            'about.p2': 'I believe research rewards consistency: I stay patient, focused, and keep a steady rhythm of output. I am currently preparing for graduate admission in <b>Fall 2028</b>, hoping to join a group whose research fits my interests and to develop my problems in depth under proper guidance.',
            'chip.nlp': 'Natural Language Processing',
            'chip.mm': 'Multimodal Learning',
            'chip.security': 'AI Security',
            'chip.forensics': 'Deepfake Forensics',
            'updates.title': 'Updates',
            'updates.i1': '🎉 Our paper <b>ISPCloak</b> is accepted by <span class="venue-badge venue-mm">ACM MM 2026</span>!',
            'updates.i2': 'ISPCloak preprint is online at <a href="https://arxiv.org/abs/2607.21897" target="_blank" rel="noopener noreferrer">arXiv:2607.21897</a>.',
            'pubs.title': 'Publications',
            'pub.venuenote': 'Accepted by the 34th ACM International Conference on Multimedia',
            'awards.title': 'Honors &amp; Awards',
            'award.1': 'ISC.AI Innovation Unicorn Sandbox Competition — National Third Prize',
            'award.2': 'Huawei Ascend AI Innovation Competition — Bronze, South China Division',
            'award.3': 'ISC.AI Innovation Unicorn Sandbox Competition — Innovation Public-Welfare Unicorn Award',
            'award.4': 'University First-Class Scholarship',
            'blog.title': 'Blog',
            'blog.viewall': 'View all',
            'blog.subtitle': 'Notes on learning, research, and life',
            'blog.excerpt.1': 'Welcome to my personal blog where I share my thoughts on machine learning, AI security, and research.',
            'blog.excerpt.2': 'Some notes on differential privacy theory and its applications in machine learning.',
            'blog.excerpt.3': 'A deep dive into attention mechanisms in transformers and their theoretical properties.',
            'blogcat.all': 'All',
            'blogcat.pg': 'General',
            'blogcat.research': 'Research',
            'blogcat.pr': 'Paper Reading',
            'blogcat.thoughts': 'Thoughts',
            'footer.rights': 'All rights reserved.',
            'modal.copy': 'Copy',
            'modal.copied': '✓ Copied to clipboard',
            'modal.copyfail': 'Copy failed — please select & copy manually'
        }
    };

    var LANG = 'zh';

    function currentLang() {
        var l = docEl.getAttribute('data-lang');
        if (l === 'en' || l === 'zh') return l;
        var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
        return nav.indexOf('zh') === 0 ? 'zh' : 'en';
    }

    function applyLang(lang) {
        if (!I18N[lang]) lang = 'zh';
        LANG = lang;
        docEl.setAttribute('data-lang', lang);
        docEl.lang = lang === 'zh' ? 'zh-CN' : 'en';
        var dict = I18N[lang];

        docEl.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (dict[key]) el.textContent = dict[key];
        });
        docEl.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-html');
            if (dict[key]) el.innerHTML = dict[key];
        });

        var lt = document.getElementById('lang-toggle');
        if (lt) {
            lt.textContent = lang === 'zh' ? 'EN' : '中文';
            lt.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文');
        }
        if (document.getElementById('blog-categories')) BlogSystem.renderCategories(lang);
    }

    function initLangToggle() {
        var lt = document.getElementById('lang-toggle');
        if (!lt) return;
        lt.addEventListener('click', function () {
            var next = LANG === 'zh' ? 'en' : 'zh';
            try { localStorage.setItem('site-lang', next); } catch (e) { /* private mode */ }
            applyLang(next);
        });
    }

    /* =====================================================
     * Theme toggle
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

        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) setOpen(false);
        });
        document.addEventListener('click', function (e) {
            if (nav.classList.contains('active') &&
                !toggle.contains(e.target) && !nav.contains(e.target)) {
                setOpen(false);
            }
        });

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
     * Smooth anchor scrolling
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
            var t = I18N[LANG];
            copyText(textarea.value,
                function () {
                    hint.classList.remove('err');
                    hint.textContent = t['modal.copied'];
                    setTimeout(function () { hint.textContent = ''; }, 2400);
                },
                function () {
                    hint.classList.add('err');
                    hint.textContent = t['modal.copyfail'];
                });
        });
    }

    /* =====================================================
     * Blog list (filtering on blog/index.html)
     * ===================================================== */
    var BlogSystem = {
        posts: [
            { title: 'Welcome to My Blog', slug: 'welcome', date: '2024-01-01', cat: 'pg', excerptKey: 'blog.excerpt.1' },
            { title: 'Notes on Differential Privacy', slug: 'differential-privacy-notes', date: '2024-02-15', cat: 'research', excerptKey: 'blog.excerpt.2' },
            { title: 'Understanding Attention Mechanisms', slug: 'attention-mechanisms', date: '2024-03-10', cat: 'pr', excerptKey: 'blog.excerpt.3' }
        ],

        categories: ['all', 'pg', 'research', 'pr', 'thoughts'],

        label: function (cat) {
            return (I18N[LANG] && I18N[LANG]['blogcat.' + cat]) || cat;
        },

        init: function () {
            this.renderPosts();
            this.renderCategories();
        },

        renderPosts: function (postsToRender) {
            var container = document.getElementById('blog-list');
            if (!container) return;

            var posts = postsToRender || this.posts;
            var dict = I18N[LANG];
            var self = this;
            container.innerHTML = posts.map(function (post) {
                return '' +
                    '<a href="posts/' + post.slug + '.html" class="blog-card">' +
                    '<h3 class="blog-card-title">' + post.title + '</h3>' +
                    '<p class="blog-card-excerpt">' + (dict[post.excerptKey] || '') + '</p>' +
                    '<div class="blog-card-meta">' +
                    '<span class="blog-card-date"><i class="fa-regular fa-calendar"></i>' + post.date + '</span>' +
                    '<span class="blog-card-category">' + self.label(post.cat) + '</span>' +
                    '</div></a>';
            }).join('');
        },

        renderCategories: function (lang) {
            var container = document.getElementById('blog-categories');
            if (!container) return;

            var self = this;
            container.innerHTML = this.categories.map(function (category) {
                return '<button class="blog-category-tag' + (category === 'all' ? ' active' : '') +
                    '" data-category="' + category + '">' + self.label(category) + '</button>';
            }).join('');

            container.querySelectorAll('.blog-category-tag').forEach(function (tag) {
                tag.addEventListener('click', function () {
                    container.querySelectorAll('.blog-category-tag').forEach(function (t) {
                        t.classList.remove('active');
                    });
                    tag.classList.add('active');

                    var category = tag.getAttribute('data-category');
                    self.renderPosts(category === 'all'
                        ? null
                        : self.posts.filter(function (p) { return p.cat === category; }));
                });
            });
        }
    };

    /* =====================================================
     * Boot (script sits at end of <body>; DOM is ready)
     * ===================================================== */
    applyLang(currentLang());
    initLangToggle();
    initThemeToggle();
    initProgressBar();
    initNavigation();
    initAnimations();
    initSmoothScroll();
    initBackToTop();
    initBibtexModal();
    if (document.getElementById('blog-list')) BlogSystem.init();

    // Export for debugging / external use
    window.AcademicSite = {
        BlogSystem: BlogSystem,
        I18N: I18N,
        applyLang: applyLang,
        getLang: function () { return LANG; }
    };
})();