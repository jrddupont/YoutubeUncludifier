
var dropdownHTML = `
<select class="filtertype">
	<option value="any">Any Channel Contains:</option>
	<option value="specificContains">does contain:</option>
	<option value="specificNotContains">does not contain:</option>
</select>
`

var dropDownUpdate = function(dropDownElem){
	var channelNameText = dropDownElem.parentNode.getElementsByClassName("channelNameTextBox")[0]
	if(dropDownElem.childNodes[1].value.includes("specific")){
		if(channelNameText.innerHTML == "n/a"){
			channelNameText.innerHTML = "Edit Me"
		}
		channelNameText.setAttribute( "contenteditable", "true" )
	} else {
		channelNameText.innerHTML = "n/a"
		channelNameText.setAttribute( "contenteditable", "false" )
	}
}

function addRow(channelName, channelFilterType, filter, onTop){
	var table = document.getElementById("table");
	
	if(onTop){
		var row = table.insertRow(1);
	}else{
		var row = table.insertRow(table.rows.length);
	}
	
	var channelNameText = row.insertCell(0);
	var channelFilterTypeDropdown = row.insertCell(1);
	var filterText = row.insertCell(2);
	var removeCell = row.insertCell(3);

	var specificChannel = channelFilterType.includes("specific")

	channelNameText.classList.add("channelNameTextBox")
	if(specificChannel){
		channelNameText.innerHTML = channelName
		channelNameText.setAttribute( "contenteditable", "true" )
	} else {
		channelNameText.innerHTML = "n/a"
		channelNameText.setAttribute( "contenteditable", "false" )
	}

	channelFilterTypeDropdown.innerHTML = dropdownHTML
	if(specificChannel){
		channelFilterTypeDropdown.childNodes[1].value = channelFilterType;
	} else {
		channelFilterTypeDropdown.childNodes[1].value = "any";
	}

	channelFilterTypeDropdown.onchange = function(){dropDownUpdate(this)}

	filterText.innerHTML = filter;
	filterText.setAttribute( "contenteditable", "true" )

	removeCell.innerHTML = "<span class=\"table-remove glyphicon glyphicon-remove\"></span>";
	removeCell.childNodes[0].onclick = function() { removeRow(this) };
}

function removeRow(elem){
	elem.parentNode.parentNode.remove();
}

function exportData(){
	var table = document.getElementById("table");

	var saveData = {}

	saveData["globalFilters"] = {
		"currentlyLive": document.getElementById("currentlyLive").checked,
		"premiering": document.getElementById("premiering").checked,
		"setReminder": document.getElementById("setReminder").checked
	}

	var specificFilters = []
	for (var i = 1, row; row = table.rows[i]; i++) {
		var channelName = row.cells[0].innerText
		var channelFilterType = row.cells[1].childNodes[1].value
		var filterText = row.cells[2].innerText

		if(!channelFilterType.includes("specific")){
			channelName = ""
		}

		specificFilters.push({
			"channelName": channelName,
			"channelFilterType": channelFilterType,
			"filterText": filterText
		})
	}

	saveData["specificFilters"] = specificFilters

	chrome.storage.sync.set(saveData);

	// Display a little text element that shows that the save worked
	var noticeElement = document.getElementById("export")
	noticeElement.innerHTML = "Data saved!"
	noticeElement.style.transitionDuration = '0s'
	noticeElement.style.opacity = '1'

	setTimeout(function(){
		noticeElement.style.transitionDuration = '1s'
		noticeElement.style.opacity = '0'
	}, 500);
}

function refresh(){
	chrome.storage.sync.get(['specificFilters', 'globalFilters'], function(data){
		for (const row of data.specificFilters) {
			addRow(row.channelName, row.channelFilterType, row.filterText, false)
		}

		document.getElementById("currentlyLive").checked = data.globalFilters.currentlyLive
		document.getElementById("premiering").checked = data.globalFilters.premiering
		document.getElementById("setReminder").checked = data.globalFilters.setReminder
	});
}

document.getElementById("addRowID").onclick = function() { addRow("", "default", "Edit Me", true) };
document.getElementById("exportDataID").onclick = exportData;

refresh();