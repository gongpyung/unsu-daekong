const fs = require('fs');

const DELAY_MS = 100; // 100ms delay to be polite
const OUTPUT_FILE = 'winning_numbers.json';

async function fetchLottoData() {
    let existingData = [];
    let startRound = 1;

    // Load existing data if available
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
            startRound = existingData.length + 1;
            console.log(`Found existing data up to round ${existingData.length}. Starting from round ${startRound}.`);
        } catch (error) {
            console.error('Error reading existing file, starting from scratch.');
        }
    }

    let currentRound = startRound;
    let consecutiveFailures = 0;
    const MAX_FAILURES = 3; // Stop after 3 consecutive failures (likely future rounds)

    while (consecutiveFailures < MAX_FAILURES) {
        try {
            const response = await fetch(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${currentRound}`);
            const data = await response.json();

            if (data.returnValue === 'success') {
                const numbers = [
                    data.drwtNo1,
                    data.drwtNo2,
                    data.drwtNo3,
                    data.drwtNo4,
                    data.drwtNo5,
                    data.drwtNo6
                ].sort((a, b) => a - b);

                existingData.push(numbers.join(','));
                console.log(`Fetched round ${currentRound}: [${numbers.join(', ')}]`);
                consecutiveFailures = 0; // Reset failures on success
                currentRound++;
            } else {
                console.log(`Round ${currentRound} not found (or future).`);
                consecutiveFailures++;
            }
        } catch (error) {
            console.error(`Error fetching round ${currentRound}:`, error.message);
            consecutiveFailures++;
        }

        // Delay
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }

    console.log(`\nTotal rounds: ${existingData.length}`);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(existingData));
    console.log(`Updated ${OUTPUT_FILE}`);
}

fetchLottoData();
