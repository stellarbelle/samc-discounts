import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import list from "../assets/list.json";
import "../App.css";

const markerColor: Record<string, string> = {
  "Spa/Salon/Health": "pink-dot",
  "Entertainment & Education": "green-dot",
  "Restaurants (all discounts do not include alcohol)": "red-dot",
  "Shopping & Home Etc": "purple-dot",
  "SAMC Family Businesses": "yellow-dot",
};
const townCenter = { lat: 34.055371, lng: -84.064106 };
interface Location {
  lat: number;
  lng: number;
}

/* eslint-disable */
const markers = list.map((value: any, idx: number) => {
  const cat = value.category; //@typescript-eslint/no-unsafe-assignment
  const color: string = markerColor[cat] || "gray";
  if (value.location) {
    return (
      <Marker
        position={value.location}
        key={`pos ${value.name}${idx}`} //@typescript-eslint/restrict-template-expressions
        icon={`http:// labs.google.com/ridefinder/images/mm_20_${color}.png`}
      />
    );
  }
});
const Map = (loc?: Location) => {
  const [center, setCenter] = useState<Location>(townCenter);
  useEffect(() => {
    if (loc) {
      setCenter(loc);
    }
  }, [loc]);

  return (
    <div className="map">
      <LoadScript googleMapsApiKey="AIzaSyBPwgAjsfJCRoR3nGFhZA8YzTzQNC7QUTw">
        <GoogleMap
          mapContainerClassName="map-container"
          zoom={13}
          center={center}
        >
          {markers}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
