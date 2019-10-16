var textPR = document.getElementById('textPR');
var localSendText = document.getElementById('js-local-text');

textPR.addEventListener('click', function() {
  textPR.textContent = '..';
  heartRates = [];
  heartRateSensor.connect()
  .then(() => heartRateSensor.startNotificationsHeartRateMeasurement().then(handleHeartRateMeasurement))
  .catch(error => {
    textPR.textContent = error;
  });
});

function handleHeartRateMeasurement(heartRateMeasurement) {
  heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
    var heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value);
    textPR.innerHTML = heartRateMeasurement.heartRate;

    room.send(textPR.innerHTML);

    heartRates.push(heartRateMeasurement.heartRate);
  });
}

var heartRates = [];
