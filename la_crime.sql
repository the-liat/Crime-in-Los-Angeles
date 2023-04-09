CREATE TABLE crime (
    incident_id SERIAL PRIMARY KEY,
    year INTEGER,
    month INTEGER,
    month_name VARCHAR,
    victim_age VARCHAR,
    victim_ethnicity VARCHAR,
    victim_gender VARCHAR,
    lat FLOAT,
    lon FLOAT,
    area_code INTEGER REFERENCES area(area_code),
    crime_code VARCHAR REFERENCES crime_type(crime_code),
    premise_code INTEGER REFERENCES premise(premise_code)
);

CREATE TABLE area (
    area_code SERIAL PRIMARY KEY,
    area_name VARCHAR NOT NULL
);

CREATE TABLE crime_type (
    crime_code SERIAL PRIMARY KEY,
    crime VARCHAR NOT NULL
);

CREATE TABLE premise (
    premise_code SERIAL PRIMARY KEY,
    premise VARCHAR NOT NULL
);

SELECT * FROM crime
SELECT * FROM area
SELECT * FROM crime_type
SELECT * FROM premise