document.onload = function () {
	// Initializing variables
    var imageField = document.getElementById("imageField");
	var mainText = document.getElementById("mainText");
	var beamSizeValue = document.getElementById("beamSizeValue");
};

function getImage() {
	// Get depiction of SMILES
	$.getJSON(
		'/image', 
		{ post: mainText.value }, 
		function(data) {
			var response = data.img; 
			imageField.innerHTML = response;
		} 
	)
};

function getPrediction() {
	var predField = document.getElementById("prodSmi");
	$.getJSON(
		'/predict', 
		{ post: mainText.value,
		  beamSize: beamSizeValue.value }, 
		function(data) {
			var pred = data.prediction;
			var pred_img = data.reaction;
			imageField.innerHTML = pred_img;
			predField.innerHTML = `<br />Predicted Reaction: <br /> ${pred}`;
			console.log(pred)
			console.log(pred_img)
		} 
	)
};

function getSMILES() {
	// Get SMILES string for names
	$.getJSON(
		'/smiles', 
		{ post: mainText.value }, 
		function(data) {
			var response = data.smiles;
			var image = data.img; 
			mainText.value = response;
			imageField.innerHTML = image;
		} 
	)
};
