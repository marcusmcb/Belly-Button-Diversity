// function to build metadata to use in visuals
function buildMetadata(sample) {
	let url = `/metadata/$(sample)`;
	d3.json(url).then(function (sample) {
		let sampleMetadata = d3.select("#sample-metadata");
		sampleMetadata.html("");
		Object.entries(sample).forEach(([key, value]) => {
			let row = sampleMetadata.append("p");
			row.text(`${key}: ${value}`)
		})
	})
}

// function to build pie graph
function buildCharts(sample) {
	let url = `/samples/${sample}`
	d3.json(url).then(data => {
		let xValues = data.otu_ids;
		let yValues = data.sample_values;
		let mSize = data.sample_values;
		let mColors = data.otu_ids;
		let tValues = data.otu_labels;

		let trace1 = {
			x: xValues,
			y: yValues,
			text: tValues,
			marker: {
				color: mColors,
				size: mSize
			}
		};

		let traceData = [trace1]

		let layout = {
			xaxis: { title: "OTU ID" }
		};

		Plotly.newPlot('bubble', traceData, layout);

		d3.json(url).then(function (data) {
			let pieValues = data.sample_values.slice(0, 10);
			let pieLabels = data.otu_ids.slice(0, 10);
			let pieHover = data.otu_labels.slice(0, 10);
			let pieData = [{
				values: pieValues,
				labels: pieLabels,
				hovertext: pieHover,
				type: 'pie'
			}];
			Plotly.newPlot('pie', pieData)
		});
	});
}

// init function to select data set
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

// re-renders visuals based on data set selected
function optionChanged(newSample) {	
	buildCharts(newSample);
	buildMetadata(newSample);
}

// calls init function
init();
