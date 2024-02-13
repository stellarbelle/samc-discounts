import sqlite3 from "sqlite3";
import * as fs from "node:fs";
// open the database connection
import { Item } from "../App";
const db = new sqlite3.Database("../discounts.db", (err) => {
  if (err) {
    return console.log("db error: ", err.message);
  }
  console.log("Connected to database!");
});

/* eslint-disable */
const places = JSON.parse(fs.readFileSync(`list.json`) as any);

const createBusinessTableCommand = `
CREATE TABLE IF NOT EXISTS businesses
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, 
    discount TEXT NOT NULL, 
    category TEXT NOT NULL, 
    address TEXT, 
    latitude INTEGER, 
    longitude INTEGER, 
    phoneNumbers TEXT, 
    emailAddresses TEXT, 
    websites TEXT
)`;

const createDbPromise = (command: string) => {
  return new Promise((reject) => {
    db.run(command, (err: Error | null) => {
      if (err) return reject(err);
    });
  });
};

console.log("Database created!");
createDbPromise(createBusinessTableCommand)
  .then(() => {
    places.forEach((place: Item) => {
      db.run(
        "INSERT INTO businesses(id, name, discount, category, address, latitude, longitude, phoneNumbers, emailAddresses, websites) VALUES(NUll, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          place.name,
          place.discount,
          place.category,
          place.address,
          place.latitude,
          place.longitude,
          place.phoneNumbers,
          place.emailAddresses,
          place.websites,
        ],
        function (err) {
          if (err) {
            return console.error("insert error: ", err.message);
          }
          console.log(`Rows inserted ${this.changes}`);
        }
      );
    });
  })
  .then(() => db.close())
  .catch((err) => console.error("create catch: ", err.message));

// output the INSERT statement

// close the database connection
