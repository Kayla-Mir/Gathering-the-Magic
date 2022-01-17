-- Create a DB called solo_project

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
	"commander" VARCHAR (255),
	"deck_img" VARCHAR (255)
);

CREATE TABLE "inventory" (
	"id" SERIAL PRIMARY KEY,
	"img_url" VARCHAR (255),
	"img_back_url" VARCHAR (255),
	"name" VARCHAR (255),
	"toughness" VARCHAR (255),
	"toughness_back" VARCHAR (255),
	"power" VARCHAR (255),
	"power_back" VARCHAR (255),
	"cmc" VARCHAR (255),
	"set" VARCHAR (255),
	"color_identity" TEXT [],
	"type_line" VARCHAR (255),
	"legality" VARCHAR (255),
	"user_id" INT REFERENCES "user" (id),
	"deck_id" INT,
	"scryfall_id" VARCHAR (255)
);