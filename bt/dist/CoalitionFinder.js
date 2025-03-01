export function return_coalitions(results) {
    const total_parties = Object.keys(results).length;
    const sorted_results = sort_results(results);
    let coalitions = new Set();
    for (let index = 0; index < total_parties; index++) {
        // TODO: Create more variety in the coalitions
        const element = sorted_results[index];
        let current_percentage = element[1];
        let exclude = new Set([element[0]]);
        let current_parliament = [element];
        if (element[0] == "0") {
            continue;
        }
        if (current_percentage >= 51) {
            // Convert coalition into sorted string to prevent duplicates
            const coalitionKey = current_parliament.map(p => p[0]).sort().join("-");
            coalitions.add(coalitionKey);
            continue;
        }
        while (current_percentage < 51) {
            const next_biggest = find_next_biggest(Array.from(exclude), sorted_results);
            if (!next_biggest) {
                break;
            }
            current_percentage += next_biggest[1];
            exclude.add(next_biggest[0]);
            current_parliament.push(next_biggest);
        }
        if (current_percentage >= 51) {
            const coalitionKey = current_parliament.map(p => p[0]).sort().join("-"); // '-' seperator
            coalitions.add(coalitionKey);
        }
    }
    return Array.from(coalitions).map(c => c.split("-"));
}
// created with github copilot because i suck at coding :D
export function sort_results(results) {
    return Object.entries(results).sort((a, b) => b[1] - a[1]);
}
export function find_next_biggest(exclude, sorted_results) {
    let index = 0;
    while (exclude.includes(sorted_results[index][0]) || sorted_results[index][0] == "0") {
        index++;
        if (index >= sorted_results.length) {
            return null;
        } // Prevent index overflow
    }
    return sorted_results[index];
}
export function display_coalitions(coalitions) {
    const container = document.querySelector(".parliament-container");
    for (let coalition of coalitions) {
        const coalitionElement = document.createElement("div");
        coalitionElement.classList.add("coalition-container");
        for (let party of coalition) {
            const partyElement = document.createElement("span");
            const plusElement = document.createElement("span");
            partyElement.classList.add("coalition-party");
            partyElement.innerHTML = `${party}`;
            coalitionElement.appendChild(partyElement);
            if (coalition.indexOf(party) === coalition.length - 1) { // if index of the current coalition is the same as the coalition length
                plusElement.innerHTML = "";
            }
            else {
                plusElement.innerHTML = "+";
            }
            plusElement.classList.add("coalition-party");
            coalitionElement.appendChild(plusElement);
        }
        container === null || container === void 0 ? void 0 : container.appendChild(coalitionElement);
    }
}
