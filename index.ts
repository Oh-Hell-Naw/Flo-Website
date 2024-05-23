let keyInputs: string = "";

document.addEventListener("keydown", (event) => {
	keyInputs += event.key;

	if (!keyInputs.toLowerCase().endsWith("rawr")) return;
	document.body.classList.add("rotate");
});

const funnyTextWrapper = document.querySelector(".transition > div > div > div");

for (let i = 1; i <= 32; i++) {
	const span = document.createElement("span");
	span.style.setProperty("--i", i.toString());
	funnyTextWrapper?.appendChild(span);
}

// <div class="socials">
// 	<a href="https://discord.com/users/1088952298962681946" target="_blank" class="socials-card">
// 		<img class="socials-picture" src="cards/discord.svg" />
// 	</a>
// 	<a href="https://www.youtube.com/channel/UCyxexTnvTeDsQekNVPHtVBg" target="_blank" class="socials-card">
// 		<img class="socials-picture" src="cards/youtube.svg" />
// 	</a>
// 	<a href="https://steamcommunity.com/id/GDFlorian/" target="_blank" class="socials-card">
// 		<img class="socials-picture" src="cards/steam.svg" />
// 	</a>
// 	<a href="https://github.com/Floerianc/" target="_blank" class="socials-card">
// 		<img class="socials-picture" src="cards/github.svg" />
// 	</a>
// </div>

type Social = {
	name: string;
	link: string;
	icon: string;
};

const socials: Social[] = [
	{
		name: "Discord",
		link: "https://discord.com/users/1088952298962681946",
		icon: "cards/discord.svg",
	},
	{
		name: "YouTube",
		link: "https://www.youtube.com/channel/UCyxexTnvTeDsQekNVPHtVBg",
		icon: "cards/youtube.svg",
	},
	{
		name: "Steam",
		link: "https://steamcommunity.com/id/GDFlorian/",
		icon: "cards/steam.svg",
	},
	{
		name: "GitHub",
		link: "https://github.com/Floerianc/",
		icon: "cards/github.svg",
	},
];

const socialsWrapper = document.querySelector(".socials");

for (const social of socials) {
	const a = document.createElement("a");
	a.href = social.link;
	a.target = "_blank";
	a.classList.add("socials-card");

	const img = document.createElement("img");
	img.src = social.icon;
	img.classList.add("socials-picture");

	a.appendChild(img);
	socialsWrapper?.appendChild(a);
}

type Project = {
	name: string;
	description: string;
	link: string;
};

const projects: Project[] = [
	{
		name: "PythonIDE",
		description: "This is a VERY mediocre little IDE I created in Python, for Python.",
		link: "https://github.com/Floerianc/FloriansIDE",
	},
	{
		name: "pdfX",
		description: "With pdfX you can extract the text from a PDF and save it in a .txt file.",
		link: "https://github.com/Floerianc/pdfX",
	},
	{
		name: "Encrypter",
		description: "With the Encrypter you can encrypt text messages, save their decryption codes in a small text file and then decrypt them via that text file easily.",
		link: "https://github.com/Floerianc/Encrypter",
	},
	{
		name: "OpenWeather",
		description: "OpenWeather is a little program I made as a joke to determine the weather details in my city and a couple other cities around the world aswell.",
		link: "https://github.com/Floerianc/OpenWeatherAPI-Program",
	},
];

const projectsWrapper = document.querySelector(".main-content > .text-start");

for (const project of projects) {
	const wrapper = document.createElement("div");
	wrapper.classList.add("project");

	const h3 = document.createElement("h3");
	h3.textContent = project.name;

	const p = document.createElement("p");
	p.textContent = project.description;

	const a = document.createElement("a");
	a.href = project.link;
	a.target = "_blank";
	a.textContent = "View on GitHub";

	wrapper.appendChild(h3);
	wrapper.appendChild(p);
	wrapper.appendChild(a);
	projectsWrapper?.appendChild(wrapper);
}