'use strict';

var cities;
var prevCityName;

$(function(){
  loadFromLocalStorage();
  $('#addCity').click(addCity);
  $('#prevCities').on("click", '.fullForecast', forecastRequest);
  $('#prevCities').on("click", ".remove", removeCity);
});

function removeCity(e){
  e.preventDefault();
  var city = this.closest('div').getElementsByClassName('prevNameOfCity')[0].innerHTML;
  for(var i = 0; i < cities.length; i++) {
    if(city.toLowerCase() === cities[i].toLowerCase()){
      cities.splice(i, 1);
    }
  }
  saveToLocalStorage();
  $(this).closest('.row')[0].remove();
}

function forecastRequest(e){
  e.preventDefault();
  var city = this.closest('div').getElementsByClassName('prevNameOfCity')[0].innerHTML;
  var $this = $(this);

  $.ajax({                          // 3 day forecast data
    method: 'GET',
    url: `http://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&units=imperial&cnt=3&appid=38f758398b969dbe1c4c60ee16c5e6ff`,
    success: function(weather3Days) {
      weather3DaysCard(weather3Days, $this);
    },
    error: function () {
      console.log('error!');
    }
  });
}

function prevCityRequest(prevName){
  $.ajax({                          // current weather data
    method: 'GET',
    url: `http://api.openweathermap.org/data/2.5/weather?q=${prevName}&units=imperial&appid=38f758398b969dbe1c4c60ee16c5e6ff`,
    success: function(currentWeather) {
      prevWeatherCard(currentWeather);
    },
    error: function () {
      console.log('error!');
    }
  });
}

function weather3DaysCard(data, $this){
  if($this.closest(".card").find(".threeDaysForecast").length === 0) {
    var $card = $('#template3').clone().addClass('row threeDaysForecast');
    $card.removeAttr('id');

    $card.find('.minTemp1').text(Math.floor(data.list[0]['temp']['min']));
    $card.find('.maxTemp1').text(Math.floor(data.list[0]['temp']['max']));
    var iconID1 = data.list[0]['weather'][0]['icon'];
    $card.find('.icon1').attr("src", `http://openweathermap.org/img/w/${iconID1}.png`);

    $card.find('.minTemp2').text(Math.floor(data.list[1]['temp']['min']));
    $card.find('.maxTemp2').text(Math.floor(data.list[1]['temp']['max']));
    var iconID2 = data.list[1]['weather'][0]['icon'];
    $card.find('.icon2').attr("src", `http://openweathermap.org/img/w/${iconID2}.png`);

    $card.find('.minTemp3').text(Math.floor(data.list[2]['temp']['min']));
    $card.find('.maxTemp3').text(Math.floor(data.list[2]['temp']['max']));
    var iconID3 = data.list[2]['weather'][0]['icon'];
    $card.find('.icon3').attr("src", `http://openweathermap.org/img/w/${iconID3}.png`);
    $this.closest(".card").find(".fcW").append($card); 
  } else {
    $this.closest('.card').find('.threeDaysForecast').toggleClass('hidden');
  }
}

function prevWeatherCard(data){
  var $card = $('#template').clone().addClass('card row');
  $card.removeAttr('id');
  $card.find('.prevNameOfCity').text(data.name);
  var iconID = data.weather[0]['icon'];
  $card.find('.icon').attr("src", `http://openweathermap.org/img/w/${iconID}.png`);
  $card.find('#prevTemp').text(Math.floor(data.main['temp']));
  $('#prevCities').prepend($card);
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
  if(cities.indexOf(newCity) === -1 ){
    cities.push(newCity);
    prevCityRequest(newCity);
    saveToLocalStorage();
    $('#newCity').val('');
  }
}