const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");

// جلب الدول من الخادم Flask وتعبئة القائمة المنسدلة
fetch('/api/countries')
    .then(response => response.json())
    .then(countries => {
        countries.forEach(country => {
            if (!countrySelect.querySelector(`option[value="${country.country_name}"]`)) {
                const option = document.createElement("option");
                option.value = country.country_name;
                option.textContent = country.country_name;
                countrySelect.appendChild(option);
            }
        });
        
        // Trigger population of cities initially
        if (countrySelect.value) {
            populateCities();
        }
    })
    .catch(error => console.error('Failed to fetch countries:', error));

// دالة لتعبئة قائمة المدن بناءً على الدولة المحددة
function populateCities() {
    const selectedCountry = countrySelect.value;
    const currentCity = citySelect.value; // Store the currently selected city

    // تفريغ قائمة المدن الحالية
    citySelect.innerHTML = '<option value="">اختر المدينة</option>';

    // جلب المدن من الخادم Flask وتعبئة القائمة المنسدلة
    fetch(`/api/cities/${selectedCountry}`)
        .then(response => response.json())
        .then(cities => {
            cities.forEach(city => {
                const option = document.createElement("option");
                option.value = city.city_name;
                option.textContent = city.city_name;
                if (city.city_name === currentCity) {
                    option.selected = true; // Restore selection
                }
                citySelect.appendChild(option);
            });
        })
        .catch(error => console.error(`Failed to fetch cities for ${selectedCountry}:`, error));
}

// Support for Select2 which might suppress native onchange events
if (typeof jQuery !== 'undefined') {
    $(document).ready(function() {
        $('#country').on('change', function() {
            populateCities();
        });
    });
}
