import sqlite3 from "sqlite3";
import * as fs from "node:fs";
// open the database connection
let db = new sqlite3.Database("../discounts.db", (err) => {
  if (err) {
    return console.log("db error: ", err.message);
  }
  console.log("Connected to database!");
});

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

const createDbPromise = (command: any) => {
  return new Promise((resolve, reject) => {
    db.run(command, (err: any, data: any) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

console.log("Database created!");
createDbPromise(createBusinessTableCommand)
  .then(() => {
    places.forEach((place: any) => {
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
