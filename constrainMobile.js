//constraints for desktop browser 
var desktopConstraints = {

    video: {
        mandatory: {
            maxWidth: 800,
            maxHeight: 600
        }
    },

    audio: true
};

//constraints for mobile browser 
var mobileConstraints = {

    video: {
        mandatory: {
            maxWidth: 480,
            maxHeight: 320,
        }
    },

    audio: true
}

//if a user is using a mobile browser 
if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    var constraints = mobileConstraints;
} else {
    var constraints = desktopConstraints;
}

function hasUserMedia() {
    //check if the browser supports the WebRTC 
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia);
}

if (hasUserMedia()) {

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    //enabling video and audio channels 
    navigator.getUserMedia(constraints, function (stream) {
        var video = document.querySelector('video');

        //inserting our stream to the video tag     
        video.srcObject = stream;
        var newStream = new MediaStream(stream);

    }, function (err) { });
} else {
    alert("WebRTC is not supported");
}