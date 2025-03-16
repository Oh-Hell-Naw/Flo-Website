// Imports
import { 
    Survey,
    get_party_shortcut,
    get_recent_survey, 
} from "./MainAgent.js";

// Globals
const checkboxes: Array<HTMLInputElement> = [];
const max_seats = 630; // In the federal parliament there's a max seat limit of 630
const min_majority = (max_seats / 2) + 1 // Minimum amount of seats for majority to lead country
export let bar_count: number = 0
export let bar_percentage: number = bar_count / 100;

// LEGACY CODE
export function return_coalitions(results: Record<string, number>) {
    const total_parties = Object.keys(results).length;
    const sorted_results = sort_results(results);
    let coalitions: Set<string> = new Set();

    for (let index = 0; index < total_parties; index++) {
        // TODO: Create more variety in the coalitions
        const element = sorted_results[index]
        let current_percentage = element[1];
        let exclude: Set<string> = new Set([element[0]]);
        let current_parliament: Array<[string, number]> = [element];

        if (element[0] == "0") { continue; }

        if (current_percentage >= 51) {
            // Convert coalition into sorted string to prevent duplicates
            const coalitionKey = current_parliament.map(p => p[0]).sort().join("-");
            coalitions.add(coalitionKey);
            continue;
        }

        while (current_percentage < 51) {
            const next_biggest = find_next_biggest(Array.from(exclude), sorted_results);
            if (!next_biggest) { break; }

            current_percentage += next_biggest[1];
            exclude.add(next_biggest[0]);
            current_parliament.push(next_biggest);
        }

        if (current_percentage >= 51) {
            const coalitionKey = current_parliament.map(p => p[0]).sort().join("-") // '-' seperator
            coalitions.add(coalitionKey);
        }
    }
    return Array.from(coalitions).map(c => c.split("-"));
}

// created with github copilot because i suck at coding :D
export function sort_results(results: Record<string, number>): [string, number][] {
    return Object.entries(results).sort((a: number[], b: number[]) => b[1] - a[1]);
}

export function find_next_biggest(exclude: Array<string>, sorted_results: [string, number][]) {
    let index = 0;
    while (exclude.includes(sorted_results[index][0]) || sorted_results[index][0] == "0") {
        index++;
        if (index >= sorted_results.length) { return null; } // Prevent index overflow
    }
    return sorted_results[index];
}

export function display_coalitions(coalitions: string[][]) {
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
            } else {
                plusElement.innerHTML = "+";
            }
            plusElement.classList.add("coalition-party");
            coalitionElement.appendChild(plusElement);
        }
        container?.appendChild(coalitionElement);
    }
}

// NEW CODE
/**
 * Unloads the progress bar of the coalition by 
 * setting the seat count and width percentage to 0
 */
export function unload_bar(): void {
    bar_count = 0;
    bar_percentage = 0;
}

/**
 * Removes parties which do not meet requirements for the parliaments
 * @param results Results of the voting
 * @returns List with relative percentages to the parties that DO meet the requirements
 */
function expell_parties(results: Record<string, number>): Object {
    const fixed_records: Record<string, number> = {};

    for (const party in results) {
        if (results[party] > 5 && party != "0") {
            fixed_records[party] = results[party];
        }
    }
    return relate_percentages(fixed_records);
}

/**
 * Explanation of why vote percentages are adjusted for parliament seat allocation:
 * 
 *  1. We have 2 parties which both have 4% voting. This means that they can't join the parliament and therefore have to be removed
 *  2. Now, let's say we have 3 parties left with a total of 92% of the votes.
 *  3. Next, we have to be able to calculate how many seats each party has in the parliament    
 *  3.1. How? Well, we get a multiplier by doing 100% / 92% so we get a multiplier of 1,08695652...
 *  3.2. Now, so we can go from 92% of the votes to 100% of the votes (because the votes are relative to the other parties that meet the requirements)
 *  3.3. And how? Well, say party 1 has 35% of the votes: we have to multiply it with the multiplier
 *  4. 35% * multiplier = 35% * 1,08695652 = 38,0434782%
 *  5. add it all together so you have 100% of the votes and can therefore calculate the amount of seats for each party.
 * 
 * @param fixed_records Results with only the parties which meet the requirements for the parliament
 * @returns Results with new percentages
 */
function relate_percentages(fixed_records: Record<string, number>): Object {
    const total_percentage = Object.values(fixed_records).reduce((acc, percentage) => acc + percentage, 0);
    const multiplier = (100 / total_percentage).toPrecision(10);
    
    for (const party in fixed_records) {
        const value = fixed_records[party] * multiplier;
        fixed_records[party] = value;
    }
    return fixed_records;
}

/**
 * 
 * @param results Results of the voting
 * @returns Returns the ID of each party along with the amount of seats it has in the parliament
 */
export function convert_to_seats(results: Survey) {
    const records = expell_parties(results.Results);
    const seats = [
        ["10", 1],
    ];

    // Now, pray to god that my previous shenanigans
    // actually turn out to make an accurate
    // approximation for the seat count of each party
    for (const result in records) {
        seats.push([result, Math.round(629 * (records[result] / 100))])
    }
    return seats;
}

/**
 * Creates checkboxes for each party in the parliament
 * @param seats Seat alignment for the parties
 */
export async function create_checkboxes(seats: (string | number)[][]) {
    const container = document.querySelector('.parliament-container');

    for (let i = 0; i < seats.length; i++) {
        const name = get_party_shortcut(seats[i][0]) ?? '';
        const seat_count = seats[i][1];

        const check_container = document.createElement('div');
        const check = document.createElement('input') as HTMLInputElement;
        const label = document.createElement('label') as HTMLLabelElement;

        check_container.classList.add('coalition-checkbox-container');

        check.type = "checkbox";
        check.id = name;
        check.classList.add('coalition-checkbox');
        check.value = `${seat_count}`;
        check.indeterminate = true;
        check.checked = false;

        label.htmlFor = name;
        label.innerHTML = `${name} (${seat_count})`;
        label.classList.add("coalition-checkbox-label");

        if (container && check && label) {
            check_container.appendChild(check);
            check_container.appendChild(label);
            container.append(check_container);
            checkboxes.push(check);
        }
    }
}

/**
 * Applies the callback function to each checkbox
 */
export function apply_checkbox_callback(): void {
    console.log(checkboxes);

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            checkboxes_callback(checkbox);
        });
    });
}

/**
 * Adds to the bar_count to calculate the amount of seats currently allocated and update the visual.
 * 
 * For more info, check code.
 * @param checkbox checkbox that was clicked
 */
function checkboxes_callback(checkbox: HTMLInputElement): void {
    const value = Number(checkbox.value)
    if (checkbox.checked) {
        bar_count = bar_count + value
    } else {
        bar_count = bar_count - value
    }

    const progress_bar = document.querySelector('.parliament-bar-progress')
    bar_percentage = Math.floor((bar_count / max_seats) * 100);
    if (progress_bar) {
        (progress_bar as HTMLDivElement).style.width = `${bar_percentage}%`; // if not as HTMLDivElement it can't find style (???)
    }

    const progress_bar_label = document.querySelector(".parliament-bar-label");
    if (progress_bar_label) {
        let is_majority = "";
        if (bar_count >= min_majority) {
            is_majority = ">=";
        } else {
            is_majority = "<";
        }
        progress_bar_label.innerHTML = `${bar_count} Sitze ${is_majority} ${min_majority} Sitze`
    }
}