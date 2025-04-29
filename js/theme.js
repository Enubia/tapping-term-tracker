class ThemeManager {
    constructor() {
        this.darkModeToggle = document.getElementById('dark-mode-toggle');
        this.body = document.body;
        this.darkModeKey = 'dark-mode';
        
        this.init();
    }

    init() {
        const isDarkMode = localStorage.getItem(this.darkModeKey) === 'true';
        this.updateDarkModeStyles(isDarkMode);
        
        this.darkModeToggle.addEventListener('click', () => {
            this.body.classList.toggle('bg-gray-900');
            this.body.classList.toggle('text-white');
            const isDark = this.body.classList.contains('bg-gray-900');
            localStorage.setItem(this.darkModeKey, isDark);
            this.updateDarkModeStyles(isDark);
        });
    }

    updateDarkModeStyles(isDark) {
        if (isDark) {
            this.body.classList.add('bg-gray-900', 'text-white');
            document.querySelector('h1').classList.remove('text-indigo-800');
            document.querySelector('h1').classList.add('text-indigo-300');
            this.darkModeToggle.innerText = '☀️';
        } else {
            this.body.classList.remove('bg-gray-900', 'text-white');
            document.querySelector('h1').classList.add('text-indigo-800');
            document.querySelector('h1').classList.remove('text-indigo-300');
            this.darkModeToggle.innerText = '🌙';
        }

        if (document.getElementById('key-stats').children.length > 0) {
            const keyStats = document.querySelectorAll('#key-stats div');
            keyStats.forEach(stat => {
                if (isDark) {
                    stat.classList.add('border-gray-600');
                } else {
                    stat.classList.remove('border-gray-600');
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});