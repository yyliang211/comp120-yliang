let map;
var my_pos = new google.maps.LatLng(0, 0);
var infoWindow = new google.maps.InfoWindow();
var service;
var request = new XMLHttpRequest();
var allCarMarkers = [];
var myMarker;

function initMap() {
        //Setting map properties
        var myOptions = {
                zoom: 13,
                center: {lat: 42.352271, lng: -71.05524200000001}
        };
        //Creating new map
        map = new google.maps.Map(document.getElementById("map"), myOptions);
        getMyLocation();
}

//Getting your geolocation
function getMyLocation() {
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(pos) {
                        //Setting latlng literal to my location
                        my_pos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                        //Panning to my location
                        map.panTo(my_pos);
                        //Set marker at my location
                        myMarker = new google.maps.Marker({
                                position: my_pos,
                                map: map,
                                title: "Current location"
                        });
                        //Search for restaurants, bars and coffee shops wtihin a mile
                        aroundMe();
                        //Call to server for vehicles
                        getCarsLocation();
                        google.maps.event.addListener(myMarker, 'click', function() {
                                infoWindow.setContent(myMarker.title);
                                infoWindow.open(map, myMarker);
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
                        var rideData = JSON.parse(request.responseText);
                        for (i = 0; i < rideData.length; i++) {
                                var marker = new google.maps.Marker({
                                        position: {lat: rideData[i].lat, lng: rideData[i].lng},
                                        map: map,
                                        icon: "icon.png"
                                });
                                //Populate array of Marker objects for cars
                                allCarMarkers.push(marker);
                        };
                        findClosestCar();
                };
        };
        var param = "username=RKml7F0D&lat=" + String(my_pos.lat()) + "&lng=" + String(my_pos.lng());
        request.send(param);
}

function findClosestCar() {
        var carIndex = 0;
        var distances = [];
        var minDistance = Number.MAX_VALUE;
        var carPos;
        //Finds closest car
        for (i = 0; i < allCarMarkers.length; i++) {
                carPos = allCarMarkers[i].getPosition();
                //converts to miles
                distances[i] =  google.maps.geometry.spherical.computeDistanceBetween(my_pos, carPos) * 0.000621371;
                if (distances[i] < minDistance) {
                        minDistance = distances[i];
                        carIndex = i;
                }
                console.log("For car " + i + " distance is " + distances[i] + " meters.");

        };
        console.log("minimum distance is " + minDistance);
        //Plot polyline from my position to closest car
        var pathCoords = [my_pos, allCarMarkers[carIndex].getPosition()];
        var path = new google.maps.Polyline({
                path: pathCoords,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
        });
        path.setMap(map);
        //Update infowindow of my marker to show distance to closest car
        google.maps.event.addListener(myMarker, 'click', function() {
                infoWindow.setContent("Distance to closest vehicle: " + minDistance + " miles.");
                infoWindow.open(map, myMarker);
        });
        //Set infowindow to show distance to you if car marker is clicked
        carOnClick(distances);
}

function carOnClick(distances) {
        allCarMarkers.forEach(function(element, index) {
                google.maps.event.addListener(element, 'click', function() {
                        infoWindow.setContent("Distance to you: " + distances[index] + " miles.");
                        infoWindow.open(map, element);
                        console.log("this is marker: " + index);
                        console.log("distance is " + distances[index]);
                });
        });
}

//Search for restaurants, bars and coffee shops wtihin a mile
function aroundMe() {
        service = new google.maps.places.PlacesService(map);
        var request = {
                location: my_pos,
                radius: 1609,
                keyword: "restaurants, bars, coffee shops"
        };
        service.nearbySearch(request, (results, status) => {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                        console.log(results);
                        for (i = 0; i < results.length; i++) {
                                marker = new google.maps.Marker({
                                        position: results[i].geometry.location,
                                        map: map,
                                });
                                placeOnClick(results[i], marker);
                        }
                }
        });

}

function placeOnClick(resultPlace, marker) {
        google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent(resultPlace.name);
                infoWindow.open(map, marker);
        });
}
