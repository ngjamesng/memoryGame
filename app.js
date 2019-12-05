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
		let matchedCards = {};
		generateCards(cardNodeList, guessObj, matchedCards);
		listenForFlipCards(cardNodeList, guessObj, matchedCards, gameStateActive);
	}

	// start button section

	function clearGameBoard() {
		cards.innerHTML = "";
		score = 0;
		currentScoreDisplay.textContent = score;
	}

	// start game logic section
	function generateCards(cardNodeList, guessObj, matchedCards) {
		for (let i = 0; i < cardNodeList.length; i++) {
			matchedCards[cardNodeList[i].innerHTML] = false;
		}
	}

	function listenForFlipCards(cardNodeList, guessObj, matchedCards, gameStateActive) {
		cardNodeList.forEach((card, idx, arr) => {
			card.addEventListener("click", () => {
				// if all cards class list has matched, handle win
				console.log(Object.values(card.classList));
				console.log(`${card.innerHTML} at idx ${idx}`);
				if (
					gameStateActive &&
					card.classList.contains("facedown") &&
					!matchedCards[card.innerHTML] &&
					Object.keys(guessObj).length == 0
				) {
					//if first, flip over
					guessObj[idx] = cardNodeList[idx];
					card.classList.add("selected");
					incrementScoreBoard();
				} else if (
					gameStateActive &&
					card.classList.contains("facedown") &&
					!guessObj[idx] &&
					matchedCards[card.innerHTML] == false &&
					guessObj[Object.keys(guessObj)[0]].innerHTML === card.innerHTML
				) {
					// if card contains facedown && idx is not already in guess obj && card.innerHTML is identical... MATCH!!!
					//  then apply matched class, remove facedown class, remove event listener, increment score, clear guess, make match = true
					// console.log("found a match!");
					cardNodeList.forEach((card) => {
						if (
							card.classList.contains("facedown") &&
							!matchedCards[card.innerHTML] &&
							!guessObj[idx] &&
							guessObj[Object.keys(guessObj)[0]].innerHTML == card.innerHTML
						) {
							card.classList.add("matched");
							card.classList.remove("facedown");
							card.classList.remove("selected");
						}
					});
					incrementScoreBoard();
					clearGuess(guessObj);
				} else if (card.classList.contains("facedown") && !card.classList.contains("matched")) {
					// if two different cards
					gameStateActive &&
						cardNodeList.forEach((card) => {
							card.classList.remove("selected");
						});
					clearGuess(guessObj);
					incrementScoreBoard();
					console.log("two different cards");
				}
				// if (
				// 	gameStateActive &&
				// 	Array.prototype.slice.call(cardNodeList).every((card) => {
				// 		return Object.values(card.classList).includes("matched");
				// 	})
				// ) {
				// 	handleWin(gameStateActive);
				// }
				checkWin(cardNodeList);
				// if card contains facedown && idx
			});
		});
	}

	function clearGuess(guessObj) {
		for (let key in guessObj) {
			delete guessObj[key];
		}
	}

	function removeClass(cardNodeList, correctGuess) {}

	function flipCards() {}

	function incrementScoreBoard() {
		score++;
		currentScoreDisplay.textContent = score;
	}

	// handling the win

	function checkWin(cardNodeList) {
		if (
			gameStateActive &&
			Array.prototype.slice.call(cardNodeList).every((card) => {
				return Object.values(card.classList).includes("matched");
			})
		) {
			handleWin(gameStateActive);
		}
	}

	function handleWin(gameStateActive) {
		console.log("you win!!!");
		gameStateActive = false;
		startButton.textContent = "play again!";
		console.log(bestScoreDisplay.textContent);
		if (bestScoreDisplay.textContent == "-" || +bestScoreDisplay.textContent < score) {
			bestScoreDisplay.textContent = score;
		}
	}
});
