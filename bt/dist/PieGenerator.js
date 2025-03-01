var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function generate_pie_graph(x_array, y_array, color_array, title) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(title);
        const layout = {
            autosize: true, // Automatically adjust to the div size
            width: null,
            height: null,
            showlegend: false,
            title: {
                text: title,
                font: {
                    size: 28
                }
            },
        };
        const data = [
            {
                labels: x_array,
                values: y_array,
                hole: 0.4,
                type: "pie",
                textinfo: "label+percent",
                insidetextorientation: "tangential",
                marker: {
                    colors: color_array,
                    line: {
                        color: "white",
                        width: 8
                    }
                }
            }
        ];
        const config = {
            responsive: true,
            scrollZoom: true,
            displayModeBar: true,
        };
        window.Plotly.newPlot("pie", data, layout);
    });
}
