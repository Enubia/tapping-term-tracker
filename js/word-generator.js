class WordGenerator {
    constructor() {
        this.wordsByKeyDistribution = {
            // Words with Q, Z, X (rare letters)
            rare: ["quartz", "quiz", "quick", "squeeze", "zombie", "zigzag", "exhaust", "relax", "complex", "oxygen"],

            // Words with J, V, K (uncommon letters)
            uncommon: ["jumbo", "judge", "enjoy", "major", "vivid", "valve", "lava", "kidney", "knowledge", "market"],

            // Words with G, Y, F (moderately common)
            moderate: ["great", "galaxy", "forget", "geology", "yes", "yesterday", "yellow", "forget", "fantastic", "often"],

            // Common words for the rest
            common: [
                "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
                "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
                "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
                "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
                "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
                "make", "can", "like", "time", "no", "just", "him", "know", "take", "people",
                "into", "year", "your", "good", "some", "could", "them", "see", "other", "than",
                "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
                "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
                "new", "want", "because", "any", "these", "give", "day", "most", "us"
            ]
        };
    }

    /**
     * Generate words with a more balanced letter distribution
     * @param {number} count - Number of words to generate
     * @returns {string} - Space-separated string of words
     */
    getBalancedRandomWords(count) {
        const words = [];

        // First ensure we have rare, uncommon, and moderate letters
        // Use about 30% of words from special categories to ensure good letter distribution
        const specialCount = Math.floor(count * 0.3);

        // Distribute special words
        const rareCount = Math.ceil(specialCount * 0.3);
        const uncommonCount = Math.ceil(specialCount * 0.3);
        const moderateCount = Math.ceil(specialCount * 0.4);

        // Add rare letter words
        for (let i = 0; i < rareCount; i++) {
            const randomIndex = Math.floor(Math.random() * this.wordsByKeyDistribution.rare.length);
            words.push(this.wordsByKeyDistribution.rare[randomIndex]);
        }

        // Add uncommon letter words
        for (let i = 0; i < uncommonCount; i++) {
            const randomIndex = Math.floor(Math.random() * this.wordsByKeyDistribution.uncommon.length);
            words.push(this.wordsByKeyDistribution.uncommon[randomIndex]);
        }

        // Add moderate letter words
        for (let i = 0; i < moderateCount; i++) {
            const randomIndex = Math.floor(Math.random() * this.wordsByKeyDistribution.moderate.length);
            words.push(this.wordsByKeyDistribution.moderate[randomIndex]);
        }

        // Fill the rest with common words
        const remainingCount = count - words.length;
        for (let i = 0; i < remainingCount; i++) {
            const randomIndex = Math.floor(Math.random() * this.wordsByKeyDistribution.common.length);
            words.push(this.wordsByKeyDistribution.common[randomIndex]);
        }

        // Shuffle the array to mix the words
        return this.shuffleArray(words).join(" ");
    }

    /**
     * Fisher-Yates shuffle algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} - Shuffled array
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}