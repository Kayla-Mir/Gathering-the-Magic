
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "user_decks" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user" (id),
	"deck_contents" TEXT [],
	"deck_name" VARCHAR (255),
	"commander" VARCHAR (255)
);

CREATE TABLE "inventory" (
	"id" SERIAL PRIMARY KEY,
	"date_added" VARCHAR (255),
	"img_url" VARCHAR (255),
	"name" VARCHAR (255),
	"toughness" VARCHAR (255),
	"power" VARCHAR (255),
	"cmc" VARCHAR (255),
	"set" VARCHAR (255),
	"color_identity" TEXT [],
	"type_line" VARCHAR (255),
	"legalality" BOOLEAN,
	"user_id" INT REFERENCES "user" (id),
	"deck_id" INT REFERENCES "user_decks" (id)	
);