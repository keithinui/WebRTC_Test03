var textPR = document.getElementById('textPR');
var localSendText = document.getElementById('js-local-text');
var batteryLevel;
var heartRateData;
var dataSend = [200];   // Data to send
var timer1;							// Interval timer

textPR.addEventListener('click', function() {
  textPR.textContent = '..';
  heartRates = [];
  heartRateSensor.connect()
  .then(() => heartRateSensor.startNotificationsHeartRateMeasurement().then(handleHeartRateMeasurement))
  .catch(error => {
    const messages = document.getElementById('js-messages');
    messages.textContent = error;
  });
});

function handleHeartRateMeasurement(heartRateMeasurement) {
  heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
    var heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value);
    heartRateData = heartRateMeasurement.heartRate;
    textPR.innerHTML = heartRateData;

    heartRateSensor.getBatteryLevel();
    statusBatteryLavel.textContent = batteryLevel;

    dataSend[0] = heartRateData;
    dataSend[1] = batteryLevel;
  });
}

function transmitData() {
    if(peer.open){
        room.send(dataSend);
    }
    // dataSend.push(heartRateMeasurement.heartRate);
}

window.onload = function () {
  // Call the function, hyoji() in 500ms period
  timer1 = setInterval("transmitData()", 500);
}
