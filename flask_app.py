# dependencies
from sqlalchemy import create_engine, inspect, MetaData, select, text, Table, func
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base
from flask import Flask
from flask import jsonify

# Create an engine that can talk to the database
engine = create_engine("sqlite:///Resources/la_crime.db", connect_args={'timeout': 30}, echo=False)
conn = engine.connect()

# creating database session
metadata = MetaData(bind=engine)
Base = automap_base(metadata=metadata)
# Use the Base class to reflect the database tables
Base.prepare(engine=engine, reflect=True)
Base.classes.keys()

# Create an app
app = Flask(__name__)

@app.route("/") 
def home():
    return "Data for visualizations"

"""
selected_year and selected_crime will be selected on the visualization web page by the user and passed into the functions below
"""

# Query crime data by year and crime and return data for line chart 
@app.route("/crime") # Data for overall line chart by year - number of total crimes
def crime():
    query = text("""
    SELECT count('crime'), year 
    FROM la_crime
    GROUP BY year
    """)
    result = engine.execute(query)
    rows = result.fetchall()
    crime_dict = []
    for row in rows:
        print(row)
        crime_dict.append({"Year": row[1], "Total Crimes": row[0]})
        print(crime_dict)
    return jsonify(crime_dict)

@app.route("/crime_year") # Data for line graph
def crime_by_year(selected_year, selected_crime):
    query = text(f"""
    SELECT count('crime'), year, month_name 
    FROM la_crime
    WHERE year = {selected_year} 
    AND crime = {selected_crime}
    GROUP BY month_name
    """)
    result = engine.execute(query)
    rows = result.fetchall()
    crime_dict = []
    for row in rows:
        print(row)
        crime_dict.append({"Month": row[2], "Total Crimes": row[0]})
        print(crime_dict)
    return jsonify(crime_dict)

@app.route("/victim")
def victim_data(selected_year, selected_crime):
    data = """ HERE WE NEED TO PUT THE QUERY -  percent of gender, ethnicity, age"""
    return jsonify(data)

# Query data by year and return data for map 
@app.route("/map")
def map_data(selected_year, selected_crime):
    data = """ HERE WE NEED TO PUT THE QUERY"""
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
