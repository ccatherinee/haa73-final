'use strict';

var map;
var guess_coordinates;
var true_location;
var num_rounds = 10;
var coin_set = Array(num_rounds).fill(null);
var score = 0;
var coin_info;
var current_round = -1;
var disable_marker;

function generateCoins() {
    const numbers = Array(16).fill().map((_, index) => index + 1);
    numbers.sort(() => Math.random() - 0.5);
    coin_set = numbers.slice(0, num_rounds)
}

generateCoins();

async function initialize() {
    disable_marker = false;
    document.getElementById('check').disabled = true;
    document.getElementById('next').disabled = true;
    document.getElementById("coin-info").innerHTML = ' '; 
    
    var current_coin = nextCoin();
    [true_location, coin_info] = coins.get(current_coin);
    
    map = new google.maps.Map(document.getElementById('map'), {
	center: {lat: 0, lng: 0},
	zoom: 2 ,
	streetViewControl: false,
	mapTypeControl: false
    });

    var marker = new google.maps.Marker({
	map: map,
	icon: {url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
    });
    
    google.maps.event.addListener(map, 'click', function(event) {
	if (!disable_marker) {
            marker.setPosition(event.latLng);
	    guess_coordinates = event.latLng;
	    document.getElementById('check').disabled = false;
	}
    });
    
    var coinPic = document.createElement("img");
    coinPic.setAttribute("src", "images/"+current_coin+".jpg");
    coinPic.setAttribute("width", "100%");
    coinPic.setAttribute("height", "auto%");
    document.getElementById("coin-pic").replaceChildren(coinPic);
}

function check(){
    disable_marker = true;
    document.getElementById('next').disabled = false;
    score += 5100 - parseInt(distance(guess_coordinates,true_location));
    
    new google.maps.Marker({
	position: true_location, 
	map: map,
	icon: {url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
    });
    
    new google.maps.Polyline({
	path: [true_location, guess_coordinates],
	map: map,
	strokeOpacity: 0,
	icons: [{
            icon: {
		path: 'M 0,-1 0,1',
		strokeOpacity: 1,
		scale: 2
	    },
            offset: '1',
            repeat: '15px'
	}],
    });

    document.getElementById("coin-info").innerHTML = coin_info;
    document.getElementById('check').disabled = true;
}

function distance(guess_coords, true_coords) {
    var rlat1 = guess_coords.lat() * (Math.PI/180);
    var rlat2 = true_coords.lat * (Math.PI/180);
    var sin_dlat = Math.sin((rlat2 - rlat1)/2)**2;
    var sin_dlon = Math.sin((true_coords.lng - guess_coords.lng()) * (Math.PI/360))**2;
    return 2*(3958.8)*Math.asin(Math.sqrt(sin_dlat+Math.cos(rlat1)*Math.cos(rlat2)*sin_dlon));
}

function nextCoin(){
    current_round += 1
    if (current_round > num_rounds -1){
        current_round = 0
        swal({
            title: "Thanks for playing!",
            text: "Your score is: " + Math.min(score, 50000) + ".",
	    button: "Play again"
        });
        score = 0;
	generateCoins()
    }
    document.getElementById('round').innerHTML = "Round: " + (current_round + 1) + "/" + num_rounds
    return coin_set[current_round]
}
