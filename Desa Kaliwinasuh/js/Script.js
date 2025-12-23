// Main JavaScript for general website functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle (if needed)
    const navMenu = document.querySelector('.nav-menu');
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll for feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Add floating animation to icons
    const icons = document.querySelectorAll('.feature-icon svg, .about-icon svg');
    icons.forEach(icon => {
        icon.style.animation = 'float 3s ease-in-out infinite';
    });

    // Console welcome message
    console.log('%c🗺️ Peta Desa System', 'color: #2563eb; font-size: 20px; font-weight: bold;');
    console.log('%cVersion 1.0.0', 'color: #f59e0b; font-size: 14px;');
});

// Add CSS animation for floating effect
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);