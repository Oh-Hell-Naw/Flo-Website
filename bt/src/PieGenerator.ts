/**
 * Generates a pie graph with the given x- and y-array, array of colors and title
 * @param x_array array of names for the "x"-axis
 * @param y_array array of values for the "y"-axis
 * @param color_array array of names for the colors and their corresponding x-values
 * @param title title of the pie graph
 */
export async function generate_pie_graph(x_array: Array<string[]>, y_array: Array<string[]>, color_array: string[], title: string) {
    console.log(title);
    const layout = {
        autosize: true,  // Automatically adjust to the div size
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
            labels:x_array, 
            values:y_array, 
            hole: 0.4,
            type:"pie",
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
    }

    window.Plotly.newPlot("pie", data, layout);
}