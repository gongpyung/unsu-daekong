document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers-container');

    generateBtn.addEventListener('click', generateLottoNumbers);

    function generateLottoNumbers() {
        // Generate 6 unique random numbers between 1 and 45
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNum = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNum);
        }

        // Convert to array and sort ascending
        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        // Clear previous numbers
        numbersContainer.innerHTML = '';

        // Render numbers with animation delay
        sortedNumbers.forEach((num, index) => {
            const numberElement = document.createElement('div');
            numberElement.classList.add('lotto-number');
            numberElement.textContent = num;
            
            // Set data-range for coloring
            if (num <= 10) numberElement.dataset.range = "1";
            else if (num <= 20) numberElement.dataset.range = "2";
            else if (num <= 30) numberElement.dataset.range = "3";
            else if (num <= 40) numberElement.dataset.range = "4";
            else numberElement.dataset.range = "5";

            // Add animation delay for sequential appearance
            numberElement.style.animationDelay = `${index * 0.1}s`;
            
            numbersContainer.appendChild(numberElement);
        });
    }
});
