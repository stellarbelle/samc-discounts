import React, { useState } from "react";
import list from "./assets/list.json";
import BusinessRow from "./components/BusinessRow";
import Form from "./components/Form";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
} from "@mui/material";
import arrow from "../public/feathered-arrow.png";

export interface Item {
  name: string;
  category: string;
  discount: string;
  location?: { lat: number; lng: number };
  address?: string;
  dist?: number;
  phoneNumbers?: string[];
  emailAddresses?: string[];
  websites?: string[];
}

const placeList = (list as Item[]).filter((place, index) => {
  const placeName = place.name;
  const isDupe =
    index ===
    list.findIndex((obj) => {
      return obj.name === placeName;
    });
  return isDupe;
});

function App() {
  const [filteredList, setFilteredList] = useState<Item[]>(placeList);
  const [value, setValue] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const [categoryList, setCategoryList] = useState<string[]>([]);
  // const [center, setCenter] = useState();
  const getSelectedList = (value: string) => {
    setValue("");
    if (!value.length) return placeList;
    const updatedList = placeList.filter((item: Item) => {
      if (!value.length || value === "All") return item;
      if (item.category.indexOf(value) !== -1) {
        return item;
      }
    });
    setSelected(value);
    setFilteredList(updatedList);
  };
  const filterBySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);
    setSelected("");
    const updatedList = placeList.filter((item: Item) => {
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
        return item;
      }
    });
    setFilteredList(updatedList);
  };

  const addCategory = (category: string) => {
    if (categoryList.indexOf(category) === -1) {
      const updatedCategories = categoryList.concat(category);
      setCategoryList(updatedCategories);
    }
  };

  const businessRows = filteredList.map((business: Item, idx: number) => {
    addCategory(business.category);
    return <BusinessRow business={business} key={idx} />;
  });

  const table = (
    <TableContainer sx={{ maxHeight: 440, width: "100%", overflow: "scroll" }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Business Name</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Contact/Website</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{businessRows}</TableBody>
      </Table>
    </TableContainer>
  );
  return (
    <>
      <div className="container">
        <h1 class={"text-pink font-serif"}>Suwanee Area Moms Club</h1>
        <img src={arrow} alt="feathered arrow" />
        <h2 class={"text-pink font-serif"}>Member Discount List</h2>
        <Form
          selected={selected}
          categories={categoryList}
          value={value}
          filterBySearch={filterBySearch}
          getSelectedList={getSelectedList}
        />
        <div className="list">{table || "Loading..."}</div>
      </div>
    </>
  );
}

export default App;
