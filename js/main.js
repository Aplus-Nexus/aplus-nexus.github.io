/**
 * Academic Personal Website - Main JavaScript
 * Production-ready, enhanced interactivity
 */

(function() {
    'use strict';

    // ========================================
    // Configuration
    // ========================================

    const CONFIG = {
        animations: {
            enabled: true,
            duration: 500,
            staggerDelay: 100
        },
        mobile: {
            breakpoint: 768
        }
    };

    // ========================================
    // DOM Ready
    // ========================================

    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initAnimations();
        initTooltips();
        initSmoothScroll();
    });

    // ========================================
    // Navigation
    // ========================================

    function initNavigation() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav');

        if (!menuToggle || !mainNav) return;

        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
                mainNav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon && icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Set active nav item based on current page
        setActiveNavItem();
    }

    function setActiveNavItem() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.main-nav a');
        
        navLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href.replace('.html', ''))) {
                link.classList.add('active');
            }
        });
    }

    // ========================================
    // Animations
    // ========================================

    function initAnimations() {
        if (!CONFIG.animations.enabled) return;

        // Intersection Observer for scroll animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('section').forEach(function(section) {
            section.style.opacity = '0';
            observer.observe(section);
        });

        // Observe publication items
        document.querySelectorAll('.pub-item').forEach(function(item, index) {
            item.style.opacity = '0';
            item.style.animationDelay = (index * CONFIG.animations.staggerDelay) + 'ms';
            observer.observe(item);
        });

        // Observe blog cards
        document.querySelectorAll('.blog-card').forEach(function(card, index) {
            card.style.opacity = '0';
            card.style.animationDelay = (index * CONFIG.animations.staggerDelay) + 'ms';
            observer.observe(card);
        });

        // Observe award items
        document.querySelectorAll('#honors li').forEach(function(item, index) {
            item.style.opacity = '0';
            item.style.animationDelay = (index * CONFIG.animations.staggerDelay) + 'ms';
            observer.observe(item);
        });
    }

    // ========================================
    // Tooltips (social links)
    // ========================================

    function initTooltips() {
        const socialLinks = document.querySelectorAll('.social-links a');
        
        socialLinks.forEach(function(link) {
            link.addEventListener('mouseenter', function(e) {
                const text = link.textContent.trim();
                showTooltip(e, text);
            });
            
            link.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        });
    }

    function showTooltip(event, text) {
        // Create tooltip element if it doesn't exist
        let tooltip = document.querySelector('.custom-tooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            document.body.appendChild(tooltip);
        }
        
        tooltip.textContent = text;
        tooltip.style.display = 'block';
        
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    }

    function hideTooltip() {
        const tooltip = document.querySelector('.custom-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    // ========================================
    // Smooth Scroll
    // ========================================

    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = link.getAttribute('href');
                
                if (targetId === '#' || targetId === '') return;
                
                const target = document.querySelector(targetId);
                
                if (target) {
                    e.preventDefault();
                    
                    const navHeight = document.querySelector('.top-nav').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // Blog System
    // ========================================

    const BlogSystem = {
        posts: [
            {
                title: 'Welcome to My Blog',
                slug: 'welcome',
                date: '2024-01-01',
                category: 'General',
                excerpt: 'Welcome to my personal blog where I share my thoughts on machine learning, AI safety, and research.'
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
        
        init: function() {
            this.renderPosts();
            this.renderCategories();
        },
        
        renderPosts: function(postsToRender) {
            const container = document.getElementById('blog-list');
            if (!container) return;
            
            const posts = postsToRender || this.posts;
            
            container.innerHTML = posts.map(function(post) {
                return '\n                    <a href="posts/' + post.slug + '.html" class="blog-card">\n                        <h3 class="blog-card-title">' + post.title + '</h3>\n                        <p class="blog-card-excerpt">' + post.excerpt + '</p>\n                        <div class="blog-card-meta">\n                            <span class="blog-card-date">\n                                <i class="fa-regular fa-calendar"></i>\n                                ' + post.date + '\n                            </span>\n                            <span class="blog-card-category">' + post.category + '</span>\n                        </div>\n                    </a>\n                ';
            }).join('');
        },
        
        renderCategories: function() {
            const container = document.getElementById('blog-categories');
            if (!container) return;
            
            var self = this;
            
            container.innerHTML = this.categories.map(function(category) {
                return '\n                    <button class="blog-category-tag ' + (category === 'All' ? 'active' : '') + '" data-category="' + category + '">\n                        ' + category + '\n                    </button>\n                ';
            }).join('');
            
            // Add click handlers
            container.querySelectorAll('.blog-category-tag').forEach(function(tag) {
                tag.addEventListener('click', function() {
                    var category = this.getAttribute('data-category');
                    
                    container.querySelectorAll('.blog-category-tag').forEach(function(t) {
                        t.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    if (category === 'All') {
                        self.renderPosts();
                    } else {
                        var filtered = self.posts.filter(function(p) {
                            return p.category === category;
                        });
                        self.renderPosts(filtered);
                    }
                });
            });
        },
        
        filterByCategory: function(category) {
            if (category === 'All') {
                return this.posts;
            }
            return this.posts.filter(function(post) {
                return post.category === category;
            });
        },
        
        searchPosts: function(query) {
            var lowerQuery = query.toLowerCase();
            return this.posts.filter(function(post) {
                return post.title.toLowerCase().includes(lowerQuery) ||
                       post.excerpt.toLowerCase().includes(lowerQuery);
            });
        }
    };

    // Initialize blog if on blog page
    if (document.getElementById('blog-list')) {
        BlogSystem.init();
    }

    // ========================================
    // Export
    // ========================================

    window.AcademicSite = {
        BlogSystem: BlogSystem,
        CONFIG: CONFIG
    };

})();