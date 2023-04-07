function init(currID) {

    //Use the D3 library to read in samples.json from the URL
    
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
    
    // Fetch the JSON data
    d3.json(url).then(function(data) {
        let names = data.names;
        let samples = data.samples;
        let metadata = data.metadata;
    
        
    
    
    names = Object.values(names);
    
        // Populate the dropdown from the list/array
        selector = d3.select("#selDataset");
    
        for (let i = 0; i < names.length; i++){
            selector.append("option").text(names[i]).property("value", names[i]);
        }
    
    
    
    myUser = samples.filter(sample => sample.id == currID)[0];
    
    //Get all values for a single ID
    let selectedUserSampleValues = myUser.sample_values;
    let selectedUserOTUIDs = myUser.otu_ids;
    let selectedUserOTULabels = myUser.otu_labels;
    
    //Get the top 10 for each and reverse for display
    topSampleValues = selectedUserSampleValues.slice(0,10).reverse();
    topOTUIDs = selectedUserOTUIDs.slice(0,10).reverse();
    topOTULabels = selectedUserOTULabels.slice(0,10).reverse();
    
    //Format OTU IDs
    let formattedOTUIDs = topOTUIDs.map(formattedOTU => `OTU ${formattedOTU}`);
    
    //console.log(topSampleValues);
    //console.log(topOTUIDs);
    //console.log(topOTULabels);
    
    //Output the bar graph
    
    let trace1 = {
        x: topSampleValues,
        y: formattedOTUIDs,
        text: topOTULabels,
        type: "bar",
        orientation: "h",
        marker: {
            color: 'rgba(255, 192, 92,1)',
            width: 1
          }
    }
    let OTUData = [trace1]
    
    // Setup layout
    let layout = {
      title: "Top 10 OTUs"
    };
    
    Plotly.newPlot("bar", OTUData, layout);
    
    
    
    
    //console.log(selectedUserSampleValues)
    
    //Output the bubble graph
    
    let trace2 = {
        x: selectedUserOTUIDs,
        y: selectedUserSampleValues,
        text: selectedUserOTULabels,
        mode: "markers",
        marker:{
        size: selectedUserSampleValues,
        color: selectedUserOTUIDs,
        colorscale: 'Blackbody'
        }
    }
    
    let SampleData = [trace2]
    
    // Setup layout
    let layout2 = {
      title: "OTU IDs"
    };
    
    Plotly.newPlot("bubble", SampleData, layout2);
    
    
    
    //Filter the person's metadata
    myUser2 = metadata.filter(md => md.id == currID)[0];
    
    // Set a variable for the demograhic info box
    let demoInfo = d3.select("#sample-metadata");
    
    //Clear data in the demographic info box
    demoInfo.text("");
    
    //Display demographic info
    Object.entries(myUser2).forEach(
        ([key, value]) => demoInfo.append("p").html(`<b>${key}:</b> ${value}<hr/>`));
    
    
    
    
    let gaugeData = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            value: myUser2.wfreq,
            title: { text: "Belly Button Wash Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 10] },
                bar: {color: 'rgba(255, 192, 92,1)'}
            }
        }
    ];
    
    
    Plotly.newPlot('gauge', gaugeData);
    
    //console.log(myUser2.wfreq)
    
    });
    }
    
    //Set an ID so the charts will populate initially
    let currID = 940;
    init(currID)
    
    
    
    function optionChanged(){
        let menu = d3.select("#selDataset");
        let currID = menu.property("value");
        console.log(currID);
    
        init(currID);
    };
    
    d3.selectAll("#selDataset").on("change", optionChanged);