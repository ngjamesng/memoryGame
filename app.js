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
			0,
			1,
			2
		];
		doubledCards.forEach((singleCard) => {
			// create li (list item)
			let imageItem = document.createElement("li");
			imageItem.setAttribute("class", "image facedown");
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
		const cardArray = document.querySelectorAll(".image.facedown"); //Array/nodelist
		let guessObj = {}; //object
		let matchedCards = {};
		generateCards(cardArray, guessObj, matchedCards);
		listenForFlipCards(cardArray, guessObj, matchedCards);
	}

	// start button section

	function clearGameBoard() {
		cards.innerHTML = "";
	}

	// start game logic section
	function generateCards(cardArray, guessObj, matchedCards) {
		for (let i = 0; i < cardArray.length; i++) {
			matchedCards[cardArray[i].innerHTML] = false;
		}
	}

	function listenForFlipCards(cardArray, guessObj, matchedCards) {
		cardArray.forEach((card, idx, arr) => {
			card.addEventListener("click", () => {
				console.log(`${card.innerHTML} at idx ${idx}`);
				if (
					card.classList.contains("facedown") &&
					!matchedCards[card.innerHTML] &&
					Object.keys(guessObj).length == 0
				) {
					//if first, flip over
					guessObj[idx] = cardArray[idx];
					card.classList.add("selected");
					incrementScoreBoard();
					// console.log("flipped one card, contains facedown, not matched");
					// console.log(guessObj);
				} else if (
					card.classList.contains("facedown") &&
					!guessObj[idx] &&
					matchedCards[card.innerHTML] == false &&
					guessObj[Object.keys(guessObj)[0]].innerHTML === card.innerHTML
				) {
					// if card contains facedown && idx is not already in guess obj && card.innerHTML is identical... MATCH!!!
					//  then apply matched class, remove facedown class, remove event listener, increment score, clear guess, make match = true
					console.log("found a match!");
					cardArray.forEach((card) => {
						if (
							card.classList.contains("facedown") &&
							!matchedCards[card.innerHTML] &&
							!guessObj[idx] &&
							guessObj[Object.keys(guessObj)[0]].innerHTML == card.innerHTML
						) {
							card.classList.remove("facedown");
							card.classList.remove("selected");
							card.classList.add("matched");
						}
					});
					incrementScoreBoard();
					clearGuess(guessObj);
				} else if (card.classList.contains("facedown") && !card.classList.contains("matched")) {
					// if two different cards
					cardArray.forEach((card) => {
						card.classList.remove("selected");
					});
					clearGuess(guessObj);
					incrementScoreBoard();
					console.log("two different cards");
				}

				// if card contains facedown && idx
			});
		});
	}

	function clearGuess(guessObj) {
		for (let key in guessObj) {
			delete guessObj[key];
		}
	}

	function removeClass(cardArray, correctGuess) {}

	function flipCards() {}

	function incrementScoreBoard() {
		score++;
		currentScoreDisplay.textContent = score;
	}
});
