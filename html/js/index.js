
function addRow(isChecked, url, onTop){
	var table = document.getElementById("table");
	
	if(onTop){
		var row = table.insertRow(1);
	}else{
		var row = table.insertRow(table.rows.length);
	}
	
	
	var checkCell = row.insertCell(0);
	var urlCell = row.insertCell(1);
	var removeCell = row.insertCell(2);
	
	checkCell.innerHTML = "<input type=\"checkbox\" id=\"isExactBox\">";
	urlCell.innerHTML = url;
	urlCell.setAttribute( "contenteditable", "true" )
	removeCell.innerHTML = "<span class=\"table-remove glyphicon glyphicon-remove\"></span>";
	removeCell.childNodes[0].onclick = function() { removeRow(this) };
	checkCell.childNodes[0].checked = isChecked;
}

function removeRow(elem){
	elem.parentNode.parentNode.remove();
}

function exportData(){
	var table = document.getElementById("table");
	
	var chunks = {};
	var numberOfChunks = 0;
	var currentChunk = [];
	var values = [];
	for (var i = 1, row; row = table.rows[i]; i++) {
		var isExactBox = row.cells[0].childNodes[0].checked;
		var urlText = row.cells[1].innerText;
		var currentRow = {};
		currentRow["e"] = isExactBox ? "t" : "f";
		currentRow["u"] = urlText;
		values.push({'e': isExactBox, 'u': urlText});
		if(JSON.stringify(currentChunk).length + JSON.stringify(currentRow).length > 100){
			chunks[numberOfChunks] = currentChunk;
			currentChunk = [];
			numberOfChunks++;
		}
		currentChunk.push(currentRow);
	}
	if(currentChunk.length != 0){
		chunks[numberOfChunks] = currentChunk;
	}
	chunks["number"] = numberOfChunks + 1;
	
	if(numberOfChunks > 500 || JSON.stringify(chunks).length > 100000){
		tooBig();
		return;
	}
	
	chrome.storage.sync.clear();
	chrome.storage.sync.set(chunks);
	
	chrome.storage.local.clear();
	chrome.storage.local.set({'vals':values});
}

function tooBig(){
	document.getElementById("export").innerHTML = "Sorry, you have exceeded the amount of space that chrome can store in the cloud, please remove some entries.";
}

function refresh(){
	chrome.storage.sync.get(['number'], function(numResult){
		if(numResult.number == 0){
			return;
		}
		console.log(numResult.number);
		var keys = [];
		for(var i = 0; i <= numResult.number - 1; i++){
			keys.push(""+i);
		}
		
		chrome.storage.sync.get(keys, function(result){
			var values = [];
			for(var i = 0; i <= numResult.number - 1; i++){
				result[i].forEach(function(e){
					addRow(e.e=="t", e.u, false)
					values.push({'e': e.e=="t", 'u': e.u});
					console.log(e);
				});
			}
			
			chrome.storage.local.clear();
			chrome.storage.local.set({'vals':values});
			
		});
	});
}

document.getElementById("addRowID").onclick = function() { addRow(false, "Edit Me", true) };
document.getElementById("exportDataID").onclick = exportData;

refresh();