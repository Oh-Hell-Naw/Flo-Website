let keyInputs = "";
document.addEventListener("keydown", (event) => {
    keyInputs += event.key;
    if (!keyInputs.toLowerCase().endsWith("rawr"))
        return;
    document.body.classList.add("rotate");
});
const funnyTextContainer = document.querySelector(".container2 > .box > div");
for (let i = 1; i <= 32; i++) {
    const span = document.createElement("span");
    span.style.setProperty("--i", i.toString());
    funnyTextContainer?.appendChild(span);
}
