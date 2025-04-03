document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript Loaded!");

    document.getElementById("search-btn").addEventListener("click", function() {
        console.log("Search button clicked!");

        let fromStation = document.getElementById("from-station").value.trim().toUpperCase();
        let toStation = document.getElementById("to-station").value.trim().toUpperCase();

        if (fromStation === "" || toStation === "") {
            alert("Please enter both stations.");
            return;
        }

        console.log(`Fetching trains from ${fromStation} to ${toStation}...`);

        fetch("/search", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `from_station=${fromStation}&to_station=${toStation}`
        })
        .then(response => {
            console.log("Response received:", response);
            return response.json();
        })
        .then(data => {
            let resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = "";

            if (data.error) {
                console.log("Error received:", data.error);
                resultsDiv.innerHTML = `<p>${data.error}</p>`;
                return;
            }

            data.forEach(train => {
                resultsDiv.innerHTML += `
                    <p>Train to ${train.destination_name} - Departure: ${train.aimed_departure_time}</p>
                `;
            });

            console.log("Train data displayed successfully.");
        })
        .catch(error => console.error("Error fetching train data:", error));
    });
});
