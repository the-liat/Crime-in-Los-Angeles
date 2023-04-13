/*------------------------------------------------------------
        Requesting LA Crime data from Flask Server
-------------------------------------------------------------*/
let selectedYear = 2022;
let selectedCrime = "Assault";
let url = "http://127.0.0.1:5000/";
let crime_url = `${url}/crime`;
let crime_by_year_url = `${url}/crime_year/${selectedYear}/${selectedCrime}`;
let victim_data_url = `${url}/victim/${selectedYear}/${selectedCrime}`;
let map_url = `${url}/map/${selectedYear}/${selectedCrime}`;

function init() {
    createDropdown();
    fetchAllCrimes();
    updatePage(selectedYear, selectedCrime);
}

function createDropdown() {
    const crimeNamePromise = d3.json(url);
    // Fetch the JSON data and create/ update chart 
    d3.json(url).then(function(data) {
//        console.log(data); // Verifying data
        let selection = document.getElementById("selCrimeType");
        let dropMenu = "";
        for (let i = 0; i < data.length; i++) {
            // console.log(data[i]["Crimes"]);
            dropMenu = dropMenu.concat(`<option value="${data[i]["Crimes"]}" onClick="changeCrime(this.value);">${data[i]["Crimes"]}</option>`);
        };
        selection.innerHTML = dropMenu;
    });
};

function changeYear(y) {
    selectedYear = y;
    updatePage(selectedYear, selectedCrime);
}

function changeCrime(c) {
    alert(`${c}`);
}

/*-----------------------------------------------------------
    getting selected choices from drop down menus when clicked   
 -----------------------------------------------------------*/
function optionChanged() {
    let selectedYear = d3.select("#xxxxxxx").property("value"); //NEED TO CHANGE THE div TO THE CORRECT ONE ON THE PAGE
    // THIS MIGHT NEED TO CHANGE FOR 5 LINES WITH CONDITIONALS BECAUSE WE HAVE 5 BOXES ON THE PAGE. VALUE OF YEAR NEED TO BE INTEGER
    let selectedCrime = d3.select("#yyyyyyyy").property("value"); //NEED TO CHANGE THE div TO THE CORRECT ONE ON THE PAGE
    updatePage(selectedYear, selectedCrime);
};


/*-----------------------------------------------------------
        Generating the Chart (all nested functions)   
 -----------------------------------------------------------*/
// Calling the function to get data and create static graph (one time no need to update)


// Calling the function to update charts when selection is made 
// [default passed to the flask server is (2022, 'Assualt'), so the page starts with that]

/*------------------------------------------------------------------------------------
       Update page 
------------------------------------------------------------------------------------*/
function updatePage(selectedYear, selectedCrime) {
//    alert(`Year:  ${selectedYear}`);
    crime_by_year_url = `${url}/crime_year/${selectedYear}/${selectedCrime}`;
    victim_data_url = `${url}/victim/${selectedYear}/${selectedCrime}`;
    map_url = `${url}/map/${selectedYear}/${selectedCrime}`;
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
        crimeChart(data);
    });
};

/*------------------------------------------------------------------------------------
        Line chart for total Crimes for 2018-2022
------------------------------------------------------------------------------------*/
function crimeChart(data) {
    // Parsing the data
    let totalCrime = [];
    let crimeYear = [];
    for (let i = 0; i < data.length; i++) {
        totalCrime.push(data[i]["Total Crimes"]);
        crimeYear.push(data[i]["Year"]);
    };
    console.log(totalCrime); // prints an array of Total Crime values
    console.log(crimeYear); // prints an array of Year values
    // Code for line chart
    let plotData = [{
        type: "scatter",
        x: crimeYear,
        y: totalCrime
      }];
    Plotly.newPlot("staticLine", plotData); //CHANGE xxx TO THE RIGHT div ON THE HTML
};

/*------------------------------------------------------------
        Data for Crime by month Chart
-------------------------------------------------------------*/
function fetchCrimeByMonth(selectedYear, selectedCrime) {
    // Create promise 
    var crmYrPromise = d3.json(crime_by_year_url); 
    console.log("Crime by Month Data Promise: ", crmYrPromise);
    // Fetch the JSON data and create/ update chart 
    d3.json(crime_by_year_url).then(function(data) {
//        console.log(data); // Verifying data
        crimeByMonthChart(data);
    });
};

/*------------------------------------------------------------------------------------
        Line chart for crime by month
------------------------------------------------------------------------------------*/
function crimeByMonthChart(data) {
    // Parsing the data
    let numCrimes = [];
    let crimeMonth = [];
    for (let i = 0; i < data.length; i++) {
        numCrimes.push(data[i]["Total Crimes"]);
        crimeMonth.push(data[i]["Month"]);
    };
    console.log(numCrimes); // prints an array of Total Crime values
    console.log(crimeMonth); // prints an array of Year values
    // Code for line chart
    let plotData = [{
        type: "scatter",
        x: crimeMonth,
        y: numCrimes
      }];
    Plotly.newPlot("dynamicLine", plotData);
};


/*------------------------------------------------------------
        Victim Data
-------------------------------------------------------------*/
function fetchVictimData(selectedYear, selectedCrime) {
    // Create promise 
    var victimPromise = d3.json(victim_data_url); 
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
    // Code for horizontal bar chart
        let plotData = [{
            y: ageCatg,
            x: agePercent,
            type: 'bar',
            orientation: 'h',
            text: ageCatg,
            name: 'Victim Age',
            marker: {
                color: '#D35400', 
                line: {
                    color: 'rgba(243, 156, 18, 1)', 
                    width: 1
                }
            }
        }];
        Plotly.newPlot("barAge", plotData); //CHANGE xxx TO THE RIGHT div ON THE HTML
};

/*------------------------------------------------------------------------------------
        Bar chart for Ethnicity.
------------------------------------------------------------------------------------*/
// function to set bar chart elements
function ethnicityChart(data) {
    // Parsing the data
    let ethnCatg = [];
    let ethnPercent = [];
    for (let i = 0; i < data["Ethnicity Data"].length; i++) {
        ethnCatg.push(data["Ethnicity Data"][i]["Ethnicity"]);
        ethnPercent.push(data["Ethnicity Data"][i]["Ethnicity %"]);
    };
    console.log(ethnCatg); // prints an array of Ethnicity categories
    console.log(ethnPercent); // prints an array of Ethnicity % values
    // Code for horizontal bar chart
    let plotData = [{
        y: ethnCatg,
        x: ethnPercent,
        type: 'bar',
        orientation: 'h',
        text: ethnCatg,
        name: 'Victim Ethnicity',
        marker: {
            color: '#D35400', 
            line: {
                color: '#FD8D3C', 
                width: 1
            }
        }
    }];
    Plotly.newPlot("barEth", plotData); //CHANGE xxx TO THE RIGHT div ON THE HTML
};

/*------------------------------------------------------------------------------------
        Pie chart for Gender.
------------------------------------------------------------------------------------*/
// function to set pie chart elements
function genderChart(data) {
    // Parsing the data
    let genderCatg = [];
    let genderPercent = [];
    for (let i = 0; i < data["Gender Data"].length; i++) {
        genderCatg.push(data["Gender Data"][i]["Gender"]);
        genderPercent.push(data["Gender Data"][i]["Gender %"]);
    };
    console.log(genderCatg); // prints an array of Gender categories
    console.log(genderPercent); // prints an array of Gender % values
    // Code for pie chart
    let plotData = [{
        type: 'pie',
        values: genderPercent,
        labels: genderCatg,
        name: "Crimes by Gender",
        marker: {
            colors: ['#D35400', '#FD8D3C']
        }
    }];
    Plotly.newPlot("pie", plotData); //CHANGE xxx TO THE RIGHT div ON THE HTML
};

/*------------------------------------------------------------
        Map Data
-------------------------------------------------------------*/
function fetchMapData(selectedYear, selectedCrime) {
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