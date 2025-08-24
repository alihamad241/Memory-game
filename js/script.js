document.addEventListener("DOMContentLoaded", () => {
    const gameGrid = document.getElementById("game-grid");
    const timerDisplay = document.getElementById("timer-display");
    const movesCounter = document.getElementById("moves-counter");
    const scoreModal = document.getElementById("score-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalScore = document.getElementById("modal-score");
    const modalRating = document.getElementById("modal-rating");
    const resetButton = document.getElementById("reset-button");

    const icons = [
        "fas fa-dog",
        "fas fa-cat",
        "fas fa-fish",
        "fas fa-frog",
        "fas fa-hippo",
        "fas fa-spider",
        "fas fa-bug",
        "fas fa-dragon",
    ];

    const totalPairs = icons.length;
    const totalCards = totalPairs * 2;
    const gameDuration = 300;

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer;
    let timeLeft = gameDuration;

    function initGame() {
        clearInterval(timer);

        const cardIcons = icons.concat(icons);

        for (let i = cardIcons.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardIcons[i], cardIcons[j]] = [cardIcons[j], cardIcons[i]];
        }

        cards = [];
        gameGrid.innerHTML = "";
        cardIcons.forEach((icon, index) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");
            cardElement.dataset.id = index;

            const cardInner = document.createElement("div");
            cardInner.classList.add("card-inner");

            const cardFront = document.createElement("div");
            cardFront.classList.add("card-face", "card-front");
            cardFront.innerHTML = `<i class="${icon}"></i>`;

            const cardBack = document.createElement("div");
            cardBack.classList.add("card-face", "card-back");
            cardBack.innerHTML = `<i class="fas fa-question"></i>`;

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);

            cardElement.addEventListener("click", () =>
                flipCard(cardElement, icon)
            );
            gameGrid.appendChild(cardElement);
        });

        const allCards = Array.from(gameGrid.children);
        allCards.forEach(card => card.classList.add("is-flipped"));
        setTimeout(() => {
            allCards.forEach(card => card.classList.remove("is-flipped"));
        }, 3000);

        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        movesCounter.textContent = `${moves} Moves`;
        timeLeft = gameDuration;
        startTimer();
    }

    function flipCard(card, icon) {
        if (card.classList.contains("is-flipped") || flippedCards.length >= 2) {
            return;
        }

        card.classList.add("is-flipped");
        flippedCards.push({ element: card, icon: icon });

        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 700);
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        moves++;
        movesCounter.textContent = `${moves} Moves`;

        if (card1.icon === card2.icon) {
            card1.element.classList.add("matched");
            card2.element.classList.add("matched");

            card1.element.style.pointerEvents = "none";
            card2.element.style.pointerEvents = "none";

            matchedPairs++;
            if (matchedPairs === totalPairs) {
                endGame("win");
            }
        } else {
            card1.element.classList.remove("is-flipped");
            card2.element.classList.remove("is-flipped");
        }

        flippedCards = [];
    }

    function calculateRating(moves) {
        const requiredMoves = totalPairs;
        const diff = moves - requiredMoves;
        let stars = 5;

        if (diff <= 0) {
            stars = 5;
        } else if (diff <= 2) {
            stars = 4;
        } else if (diff <= 4) {
            stars = 3;
        } else if (diff <= 6) {
            stars = 2;
        } else {
            stars = 1;
        }

        let starHtml = "";
        for (let i = 0; i < 5; i++) {
            if (i < stars) {
                starHtml += '<i class="fas fa-star"></i>';
            } else {
                starHtml += '<i class="far fa-star"></i>';
            }
        }
        return starHtml;
    }

    function endGame(status) {
        clearInterval(timer);

        if (status === "win") {
            modalTitle.textContent = "Congratulations!";
            modalScore.textContent = `You completed the game in ${moves} moves!`;
            modalRating.innerHTML = calculateRating(moves);
        } else {
            modalTitle.textContent = "Game Over!";
            modalScore.textContent = `Time's up! You matched ${matchedPairs} out of ${totalPairs} pairs.`;
            modalRating.innerHTML = "";
        }

        scoreModal.classList.add("show");
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes}:${
                seconds < 10 ? "0" : ""
            }${seconds}`;

            if (timeLeft <= 0) {
                endGame("lose");
            }
        }, 1000);
    }

    resetButton.addEventListener("click", () => {
        initGame();
    });

    initGame();
});
