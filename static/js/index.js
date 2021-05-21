function getImage() {
	var imageField = document.getElementById("imageField");
	var mainText = document.getElementById("mainText");
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
	var imageField = document.getElementById("imageField");
	var mainText = document.getElementById("mainText");
	var predField = document.getElementById("prodSmi");
	$.getJSON(
		'/predict', 
		{ post: mainText.value }, 
		function(data) {
			var pred = data.prediction;
			var pred_img = data.reaction;
			imageField.innerHTML = pred_img;
			predField.innerHTML = `<br />Predicted Reaction: <br /> ${pred}`;
		} 
	)
};
