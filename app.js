var textPR = document.getElementById('textPR');
var localSendText = document.getElementById('js-local-text');
var batteryLevel;
var heartRateData;
var dataSendParameters = [20];    // Parameter Data to send
var dataSendWaveformes = [200];   // Waveforme Data to send
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
    
    // Set parameters (Heart rate and Battery Level)
    heartRateData = heartRateMeasurement.heartRate;
    textPR.innerHTML = heartRateData;

    heartRateSensor.getBatteryLevel();
    statusBatteryLavel.textContent = batteryLevel;

    // Send array data
    dataSendParameters[0] = heartRateData;
    dataSendParameters[1] = batteryLevel;
    if(peer.open){
      room.send(dataSendParameters);
    }
  });
}

function transmitData() {
  if(youJoyned == 1 && peer.open){
    
    console.log('Interval timer!!!!!");
    
    dataSendWaveformes.push(heartRateMeasurement.heartRate);
    room.send(dataSendWaveformes);
  }
}

window.onload = function () {
  // Call the function, interval timer function in 200ms period
  timer1 = setInterval("transmitData()", 200);
}
