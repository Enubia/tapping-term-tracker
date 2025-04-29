class ResultsManager {
    constructor(typingTest) {
        this.typingTest = typingTest;
        this.resultsSection = document.getElementById('results');
        this.avgTimeDisplay = document.getElementById('avgTime');
        this.wordsTypedDisplay = document.getElementById('wordsTyped');
        this.charsTypedDisplay = document.getElementById('charsTyped');
        this.keyStatsDisplay = document.getElementById('key-stats');
        this.restartBtn = document.getElementById('restart-btn');
        
        // New elements for tapping term recommendations
        this.conservativeTermDisplay = document.getElementById('conservativeTermValue');
        this.balancedTermDisplay = document.getElementById('balancedTermValue');
        this.aggressiveTermDisplay = document.getElementById('aggressiveTermValue');
        
        this.restartBtn.addEventListener('click', () => {
            this.typingTest.reset();
        });
    }

    /**
     * Calculate and display recommended tapping terms
     * @param {Map} keyAvgTimes - Map of key codes to average press times
     * @param {number} avgTime - Overall average key press time
     */
    updateRecommendedTappingTerms(keyAvgTimes, avgTime) {
        // Calculate recommendations with different buffers
        // Conservative: adds 150ms buffer to account for latency and variation
        const conservativeTerm = Math.round(avgTime + 100);
        
        // Balanced: adds 100ms buffer, good middle ground
        const balancedTerm = Math.round(avgTime + 50);
        
        // Aggressive: adds only 50ms buffer for faster response
        const aggressiveTerm = Math.round(avgTime + 25);
        
        // Update the UI
        this.conservativeTermDisplay.textContent = conservativeTerm;
        this.balancedTermDisplay.textContent = balancedTerm;
        this.aggressiveTermDisplay.textContent = aggressiveTerm;
    }

    /**
     * Display typing test results
     */
    showResults() {
        this.resultsSection.classList.remove('hidden');
        this.typingTest.typingArea.blur();

        const { totalKeyPressTime, totalKeyPressCount, keyPressTimes, wordCount, currentIndex } = this.typingTest;
        const avgTime = totalKeyPressTime / totalKeyPressCount;
        
        this.avgTimeDisplay.innerText = avgTime.toFixed(2);
        this.wordsTypedDisplay.innerText = wordCount;
        this.charsTypedDisplay.innerText = currentIndex;

        this.keyStatsDisplay.innerHTML = '';

        const keyAvgTimes = new Map();
        keyPressTimes.forEach((times, keyCode) => {
            // Skip spacebar
            if (keyCode !== 32) {
                const avgKeyTime = times.reduce((a, b) => a + b, 0) / times.length;
                keyAvgTimes.set(keyCode, avgKeyTime);
            }
        });

        // Update the tapping term recommendations
        this.updateRecommendedTappingTerms(keyAvgTimes, avgTime);

        // Sort keys by average time (slowest to fastest)
        const sortedKeys = Array.from(keyAvgTimes.keys()).sort((a, b) => {
            return keyAvgTimes.get(b) - keyAvgTimes.get(a); // Descending order
        });

        // Check if dark mode is active to apply appropriate styling
        const isDarkMode = document.body.classList.contains('bg-gray-900');
        const borderClass = isDarkMode ? 'border-gray-600' : 'border';

        // Simple gray color for all keys
        const keyColor = isDarkMode ? '#9CA3AF' : '#6B7280';

        // Performance thresholds
        const fastThreshold = avgTime * 0.8;  // 20% faster than average is good
        const slowThreshold = avgTime * 1.2;  // 20% slower than average is bad

        sortedKeys.forEach(keyCode => {
            const times = keyPressTimes.get(keyCode);
            const avgKeyTime = keyAvgTimes.get(keyCode);
            const keyName = String.fromCharCode(keyCode);

            // Determine performance color based on average time
            let performanceColor;
            let performanceLabel;

            if (avgKeyTime <= fastThreshold) {
                performanceColor = 'bg-green-100 text-green-800';
                performanceLabel = 'Fast';
                if (isDarkMode) {
                    performanceColor = 'bg-green-900 text-green-200';
                }
            } else if (avgKeyTime >= slowThreshold) {
                performanceColor = 'bg-red-100 text-red-800';
                performanceLabel = 'Slow';
                if (isDarkMode) {
                    performanceColor = 'bg-red-900 text-red-200';
                }
            } else {
                performanceColor = 'bg-yellow-100 text-yellow-800';
                performanceLabel = 'Average';
                if (isDarkMode) {
                    performanceColor = 'bg-yellow-900 text-yellow-200';
                }
            }

            const keyStatDiv = document.createElement('div');
            keyStatDiv.className = `p-2 ${borderClass} rounded`;
            keyStatDiv.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" 
                             style="background-color: ${keyColor}">
                            ${keyName}
                        </div>
                    </div>
                    <div class="px-2 py-1 rounded text-xs ${performanceColor}">
                        ${performanceLabel}
                    </div>
                </div>
                <div class="font-medium">${avgKeyTime.toFixed(2)} ms</div>
                <div class="text-xs text-gray-500">${times.length} presses</div>
            `;
            this.keyStatsDisplay.appendChild(keyStatDiv);
        });
    }
}