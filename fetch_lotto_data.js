const fs = require('fs');

const DELAY_MS = 100;
const OUTPUT_FILE = 'winning_numbers.json';
const API_URL = 'https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do';
const MAX_RETRIES = 3;

async function fetchBatch(params) {
    const url = `${API_URL}?${new URLSearchParams(params)}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.data?.list || [];
}

async function fetchLottoData() {
    let existingData = [];

    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
            console.log(`Found existing data up to round ${existingData.length}. Starting from round ${existingData.length + 1}.`);
        } catch (error) {
            console.error('Error reading existing file, starting from scratch.');
        }
    }

    const startRound = existingData.length + 1;
    let isFirstRequest = true;
    let cursor = null;
    let newCount = 0;
    let retries = 0;

    while (true) {
        try {
            const params = isFirstRequest
                ? { srchDir: 'center', srchLtEpsd: Math.max(startRound - 4, 5) }
                : { srchDir: 'latest', srchCursorLtEpsd: cursor };

            const list = await fetchBatch(params);
            retries = 0;

            if (list.length === 0) break;

            let addedInBatch = 0;
            for (const item of list) {
                const round = item.ltEpsd;
                if (round < startRound) continue; // skip already existing
                if (existingData[round - 1]) continue; // skip duplicates

                const numbers = [
                    item.tm1WnNo, item.tm2WnNo, item.tm3WnNo,
                    item.tm4WnNo, item.tm5WnNo, item.tm6WnNo
                ].sort((a, b) => a - b);

                existingData[round - 1] = numbers.join(',');
                console.log(`Fetched round ${round}: [${numbers.join(', ')}]`);
                addedInBatch++;
                newCount++;
            }

            // Update cursor to the highest round in this batch
            const maxRound = Math.max(...list.map(i => i.ltEpsd));
            if (cursor !== null && maxRound <= cursor) break; // no progress
            cursor = maxRound;
            isFirstRequest = false;

            if (addedInBatch === 0 && !isFirstRequest) break; // all were duplicates
        } catch (error) {
            retries++;
            if (retries >= MAX_RETRIES) {
                console.error(`${MAX_RETRIES} consecutive failures. Stopping.`);
                break;
            }
            console.error(`Error (retry ${retries}/${MAX_RETRIES}):`, error.message);
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            continue;
        }

        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }

    console.log(`\nTotal rounds: ${existingData.length} (${newCount} new)`);

    if (newCount > 0) {
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(existingData));
        console.log(`Updated ${OUTPUT_FILE}`);
    } else {
        console.log('Already up to date.');
    }
}

fetchLottoData();
