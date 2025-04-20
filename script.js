let cards = [];
let currentIndex = -1;
let isEnglishFirst = true;

async function loadCards() {
    const response = await fetch('words.csv');
    const csvText = await response.text();

    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');

    cards = lines.slice(1).map(line => {
        const columns = line.split(',');
        const card = {};

        headers.forEach((header, index) => {
            const value = columns[index];
            if (header === 'tags') {
                card[header] = value.split(';').map(tag => tag.trim());
            } else {
                card[header] = value;
            }
        });

        return card;
    });

    renderList();
}

function renderList() {
    const listContainer = document.getElementById('cardList');
    listContainer.innerHTML = '';
    cards.forEach(card => {
        const item = document.createElement('div');
        item.className = 'card';
        item.innerHTML = `
            <div class="tags">${card.tags.join(', ')}</div>
            <div class="word">${isEnglishFirst ? card.word : card.translation}</div>
            <div class="translation">${isEnglishFirst ? card.translation : card.word}</div>
            <div class="part">${card.part}</div>
            <div class="ref">${card.ref}</div>
        `;
        listContainer.appendChild(item);
    });
}

function startFlashcards() {
    document.getElementById('cardList').classList.add('hidden');
    document.getElementById('flashcard').classList.remove('hidden');
    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('listBtn').classList.remove('hidden');
    currentIndex = -1;
    nextCard();
}

function showList() {
    document.getElementById('cardList').classList.remove('hidden');
    document.getElementById('flashcard').classList.add('hidden');
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('listBtn').classList.add('hidden');
}

function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    displayCard();
}

function displayCard() {
    const card = cards[currentIndex];
    document.getElementById('word').textContent = isEnglishFirst ? card.word : card.translation;
    document.getElementById('translation').textContent = isEnglishFirst ? card.translation : card.word;
    document.getElementById('part').textContent = card.part;
    document.getElementById('ref').textContent = card.ref;
    document.getElementById('flashcardTags').textContent = card.tags.join(', ');
}

function toggleLanguage() {
    isEnglishFirst = !isEnglishFirst;
    if(currentIndex >= 0) displayCard();
    renderList();
}

loadCards();
