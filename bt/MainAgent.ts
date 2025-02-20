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

    // TODO: Add a button to show the data one by one
    // TODO: Make website look better
    // TODO: Add function to look for specific parliaments
    // TODO: Cool animations perhaps???
    // TODO: Show possible parliament coalitions

import { return_coalitions, return_names, display_coalitions } from "./CoalitionFinder.js";
import { generate_pie_graph } from "./PieGenerator.js";

const api_url = "https://api.dawum.de/";
const party_colors = {
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

interface Survey {      // NOTE TO SELF: DO NOT FUCKING RENAME THESE KEYS I HATE TYPESCRIPT
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

async function get_api_data(): Promise<Record<string, any>> {
    return await (await fetch(api_url)).json();
}

async function get_recent_survey(): Promise<Survey | undefined> {
    const json = await get_api_data();
    let data = json['Surveys'];
    if (data) { 
        let recent = Object.values(data).at(-1) as Survey // returns last element from object 🤑🤑🤑🤑 
        return recent;
    }
    console.log("Failed");
    return undefined
}

async function get_name(category: string, id: string): Promise<string | null> {
    const JSONdata = await get_api_data();
    
    if (JSONdata[category] && JSONdata[category][id]) {
        return JSONdata[category][id]['Election'] || JSONdata[category][id]['Name'] || null;
    }

    return null;
}

async function extract_info() { // I want to kill myself
    const survey = await get_recent_survey();
    if (!survey) {
        return;
    }

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

async function get_party_name(id: string): Promise<Array<string>> {
    const JSONdata = await get_api_data();
    return JSONdata['Parties'][id]['Shortcut'];
}

async function parse_results(survey: Survey | undefined) {
    if (!survey) {
        console.log("No survey found");
        return;
    }

    const JSONdata = await get_recent_survey();
    const results = JSONdata?.Results;
    if (!results) {
        console.log("No results found");
        return;
    }
    let x_array = Array();
    let y_array = Array();
    let color_array = Array();
    let title = await get_name("Parliaments", survey.Parliament_ID)

    for (const element of Object.entries(results)) { // ensures the await request is fulfilled until pushing?
        let party_name = await get_party_name(element[0]);
        let party_color = await party_colors[party_name]; // why the fuck does it show an error it literally works fuck ts
        x_array.push(party_name);
        y_array.push(element[1]);
        color_array.push(party_color);
    }
    console.log(x_array, y_array, color_array);
    generate_pie_graph(x_array, y_array, color_array, title);
}

async function return_coalition_names(coalitions: Array<[string, number]>[]) {
    for (let i = 0; i < coalitions.length; i++) {
        let current_coalition = coalitions[i][0];
        const name = await get_party_name(current_coalition[0]);
        current_coalition[0] = name;
    }
    return coalitions;
}

let survey = await extract_info();
if (survey) {
    parse_results(survey);
    let coalitions = return_coalitions(survey.Results);
    let coalition_full_names = await return_coalition_names(coalitions)
    display_coalitions(coalition_full_names);
}