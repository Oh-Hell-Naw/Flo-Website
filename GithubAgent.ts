const url = 'https://api.github.com/users/floerianc/repos?sort=created&per_page=5';

function extractRepos(repos: any[]): Array<any> {
    let extractedRepos = Array();

    for (let index = 0; index < 5; index++) {
        let current_repo = repos[index];
        extractedRepos.push({
                name: current_repo.name,
                url: current_repo.html_url,
                description: current_repo.description,
                stars: current_repo.stargazers_count,
                updated_at: current_repo.updated_at
            });
    }
    return extractedRepos;
}

async function getRepos(): Promise<any[]> {
    let response = (await fetch(url));
    if (!response.ok) { 
        throw new Error(`GitHub API error: ${response.status}`); // $fstring
    }
    let repos = await response.json();
    let info = extractRepos(repos);
    return info;
}

function displayRepos(repos: any[]): void {
    const container = document.querySelector(".page-container"); // selects .page-container from the HTML
    if (!container) {
        throw new Error("No container found");
    }
    container.innerHTML = ""; // Clear existing content

    repos.forEach(repo => { // forEach(callback) 
        const projectElement = document.createElement("a"); // create anchor element
        projectElement.classList.add("project");
        projectElement.href = repo.url;
        projectElement.target = "_blank"; // Open in a new tab

        projectElement.innerHTML = `
            <header>${repo.name}</header><br>
            <span>Last updated: ${repo.updated_at}</span><br>
            <span>⭐ ${repo.stars}</span><br>
        `;

        container.appendChild(projectElement);
    });
}

getRepos().then(repos => displayRepos(repos)).catch(error => console.error(error));