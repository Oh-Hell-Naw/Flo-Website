let keyInputs = "";

document.addEventListener("keydown", (event) => {
	keyInputs += event.key;

	if (!keyInputs.toLowerCase().endsWith("rawr")) return;
	document.body.classList.add("rotate");
});