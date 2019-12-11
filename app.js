document.addEventListener("DOMContentLoaded", () => {
	// best score, current score section
	const bestScoreDisplay = document.querySelector("#best-score"),
		currentScoreDisplay = document.querySelector("#current-score");
	let score = 0;
	let gameStateActive = false;

	//if there's a best score in local storage, set display
	localStorage.bestScore ? (bestScoreDisplay.textContent = localStorage.bestScore) : null;

	// board/cards section
	const cards = document.querySelector("#cards");
	const startButton = document.querySelector("#startButton");
	const clearBestScore = document.querySelector("#clearBestScore");
	// start game
	clearBestScore.addEventListener("click", () => {
		localStorage.clear();
		bestScoreDisplay.textContent = "-";
	});

	startButton.addEventListener("click", () => {
		clearGameBoard();
		setGameBoard();
		startGameLogic();
	});

	function setGameBoard() {
		// NEED TO ADD RANDOMIZE FUNCTION TWICE
		let doubledCards = [];
		for (let i = 0; i < 6; i++) {
			// need to do twice, each image is based on the URL numbered starting 0.jpg
			doubledCards.push(i);
			doubledCards.push(i);
		}
		doubledCards.forEach((singleCard, idx) => {
			const j = Math.floor(Math.random() * (idx + 1));
			[
				doubledCards[idx],
				doubledCards[j]
			] = [
				doubledCards[j],
				doubledCards[idx]
			];
		});

		doubledCards.forEach((singleCard) => {
			// create li (list item)
			let imageItem = document.createElement("li");
			imageItem.setAttribute("class", "flipcard facedown");
			let div = document.createElement("div");
			let img = document.createElement("img");
			let front = document.createElement("div");
			img.setAttribute("class", "side back");
			img.setAttribute("src", `cards/${singleCard}.jpg`);
			img.setAttribute("draggable", false); // prevent dragging/cheating
			front.setAttribute("class", "side front");
			div.appendChild(img);
			div.appendChild(front);
			div.setAttribute("class", "card");
			// finally, add the card to the list of cards
			imageItem.appendChild(div);
			cards.appendChild(imageItem);
		});
	}

	// game logic
	function startGameLogic() {
		gameStateActive = true;
		startButton.textContent = "reset";
		const cardNodeList = document.querySelectorAll(".flipcard.facedown"); //nodelist, not an array
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
			(gameStateActive && card.classList.contains("selected" || "matched")) || Object.keys(guessObj).length == 2
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
		Object.keys(guessObj).length == 1 ? card.classList.add("selected") : null;
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
		Object.keys(guessObj).length == 1 ? (guessObj[idx] = cardNodeList[idx]) : null;

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
				node.classList.contains("selected") ? node.classList.remove("selected") : null;
			});
			clearGuess(guessObj);
		}, 1000);
		incrementScoreBoard();
	}

	// handling the win

	function facedownAndNotMatched(card) {
		return card.classList.contains("facedown") && !card.classList.contains("matched");
	}

	function checkWin(cardNodeList) {
		gameStateActive &&
		[
			...cardNodeList
		].every((card) => card.classList.contains("matched"))
			? handleWin()
			: null;
	}

	function handleWin() {
		gameStateActive = false;
		startButton.textContent = "play again!";
		if (bestScoreDisplay.textContent == "-" || +bestScoreDisplay.textContent > score) {
			bestScoreDisplay.textContent = score;
			localStorage.setItem("bestScore", bestScoreDisplay.textContent);
		}
	}
});
