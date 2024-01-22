import * as fs from "node:fs";
// Read the contents of the JSON file
const list = fs.readFileSync(`list.json`, "utf8");
// Parse the JSON data into a JavaScript object
const jsonData = JSON.parse(list);

const getContacts = (discount) => {
  const websiteRegex =
    /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#\.]?[\w-]+)*\/?/gim;
  const phoneRegex = /(\s{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}.?$/g;
  const emailRegex = /([a-zA-Z0-9+._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gm;
  const emails = discount.match(emailRegex);
  const phoneNumbers = discount.match(phoneRegex);
  const websites = discount.match(websiteRegex);
  return { emails, phoneNumbers, websites };
};
// console.log("Before Adding data", JSON.stringify(jsonData, null, 4));
// Modify the JavaScript object by adding new data
const businessUpdates = jsonData.map((business) => {
  const discount = business.discount;
  const { emails, websites, phoneNumbers } = getContacts(discount);
  const update = {
    ...business,
    latitude: business.location?.lat,
    longitude: business.location?.lng,
    emailAddresses: emails,
    websites,
    phoneNumbers,
  };
  return update;
});

// Convert the JavaScript object back into a JSON string
const jsonString = JSON.stringify(businessUpdates);

console.log("After Adding data", businessUpdates);

fs.writeFileSync("list.json", jsonString, "utf-8", (err) => {
  if (err) throw err;
  console.log("Data added to file");
});

const update_data = fs.readFileSync("list.json");
const updated_jsonData = JSON.parse(update_data);
console.log("After Adding data", JSON.stringify(updated_jsonData, null, 4));
