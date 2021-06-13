let map;

function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
                center: {lat: 42.352271, lng: -71.05524200000001},
                zoom: 14
        });

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
        }
}
