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
    var w = window.innerWidth;
    var h = window.innerHeight;
    sizePageElements(w,h);
    createDropdown();
    fetchAllCrimes();
    updatePage(selectedYear, selectedCrime);
}

function sizePageElements(w,h) {
    /*  
        This function adapts the elements on the page depending using jQuery.
        The app is initally built to a 1440p display and this function resizes everything to a 1080p or 720p display.
        The browser's width is passed in, and if it is below a certian threshold
        
    */
    resizeMap(w,h);
    if (w < 1950) {
        if (w < 1500) {
            // 720p
            $("#header").css({"font-size": "18px"});
            $("#selCrimeType").css({"font-size": "24px"});
            $("#lineGraphs").css({"width": (w*(1704/2560)), "height": (h*(456/1300))});
            $("#victimGraphs").css({"width": (w*(1704/2560)), "height": (h*(456/1300))});
            $("#staticLine").css({"width": (w*(562/2560)), "height": (h*(456/1300))});
            $("#dynamicLine").css({"width": (w*(1128/2560)), "height": (h*(456/1300))});
            $("#pie").css({"width": (w*(562/2560)), "height": (h*(456/1300))});
            $("#barAge").css({"width": (w*(562/2560)), "height": (h*(456/1300))});
            $("#barEth").css({"width": (w*(562/2560)), "height": (h*(456/1300))});
            $(".select").css({"margin-left": (w*(144/2560))});
            $("div.year").css({"width": (w*(200/2560)), "height": (h*(72/1300)), "font-size": "30px"});
            $("select").css({"padding": "15px"});
        } else {
            // 1080p
            $("#header").css({"font-size": "30px"});
            $("#selCrimeType").css({"font-size": "30px"});
            $("#lineGraphs").css({"width": (w*(1716/2560)), "height": (h*(500/1300))});
            $("#victimGraphs").css({"width": (w*(1716/2560)), "height": (h*(500/1300))});
            $("#staticLine").css({"width": (w*(568/2560)), "height": (h*(500/1300))});
            $("#dynamicLine").css({"width": (w*(1142/2560)), "height": (h*(500/1300))});
            $("#pie").css({"width": (w*(568/2560)), "height": (h*(500/1300))});
            $("#barAge").css({"width": (w*(568/2560)), "height": (h*(500/1300))});
            $("#barEth").css({"width": (w*(568/2560)), "height": (h*(500/1300))});
            $(".select").css({"margin-left": (w*(144/2560))});
            $("div.year").css({"width": (w*(200/2560)), "height": (h*(72/1300)), "font-size": "44px"});
            $("select").css({"padding": "15px"});
        }
    }
}

function resizeMap(w,h) {
    /*  ----------------------------------------------------------------------------------------------------
        A seperate function is needed to re-size the map.
        This is because the map is erased and re-created each time the user changes the year or crime type.
        ----------------------------------------------------------------------------------------------------    */
    if (w < 1950) {
        if (w < 1500) {
            // 720p
            $("#map").css({"width": (w*(756/2560)), "height": (h*(912/1300))});
        } else {
            // 1080p
            $("#map").css({"width": (w*(794/2560)), "height": (h*(1000/1300))});
        }
    }
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
            dropMenu = dropMenu.concat(`<option value="${data[i]["Crimes"]}">${data[i]["Crimes"]}</option>`);
        };
        selection.innerHTML = dropMenu;
    });
};

function changeYear(y) {
    selectedYear = y;
    updatePage(selectedYear, selectedCrime);
}

function changeCrime(c) {
    selectedCrime = c;
    updatePage(selectedYear, selectedCrime);
}

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
    var w = window.innerWidth;
    var h = window.innerHeight;
    sizePageElements(w,h);
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
        y: totalCrime,
        title: 'Number of All Crimes by Year',
        mode: 'lines+markers',
        marker: {
          color: '#FFA500',
          size: 8
        },
        line: {
          color: '#F08000',
          width: 1
        }
      }];
    /*let layout = {
        plot_bgcolor: '#FFE5B4' 
      }*/
    Plotly.newPlot("staticLine", plotData, {responsive: true}); 
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
        y: numCrimes,
        title: 'Number of Crimes by Month',
        mode: 'lines+markers',
        marker: {
          color: '#FFA500',
          size: 8
        },
        line: {
          color: '#F08000',
          width: 1
        }
      }];
    Plotly.newPlot("dynamicLine", plotData, {responsive: true});
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
                    color: '#F39C12', 
                    width: 1
                }
            }
        }];
        Plotly.newPlot("barAge", plotData, {responsive: true}); 
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
                color: '#F39C12', 
                width: 1
            }
        }
    }];
    Plotly.newPlot("barEth", plotData, {responsive: true});
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
            colors: ['#D35400', '#F39C12']
        }
    }];
    Plotly.newPlot("pie", plotData, {responsive: true});
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
    var pageMap = document.getElementById("map").innerHTML;
    if (pageMap != "") {
        document.getElementById("map").outerHTML = "<div id=\"map\"></div>";
        var w = window.innerWidth;
        var h = window.innerHeight;
        sizePageElements(w,h);
    }
    var myMap = L.map("map", {
        center: [34, -118.42],
        zoom: 10,
        zoomDelta: 0.1,
        zoomSnap: 0
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
    for (index = 0; index < data.length; index++) {
        var marker = L.circle([data[index].lat, data[index].lon], {
            color: "#CC7722",
            weight: 1,
            fillColor: "#FAC898",
            fillOpacity: 0.9,
            radius: scaleDatapoints(data.length)
        });
        marker.addTo(myMap);
    }
};

function scaleDatapoints(size) {
    if (size > 10000) {
        return 150;
    } else if (size > 7500) {
        return 200;
    } else if (size > 5000) {
        return 250;
    } else if (size > 2500) {
        return 300;
    } else if (size > 1000) {
        return 400;
    } else if (size > 500) {
        return 500;
    } else {
        return 750;
    }
}
