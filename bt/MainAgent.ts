// IMPORTANT NOTES TO SELF:
// - DO EXPORT {} 
// - DELETE Object.defineProperty(exports, "__esModule", { value: true }); LINE
//      - EDIT import { generate_pie_graph } from "./PieGenerator.js";
//      - EDIT import { return_coalitions, display_coalitions } from "./CoalitionFinder.ts";
// - SET OUTDIR TO ./dist SO THE COMPILER DOESN'T CRY
// - ALLOW JS TO.. WELL.. ALLOW JS IMPORTS
// - SET THEIR TYPE TO MODULE IN PACKAGE.JSON AND HTML SCRIPT TAGS
// - THIS COMMAND WORKS FOR TSC:
//      tsc .\bt\MainAgent.ts --outDir ./dist --allowJs --module esnext --target es6 --strict --esModuleInterop --moduleResolution node

    // TODO: Make website look better
    // TODO: Add function to look for specific parliaments
    // FIXME: Show possible parliament coalitions

import { return_coalitions, display_coalitions, sort_results } from "./CoalitionFinder.js";
import { generate_pie_graph } from "./PieGenerator.js";

const api_url = "https://api.dawum.de/";

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

export async function get_name(category: string, id: string): Promise<string | null> {
    if (JSONdata[category] && JSONdata[category][id]) {
        return JSONdata[category][id]['Name'] || null;
    }

    return null;
}

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
    return survey;
}

async function get_party_name(id: string): Promise<string> {
    return JSONdata['Parties'][id]['Shortcut'];
}

async function parse_results(survey: Survey | undefined) {
    if (!survey) {
        console.log("No survey found");
        return;
    }

    const results = survey.Results;
    if (!results) {
        console.log("No results found");
        return;
    }
    let x_array = Array();
    let y_array = Array();
    let color_array = Array();
    let parliament_name = await get_name("Parliaments", survey.Parliament_ID);
    let date = survey.Date;
    let title = `${parliament_name} - ${date}`;

    for (const element of Object.entries(results)) { // ensures the await request is fulfilled until pushing?
        let party_name = await get_party_name(element[0]);
        let party_color = await party_colors[party_name]; // why the fuck does it show an error it literally works fuck ts
        x_array.push(party_name);
        y_array.push(element[1]);
        color_array.push(party_color);
    }
    console.log(x_array, y_array, color_array);
    await generate_pie_graph(x_array, y_array, color_array, title);
}

async function return_coalition_names(coalitions: string[][]) {
    for (let i = 0; i < coalitions.length; i++) {
        for (let j = 0; j < coalitions[i].length; j++) {
            const name = await get_party_name(coalitions[i][j]);
            coalitions[i][j] = name;
        }
    }
    return coalitions;
}

async function set_detailed_info(survey: Survey | undefined) {
    if (!survey) { return; }
    const container = document.querySelector('.detailed-info-container')
    const sorted_results = sort_results(survey?.Results)
    
    const title = document.createElement("p");
    title.innerHTML = "Achtung! Rundungsfehler möglich!";
    
    if (container && sorted_results) {
        container?.appendChild(title)
        sorted_results.forEach(async party => {
            const party_name = await get_party_name(party[0]);
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

function unload_everything() {
    const info_container = document.querySelector('.detailed-info-container');
    const coalition_container = document.querySelector(".parliament-container");
    const pie_graph = document.getElementById("pie") as HTMLElement;
    
    if (info_container && coalition_container && pie_graph) { 
        info_container.innerHTML = "";
        coalition_container.innerHTML = "";
        window.Plotly.purge(pie_graph);
    }
}

export async function load_survey(survey: Survey | undefined) {
    if (!survey) { return; }
    console.log(survey.Results);
    unload_everything();
    await extract_info(survey);
    await parse_results(survey);
    await set_detailed_info(survey);
    let coalitions = return_coalitions(survey.Results);
    let coalition_full_names = await return_coalition_names(coalitions);
    console.log(coalitions, coalition_full_names)
    display_coalitions(coalition_full_names);
}

let recent_survey = await get_recent_survey();
load_survey(recent_survey);

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