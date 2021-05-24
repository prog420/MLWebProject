var imageField = document.getElementById("imageField");
var mainText = document.getElementById("mainText");
var predField = document.getElementById("prodSmi");
var beamSizeValue = document.getElementById("beamSizeValue");
var modelValue = document.getElementById("modelValue");
var langValue = document.getElementById("selectLang");

var decomposedCGRText = document.getElementById("decomposedCGR");
var cgrReact = document.getElementById("cgrReact");
var cgrArrow = document.getElementById('cgrArrow');
var cgrProd= document.getElementById("cgrProd");

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
			var descriptions = data.decomposed_smiles;
			var svg_list = data.decomposed_svg;
			if (typeof data.decomposed_smiles !== 'undefined') {
				fillCGRObjects(descriptions, svg_list);
			} else {
				hideCGRObjects();
			}
			imageField.innerHTML = response;
		} 
	)
};

function getPrediction() {
	// Get Prediction (Algorithmia pipeline)
	$.getJSON(
		'/predict', 
		{ post: mainText.value,
		  beamSize: beamSizeValue.value ,
		  model: modelValue.value }, 
		function(data) {
			var pred = data.prediction;
			var pred_img = data.reaction;
			var descriptions = data.decomposed_smiles;
			var svg_list = data.decomposed_svg;
			imageField.innerHTML = pred_img;
			predField.innerHTML = `<br /><b>Predicted Reaction:</b><br /> ${pred}`;
			if (modelValue.value == "cgr") {
				fillCGRObjects(descriptions, svg_list);
			} else {
				hideCGRObjects();
			}
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

function fillCGRObjects(smiles_array, svg_array) {
	decomposedCGRText.style.visibility = "visible";
	cgrReact.style.visibility = "visible";
	cgrArrow.style.visibility = "visible";
	cgrProd.style.visibility = "visible";
	decomposedCGRText.innerHTML = `<b>Decomposed CGR<br />Reactants:</b><br />
									${smiles_array[0]}<br /><b>Products:</b><br />${smiles_array[1]}`;
	cgrReact.innerHTML = svg_array[0];
	cgrArrow.data = "./static/resources/arrow.svg";
	cgrProd.innerHTML = svg_array[1];
}

function hideCGRObjects() {
	decomposedCGRText.style.visibility = "hidden";
	cgrReact.style.visibility = "hidden";
	cgrArrow.style.visibility = "hidden";
	cgrProd.style.visibility = "hidden";
	decomposedCGRText.innerHTML = "";
	cgrReact.innerHTML = "";
	cgrArrow.data = "";
	cgrProd.innerHTML = "";
}
