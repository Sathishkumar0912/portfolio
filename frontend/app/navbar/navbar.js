function initNavbar() {
    const navbar = document.getElementById('navbar');
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const bottomNav = document.getElementById('bottom-nav');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

    // Check if navbar exists
    if (!navbar) {
        console.error('Navbar element not found');
        return;
    }

    // ================= THEME FUNCTIONALITY =================
    
    // Get saved theme or default to dark
    function getSavedTheme() {
        return localStorage.getItem('theme') || 'dark';
    }

    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Toggle between themes
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    // Initialize theme on load
    applyTheme(getSavedTheme());

    // Theme toggle click events
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
        });
    }

    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
        });
    }

    // ================= NAVBAR SCROLL EFFECT =================
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ================= BOTTOM NAV ACTIVE STATE =================
    
    // Update active state based on scroll position
    function updateActiveNavItem() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all items
                bottomNavItems.forEach(item => {
                    item.classList.remove('active');
                });

                // Add active class to matching item
                const activeItem = document.querySelector(`.bottom-nav-item[data-section="${sectionId}"]`);
                if (activeItem) {
                    activeItem.classList.add('active');
                }
            }
        });
    }

    // Listen for scroll to update active state
    window.addEventListener('scroll', updateActiveNavItem);

    // Handle bottom nav item clicks
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Remove active from all
            bottomNavItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active to clicked item
            this.classList.add('active');
        });
    });

    // Initialize active state on load
    updateActiveNavItem();

    console.log('Navbar initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
} else {
    initNavbar();
}
