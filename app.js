document.addEventListener("DOMContentLoaded", () => {
	// best score, current score section
	const bestScore = document.querySelector("#bestScore"),
		currentScore = document.querySelector("#currentScore");
	// board/cards section
	const cards = document.querySelector("#cards");

	const startButton = document.querySelector("#startButton");
	// start game
	startButton.addEventListener("click", () => {
		resetGame();
	});
	// finish game, will need to call reset, and if current score < best score, then bestscore=currentscore

	function resetGame() {
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

	function generateCard() {}
});
