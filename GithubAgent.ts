const url = 'https://api.github.com/users/floerianc/repos?sort=created&per_page=10';

interface GithubRepo {
    name: string;
    url: string;
    description: string;
    stars: number;
    updated_at: string;
}

function extractRepos(repos: any[]): Array<GithubRepo> {
    let extractedRepos: Array<GithubRepo> = [];
    repos.forEach(currentRepo => {
        extractedRepos.push({
            name: currentRepo.name,
            url: currentRepo.html_url,
            description: currentRepo.description,
            stars: currentRepo.stargazers_count,
            updated_at: currentRepo.updated_at
        });
    });
    return extractedRepos;
}

async function getRepos(): Promise<Array<GithubRepo>> {
    const response = (await fetch(url));
    if (!response.ok) { 
        throw new Error(`GitHub API error: ${response.status}`); // $fstring
    }
    return extractRepos(await response.json());
}

function addRepo(
    repo: GithubRepo,
    container: Element
): void {
    const isoDate = new Date(repo.updated_at)
    const dateString = isoDate.toDateString()
    const projectElement = document.createElement("a"); // create anchor element
    projectElement.classList.add("project");
    projectElement.href = repo.url;
    projectElement.target = "_blank"; // Open in a new tab
    projectElement.innerHTML = `
        <header>${repo.name}</header><br>
        <span>Last updated: ${dateString}</span><br>
        <span>⭐ ${repo.stars}</span><br>
    `;
    container.appendChild(projectElement);
}

function displayRepos(
    repos: Array<GithubRepo>,
    amount: number | null
): void {
    const container = document.querySelector(".page-container");
    if (!container) {
        throw new Error("No container found");
    }
    container.innerHTML = "";

    if (!amount) {
        repos.forEach(repo => {
            addRepo(repo, container)
        });
    } else {
        for (let i = 0; i < amount && i < repos.length; i++) {
            addRepo(repos[i], container)
        }
    }
}

const getRepoDisplayAmount = (): number | null => {
    const path = window.location.pathname;
    if (path === "/fl/index.html" || path === "/fl/") return 7;
    else if (path === "/index.html" || path === "/") return 3;
    else return null; // Show all by default
}

async function main(): Promise<void> {
    try {
        displayRepos(await getRepos(), getRepoDisplayAmount());
    } catch (error) {
        console.error(error);
    }
}

main()