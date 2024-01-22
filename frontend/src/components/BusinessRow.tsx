import { TableRow, TableCell } from "@mui/material";
import { Item } from "../App";

const BusinessRow = ({ business }: { business: Item }) => {
  const { discount, name, phoneNumbers, websites, emailAddresses } = {
    ...business,
  };
  console.log("business: ", business);
  const rows = (
    <TableRow key={name}>
      <TableCell>{name}</TableCell>
      <TableCell>{discount}</TableCell>
      <TableCell>
        {phoneNumbers &&
          phoneNumbers.map((num: string, idx: number) => {
            return (
              <div key={`${num}${idx}`}>
                <a href={`tel:${num}`}>{num}</a>
              </div>
            );
          })}
        {emailAddresses &&
          emailAddresses.map((email: string, idx: number) => {
            return (
              <div key={`${email}${idx}`}>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            );
          })}
        {websites &&
          websites.map((site: string, idx: number) => {
            const website: string = site.includes("http")
              ? site
              : `http://${site}`;
            const isWebsite = site.length > 4;
            if (isWebsite && !site.includes("http")) {
              return (
                <a
                  key={`${website}${idx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={website}
                >
                  {website}
                </a>
              );
            }
          })}
      </TableCell>
    </TableRow>
  );
  return rows;
};

export default BusinessRow;
