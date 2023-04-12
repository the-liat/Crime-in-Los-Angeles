/*------------------------------------------------------------
        Requesting LA Crime data from Flask Server
-------------------------------------------------------------*/
let url = "http://127.0.0.1:5000/";
let crime_url = `${url}/crime`;
let crime_by_year_url = `${url}/crime_year`;
let victim_data_url = `${url}/victim`
let map_url = `${url}/map`;

/*-----------------------------------------------------------
    getting selected choices from drop down menus when clicked   
 -----------------------------------------------------------*/
 function optionChanged() {
    let selectedYear = d3.select("#xxxxxxx").property("value"); //NEED TO CHANGE THE div TO THE CORRECT ONE ON THE PAGE
    // THIS MIGHT NEED TO CHANGE FOR 5 LINES WITH CONDITIONALS BECAUSE WE HAVE 5 BOXES ON THE PAGE. VALUE OF YEAR NEED TO BE INTEGER
    let selectedCrime = d3.select("#yyyyyyyy").property("value"); //NEED TO CHANGE THE div TO THE CORRECT ONE ON THE PAGE
    updatePage(selectedYear, selectedCrime);
};

// Calling the function to get data and create static graph (one time no need to update)
fetchAllCrimes();

/*------------------------------------------------------------------------------------
       Update page 
------------------------------------------------------------------------------------*/
function updatePage(selectedYear, selectedCrime) {
    fetchCrimeByMonth(selectedYear, selectedCrime);
    fetchVictimData(selectedYear, selectedCrime);
    fetchMapData(selectedYear, selectedCrime);
};

/*------------------------------------------------------------
          Data for total Crimes for 2018-2022
-------------------------------------------------------------*/
function fetchAllCrimes() {
    // Create promise
    const crimePromise = d3.json(crime_url);
    console.log("Crime Data Promise: ", crimePromise);
    
    // Fetch the JSON data and create crime chart
    d3.json(crime_url).then(function(data) {
        console.log(data); // Verifying data
        createDropdown(data); //initializing the drop down menu *** DO WE NEED THIS OR DID ASTER CREATE IT ON THE PAGE?
        crimeChart(data);
    });
};

/*------------------------------------------------------------
        Creating the Crime Type down menu - UPDATE FUNCTION IF IT IS NEEDED AT ALL
-----------------------------------------------------------*/
function createDropdown(data) {
    let selection = document.getElementById("selDataset");
    for (let i = 0; i < data.names.length; i++) {
        let option = document.createElement("option");
        option.value = data.names[i];
        option.text = data.names[i];
        selection.appendChild(option);
    };
};

/*------------------------------------------------------------------------------------
        Line chart for total Crimes for 2018-2022
------------------------------------------------------------------------------------*/
function crimeChart(data) {
    // ADD CODE TO PARSE THE DATA
    // ADD CODE FOR LINE CHART HERE
};

/*------------------------------------------------------------
        Data for Crime by month Chart
-------------------------------------------------------------*/
function fetchCrimeByMonth(selectedYear, selectedCrime) {
    // Create promise 
    const crmYrPromise = d3.json(crime_by_year_url); 
    console.log("Crime by Month Data Promise: ", crmYrPromise);
    // Fetch the JSON data and create/ update chart 
    d3.json(crime_by_year_url).then(function(data) {
        console.log(data); // Verifying data
        crimeByMonthChart(data);
    });
};

/*------------------------------------------------------------------------------------
        Line chart for crime by month
------------------------------------------------------------------------------------*/
function crimeByMonthChart(data) {
    // ADD CODE TO PARSE THE DATA
    // ADD CODE FOR LINE CHART HERE
};

/*------------------------------------------------------------
        Victim Data
-------------------------------------------------------------*/
function fetchVictimData(selectedYear, selectedCrime); {
    // Create promise 
    const victimPromise = d3.json(victim_data_url); 
    console.log("Victim Data Promise: ", victimPromise);
    // Fetch the JSON data and create/ update chart 
    d3.json(victim_data_url).then(function(data) {
        console.log(data); // Verifying data
        genderChart(data);
        ageChart(data); 
        ethnicityChart(data);
    });
};

/*------------------------------------------------------------------------------------
        Bar chart for Age.
------------------------------------------------------------------------------------*/
// function to set bar chart elements
function ageChart(data) {
    // Parsing the data
    let ageCatg = [];
    let agePercent = [];
    for (let i = 0; i < data["Age Data"].length; i++) {
        ageCatg.push(data["Age Data"][i]["Age"]);
        agePercent.push(data["Age Data"][i]["Age %"]);
    };
    console.log(ageCatg); // prints an array of Age categories
    console.log(agePercent); // prints an array of Age % values
    // ADD CODE FOR BAR CHART HERE
};

/*------------------------------------------------------------------------------------
        Bar chart for Ethnicity.
------------------------------------------------------------------------------------*/
// function to set bar chart elements
function ethnicityChart(data) {
    // ADD CODE TO PARSE THE DATA
    // ADD CODE FOR BAR CHART HERE
};

/*------------------------------------------------------------------------------------
        Pie chart for Gender.
------------------------------------------------------------------------------------*/
// function to set pie chart elements
function genderChart(data) {
    // ADD CODE TO PARSE THE DATA
    // ADD CODE FOR PIE CHART HERE
};

/*------------------------------------------------------------
        Map Data
-------------------------------------------------------------*/
function fetchMapData(selectedYear, selectedCrime); {
    // Create promise 
    const mapPromise = d3.json(map_url); 
    console.log("Map Data Promise: ", mapPromise);
    // Fetch the JSON data and create/ update chart 
    d3.json(map_url).then(function(data) {
        console.log(data); // Verifying data
        crimeMap(data);
    });
};

/*------------------------------------------------------------------------------------
        Map chart 
------------------------------------------------------------------------------------*/
// function to setup map
function crimeMap(data) {
    // ADD CODE TO PARSE THE DATA
    // ADD CODE FOR MAP HERE
};


// Calling the function to update charts when selection is made
updatePage(selectedYear, selectedCrime);