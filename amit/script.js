/**
 * ============================================
 * MAIN.JS - SEO Optimized Landing Page
 * Functions: Particles, Bottom Sheet, Share, Copy
 * ============================================
 */

(function() {
    'use strict';

    // ===== CREATE PARTICLES =====
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        // Clear existing particles if any
        container.innerHTML = '';
        
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 10 + 8) + 's';
            p.style.animationDelay = (Math.random() * 10) + 's';
            p.style.width = (Math.random() * 3 + 2) + 'px';
            p.style.height = p.style.width;
            container.appendChild(p);
        }
    }

    // ===== TOGGLE BOTTOM SHEET =====
    function toggleBottomSheet(link) {
        const sheet = document.getElementById('bottomSheet');
        const overlay = document.getElementById('overlay');
        const shareLink = document.getElementById('shareLink');

        if (!sheet || !overlay) return;

        if (sheet.classList.contains('closed')) {
            // Open sheet
            sheet.classList.remove('closed');
            sheet.classList.add('open');
            overlay.classList.remove('hidden');
            
            if (shareLink && link) {
                shareLink.value = link;
            }
            
            document.body.style.overflow = 'hidden';
            
            // Track share button open event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'share_sheet_open', {
                    event_category: 'Engagement',
                    event_label: 'Share Sheet Opened'
                });
            }
        } else {
            // Close sheet
            sheet.classList.remove('open');
            sheet.classList.add('closed');
            overlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    // ===== COPY TO CLIPBOARD =====
    function copyToClipboard() {
        const input = document.getElementById('shareLink');
        if (!input || !input.value) {
            showToast('❌ No link to copy', 'error');
            return;
        }

        const text = input.value;

        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showToast('✅ Link copied successfully!', 'success');
                    trackEvent('copy_link', 'Clipboard API');
                })
                .catch(() => {
                    fallbackCopy(text);
                });
        } else {
            fallbackCopy(text);
        }
    }

    // ===== FALLBACK COPY (Legacy browsers) =====
    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.top = '-9999px';
        ta.style.left = '-9999px';
        ta.style.opacity = '0';
        ta.style.pointerEvents = 'none';
        document.body.appendChild(ta);
        ta.select();
        
        try {
            const success = document.execCommand('copy');
            if (success) {
                showToast('✅ Link copied successfully!', 'success');
                trackEvent('copy_link', 'Fallback');
            } else {
                showToast('❌ Failed to copy. Please copy manually.', 'error');
            }
        } catch (e) {
            showToast('❌ Failed to copy. Please copy manually.', 'error');
            console.error('Copy error:', e);
        }
        
        document.body.removeChild(ta);
    }

    // ===== SHARE ON SOCIAL PLATFORMS =====
    function shareOn(platform) {
        const linkInput = document.getElementById('shareLink');
        if (!linkInput || !linkInput.value) {
            showToast('❌ No link to share', 'error');
            return;
        }

        const url = encodeURIComponent(linkInput.value);
        const text = encodeURIComponent('🎮 Download Jungle Haan & Sabka Game APK 2026! Get free bonus ₹2000. Play now and win real cash! 🏆');
        
        let shareUrl = '';

        switch (platform) {
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=Check out this amazing game!&body=${text}%0A%0A${url}`;
                break;
            default:
                showToast('❌ Unsupported platform', 'error');
                return;
        }

        if (shareUrl) {
            // Track share event
            trackEvent('share', platform);
            
            // Open share dialog
            window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
            
            // Close bottom sheet after sharing
            setTimeout(() => {
                const sheet = document.getElementById('bottomSheet');
                const overlay = document.getElementById('overlay');
                if (sheet && !sheet.classList.contains('closed')) {
                    sheet.classList.remove('open');
                    sheet.classList.add('closed');
                    overlay.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }
            }, 500);
        }
    }

    // ===== TOAST NOTIFICATION =====
    function showToast(message, type) {
        // Remove existing toasts
        document.querySelectorAll('.toast-notification').forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = 'toast-notification toast fixed bottom-28 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-xl shadow-2xl text-white font-bold z-[100] text-sm flex items-center gap-2';
        
        const colors = {
            success: 'linear-gradient(135deg, #10B981, #059669)',
            error: 'linear-gradient(135deg, #EF4444, #DC2626)',
            info: 'linear-gradient(135deg, #3B82F6, #2563EB)'
        };
        
        toast.style.background = colors[type] || colors.info;
        toast.innerHTML = message;
        
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.remove) {
                toast.remove();
            }
        }, 3000);
    }

    // ===== TRACK EVENTS (Google Analytics) =====
    function trackEvent(action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'Engagement',
                event_label: label || 'unknown',
                value: 1
            });
        }
        console.log(`📊 Tracked: ${action} - ${label}`);
    }

    // ===== HANDLE KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', function(e) {
        // ESC key closes bottom sheet
        if (e.key === 'Escape') {
            const sheet = document.getElementById('bottomSheet');
            const overlay = document.getElementById('overlay');
            if (sheet && !sheet.classList.contains('closed')) {
                toggleBottomSheet();
            }
        }
        
        // Ctrl+C or Cmd+C when sheet is open copies link
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            const sheet = document.getElementById('bottomSheet');
            if (sheet && !sheet.classList.contains('closed')) {
                // Allow default copy behavior
            }
        }
    });

    // ===== HANDLE DOWNLOAD CLICKS =====
    function setupDownloadTracking() {
        document.querySelectorAll('a[href*="junglehaan"], a[href*="sabkagame"]').forEach(function(btn, i) {
            btn.addEventListener('click', function(e) {
                const appName = this.href.includes('junglehaan') ? 'Jungle Haan' : 'Sabka Game';
                trackEvent('download_click', appName);
                console.log(`📥 Download ${i+1}: ${appName} - ${this.href}`);
            });
        });
    }

    // ===== HANDLE TELEGRAM FOOTER CLICK =====
    function setupTelegramTracking() {
        const tgFooter = document.querySelector('.telegram-footer');
        if (tgFooter) {
            tgFooter.addEventListener('click', function() {
                trackEvent('telegram_click', 'Footer Join Button');
            });
        }
    }

    // ===== PAGE LOAD ANIMATION =====
    function pageLoadAnimation() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        requestAnimationFrame(function() {
            document.body.style.opacity = '1';
        });
    }

    // ===== SMOOTH SCROLL FOR INTERNAL LINKS =====
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ===== INITIALIZE ON DOM READY =====
    function init() {
        createParticles();
        pageLoadAnimation();
        setupDownloadTracking();
        setupTelegramTracking();
        setupSmoothScroll();
        
        console.log('🚀 SEO Optimized Page Loaded Successfully!');
        console.log('📊 Tracking enabled. Share, copy, and download events will be logged.');
    }

    // ===== EXPOSE GLOBAL FUNCTIONS =====
    window.downloadApp = {
        toggleBottomSheet: toggleBottomSheet,
        copyToClipboard: copyToClipboard,
        shareOn: shareOn,
        showToast: showToast,
        trackEvent: trackEvent,
        createParticles: createParticles
    };

    // ===== RUN ON DOM READY =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ===== RUN ON WINDOW LOAD (for images) =====
    window.addEventListener('load', function() {
        // Particles already created in init
        // Any additional post-load tasks
        console.log('✅ All resources loaded successfully.');
    });

})();
