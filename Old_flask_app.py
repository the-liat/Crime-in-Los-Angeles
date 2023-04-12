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

#Crime by age and year-BK
@app.route("/Victim_age")
def victim_data(selected_year, selected_crime):
    query_age = text(f"""
    SELECT count(crime), year, Victim_age 
    FROM la_crime
    WHERE year = 2018 
    AND crime = 'Domestic Violence'
    AND crime IS NOT NULL
    AND Victim_age IS NOT NULL
    GROUP BY Victim_age
    """)
    result = engine.execute(query_age)
    rows = result.fetchall()
    crime_dict = []
    for row in rows:
        print(row)
        crime_dict.append({"Month": row[2], "Total Crimes": row[0]})
        print(crime_dict)
    return jsonify(crime_dict)

#Crime type count by victim gender-bk
@app.route("/victim_gender")
def victim_data(selected_year, selected_crime):
    query_gender = text(f"""
    SELECT count(crime), crime, victim_gender 
    FROM la_crime
    WHERE year = 2018 
    AND crime IS NOT NULL
    AND victim_gender IS NOT NULL
    GROUP BY crime, victim_gender
    """)
    result = engine.execute(query_gender)
    rows = result.fetchall()
    crime_dict = []
    for row in rows:
        print(row)
        crime_dict.append({"Crime Type": row[1], "Victim Gender": row[2], "Total Crimes": row[0]})
        print(crime_dict)
    return jsonify(crime_dict)



##query to show crime by year, geoloc, area, premis and crime typ-bk
@app.route("/victim_gender")
def victim_data(selected_year, selected_crime):
    query_location = text(f"""
    SELECT count(crime), lat, lon, area_name, crime, premise, year
    FROM la_crime
    WHERE year = year 
    AND crime IS NOT NULL
    AND lat IS NOT NULL
    AND lon IS NOT NULL
    AND area_name IS NOT NULL
    AND premise IS NOT NULL
    GROUP BY lat, lon, area_name, crime, premise
    LIMIT 200
    """)
    result = engine.execute(query_location)
    rows = result.fetchall()
    crime_dict = []
    for row in rows:
        crime_dict.append({"Year": row[6], "Crime Type": row[4], "Premise": row[5], "Area Name": row[3], "Latitude": row[1], "Longitude": row[2], "Total Crimes": row[0]})
        print(crime_dict)
    return jsonify(crime_dict)



# Query data by year and return data for map 
@app.route("/map")
def map_data(selected_year, selected_crime):
    data = """ HERE WE NEED TO PUT THE QUERY"""
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
