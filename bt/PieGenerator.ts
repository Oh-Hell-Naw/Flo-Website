export async function generate_pie_graph(x_array: Array<string[]>, y_array: Array<string[]>, color_array: string[], title: string[]) {
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

    Plotly.newPlot("pie", data, layout);
}