var liveNowClass = "badge-style-type-live-now"
var setReminderButtonClass = "ytd-toggle-button-renderer"
var setReminderText = "Set reminder"

var videoListTag = "ytd-section-list-renderer"
var videoElementTag = "ytd-item-section-renderer"

function purge(){

	

	var videoList = document.getElementsByTagName(videoListTag)[0]
	var videos = videoList.getElementsByTagName(videoElementTag)

	var videosToRemove = []

	console.log("Number of videos: " + videos.length)

	mainLoop:
	for (const currentVideo of videos) {

		// If a video is "live now"
		if(currentVideo.getElementsByClassName(liveNowClass).length >= 1){
			videosToRemove.push(currentVideo)
			continue mainLoop
		} 
		
		// If the video has a "Set reminder"
		var possibleButtons = currentVideo.getElementsByClassName(setReminderButtonClass)
		for (const button of possibleButtons) {
			if (button.textContent.includes(setReminderText)) {
				videosToRemove.push(currentVideo)
				continue mainLoop
			}
		}
	}

	// Remove the videos we found in the scan
	for (const clutter of videosToRemove) {
		clutter.remove()
	}
}

function waitForVideoList(){
	console.log("STARTING PURGE")
	setTimeout(purge, 2000);
}

waitForVideoList()

