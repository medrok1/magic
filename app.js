document.addEventListener("DOMContentLoaded", () => {
    const cardSelection = document.getElementById("card-selection");
    const deck = document.getElementById("deck");
    const cardCount = document.getElementById("card-count");
    const searchBar = document.getElementById("search-bar");

    let deckCards = JSON.parse(localStorage.getItem("deck")) || [];

    function updateDeck() {
        deck.innerHTML = "";
        deckCards.forEach((card, index) => {
            const cardElement = document.createElement("div");
            cardElement.className = "card";
            cardElement.innerHTML = `<img src="${card.image_uris.small}" alt="${card.name}"><p>${card.name}</p>`;
            cardElement.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                removeCardFromDeck(index);
            });
            deck.appendChild(cardElement);
        });
        cardCount.textContent = deckCards.length;
        localStorage.setItem("deck", JSON.stringify(deckCards));
    }

    function addCardToDeck(card) {
        if (deckCards.length < 100) {
            deckCards.push(card);
            updateDeck();
        } else {
            alert("Deck cannot have more than 100 cards");
        }
    }

    function removeCardFromDeck(index) {
        deckCards.splice(index, 1);
        updateDeck();
    }

    function renderCards(cards) {
        cardSelection.innerHTML = "";
        cards.forEach(card => {
            const cardElement = document.createElement("div");
            cardElement.className = "card";
            cardElement.innerHTML = `<img src="${card.image_uris.small}" alt="${card.name}"><p>${card.name}</p>`;
            cardElement.addEventListener("click", () => addCardToDeck(card));
            cardSelection.appendChild(cardElement);
        });
    }

    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        fetch(`https://api.scryfall.com/cards/search?q=${query}`)
            .then(response => response.json())
            .then(data => {
                if (data.data) {
                    renderCards(data.data);
                }
            })
            .catch(error => console.error('Error fetching cards:', error));
    });

    renderCards([]);
    updateDeck();
});
