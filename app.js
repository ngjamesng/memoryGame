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

	function setGameBoard() {
		// NEED TO ADD RANDOMIZE FUNCTION TWICE
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
			img.setAttribute("draggable", false); // prevent dragging/cheating
			imageItem.appendChild(img);
			// finally, add the card to the list of cards
			cards.appendChild(imageItem);
		});
	}

	// game logic
	function startGameLogic() {
		gameStateActive = true;
		startButton.textContent = "reset";
		const cardNodeList = document.querySelectorAll(".image.facedown"); //nodelist, not an array
		let guessObj = {};
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
				if (checkSameOrMatchedOrAlreadyFlippedTwo(gameStateActive, card, guessObj)) {
					null;
				} else if (checkFirstCard(gameStateActive, card, guessObj, cardNodeList)) {
					flipFaceUp(guessObj, idx, cardNodeList, card);
				} else if (checkIfTwoCardsMatch(gameStateActive, card, guessObj, idx)) {
					matchCards(cardNodeList, guessObj, idx);
				} else if (checkIfTwoAreDifferent(card, guessObj)) {
					twoDifferentCards(guessObj, idx, cardNodeList, card);
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
	function checkSameOrMatchedOrAlreadyFlippedTwo(gameStateActive, card, guessObj) {
		return (
			(gameStateActive && Object.values(card.classList).includes("selected" || "matched")) ||
			Object.keys(guessObj).length == 2
		);
	}

	function checkFirstCard(gameStateActive, card, guessObj, cardNodeList) {
		return (
			gameStateActive &&
			facedownAndNotMatched(card) &&
			Object.keys(guessObj).length == 0 &&
			!cardNodeList.forEach((cardNode) => {
				cardNode.classList.contains("selected");
			})
		);
	}

	function flipFaceUp(guessObj, idx, cardNodeList, card) {
		guessObj[idx] = cardNodeList[idx];
		if (Object.keys(guessObj).length == 1) {
			card.classList.add("selected");
		}
		incrementScoreBoard();
	}

	function checkIfTwoCardsMatch(gameStateActive, card, guessObj, idx) {
		return (
			gameStateActive &&
			facedownAndNotMatched(card) &&
			!guessObj[idx] &&
			guessObj[Object.keys(guessObj)[0]].innerHTML === card.innerHTML
		);
	}

	function matchCards(cardNodeList, guessObj, idx) {
		cardNodeList.forEach((cardNode) => {
			if (
				!guessObj[idx] &&
				guessObj[Object.keys(guessObj)[0]].innerHTML == cardNode.innerHTML &&
				Object.keys(guessObj).length < 2
			) {
				cardNode.classList.add("matched");
				cardNode.classList.remove("facedown");
				cardNode.classList.remove("selected");
			}
		});
		incrementScoreBoard();
		clearGuess(guessObj);
	}

	function checkIfTwoAreDifferent(card, guessObj) {
		return facedownAndNotMatched(card) && Object.keys(guessObj).length == 1;
	}

	function twoDifferentCards(guessObj, idx, cardNodeList, card) {
		if (Object.keys(guessObj).length == 1) {
			guessObj[idx] = cardNodeList[idx];
		}
		cardNodeList.forEach((node, nodeidx) => {
			if (
				Object.keys(guessObj).includes(nodeidx.toString()) &&
				Object.keys(guessObj).length == 2
				// card !== node
			) {
				node.classList.add("selected");
			}
		});

		setTimeout(() => {
			cardNodeList.forEach((node) => {
				if (node.classList.contains("selected")) {
					node.classList.remove("selected");
					console.log("removed!");
				}
			});
			clearGuess(guessObj);
		}, 3000);
		incrementScoreBoard();
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
