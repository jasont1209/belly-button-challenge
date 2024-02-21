const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

d3.json(url).then(function(data) {
    console.log("data"),data
});

let dropdownMenu = d3.select("#selDataset");

//initialize

function init() {

    d3.json(url).then(function(alldata){

        let names = alldata.names;

        names.forEach(function(id){
            dropdownMenu.append("option").text(id).property("value");
        });

        //call functions for first sample
        datavalues(names[0]);
        metadata(names[0]);
    });
};

// function to change data to selected id
function optionChanged(selected_id){
    datavalues(selected_id);
    metadata(selected_id);
}

//function to get chart values
function datavalues(selected_id){

    d3.json(url).then(function(alldata){

        let samples = alldata.samples;
        let id = samples.filter(take => take.id == selected_id);

        let sample_values = id[0].sample_values;
        let otu_ids = id[0].otu_ids;
        let otu_labels = id[0].otu_labels;

        // console.log("Sample Values:",sample_values);
        // console.log('OTU IDs:', otu_ids);
        // console.log('OTU Labels:', otu_labels);


        hbarchart(sample_values, otu_ids, otu_labels);
        bubblechart(sample_values, otu_ids, otu_labels);
    });
};


//hbarchart build
function hbarchart(sample_values, otu_ids, otu_labels){
    d3.json(url).then(function(alldata){
        let bar_data = [{
            type: 'bar',
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels,
            orientation: "h"
        }];
        // console.log('X:', bar_data.x); 
        // console.log('Y:', bar_data.y); 
        let bar_layout = {
            title:"Bar Chart"
        };

        Plotly.newPlot('bar', bar_data, bar_layout)
    });  
};

//bubblechartbuild
function bubblechart(sample_values,otu_ids,otu_labels){
    d3.json(url).then(function(alldata){
    
        let bubble_data = [{
            x:otu_ids,
            y:sample_values,
            text:otu_labels,
            mode: "markers",
            marker:{
                size:sample_values,
                color:otu_ids,
                colorscale:"Earth",
            }
        }];
        
        let bubble_layout = {
            title: "Bubble Chart",
        };

        Plotly.newPlot("bubble", bubble_data, bubble_layout);

    });
};

//metadata
function metadata(selected_id){
    d3.json(url).then(function(alldata){
        
        let samples = alldata.metadata;
        
        let id = samples.filter(take => take.id == selected_id);
        
        let sample_metadata = d3.select("#sample-metadata").html("");

        Object.entries(id[0]).forEach(([key,value]) =>{
            sample_metadata.append("h5").text(`${key}: ${value}`);
        });
    });
};

init();



