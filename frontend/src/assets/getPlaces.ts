import * as fs from "node:fs";
import * as fsPromises from "fs/promises";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { Item } from "../App";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type results = {
  permanently_closed: boolean;
  place_id: string;
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
};

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

const list = fs.readFileSync(`${__dirname}/list.txt`, "utf8");
const townCenter = { lat: 34.055371, lng: -84.064106 };
const radius = 16000;

const fetchData = (item: string[], category: string) => {
  const name = item[0];
  const baseURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${name}&key=AIzaSyBPwgAjsfJCRoR3nGFhZA8YzTzQNC7QUTw&circle:${radius}@${townCenter.lat},${townCenter.lng}`;
  const place = axios
    .get(baseURL)
    .then((response: { data: { results: results[] } }) => {
      const newItem: Item[] = [];
      response.data.results.forEach((res: results) => {
        const loc = res.geometry.location;
        const dist = getDistanceFromLatLonInKm(
          townCenter.lat,
          townCenter.lng,
          loc.lat,
          loc.lng
        );
        if (!res.permanently_closed && dist < 25) {
          newItem.push({
            name,
            discount: item[1],
            category,
            location: res.geometry.location,
            address: res.formatted_address,
          });
        }
      });
      return newItem;
    })
    .catch((error) => {
      console.error(error);
    });
  return place;
};

const itemList = async (list: string) => {
  let category: string;
  const getItemsList = async () => {
    const items = list.split("\n");
    for (const item of items) {
      const newItem: string[] = item.split(/- (.*)/s);
      if (!newItem[1]) {
        category = newItem[0];
      } else {
        await fetchData(newItem, category);
      }
    }
  };
  return await getItemsList();
};

const places = await itemList(list);
await fsPromises.writeFile(`${__dirname}/list.json`, JSON.stringify(places));
