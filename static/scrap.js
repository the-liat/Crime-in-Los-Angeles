/*------------------------------------------------------------
        Requesting LA Crime data from Flask Server
-------------------------------------------------------------*/
let url = "http://127.0.0.1:5000/";
let crime_url = `${url}/crime`;
let crime_by_year_url = `${url}/crime_year`;
let victim_data_url = `${url}/victim`
let map_url = `${url}/map`;

function init() {
    createDropdown();
}

function createDropdown() {
    const crimeNamePromise = d3.json(url);
    // Fetch the JSON data and create/ update chart 
    d3.json(url).then(function(data) {
        console.log(data); // Verifying data
        let selection = document.getElementById("selCrimeType");
        let dropMenu = "";
        for (let i = 0; i < data.length; i++) {
            // console.log(data[i]["Crimes"]);
            dropMenu = dropMenu.concat(`<option value="${data[i]["Crimes"]}">${data[i]["Crimes"]}</option>`);
        };
        selection.innerHTML = dropMenu;
    });
};

function changeYear() {
    alert(`'Year Changed'`);
}