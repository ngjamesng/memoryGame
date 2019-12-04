document.addEventListener("DOMContentLoaded", () => {
	// best score, current score section
	const bestScore = document.querySelector("#best-score"),
		currentScoreDisplay = document.querySelector("#current-score");
	let score = 0;
	// board/cards section
	const cards = document.querySelector("#cards");
	const startButton = document.querySelector("#startButton");
	// start game
	startButton.addEventListener("click", () => {
		clearGameBoard();
		setGameBoard();
		startGameLogic();
	});
	// finish game, will need to call reset, and if current score < best score, then bestscore=Score Dispaly

	function setGameBoard() {
		// NEED TO ADD RANDOMIZE FUNCTION
		let doubledCards = [
			0,
			1,
			2,
			3,
			4,
			5,
			0,
			1,
			2,
			3,
			4,
			5
		];
		doubledCards.forEach((singleCard) => {
			// create li (list item)
			let imageItem = document.createElement("li");
			imageItem.setAttribute("class", "image");
			let img = document.createElement("img");
			img.setAttribute("src", `cards/${singleCard}.jpg`);
			imageItem.appendChild(img);
			// finally, add the card to the list of cards
			cards.appendChild(imageItem);
		});
	}

	// game logic
	let gameActive = false;
	function startGameLogic() {
		gameActive = true;
		let guess = {};
		let cardsFlipped = 0;
		const cardArray = document.querySelectorAll(".image");

		cardArray.forEach((singleCard, idx) => {
			singleCard.addEventListener("click", () => {
				const strCard = singleCard.innerHTML;
				if (Object.keys(guess).length === 0) {
					guess[idx] = strCard;
					console.log(`flipped one card`);
					incrementScoreBoard();
				} else if (Object.keys(guess).length === 1) {
					if (guess[idx]) {
						console.log("clicked on the same card twice");
					} else if (!guess[idx]) {
						guess[idx] = strCard;
						const guessArr = Object.keys(guess);
						const firstFlipped = guess[guessArr[0]],
							secondFlipped = guess[guessArr[1]];
						if (firstFlipped === secondFlipped) {
							//apply face-up class
							console.log("matched two cards");
						} else {
							console.log(`flipped two different cards`);
						}
						for (let key in guess) {
							delete guess[key];
						}
						incrementScoreBoard();
					}
				}
			});
		});
	}

	function incrementScoreBoard() {
		// increment score and scoreboard
		score++;
		currentScoreDisplay.textContent = score;
	}

	function clearGameBoard() {
		cards.innerHTML = "";
	}
});
