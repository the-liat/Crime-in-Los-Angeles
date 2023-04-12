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

# victims by % race
@app.route("/race")
def victim_ethnicity(selected_year, selected_crime):
    query = text("""
    SELECT victim_ethnicity, count(*) AS total_count
        FROM la_crime
        WHERE year = {selected_year} 
        AND crime = {selected_crime}
        GROUP BY victim_ethnicity 
        """)
    result = engine.execute(query_age)
    rows = result.fetchall()
    race_dict = []
    total_count = 0
    for row in rows:
        print(row)
        race_dict.append({"Ethnicity": row[0], "Count": row[1]})
        total_count += row[1]
        print(race_dict, total_count)
    for d in race_dict:
        d["Total People"] = total_count
        d["Ethnicity %"] = round((d["Count"]/d["Total People"]) * 100)
        print(race_dict)
    return jsonify(race_dict)

# victim age-bar graph
@app.route("/victim_age") 
def crime_by_age(selected_year, selected_crime):
    qquery = text("""
    SELECT count(crime), year, Victim_age 
        FROM la_crime
        WHERE year = {selected_year} 
        AND crime = {selected_crime}'
        AND crime IS NOT NULL
        AND Victim_age IS NOT NULL
        GROUP BY year, Victim_age
        """)
    result = engine.execute(query_age)
    rows = result.fetchall()
    crime_dict = []
    total_count = sum(row[0] for row in rows)
    for row in rows:
        print(row)
        crime_dict.append({"Year": row[1], "Victim Age": row[2], "Total Crimes": row[0], "% of Total": round(row[0]/total_count*100,2)})
        print(crime_dict)
    return jsonify(crime_dict)

#Crme by gender%
@app.route("/crime") 
def crime():
    query_gender = text("""
    SELECT count(crime), crime, victim_gender 
    FROM la_crime
    WHERE year = 2018 
    AND crime = "Trespassing"
    AND crime IS NOT NULL
    AND victim_gender IS NOT NULL
    GROUP BY crime, victim_gender
    """)
    result = engine.execute(query_gender)
    rows = result.fetchall()

    gender_dict = []
    for crime in set([row[1] for row in rows]):
        crime_count = sum([row[0] for row in rows if row[1] == crime])
    for gender in set([row[2] for row in rows if row[1] == crime]):
        gender_count = sum([row[0] for row in rows if row[1] == crime and row[2] == gender])
        gender_dict.append({
            #"Crime Type": crime,
            "Victim Gender": gender,
            "Total Crimes": gender_count,
            "% of Total": round((gender_count/crime_count)*100, 2)
        })

        print(gender_dict)
    return jsonify(gender_dict)



# Query data by year and return data for map 
@app.route("/map")
def map_data(selected_year, selected_crime):
    data = """ HERE WE NEED TO PUT THE QUERY"""
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)

