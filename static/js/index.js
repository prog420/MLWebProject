var imageField = document.getElementById("imageField");
var mainText = document.getElementById("mainText");
var predField = document.getElementById("prodSmi");
var beamSizeValue = document.getElementById("beamSizeValue");
var langValue = document.getElementById("selectLang");

var selectLang = document.getElementById("selectLang");
var languages = ["ru", "en", "fr", "de"];
for (var i = 0; i < languages.length; i++) {
	var opt = languages[i];
	var elem = document.createElement("option");
	elem.textContent = opt.toUpperCase();
	elem.value = opt;
	selectLang.appendChild(elem);
}

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
	// Get Prediction (Algorithmia pipeline)
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
		{ post: mainText.value ,
		  lang: langValue.value }, 
		function(data) {
			var response = data.smiles;
			var image = data.img; 
			mainText.value = response;
			imageField.innerHTML = image;
		} 
	)
};
