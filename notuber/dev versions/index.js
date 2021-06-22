let map;
var my_pos = {lat: 0, lng: 0};
var request = new XMLHttpRequest();

function initMap() {
        //Setting map properties
        var myOptions = {
                zoom: 13,
                center: {lat: 42.352271, lng: -71.05524200000001}
        };

        //Creating new map
        map = new google.maps.Map(document.getElementById("map"), myOptions);

        jsonData = '[' +
        '{"vehicle id": "mXfkjrFw",' +
        '"latitude": "42.3453",' +
        '"longitude": "-71.0464"},' +

        '{"vehicle id": "nZXB8ZHz",' +
        '"latitude": "42.3662",' +
        '"longitude": "-71.0621"},' +

        '{"vehicle id": "Tkwu74WC",' +
        '"latitude": "42.3603",' +
        '"longitude": "-71.0547"},' +

        '{"vehicle id": "5KWpnAJN",' +
        '"latitude": "42.3472",' +
        '"longitude": "-71.0802"},' +

        '{"vehicle id": "uf5ZrXYw",' +
        '"latitude": "42.3663",' +
        '"longitude": "-71.0544"},' +

        '{"vehicle id": "VMerzMH8",' +
        '"latitude": "42.3542",' +
        '"longitude": "-71.0704"}]';

        parsed = JSON.parse(jsonData);

        for (i = 0; i < 6; i++) {
                var lati = parseFloat(parsed[i].latitude);
                var long = parseFloat(parsed[i].longitude);
                var pos = {lat : lati, lng : long};
                var marker = new google.maps.Marker({
                        position : pos,
                        map: map,
                        icon: "icon.png"
                });
        };

        getMyLocation();
        getCarsLocation();
}

function getMyLocation() {
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(pos) {
                        //Setting latlng literal to my location
                        my_pos = {lat: pos.coords.latitude, lng: pos.coords.longitude};
                        //Panning to my location
                        map.panTo(my_pos);
                        //Set marker at my location
                        var marker = new google.maps.Marker({
                                position: my_pos,
                                map: map,
                        });

                });
        }
        else {
                alert("Browser doesn't support Geolocation services.");
        }
}

function getCarsLocation() {
        var url = "https://jordan-marsh.herokuapp.com/rides";
        request.open("POST", url, true);
        //Sending proper headers with the request
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                        console.log("SanityCheck");
                        data = JSON.parse(request.responseText);
                        console.log(data);
                };
        };
        var param = "username=RKml7F0D&lat=" + String(my_pos.lat) + "&lng=" + String(my_pos.lng);
        console.log(my_pos.lat);
        console.log(param);
        request.send(param);

}
