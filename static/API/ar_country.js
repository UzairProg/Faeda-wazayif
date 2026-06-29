const countrySelect = document.getElementById("country");
const citySelect = document.getElementById("city");

// جلب الدول من الخادم Flask وتعبئة القائمة المنسدلة
fetch('/api/countries')
    .then(response => response.json())
    .then(countries => {
        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country.country_name;
            option.textContent = country.country_name;
            countrySelect.appendChild(option);
        });
    })
    .catch(error => console.error('Failed to fetch countries:', error));

// دالة لتعبئة قائمة المدن بناءً على الدولة المحددة
function populateCities() {
    const selectedCountry = countrySelect.value;

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
                citySelect.appendChild(option);
            });
        })
        .catch(error => console.error(`Failed to fetch cities for ${selectedCountry}:`, error));
}
