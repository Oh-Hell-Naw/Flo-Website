export function return_coalitions(results: Record<string, number>) {
    const total_parties = Object.keys(results).length;
    const sorted_results = sort_results(results);
    let coalitions: Array<Array<[string, number]>> = [];

    for (let index = 0; index < total_parties; index++) {
        // TODO: Create more variety in the coalitions
        let current_percentage = sorted_results[index][1];
        let exclude: Array<string> = [];
        let current_parliament: Array<[string, number]> = [];

        const element = sorted_results[index];
        if (element[0] == "0") {
            continue;
        }
        exclude.push(element[0]);
        current_parliament.push(element);

        while (current_percentage < 50) {
            let next_biggest = find_next_biggest(exclude, sorted_results);
            if (next_biggest == null) {
                break;
            }
            current_percentage += next_biggest[1];

            exclude.push(next_biggest[0]);
            current_parliament.push(next_biggest);
        }
        if (current_percentage >= 50) {
            coalitions.push(current_parliament);
        }
    }
    return coalitions;
}

// created with github copilot because i suck at coding :D
export function sort_results(results: Record<string, number>): [string, number][] {
    return Object.entries(results).sort((a, b) => b[1] - a[1]);
}

export function find_next_biggest(exclude: Array<string>, sorted_results: [string, number][]) {
    let index = 0;
    while (exclude.includes(sorted_results[index][0]) || sorted_results[index][0] == "0") {
        index++;
        if (index >= sorted_results.length) { return null; } // Prevent index overflow
    }
    return sorted_results[index];
}

export function display_coalitions(coalitions: Array<Array<[string, number]>>) {
    const container = document.querySelector(".parliament-container");
    for (let coalition of coalitions) {
        const coalitionElement = document.createElement("div");
        coalitionElement.classList.add("coalition-container");

        for (let party of coalition) {
            const partyElement = document.createElement("span");
            const plusElement = document.createElement("span");

            partyElement.classList.add("coalition-party");
            partyElement.innerHTML = `${party[0]}`;
            coalitionElement.appendChild(partyElement);

            if (coalition.indexOf(party) === coalition.length - 1) { // if index of the current coalition is the same as the coalition length
                plusElement.innerHTML = "=";
            } else {
                plusElement.innerHTML = "+";
            }
            plusElement.classList.add("coalition-party");
            coalitionElement.appendChild(plusElement);
        }
        const coalitionPercentage = document.createElement("span");
        coalitionPercentage.classList.add("coalition-result");
        coalitionPercentage.innerHTML = `${coalition.reduce((acc, cur) => acc + cur[1], 0)}%`;
        coalitionElement.appendChild(coalitionPercentage);
        
        container?.appendChild(coalitionElement);
    }
}