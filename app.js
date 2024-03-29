var textPR = document.getElementById('textPR');
var localSendText = document.getElementById('js-local-text');
var heartRateData;                // 0. Heart rate data
var respRateData;                 // 1. Resp. rate data
var spo2 = 50;                    // 2. SpO" data
var batteryLevel;                 // 3. Battery Level
var dataSendParameters = [20];    // Parameter Data to send
var dataSendWaveformes = [0,0,0,0,0,0,0,0,0,10,0,0,0,0,0,0,0,0,0,20,0,0];   // Waveforme Data to send
var timer1;							          // Interval timer
var connectedBLE = 0;             // 0: BLE not connected,       1: BLE connected
var waveDisplayOn = 0;            // 0: Waveforme Display Off,   1: On

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
    
    // Set parameters (Heart rate and Battery Level) to the local side
    heartRateData = heartRateMeasurement.heartRate;
    textPR.innerHTML = heartRateData;

    heartRateSensor.getBatteryLevel();
    statusBatteryLavel.textContent = batteryLevel;
    
    statusSpo2.textContent = spo2;

    // Send array data to the remote side
    dataSendParameters[0] = heartRateData;
    dataSendParameters[1] = 0;
    dataSendParameters[2] = spo2;
    dataSendParameters[3] = batteryLevel;
    if(peer.open){
      room.send(dataSendParameters);
    }
    
    // BLE Connected
    connectedBLE = 1;
  });
}

function transmitData() {
  if(connectedBLE == 1 && youJoyned == 1 && peer.open){
    dataSendWaveformes.push(heartRateData);
    room.send(dataSendWaveformes);
    
    // SpO2 data increment for test purpose
    // spo2 = spo2 >= 99 ? 0 : spo2 + 1;
  }
}

window.onload = function () {
  // Call the function, interval timer function in 00ms period
  timer1 = setInterval("transmitData()", 200);
}
