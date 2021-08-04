var liveNowClass = "badge-style-type-live-now"
var setReminderButtonClass = "ytd-toggle-button-renderer"
var setReminderText = "Set reminder"


var videoElementTag = "ytd-item-section-renderer"

function purge(videoList, settings){
	var videos = videoList.getElementsByTagName(videoElementTag)

	for (const currentVideo of videos) {
		handleVideo(currentVideo, settings)
	}
}

function handleVideo(video, settings){
	if(shouldPurgeVideo(video, settings)){
		video.remove()
		console.log("Removed video: ")
		console.log(video)
	} else {
		console.log("Kept video")
	}
}

function shouldPurgeVideo(video, settings){
	// If a video is "live now"
	if(settings.globalFilters.currentlyLive && isLiveVideo(video)){
		return true
	} 

	// If the video is "Premiering"
	if(settings.globalFilters.premiering && isPremieringVideo(video)){
		return true
	} 
	
	// If the video has a "Set reminder"
	if(settings.globalFilters.setReminder && isSetReminder(video)){
		return true
	} 

	if(isSpecificVideo(video, settings.specificFilters)){
		return true
	} 

	return false
}

function isLiveVideo(currentVideo){
	return currentVideo.getElementsByClassName(liveNowClass).length >= 1
}

function isPremieringVideo(currentVideo){
	return false
}

function isSetReminder(currentVideo){
	var possibleButtons = currentVideo.getElementsByClassName(setReminderButtonClass)
	for (const button of possibleButtons) {
		if (button.textContent.includes(setReminderText)) {
			return true
		}
	}
	return false
}

function isSpecificVideo(currentVideo, specificFilters){
	var videoTitle = currentVideo.getElementsByClassName("title-and-badge")[0].innerText
	var videoAuthor = currentVideo.getElementsByTagName("ytd-channel-name")[0].innerText
	for (const filter of specificFilters) {
		var specificChannel = filter.channelFilterType.includes("specific")
		if(specificChannel){
			if(filter.channelFilterType.includes("Not")){
				return videoAuthor == filter.channelName && !videoTitle.includes(filter.filterText)
			} else {
				return videoAuthor == filter.channelName && videoTitle.includes(filter.filterText)
			}

		} else {
			return videoTitle.includes(filter.filterText)
		}
	}
	return false
}

function getListNode(){
	var videoListTag = "ytd-section-list-renderer"
	return document.getElementsByTagName(videoListTag)[0].childNodes[3]
}

function startPurge(){
	chrome.storage.sync.get(['specificFilters', 'globalFilters'], function(settings){
		// Select the node that will be observed for mutations
		const targetNode = getListNode()

		// Purge existing nodes
		purge(targetNode, settings)

		// Add an observer for the rest
		createObserver(targetNode, settings)
	});
}

function createObserver(targetNode, settings){

	// Options for the observer (which mutations to observe)
	const config = { childList: true }

	// Callback function to execute when mutations are observed
	const callback = function(mutationsList, observer) {
		// Use traditional 'for loops' for IE 11
		for(const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				for(const currentVideo of mutation.addedNodes) {
					handleVideo(currentVideo, settings)
				}
			}
		}
	};

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);
}

