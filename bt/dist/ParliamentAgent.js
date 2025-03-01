var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JSONdata, get_recent_survey, get_name, load_survey, } from "./MainAgent.js";
function setup_options() {
    return __awaiter(this, void 0, void 0, function* () {
        const json = JSONdata;
        const parliaments = json['Parliaments'];
        const menu = document.querySelector(".dropdown-select");
        console.log(typeof parliaments);
        for (const parliament of Object.values(parliaments)) {
            console.log(menu, parliament);
            if (menu && parliament) {
                const option = document.createElement("option");
                option.value = parliament['Name']; // in py: parliament['Shortcut'][:2]
                option.classList.add("parliament-option");
                option.innerHTML = parliament['Name'];
                menu.appendChild(option);
            }
        }
        const survey = yield get_recent_survey();
        if (survey && menu) {
            const parliament_name = parliaments[survey.Parliament_ID]['Name'];
            // const parliament_substring = parliament_name?.substring(0, 4) || "";
            if (menu) {
                menu.value = parliament_name;
            }
        }
    });
}
function get_specifc_survey(parliament) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = JSONdata;
        const surveys_object = json['Surveys'];
        const surveys = Object.values(surveys_object).reverse();
        console.log(typeof surveys);
        for (const survey in surveys) {
            const name = yield get_name("Parliaments", surveys[survey].Parliament_ID);
            if (name == parliament) {
                return surveys[survey];
            }
        }
    });
}
function select_parliament() {
    return __awaiter(this, void 0, void 0, function* () {
        const element = document.querySelector(".dropdown-select");
        if (element) {
            const value = element.value;
            const survey = yield get_specifc_survey(value);
            if (survey) {
                load_survey(survey);
            }
        }
        else {
            console.warn("Element not found");
        }
    });
}
setup_options();
window.select_parliament = select_parliament; // sets select_parliament to global scope in document
