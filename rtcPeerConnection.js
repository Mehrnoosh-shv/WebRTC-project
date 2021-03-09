var connection = new WebSocket('ws://localhost:9090');
var name = "";

var loginInput = document.querySelector('#loginInput');
var loginBtn = document.querySelector('#loginBtn');
var otherUsernameInput = document.querySelector('#otherUsernameInput');
var connectToOtherUsernameBtn = document.querySelector('#connectToOtherUsernameBtn');
var connectedUser, myConnection; //undefined

//when a user clicks the login button 
loginBtn.addEventListener("click", function (event) {
   name = loginInput.value;

   if (name.length > 0) {
      send({
         type: "login",
         name: name
      });
   }

});

//handle messages from the server 
connection.onmessage = function (message) {
   console.log("Got message", message.data);
   // JSON.parse is a string like {"login":"login"} and convert it to JSON (javascript object)
   var data = JSON.parse(message.data);

   // use switch for onmessage because we have type and to know, what to do for each type
   switch (data.type) {
      case "login":
         onLogin(data.success);
         break;
      case "offer":
         onOffer(data.offer, data.name);
         break;
      case "answer":
         onAnswer(data.answer);
         break;
      case "candidate":
         onCandidate(data.candidate);
         break;
      default:
         break;
   }
};

//when a user logs in 
function onLogin(success) {

   if (success === false) {
      alert("oops...try a different username");
   } else {
      //creating our RTCPeerConnection object 

      var configuration = {
         "iceServers": [{ "url": "stun:stun.1.google.com:19302" }]
      };

      myConnection = new webkitRTCPeerConnection(configuration);
      console.log("RTCPeerConnection object was created");
      console.log(myConnection);

      //setup ice handling
      //when the browser finds an ice candidate we send it to another peer 
      // object myconnection has a method onicecandidate and if the event fires, it throws "event". then it goes to do the function.
      myConnection.onicecandidate = function (event) {

         if (event.candidate) {
            send({
               type: "candidate",
               candidate: event.candidate
            });
         }
      };
   }
};

connection.onopen = function () {
   console.log("Connected");
};

connection.onerror = function (err) {
   console.log("Got error", err);
};

// Alias for sending messages in JSON format 
function send(message) {

   if (connectedUser) {
      message.name = connectedUser;
   }

   connection.send(JSON.stringify(message));
};





//setup a peer connection with another user 
connectToOtherUsernameBtn.addEventListener("click", function () {

   var otherUsername = otherUsernameInput.value;
   connectedUser = otherUsername;

   if (otherUsername.length > 0) {
      //make an offer 
      myConnection.createOffer(function (offer) {
         console.log();
         send({
            type: "offer",
            offer: offer
         });

         myConnection.setLocalDescription(offer);
      }, function (error) {
         alert("An error has occurred.");
      });
   }
});


//when somebody wants to call us 
function onOffer(offer, name) {    //name is the name of user in text box you gave in browser
   connectedUser = name;
   myConnection.setRemoteDescription(new RTCSessionDescription(offer));
//Keep in mind that "setRemoteDescription()" is called while a connection is already in place.
   myConnection.createAnswer(function (answer) {
      myConnection.setLocalDescription(answer);
// send() : sends data across the data channel to the remote peer
      send({
         type: "answer",
         answer: answer
      });

   }, function (error) {
      alert("oops...error");
   });
}


//when another user answers to our offer 
function onAnswer(answer) {
   myConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

//when we got ice candidate from another user 
function onCandidate(candidate) {
   myConnection.addIceCandidate(new RTCIceCandidate(candidate));
}