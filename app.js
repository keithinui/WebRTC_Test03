var textPR = document.getElementById('textPR');
var localSendText = document.getElementById('js-local-text');
var batteryLevel;

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
    textPR.innerHTML = heartRateMeasurement.heartRate;

    heartRateSensor.getBatteryLevel();
    statusBatteryLavel.textContent = batteryLevel;

    if(peer.open){
        room.send(textPR.innerHTML);
    }

    heartRates.push(heartRateMeasurement.heartRate);
  });
}

var heartRates = [];
