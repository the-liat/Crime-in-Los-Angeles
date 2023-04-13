from flask import Flask
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# dependencies
from sqlalchemy import create_engine, MetaData, text
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
    query = text("""
    SELECT crime 
    FROM crime_type
    GROUP BY crime
    """)
    result = engine.execute(query)
    rows = result.fetchall()
    crime_dict = []
    for row in rows:
        crime_dict.append({"Crimes": row[0]})
    return jsonify(crime_dict)

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
        crime_dict.append({"Year": row[1], "Total Crimes": row[0]})
    return jsonify(crime_dict)

@app.route("/crime_year/<selected_year>/<selected_crime>") # Data for line graph by month
def crime_by_year(selected_year=2022, selected_crime='Assault'):
    query = text(f"""
    SELECT count('crime'), year, month, month_name 
    FROM la_crime
    WHERE year = {selected_year} 
    AND crime = "{selected_crime}"
    GROUP BY month_name, month
    ORDER BY month  
    """)
    result = engine.execute(query)
    rows = result.fetchall()
    crime_dict = []
    for row in rows:
        crime_dict.append({"Month": row[3], "Total Crimes": row[0]})
    return jsonify(crime_dict)


@app.route("/victim/<selected_year>/<selected_crime>")
def victim_data(selected_year=2022, selected_crime='Assault'):
    query_age = text(f"""
    SELECT crime, year, Victim_age, count(*) AS total_count 
    FROM la_crime
    WHERE year = {selected_year} 
    AND crime = "{selected_crime}"
    GROUP BY Victim_age
    """)
    print(query_age)
    result = engine.execute(query_age)
    rows = result.fetchall()
    age_dict = []
    total_count = 0
    for row in rows:
        print(row)
        age_dict.append({"Age": row[2], "Age Count": row[3]})
        total_count += row[3]
    for d in age_dict:
        d["Total People"] = total_count
        d["Age %"] = round((d["Age Count"]/d["Total People"]) * 100)
    query_gender = text(f"""
    SELECT crime, year, Victim_gender, count(*) AS total_count
    FROM la_crime
    WHERE year = {selected_year} 
    AND crime = "{selected_crime}"
    GROUP BY Victim_gender
    """)
    result = engine.execute(query_gender)
    rows = result.fetchall()
    gender_dict = []
    total_count = 0
    for row in rows:
        gender_dict.append({"Gender": row[2], "Gender Count": row[3]})
        total_count += row[3]
    for d in gender_dict:
        d["Total People"] = total_count
        d["Gender %"] = round((d["Gender Count"]/d["Total People"]) * 100)
    query_ethnicity = text(f"""
    SELECT crime, year, Victim_ethnicity, count(*) AS total_count
    FROM la_crime
    WHERE year = {selected_year} 
    AND crime = "{selected_crime}"
    GROUP BY Victim_ethnicity
    """)
    result = engine.execute(query_ethnicity)
    rows = result.fetchall()
    ethnicity_dict = []
    total_count = 0
    for row in rows:
        ethnicity_dict.append({"Ethnicity": row[2], "Ethnicity Count": row[3]})
        total_count += row[3]
    for d in ethnicity_dict:
        d["Total People"] = total_count
        d["Ethnicity %"] = round((d["Ethnicity Count"]/d["Total People"]) * 100)
    crime_dict = {"Age Data": age_dict, "Gender Data": gender_dict, "Ethnicity Data": ethnicity_dict}
    return jsonify(crime_dict)

# Query data by year and return data for map 
@app.route("/map/<selected_year>/<selected_crime>")
def map_data(selected_year=2022, selected_crime='Assault'):
    query_map = text(f"""
    SELECT crime, year, lat, lon, area_name, premise, count(*) AS total_count
    FROM la_crime
    WHERE year = {selected_year} 
    AND crime = "{selected_crime}"
    GROUP BY lat, lon, area_name, premise
    """)
    result = engine.execute(query_map)
    rows = result.fetchall()
    map_dict = []
    for row in rows:
        map_dict.append({"lat": row[2], "lon": row[3], "Area": row[4],"Premise": row[5], "Number of Crimes": row[6]})
    return jsonify(map_dict)

if __name__ == "__main__":
    app.run(debug=True)
