
function toggleBottomSheet(link = window.location.href) {
    const sheet = document.getElementById('bottomSheet');
    const overlay = document.getElementById('overlay');
    const shareLink = document.getElementById('shareLink');

    if (sheet.classList.contains('bottom-[-100%]')) {
        
        sheet.classList.remove('bottom-[-100%]');
        sheet.classList.add('bottom-0');
        overlay.classList.remove('hidden');
        shareLink.value = link;
        
        
        document.body.style.overflow = 'hidden';
    } else {
      
        sheet.classList.remove('bottom-0');
        sheet.classList.add('bottom-[-100%]');
        overlay.classList.add('hidden');
        
        
        document.body.style.overflow = 'auto';
    }
}

function copyToClipboard() {
    const copyText = document.getElementById("shareLink");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand("copy");
        showToast("✅ Link copied!", "success");
    } catch (err) {
        showToast("❌ Failed to copy", "error");
    }
}


function copyToClipboardModern() {
    const copyText = document.getElementById("shareLink").value;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText).then(() => {
            showToast("✅ Link copied!", "success");
        }).catch(() => {
            showToast("❌ Failed to copy", "error");
        });
    } else {
      
        const textarea = document.createElement('textarea');
        textarea.value = copyText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast("✅ Link copied!", "success");
    }
}

function shareOn(platform) {
    const url = encodeURIComponent(document.getElementById("shareLink").value);
    const text = encodeURIComponent("Check out this amazing game! 🎮 Download now!");
    let shareUrl = "";

    switch (platform) {
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=Check this out!&body=${text}%0A%0A${url}`;
            break;
        default:
            shareUrl = url;
    }
    
    window.open(shareUrl, "_blank", "noopener,noreferrer");
}


function showToast(message, type = "success") {
    
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    
    const toast = document.createElement('div');
    toast.className = `toast-notification fixed bottom-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-[100] animate-fade-in-up`;
    
    if (type === "success") {
        toast.style.backgroundColor = "#10B981";
        toast.style.background = "linear-gradient(135deg, #10B981, #059669)";
    } else {
        toast.style.backgroundColor = "#EF4444";
        toast.style.background = "linear-gradient(135deg, #EF4444, #DC2626)";
    }
    
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    
    setTimeout(() => {
        toast.style.animation = "fadeOut 0.3s ease-out";
        setTimeout(() => {
            if (toast && toast.remove) {
                toast.remove();
            }
        }, 300);
    }, 2000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, 20px);
        }
    }
    
    .animate-fade-in-up {
        animation: fadeInUp 0.3s ease-out;
    }
    
    /* Smooth scroll behavior */
    html {
        scroll-behavior: smooth;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
    }
`;
document.head.appendChild(style);

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const sheet = document.getElementById('bottomSheet');
        const overlay = document.getElementById('overlay');
        
        if (sheet && !sheet.classList.contains('bottom-[-100%]')) {
            toggleBottomSheet();
        }
    }
});

const sheet = document.getElementById('bottomSheet');
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
            if (sheet.classList.contains('bottom-0')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }
    });
});

if (sheet) {
    observer.observe(sheet, { attributes: true });
}


window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
});

function trackClick(buttonName, link) {
    console.log(`Button clicked: ${buttonName}, Link: ${link}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'Download Button',
            'event_label': buttonName,
            'value': link
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const downloadButtons = document.querySelectorAll('a[href*="rummy"]');
    downloadButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            trackClick(`Download Button ${index + 1}`, this.href);
        });
    });
});
