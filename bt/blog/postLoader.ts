import posts from "./posts.json" with { type: "json" };

const container = document.querySelector('.sidebar-button-container')
for (const post in posts) {
    const title = posts[post]['title']
    const url = posts[post]['url']

    const anchor = document.createElement("a");

    if (document.location.href.includes("posts")) {
        anchor.href = `./${url}`
    } else {
        anchor.href = `./posts/${url}`;
    }
    anchor.innerHTML = title;
    container?.appendChild(anchor);
}