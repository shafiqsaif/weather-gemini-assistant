const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    const output = document.getElementById('output');

    if (city) {
        output.innerHTML = `<h3>System Ready.</h3> <p>You entered: <strong>${city}</strong>. Next step: Connect APIs.</p>`;
    } else {
        alert("Please enter a city name to test.");
    }
});