// 
var config = {
  apiKey: "AIzaSyDvJhkHKApk5zPtLkdBNdvVEkjlI58r4FM",
  authDomain: "train-schedule-sck.firebaseapp.com",
  databaseURL: "https://train-schedule-sck.firebaseio.com",
  projectId: "train-schedule-sck",
  storageBucket: "train-schedule-sck.appspot.com",
  messagingSenderId: "148626247117"
};

firebase.initializeApp(config);

var database = firebase.database();

// 
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-input").val().trim();
  var trainRole = $("#destination-input").val().trim();
  var trainStart = $("#time-input").val().trim();
  var trainRate = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    role: trainRole,
    start: trainStart,
    rate: trainRate
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.role);
  console.log(newTrain.start);
  console.log(newTrain.rate);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

// 
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainRole = childSnapshot.val().role;
  var trainStart = childSnapshot.val().start;
  var trainRate = childSnapshot.val().rate;

  // Train Info
  console.log(trainName);
  console.log(trainRole);
  console.log(trainStart);
  console.log(trainRate);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var trainStartPretty = moment(trainStart, "hh:mm").subtract(1, "years");
  console.log(trainStartPretty);

  // Current Time
  var currentTime = new moment().format("HH:mm");
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(trainStartPretty), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % trainRate;
  console.log(tRemainder);

  // Minute(s) Until Train
  var tMinutesTillTrain = trainRate - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

  var catchTrain = moment(nextTrain).format("HH:mm");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainRole),
    $("<td>").text(trainRate),
    $("<td>").text(catchTrain),
    $("<td>").text(tMinutesTillTrain)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);

});