'use strict';

var cities;
var prevCityName;

$(function(){
  loadFromLocalStorage();
  $('#addCity').click(addCity);
  //$('#addCity').click(sendNewRequest);
  $('#addCity').click(prevCityRequest);
  $('#prevCities').on("click", ".remove", removeCity);
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

function removeCity(e){
  e.preventDefault();
  var city = this.closest('div').getElementsByClassName('prevNameOfCity')[0].innerHTML;

  console.log("index:", cities.indexOf(city));
  for(var i = 0; i < cities.length; i++) {
    if(city.toLowerCase() === cities[i].toLowerCase()){
      cities.splice(i, 1);
    }
  }
  console.log('cities', cities);
  saveToLocalStorage();
  $(this).closest('.row')[0].remove();
}

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

}

function prevWeatherCard(data){
  var $card = $('#template').clone().addClass('card row');
  $card.removeAttr('id');
  $card.find('.prevNameOfCity').text(data.name);
  var iconID = data.weather[0]['icon'];
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
  if(city !== undefined){

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