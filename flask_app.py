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

<<<<<<< HEAD
# victims by % race
@app.route("/race")
def victim_ethnicity(selected_year, selected_crime):
    query = text(f"""
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


=======

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
>>>>>>> 2e0fcd8b61f497d029ca1316e4eb3fcb075ea710

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

