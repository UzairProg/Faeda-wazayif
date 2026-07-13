$(document).ready(function() {
    var countriesData;
    var citiesData;

    // تحميل بيانات الدول من الملف country.json
    $.getJSON("/static/API/country.json", function(data) {
        countriesData = data;
        loadCountries();
    });

    // تحميل بيانات المدن من الملف cities.json
    $.getJSON("/static/API/cities.json", function(data) {
        citiesData = data;
    });

    $('#country').change(function() {
        loadStates();
    });

    $('#state').change(function() {
        loadCities();
    });

    function loadCountries() {
        countriesData.forEach(function(country) {
            $('#country').append('<option value="' + country.country_name + '">' + country.country_name + '</option>');
        });
    }

    function loadStates() {
        var selectedCountry = $('#country').val();
        var states = countriesData.find(country => country.country_name === selectedCountry).states;
        $('#state').empty().append('<option value="">Select your state</option>');
        if (states) {
            states.forEach(function(state) {
                $('#state').append('<option value="' + state + '">' + state + '</option>');
            });
        }
    }

    function loadCities() {
        var selectedState = $('#state').val();
        var cities = citiesData[selectedState];
        $('#city').empty().append('<option value="">Select your city</option>');
        if (cities) {
            cities.forEach(function(city) {
                $('#city').append('<option value="' + city.city_name + '">' + city.city_name + '</option>');
            });
        }
    }
});
