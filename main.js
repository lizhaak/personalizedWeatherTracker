'use strict';

var cities;
var prevCityName;

$(function(){
  //prevCityRequest
  loadFromLocalStorage();
  $('#addCity').click(addCity);
  //$('#addCity').click(sendNewRequest);
  $('#addCity').click(prevCityRequest);
});

// function sendNewRequest(){            // new request to get the 5 day forecast
//   var $newCity = $('#newCity').val();
//   console.log('$newCity', $newCity);

//   $.ajax({
//     method: 'GET',
//     url: `http://api.openweathermap.org/data/2.5/forecast?q=${$newCity},us&&appid=38f758398b969dbe1c4c60ee16c5e6ff`,
//     success: function(weather5Day) {
//       console.log('weather5Day:', weather5Day);
//     },
//     error: function () {
//       console.log('error!');
//     }

//   });

//   console.log('send');
// }

function prevCityRequest(prevName){
  $.ajax({
    method: 'GET',
    url: `http://api.openweathermap.org/data/2.5/weather?q=${prevName}&units=imperial&appid=38f758398b969dbe1c4c60ee16c5e6ff`,
    success: function(weather) {
        prevWeatherCard(weather);
        
    },
    error: function () {
      console.log('error!');
    }
  });
  console.log('send');   //need to remove or do something with this.
}

function prevWeatherCard(data){
  console.log('data:', data);
  var $card = $('#template').clone().addClass('card row');
  $card.removeAttr('id');
  console.log('data.name: ', data.name);
  console.log('data.main.temp:', data.main['temp']);
  $card.find('.prevNameOfCity').text(data.name);
  var iconID = data.weather[0]['icon'];
  console.log('iconID', iconID);
  $card.find('.icon').attr("src", `http://openweathermap.org/img/w/${iconID}.png`);
  $card.find('#prevTemp').text(Math.floor(data.main['temp']));
  $('#prevCities').append($card);
}

function loadFromLocalStorage(){
  if(localStorage.cities === undefined) {
    localStorage.cities = '[]';
  }
  cities = JSON.parse(localStorage.cities);
  citiesInit(0);
}

function citiesInit(cityID) {
  var city = cities[cityID];

 $.ajax({
    method: 'GET',
    url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=38f758398b969dbe1c4c60ee16c5e6ff`,
    success: function(weather) {
        prevWeatherCard(weather);
        if(cityID < cities.length - 1){
          citiesInit(cityID + 1);
        }  
    },
    error: function () {
      console.log('error!');
    }
  });
}

function saveToLocalStorage() {
  localStorage.cities = JSON.stringify(cities);
}

function addCity(e) {
  e.preventDefault();
  var newCity = $('#newCity').val();
  cities.push(newCity);
  saveToLocalStorage();
  console.log('localStorage.cities:', localStorage.cities);
}