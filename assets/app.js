var currentTime = moment()
console.log("Before ready-CURRENT DATE: " + moment(currentTime).format("MMMM do YYYY, h:mm:ss A"))
$(document).ready(function () {
console.log("BEGIN-CURRENT DATE: " + moment().format("MMMM do YYYY, h:mm:ss A"))

    var trainName = "";
    var trainDestination = "";
    var timeInput = "";
    var trainFrequency = "";


    // Initialize Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyDPQEpO12pkTZHJN0p7Rz8hCiOQ9GPmfII",
        authDomain: "train-schedule-bb0ce.firebaseapp.com",
        databaseURL: "https://train-schedule-bb0ce.firebaseio.com",
        projectId: "train-schedule-bb0ce",
        storageBucket: "",
        messagingSenderId: "585358703458",
        appId: "1:585358703458:web:c5342d065d7901e2"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);

      var database = firebase.database();

      function timeClock () {
        var time = "2019-07-17T09:30:29Z"
        
        $(".currentTime").html(moment(time).startOf("hour").fromNow());
        $(".scurrentTime").html(moment().format("H:mm:ss a"));
    }

    setInterval(timeClock, 1000);


    database.ref().on("child_added", function (snapshot) {
        trainName = snapshot.val().trainName;
        trainDestination = snapshot.val().trainDestination;
        timeInput = snapshot.val().timeInput;
        trainFrequency = snapshot.val().trainFrequency;
       
        // var minutesAway = snapshot.val().minutesAway;
        // var nextArrival = snapshot.val().nextArrival;
        console.log(snapshot.val())

        var timeConverted = moment(timeInput, "hh:mm").subtract("1,years");
        console.log("Time converted: " + timeConverted)
        var currentTime = moment();
        console.log("Military time(now):  " + currentTime.format("hh:mm"));

        var diffTime = currentTime.diff(moment(timeConverted), "minutes");
        console.log("Time now " + currentTime)
        console.log("diffTime: " + diffTime)

        var trainRemainder = diffTime % trainFrequency;
        console.log("trainRemainder: " + trainRemainder)

        var minutesAway = trainFrequency - trainRemainder;
        console.log("Minutes away: " + minutesAway)

        var nextArrival = moment().add(minutesAway, "minutes").format("dddd, MMM Do, hh:mm a");
        console.log("nextTrain: " + nextArrival)

        $("#trainInfo").append(
            "<tr><td>" + trainName + "</td>" +
            "<td>" + trainDestination + "</td>" +
            "<td>" + trainFrequency + "</td>" +
            "<td>" + nextArrival + "</td>" +
            "<td>" + minutesAway + "</td></tr>"
        )
    });



    $("#addTrain").on("click", function () {

        if(trainName == "" || trainDestination == "" || timeInput == "" || trainFrequency == "") {
            console.log("blank fields")
            alert("All fields must be entered! Please try again.")
            return;
        }


        trainName = $("#nameInput").val().trim();
        trainDestination = $("#destinationInput").val().trim();
        timeInput = $("#timeInput").val().trim();
        trainFrequency = $("#frequencyInput").val().trim();
        console.log("trainName: " + trainName, "trainDest: " + trainDestination, "timeInput: " + timeInput, "trainFreq: " + trainFrequency)
        console.log("CURRENT DATE: " + moment().format("MMMM do YYYY, hh:mm:ss A"))

        var newTrain = {
            trainName: trainName,
            trainDestination: trainDestination,
            timeInput: timeInput,
            trainFrequency: trainFrequency,
        }

        console.log(newTrain)
        database.ref().push(newTrain);
    })

    
    

});