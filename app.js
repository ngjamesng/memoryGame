document.addEventListener("DOMContentLoaded", () => {
	// best score, current score section
	const bestScoreDisplay = document.querySelector("#best-score"),
		currentScoreDisplay = document.querySelector("#current-score");
	let score = 0;
	let gameStateActive = false;

	// board/cards section
	const cards = document.querySelector("#cards");
	const startButton = document.querySelector("#startButton");
	// start game
	startButton.addEventListener("click", () => {
		clearGameBoard();
		setGameBoard();
		startGameLogic();
	});
	// finish game, will need to call reset, and if current score < best score, then bestScoreDisplay=Score Dispaly

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
	function startGameLogic() {
		gameStateActive = true;
		startButton.textContent = "reset";
		const cardNodeList = document.querySelectorAll(".image.facedown"); //Array/nodelist
		let guessObj = {}; //object
		listenForFlipCards(cardNodeList, guessObj, gameStateActive);
	}

	// start button section

	function clearGameBoard() {
		cards.innerHTML = "";
		score = 0;
		currentScoreDisplay.textContent = score;
	}

	// start game logic section

	function listenForFlipCards(cardNodeList, guessObj, gameStateActive) {
		cardNodeList.forEach((card, idx) => {
			card.addEventListener("click", () => {
				// if all cards class list has matched, handle win
				let cardImg = card.innerHTML;
				if (firstCard(gameStateActive, card, guessObj)) {
					flipFaceUp(guessObj, idx, cardNodeList, card);
					incrementScoreBoard();
				} else if (checkIfTwoCardsMatch(gameStateActive, card, guessObj, idx, cardImg)) {
					matchCards(cardNodeList, guessObj, idx);
					clearGuess(guessObj);
					incrementScoreBoard();
				} else if (checkIfTwoAreDifferent(card)) {
					cardNodeList.forEach((card) => card.classList.remove("selected"));
					clearGuess(guessObj);
					incrementScoreBoard();
					// console.log("two different cards");
				} else {
					console.log("you clicked on the same card twice");
				}
				checkWin(cardNodeList); //check win at every iteration
			});
		});
	}

	function clearGuess(guessObj) {
		for (let key in guessObj) {
			delete guessObj[key];
		}
	}

	function incrementScoreBoard() {
		score++;
		currentScoreDisplay.textContent = score;
	}

	// matching logic
	function firstCard(gameStateActive, card, guessObj) {
		return gameStateActive && facedownAndNotMatched(card) && Object.keys(guessObj).length == 0;
	}

	function flipFaceUp(guessObj, idx, cardNodeList, card) {
		guessObj[idx] = cardNodeList[idx];
		card.classList.add("selected");
	}

	function checkIfTwoCardsMatch(gameStateActive, card, guessObj, idx, cardImg) {
		return (
			gameStateActive &&
			facedownAndNotMatched(card) &&
			!guessObj[idx] &&
			guessObj[Object.keys(guessObj)[0]].innerHTML === cardImg
		);
	}

	function checkIfTwoAreDifferent(card) {
		return facedownAndNotMatched(card);
	}

	function matchCards(cardNodeList, guessObj, idx) {
		cardNodeList.forEach((cardNode) => {
			if (!guessObj[idx] && guessObj[Object.keys(guessObj)[0]].innerHTML == cardNode.innerHTML) {
				cardNode.classList.add("matched");
				cardNode.classList.remove("facedown");
				cardNode.classList.remove("selected");
			}
		});
	}

	// handling the win

	function facedownAndNotMatched(card) {
		return card.classList.contains("facedown") && !card.classList.contains("matched");
	}

	function checkWin(cardNodeList) {
		gameStateActive &&
		Array.prototype.slice.call(cardNodeList).every((card) => Object.values(card.classList).includes("matched"))
			? handleWin()
			: null;
	}

	function handleWin() {
		console.log("you win!!!");
		gameStateActive = false;
		startButton.textContent = "play again!";
		if (bestScoreDisplay.textContent == "-" || +bestScoreDisplay.textContent > score) {
			bestScoreDisplay.textContent = score;
		}
	}
});
