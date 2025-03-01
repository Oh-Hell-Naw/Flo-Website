import { 
    JSONdata,
    Survey,
    get_recent_survey, 
    get_name,
    load_survey,
} from "./MainAgent.js";

async function setup_options() {
    const json = JSONdata;
    const parliaments = json['Parliaments'];
    const menu = document.querySelector(".dropdown-select");
    console.log(typeof parliaments);

    for (const parliament of Object.values(parliaments as any)) {
        console.log(menu, parliament);
        if (menu && parliament) {
            const option = document.createElement("option");
            option.value = parliament['Name']; // in py: parliament['Shortcut'][:2]
            option.classList.add("parliament-option");
            option.innerHTML = parliament['Name'];
            menu.appendChild(option);
        }
    }
    const survey = await get_recent_survey();
    if (survey && menu) {
        const parliament_name = parliaments[survey.Parliament_ID]['Name'];
        // const parliament_substring = parliament_name?.substring(0, 4) || "";

        if (menu) {
            (menu as HTMLSelectElement).value = parliament_name;
        }
    }
}

async function get_specifc_survey(parliament: string) {
    const json = JSONdata;
    const surveys_object = json['Surveys'];
    const surveys = Object.values(surveys_object).reverse();
    console.log(typeof surveys);

    for (const survey in surveys as Survey[]) {
        const name = await get_name("Parliaments", surveys[survey].Parliament_ID);
        if (name == parliament) {
            return surveys[survey] as Survey;
        }
    }
}

async function select_parliament() {
    const element = document.querySelector(".dropdown-select") as HTMLSelectElement | null;
    if (element) {
        const value = element.value;
        const survey = await get_specifc_survey(value);
        if (survey) { load_survey(survey); }
    } else {
        console.warn("Element not found");
    }
}

setup_options();
(window as any).select_parliament = select_parliament; // sets select_parliament to global scope in document