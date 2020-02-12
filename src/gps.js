export let gpsPermission = false;
export let gpsData = {};
export let setupGPS = () => {
    navigator.geolocation.watchPosition(showPosition, watchPositionError);
}
export let gpsHelp = getSettingStr();

function showPosition(position) {
    console.log('yo!');
    gpsPermission = true;
    gpsData = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        timeStamp: Date.now(),
        date: Date(Date.now())
    }
    //earthLocationRefs.child(myId).set(gp);
}
    
function watchPositionError(positionError)  {
    console.log('fail!'+gpsHelp);
    gpsPermission = false;
    switch (positionError.code) {
        // PERMISSION_DENIED
        case 1:
        console.log('Permission denied')
        break
        // POSITION_UNAVAILABLE
        case 2:
        console.log('Permission allowed, location disabled')
        break
        // TIMEOUT
        case 3:
        console.log('Permission allowed, timeout reached')
        break
        }
}

function getSettingStr() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android|windows phone/i.test(userAgent)) {
      return "1. Open the Chrome app.\n\n2. Find and tap Settings.\n\n3. Tap Site settings > Location.\n\n4. Turn Location on.";
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "1. Open the settings app.\n\n2. Find and tap Safari/Chrome.\n\n3. Tap Location.\n\n4. Select \"While Using the App\".";
    }
    return "Enable Location Permission";
}