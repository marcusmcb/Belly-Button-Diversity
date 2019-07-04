// function to build sample meta data for selector
function buildMetadata(sample) {	
	let url = `/metadata/${sample}`;
	d3.json(url).then(function (sample) {		
		let sampleMetaData = d3.select("#sample-metadata");				
		sampleMetaData.html("");
		Object.entries(sample).forEach(function ([key, value]) {
			let row = sampleMetaData.append("p");
			row.text(`${key}: ${value}`);
		});
	})
};

// function to render visuals to html
function buildCharts(sample) {	
	let url = `/samples/${sample}`;
	d3.json(url).then(function (data) {		
		let xValues = data.otu_ids;
		let yValues = data.sample_values;
		let mSize = data.sample_values;
		let mColors = data.otu_ids;
		let tValues = data.otu_labels;

		let trace1 = {
			x: xValues,
			y: yValues,
			text: tValues,
			mode: 'markers',
			marker: {
				color: mColors,
				size: mSize
			}
		};

		var data = [trace1];

		let layout = {
			xaxis: { title: "OTU ID" },
		};

		Plotly.newPlot('bubble', data, layout);
		
		d3.json(url).then(function (data) {
			let pieValues = data.sample_values.slice(0, 10);
			let pieLabels = data.otu_ids.slice(0, 10);
			let pieHover = data.otu_labels.slice(0, 10);
			var data = [{
				values: pieValues,
				labels: pieLabels,
				hovertext: pieHover,
				type: 'pie'
			}];
			Plotly.newPlot('pie', data);
		});
	});
}

// function for sample selector
function init() {	
	let selector = d3.select("#selDataset");	
	d3.json("/names").then((sampleNames) => {
		sampleNames.forEach((sample) => {
			selector
				.append("option")
				.text(sample)
				.property("value", sample);
		});
		
		const firstSample = sampleNames[0];
		buildCharts(firstSample);
		buildMetadata(firstSample);
	});
}

function optionChanged(newSample) {	
	buildCharts(newSample);
	buildMetadata(newSample);
}

// calls init function above
init();