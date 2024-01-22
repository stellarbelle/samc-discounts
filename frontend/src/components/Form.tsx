import {
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";

interface Props {
  selected: string;
  categories: string[];
  value: string;
  filterBySearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getSelectedList: (string) => void;
}

const Form = (props: Props) => {
  const { selected, categories, value, filterBySearch, getSelectedList } =
    props;
  return (
    <form>
      <p class={"text-lightPink"} className="subheading">
        An easy way to find the discount you are looking for! Just search below!
      </p>
      <div class={"text-blue"} className="search-text">
        Search Me!
      </div>
      <TextField
        id="search-box"
        type="search"
        label="Search"
        variant="outlined"
        onChange={filterBySearch}
        value={value}
      />
      <div class={"text-blue"} className="search-text">
        Or select a category from the dropdown
      </div>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selected}
          onChange={(event: SelectChangeEvent<string>) =>
            getSelectedList(event.target.value)
          }
          label="Category"
        >
          {categories.map((category: string, index: number) => {
            return (
              <MenuItem
                value={category}
                key={index}
                selected={selected === category}
              >
                {category}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </form>
  );
};
export default Form;
