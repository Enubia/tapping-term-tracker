class TypingTest {
    constructor() {
        this.wordGenerator = new WordGenerator();
        
        this.typingArea = document.getElementById('typing-area');
        this.progressDisplay = document.getElementById('progress');
        this.resultsSection = document.getElementById('results');
        this.resetBtn = document.getElementById('reset-btn');
        this.wordCountInput = document.getElementById('word-count-input');
        this.targetWordsDisplay = document.getElementById('targetWords');
        
        this.targetWordCount = 100;
        this.text = '';
        this.currentIndex = 0;
        this.keyPressTimes = new Map();
        this.totalKeyPressTime = 0;
        this.totalKeyPressCount = 0;
        this.wordCount = 0;
        this.typingStarted = false;
        this.debounceTimeout = null;

        this.resultsManager = new ResultsManager(this);
        
        this.setupEventListeners();
        
        this.reset();
        
        this.typingArea.focus();
    }

    /**
     * Set up event listeners for the test
     */
    setupEventListeners() {
        this.wordCountInput.addEventListener('input', () => {
            if (this.wordCountInput.disabled) return;

            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                let newCount = parseInt(this.wordCountInput.value);

                if (isNaN(newCount)) newCount = 100;
                if (newCount < 20) newCount = 20;
                if (newCount > 200) newCount = 200;

                this.wordCountInput.value = newCount;
                this.targetWordCount = newCount;
                this.targetWordsDisplay.textContent = newCount;
                this.progressDisplay.textContent = `0/${this.targetWordCount} words`;

                // Update text area immediately
                this.reset();
            }, 500);
        });

        this.typingArea.addEventListener('click', () => {
            this.typingArea.focus();
        });

        this.typingArea.addEventListener('keydown', (event) => this.handleKeyDown(event));

        this.resetBtn.addEventListener('click', () => this.reset());
    }

    /**
     * Handle keydown events in typing area
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyDown(event) {
        if (!this.typingStarted && event.key.length === 1) {
            this.typingStarted = true;
            this.wordCountInput.disabled = true;
        }

        if (event.key !== 'F5' &&
            !event.ctrlKey &&
            !event.metaKey &&
            event.key !== 'F12') {
            event.preventDefault();
        }

        if ((event.key.length === 1 || event.key === ' ') && this.currentIndex < this.text.length) {
            const startTime = performance.now();
            const keycode = event.keyCode;

            const shouldTrackForStats = keycode !== 32; // 32 is spacebar

            const handleKeyUp = (upEvent) => {
                if (upEvent.keyCode === keycode) {
                    if (shouldTrackForStats) {
                        const endTime = performance.now();
                        const duration = endTime - startTime;

                        this.totalKeyPressTime += duration;
                        this.totalKeyPressCount++;

                        if (!this.keyPressTimes.has(keycode)) {
                            this.keyPressTimes.set(keycode, []);
                        }
                        this.keyPressTimes.get(keycode).push(duration);
                    }

                    window.removeEventListener('keyup', handleKeyUp);
                }
            };

            window.addEventListener('keyup', handleKeyUp);

            const expectedChar = this.text[this.currentIndex];

            if ((event.key === ' ' && expectedChar === ' ') ||
                (event.key === expectedChar)) {
                this.currentIndex++;
                this.updateDisplay();
            }
        }
    }

    /**
     * Update the display after typing actions
     */
    updateDisplay() {
        const chars = this.typingArea.querySelectorAll('.char');

        chars.forEach((char, index) => {
            const baseClass = this.text[index] === ' ' ? 'char char-space' : 'char';

            if (index < this.currentIndex) {
                char.className = `${baseClass} char-correct`;
            } else if (index === this.currentIndex) {
                char.className = `${baseClass} char-current`;
            } else {
                char.className = `${baseClass} char-upcoming`;
            }
        });

        const typedText = this.text.substring(0, this.currentIndex);
        this.wordCount = typedText.split(' ').filter(word => word !== '').length;
        this.progressDisplay.textContent = `${Math.min(this.wordCount, this.targetWordCount)}/${this.targetWordCount} words`;

        // Check if completed - only complete when all characters are typed
        if (this.currentIndex >= this.text.length) {
            this.resultsManager.showResults();
        }
    }

    /**
     * Reset and initialize the typing test
     */
    reset() {
        this.typingArea.innerHTML = '';
        
        this.text = this.wordGenerator.getBalancedRandomWords(this.targetWordCount);
        
        this.currentIndex = 0;
        this.keyPressTimes = new Map();
        this.totalKeyPressTime = 0;
        this.totalKeyPressCount = 0;
        this.wordCount = 0;
        this.typingStarted = false;

        this.wordCountInput.disabled = false;
        this.wordCountInput.style.pointerEvents = 'auto';
        this.wordCountInput.style.opacity = '1';

        setTimeout(() => this.typingArea.focus(), 0);

        for (let i = 0; i < this.text.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.innerText = this.text[i];
            // Add special class for space characters to improve spacing
            if (this.text[i] === ' ') {
                charSpan.className = i === 0 ? 'char char-space char-current' : 'char char-space char-upcoming';
            } else {
                charSpan.className = i === 0 ? 'char char-current' : 'char char-upcoming';
            }
            this.typingArea.appendChild(charSpan);
        }

        this.progressDisplay.textContent = `${this.wordCount}/${this.targetWordCount} words`;
        this.targetWordsDisplay.textContent = this.targetWordCount;
        this.resultsSection.classList.add('hidden');
    }
}

// Initialize the typing test when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Reset word count input on page load
    document.getElementById('word-count-input').value = "100";
    
    new TypingTest();
});