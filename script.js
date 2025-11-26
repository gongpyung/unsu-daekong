document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers-container');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    let winningNumbers = new Set();

    // Load winning numbers
    fetch('winning_numbers.json')
        .then(response => response.json())
        .then(data => {
            winningNumbers = new Set(data);
            console.log(`Loaded ${winningNumbers.size} past winning combinations.`);
        })
        .catch(error => console.error('Error loading winning numbers:', error));

    // Load history on startup
    loadHistory();

    const themeToggleBtn = document.getElementById('theme-toggle');

    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.body.classList.add('light-mode');
        themeToggleBtn.textContent = '☀️';
    }

    // Theme toggle event
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        themeToggleBtn.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    generateBtn.addEventListener('click', generateLottoNumbers);
    clearHistoryBtn.addEventListener('click', clearHistory);

    function generateLottoNumbers() {
        const includeInput = document.getElementById('include-numbers').value;
        const excludeInput = document.getElementById('exclude-numbers').value;
        const mode = document.querySelector('input[name="gen-mode"]:checked').value;

        // Parse inputs
        const includeNums = parseInput(includeInput);
        const excludeNums = parseInput(excludeInput);

        // Validation
        if (includeNums.some(n => n < 1 || n > 45) || excludeNums.some(n => n < 1 || n > 45)) {
            alert('1부터 45 사이의 숫자만 입력해주세요.');
            return;
        }
        if (includeNums.length > 6) {
            alert('포함할 번호는 최대 6개까지만 입력 가능합니다.');
            return;
        }
        if (includeNums.some(n => excludeNums.includes(n))) {
            alert('포함할 번호와 제외할 번호가 겹칩니다.');
            return;
        }
        if (45 - excludeNums.length < 6) {
            alert('제외할 번호가 너무 많아 번호를 생성할 수 없습니다.');
            return;
        }

        // Calculate frequencies if needed
        let candidatePool = Array.from({ length: 45 }, (_, i) => i + 1);
        if (mode !== 'random' && winningNumbers.size > 0) {
            const frequencies = calculateFrequencies();
            if (mode === 'hot') {
                // Top 20 frequent numbers
                candidatePool = frequencies.slice(0, 20).map(item => item.number);
            } else if (mode === 'cold') {
                // Bottom 20 frequent numbers
                candidatePool = frequencies.slice(-20).map(item => item.number);
            }
        }

        // Filter candidate pool with exclude numbers
        candidatePool = candidatePool.filter(n => !excludeNums.includes(n));

        // Check if we have enough numbers
        const needed = 6 - includeNums.length;
        if (candidatePool.length < needed) {
            alert(`선택한 모드(${mode})와 제외 번호 설정으로 인해 생성할 수 있는 번호가 부족합니다.`);
            return;
        }

        // Generate numbers
        let sortedNumbers;
        let attempts = 0;
        const maxAttempts = 100;
        const originalBtnText = generateBtn.querySelector('span').textContent;

        do {
            const numbers = new Set(includeNums);
            while (numbers.size < 6) {
                const randomIndex = Math.floor(Math.random() * candidatePool.length);
                const randomNum = candidatePool[randomIndex];
                numbers.add(randomNum);
            }
            sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
            attempts++;
        } while (winningNumbers.has(sortedNumbers.join(',')) && attempts < maxAttempts);

        if (attempts >= maxAttempts) {
            console.warn('Could not generate a unique combination after 100 attempts. Using last generated.');
        }

        // Check animation toggle
        const useAnimation = localStorage.getItem('useAnimation') !== 'false'; // Default true

        if (!useAnimation) {
            // Instant generation
            numbersContainer.innerHTML = '';
            sortedNumbers.forEach(num => {
                const el = createNumberElement(num);
                // Set final color immediately
                el.style.backgroundColor = '';
                el.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
                numbersContainer.appendChild(el);
            });

            generateBtn.disabled = false;
            generateBtn.querySelector('span').textContent = originalBtnText;
            saveToHistory(sortedNumbers);
            return;
        }

        // Disable button during animation
        generateBtn.disabled = true;
        generateBtn.querySelector('span').textContent = '번호 추첨 중...';

        // Clear previous numbers
        numbersContainer.innerHTML = '';

        // Create 6 placeholders
        const elements = [];
        for (let i = 0; i < 6; i++) {
            const numberElement = document.createElement('div');
            numberElement.classList.add('lotto-number');
            numberElement.textContent = '?';
            numbersContainer.appendChild(numberElement);
            elements.push(numberElement);
        }

        // Animate each number
        elements.forEach((el, index) => {
            // Rolling effect
            const intervalId = setInterval(() => {
                el.textContent = Math.floor(Math.random() * 45) + 1;
                el.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // Dimmed while rolling
                el.dataset.range = '';
            }, 50);

            // Stop rolling one by one
            const stopDelay = 600 + (index * 400); // Staggered delay

            setTimeout(() => {
                clearInterval(intervalId);
                const finalNum = sortedNumbers[index];
                el.textContent = finalNum;
                el.style.backgroundColor = ''; // Reset background to allow CSS to take over

                // Set data-range for coloring
                if (finalNum <= 10) el.dataset.range = "1";
                else if (finalNum <= 20) el.dataset.range = "2";
                else if (finalNum <= 30) el.dataset.range = "3";
                else if (finalNum <= 40) el.dataset.range = "4";
                else el.dataset.range = "5";

                // Pop animation
                el.style.animation = 'none';
                el.offsetHeight; /* trigger reflow */
                el.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

                // If this is the last number
                if (index === 5) {
                    generateBtn.disabled = false;
                    generateBtn.querySelector('span').textContent = originalBtnText;
                    saveToHistory(sortedNumbers);
                }
            }, stopDelay);
        });
    }

    // Animation Toggle Logic
    const animationToggleBtn = document.getElementById('animation-toggle-btn');

    // Load state
    const savedAnimationState = localStorage.getItem('useAnimation');
    if (savedAnimationState === 'false') {
        animationToggleBtn.textContent = '⚡';
    } else {
        animationToggleBtn.textContent = '🎬';
    }

    animationToggleBtn.addEventListener('click', () => {
        const currentState = localStorage.getItem('useAnimation') !== 'false';
        const newState = !currentState;

        localStorage.setItem('useAnimation', newState);
        animationToggleBtn.textContent = newState ? '🎬' : '⚡';
    });

    function calculateFrequencies() {
        const counts = {};
        // Initialize counts
        for (let i = 1; i <= 45; i++) counts[i] = 0;

        // Count occurrences
        winningNumbers.forEach(comboStr => {
            // Assuming comboStr is "1,2,3,4,5,6"
            const nums = comboStr.split(',').map(Number);
            nums.forEach(n => {
                if (counts[n] !== undefined) counts[n]++;
            });
        });

        // Convert to array and sort
        return Object.entries(counts)
            .map(([num, count]) => ({ number: parseInt(num), count }))
            .sort((a, b) => b.count - a.count); // Descending order (Hot first)
    }

    function createNumberElement(num, isSmall = false) {
        const numberElement = document.createElement('div');
        numberElement.classList.add(isSmall ? 'history-number' : 'lotto-number');
        numberElement.textContent = num;

        // Set data-range for coloring
        if (num <= 10) numberElement.dataset.range = "1";
        else if (num <= 20) numberElement.dataset.range = "2";
        else if (num <= 30) numberElement.dataset.range = "3";
        else if (num <= 40) numberElement.dataset.range = "4";
        else numberElement.dataset.range = "5";

        return numberElement;
    }

    function saveToHistory(numbers) {
        let history = JSON.parse(localStorage.getItem('lottoHistory')) || [];

        // Add new numbers to the beginning
        history.unshift({
            date: new Date().toISOString(),
            numbers: numbers
        });

        // Limit to 10 items
        if (history.length > 10) {
            history = history.slice(0, 10);
        }

        localStorage.setItem('lottoHistory', JSON.stringify(history));
        renderHistory();
    }

    function loadHistory() {
        renderHistory();
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('lottoHistory')) || [];
        historyList.innerHTML = '';

        history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');

            // Container for numbers
            const numbersWrapper = document.createElement('div');
            numbersWrapper.style.display = 'flex';
            numbersWrapper.style.gap = '0.5rem';

            item.numbers.forEach(num => {
                const numEl = createNumberElement(num, true);
                numbersWrapper.appendChild(numEl);
            });

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-item-btn');
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = '이 기록 삭제';
            deleteBtn.onclick = () => deleteHistoryItem(index);

            historyItem.appendChild(numbersWrapper);
            historyItem.appendChild(deleteBtn);

            historyList.appendChild(historyItem);
        });
    }

    function deleteHistoryItem(index) {
        let history = JSON.parse(localStorage.getItem('lottoHistory')) || [];
        history.splice(index, 1);
        localStorage.setItem('lottoHistory', JSON.stringify(history));
        renderHistory();
    }

    function clearHistory() {
        if (clearHistoryBtn.classList.contains('confirming')) {
            // Second click - actually clear
            localStorage.removeItem('lottoHistory');
            renderHistory();

            // Reset button
            clearHistoryBtn.textContent = '기록 삭제';
            clearHistoryBtn.classList.remove('confirming');
            clearHistoryBtn.style.color = '';
            clearHistoryBtn.style.borderColor = '';
        } else {
            // First click - change to confirmation state
            const originalText = clearHistoryBtn.textContent;
            clearHistoryBtn.textContent = '진짜 삭제?';
            clearHistoryBtn.classList.add('confirming');
            clearHistoryBtn.style.color = '#ef4444'; // Red color
            clearHistoryBtn.style.borderColor = '#ef4444';

            // Reset after 3 seconds if not clicked again
            setTimeout(() => {
                if (clearHistoryBtn.classList.contains('confirming')) {
                    clearHistoryBtn.textContent = originalText;
                    clearHistoryBtn.classList.remove('confirming');
                    clearHistoryBtn.style.color = '';
                    clearHistoryBtn.style.borderColor = '';
                }
            }, 3000);
        }
    }

    function parseInput(input) {
        if (!input.trim()) return [];
        return input.split(',')
            .map(s => parseInt(s.trim(), 10))
            .filter(n => !isNaN(n));
    }
});
