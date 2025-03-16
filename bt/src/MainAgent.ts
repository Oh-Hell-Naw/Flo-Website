// IMPORTANT NOTES TO SELF:
// - DELETE Object.defineProperty(exports, "__esModule", { value: true }); LINE
//      - EDIT import { generate_pie_graph } from "./PieGenerator.js";
//      - EDIT import { return_coalitions, display_coalitions } from "./CoalitionFinder.ts";
// - SET OUTDIR TO ./dist SO THE COMPILER DOESN'T CRY
// - ALLOW JS TO.. WELL.. ALLOW JS IMPORTS
// - SET THEIR TYPE TO MODULE IN PACKAGE.JSON AND HTML SCRIPT TAGS
// - THIS COMMAND WORKS FOR TSC:
//      tsc .\bt\MainAgent.ts --outDir ./dist --allowJs --module esnext --target es6 --strict --esModuleInterop --moduleResolution node
//      ^^^ THIS DOESN'T WORK BTW ^^^
//      THIS IS DA NEW SHITTT tsc .\bt\src\MainAgent.ts --outDir ./dist --allowJs --module esnext --target es6 --strict --esModuleInterop --moduleResolution node

// IMPORTS
import { 
    unload_bar,
    sort_results,
    convert_to_seats,
    create_checkboxes,
    apply_checkbox_callback,
} from "./CoalitionFinder.js";

import { generate_pie_graph } from "./PieGenerator.js";

import { 
    setup_options, 
    select_parliament ,
} from "./ParliamentAgent.js";

// CONSTS
const api_url = "https://api.dawum.de/";

/**
 * 
 * @returns Returns JSON object for fetched URL
 */
export async function get_api_data(): Promise<Record<string, any>> {
    return await (await fetch(api_url)).json();
}

export const JSONdata = await get_api_data();
const party_colors: Record<string, string> = {
    'AfD': 'deepskyblue',
    'Bayernpartei': 'royalblue',
    'BVB/FW': 'orange',
    'Grüne': 'lime',
    'BSW': 'blueviolet',
    'bunt.saar': 'yellowgreen',
    'BfTh': 'purple',
    'BIW': 'crimson',
    'CDU/CSU': 'dimgray',
    'CDU': 'dimgray',
    'CSU': 'dimgray',
    'Linke': 'mediumvioletred',
    'Familie': 'darkorange',
    'FDP': 'yellow',
    'Freie Wähler': 'sandybrown',
    'NPD': 'gold',
    'ÖDP': 'orange',
    'Die PARTEI': 'lightgrey',
    'Tierschutzpartei': 'mediumturquoise',
    'Piraten': 'darkorange',
    'Plus Brandenburg': 'mediumpurple',
    'SPD': 'red',
    'SSW': 'dodgerblue',
    'Volt': 'violet',
    'WerteUnion': 'navy',
    'Sonstige': 'darkgrey'
}

export interface Survey {      // NOTE TO SELF: DO NOT FUCKING RENAME THESE KEYS I HATE TYPESCRIPT
    Date: string;
    Survey_Period: {
        Date_Start: string;
        Date_End: string;
    };
    Surveyed_Persons: string;
    Parliament_ID: string;
    Institute_ID: string;
    Tasker_ID: string;
    Method_ID: string;
    Results: Record<string, number>; // Object with dynamic keys (party IDs) and number values (percentages)
}

// BEGIN

/**
 * 
 * @returns Returns either the most recent survey conducted as Survey interface or undefined if it failed
 */
export async function get_recent_survey(): Promise<Survey | undefined> {
    const json = JSONdata
    let data = json['Surveys'];
    if (data) { 
        let recent = Object.values(data).at(-1) as Survey // returns last element from object 🤑🤑🤑🤑 
        return recent;
    }
    console.log("Failed");
    return undefined
}

/**
 * 
 * @param category Category in JSON (e.g. Parties, Parliaments, Institutes)
 * @param id ID as string of the specific element (e.g. "10", "2", "29")
 * @returns 
 */
export async function get_name(category: string, id: string): Promise<string | null> {
    if (JSONdata[category] && JSONdata[category][id]) {
        return JSONdata[category][id]['Name'] || null;
    }

    return null;
}

/**
 * 
 * @param id ID as string of the specific party
 * @returns Shortcut name of the party
 */
export function get_party_shortcut(id: string): string {
    if (JSONdata['Parties'][id]) {
        return JSONdata['Parties'][id]['Shortcut']
    }
    return "";
}

/**
 * Extracts important info from the Survey and puts them into its HTML Elements.
 * For more info, just check the code geez
 * @param survey Survey
 */
async function extract_info(survey: Survey) { // I want to kill myself
    const title = document.querySelector(".graph-title");
    const date = document.getElementById("survey-date");
    const people = document.getElementById("survey-people");
    const institute = document.getElementById("survey-institute");
    const method = document.getElementById("survey-method");
    const tasker = document.getElementById("survey-tasker");
    const parliament_name = await get_name("Parliaments", survey.Parliament_ID);
    const institute_name = await get_name("Institutes", survey.Institute_ID);
    const method_name = await get_name('Methods', survey.Method_ID);
    const tasker_name = await get_name('Taskers', survey.Tasker_ID);

    if (title && parliament_name) { title.innerHTML = parliament_name; }
    if (date) { date.innerHTML = `Datum: ${survey.Date}`; }
    if (people) { people.innerHTML = `Anzahl befragte Personen: ${survey.Surveyed_Persons}`; }
    if (institute) { institute.innerHTML = `Institut: ${institute_name}`; }
    if (method) { method.innerHTML = `Befragungsmethode: ${method_name}`; }
    if (tasker) { tasker.innerHTML = `Auftragssteller: ${tasker_name}`; }
}

/**
 * 
 * @param survey Survey
 * @returns Returns false if it couldn't find a survey or its results
 */
async function parse_results(survey: Survey | undefined) {
    if (!survey) {
        console.log("No survey found");
        return false;
    }

    const results = survey.Results;
    if (!results) {
        console.log("No results found");
        return false;
    }
    let x_array = Array();
    let y_array = Array();
    let color_array = Array();
    let parliament_name = await get_name("Parliaments", survey.Parliament_ID);
    let date = survey.Date;
    let title = `${parliament_name} - ${date}`;

    for (const element of Object.entries(results)) { // ensures the await request is fulfilled until pushing?
        let party_name = get_party_shortcut(element[0]);
        let party_color = await party_colors[party_name]; // why the fuck does it show an error it literally works fuck ts
        x_array.push(party_name);
        y_array.push(element[1]);
        color_array.push(party_color);
    }
    console.log(x_array, y_array, color_array);
    await generate_pie_graph(x_array, y_array, color_array, title);
}

/**
 * 
 * @param coalitions list of coalitions with the parties and their corresponding IDs
 * @returns Returns the coalitions with the names of the party instead of their 
 */
async function return_coalition_names(coalitions: string[][]) {
    for (let i = 0; i < coalitions.length; i++) {
        for (let j = 0; j < coalitions[i].length; j++) {
            const name = get_party_shortcut(coalitions[i][j]);
            coalitions[i][j] = name;
        }
    }
    return coalitions;
}

/**
 * It's 2:12am please let me sleep
 * It calculates and displays the more detailed stats 
 * of the survey like the amount of votes for each party by the institute.
 * @param survey Survey
 */
async function set_detailed_info(survey: Survey | undefined) {
    if (!survey) { return; }
    const container = document.querySelector('.detailed-info-container')
    const sorted_results = sort_results(survey?.Results)
    
    const title = document.createElement("p");
    title.innerHTML = "Achtung! Rundungsfehler möglich!";
    
    if (container && sorted_results) {
        container?.appendChild(title)
        sorted_results.forEach(async party => {
            const party_name = get_party_shortcut(party[0]);
            const multiplier = party[1] / 100;
            const votes = Math.round(Number(survey.Surveyed_Persons) * multiplier);

            const span = document.createElement('span');
            span.innerHTML = `${party_name}: ${votes} Stimmen (${survey.Results[party[0]]}%)`;
            container.appendChild(span);
        })
    }
}

// thanks github co pilot but idk what this is supposed to do
// thx ig for getting rid of the error tho :D
declare global {
    interface Window {
        Plotly: any;
    }
}

/**
 * Unloads everything that could be altered by changing the parliament 
 */
function unload_everything() {
    const info_container = document.querySelector('.detailed-info-container');
    const coalition_container = document.querySelector(".parliament-container");
    const pie_graph = document.getElementById("pie") as HTMLElement;
    
    if (info_container && coalition_container && pie_graph) { 
        info_container.innerHTML = "";
        coalition_container.innerHTML = "";
        window.Plotly.purge(pie_graph);
    }
    unload_bar();
}

/**
 * 
 * @param survey Survey
 * @returns Loads the survey displaying all the necessary info, check code for more info
 */
export async function load_survey(survey: Survey | undefined) {
    if (!survey) { return; }

    unload_everything();
    
    await extract_info(survey);
    await parse_results(survey);
    await set_detailed_info(survey);

    const seats = convert_to_seats(survey);
    await create_checkboxes(seats);
    apply_checkbox_callback();
}

let recent_survey = await get_recent_survey();
load_survey(recent_survey);

setup_options();
(window as any).select_parliament = select_parliament; // sets select_parliament to global scope in document

const detailed_info_button = document.querySelector('.detailed-info-button');
const detailed_info_container = document.querySelector('.detailed-info-container');

detailed_info_button?.addEventListener('click', () => {
    if (detailed_info_container?.classList.contains('info-container-animation-opening')) {
        detailed_info_container?.classList.remove('info-container-animation-opening');
        detailed_info_container?.classList.add('info-container-animation-closing');
    } else {
        detailed_info_container?.classList.add('info-container-animation-opening');
        detailed_info_container?.classList.remove('info-container-animation-closing');
    }
})