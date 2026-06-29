// جلب عنصر select للدولة
const countrySelect = document.getElementById("country");
// جلب عنصر select للمدينة
const citySelect = document.getElementById("city");

// جلب بيانات الدول من ملف countries.json
fetch('countries.json')
    .then(response => response.json())
    .then(countries => {
        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country.country_short_name;
            option.textContent = country.country_name;
            countrySelect.appendChild(option);
        });
    })
    .catch(error => console.error('Failed to fetch countries:', error));

// دالة لملء قائمة المدن بناءً على الدولة المحددة
function populateCities() {
    const selectedCountry = countrySelect.value;

    // تفريغ قائمة المدن الحالية
    citySelect.innerHTML = '<option value="">اختر المدينة</option>';

    // جلب بيانات المدن من ملف cities.json
    fetch('cities.json')
        .then(response => response.json())
        .then(cities => {
            cities[selectedCountry].forEach(city => {
                const option = document.createElement("option");
                option.value = city.city_name;
                option.textContent = city.city_name;
                citySelect.appendChild(option);
            });
        })
        .catch(error => console.error(`Failed to fetch cities for ${selectedCountry}:`, error));
}
