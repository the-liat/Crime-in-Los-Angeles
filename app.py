# import Flask
from flask import Flask
from flask import jsonify

# Create an app
app = Flask(__name__)

"""
selected_year and selected_crime will be selected on the visualization web page by the user and passed into the functions below
"""

# Query crime data by year and crime and return data for line chart 
@app.route("/crime") # Data for overall line chart by year - number of total crimes
def crime():
    data = """ HERE WE NEED TO PUT THE QUERY"""
    return jsonify(data)

@app.route("/crime_year") # Data for line graph
def crime_by_year(selected_year, selected_crime):
    data = """ HERE WE NEED TO PUT THE QUERY"""
    return jsonify(data)

@app.route("/victim")
def victim_data(selected_year):
    data = """ HERE WE NEED TO PUT THE QUERY -  percent of gender, ethnicity, age"""
    return jsonify(data)

# Query data by year and return data for map 
@app.route("/map")
def map_data(selected_year):
    data = """ HERE WE NEED TO PUT THE QUERY"""
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
