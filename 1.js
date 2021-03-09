var conn = new RTCPeerConnection(conf); 

conn.onaddstream = function(stream) { 
    //onaddstream event is fired when the remote user adds a video or audio stream to their peer connection.
   
    // use stream here 
}; 