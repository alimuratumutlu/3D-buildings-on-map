import { Typography } from "@/components";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { LOAD_GEOJSON } from "constants/Titles";
import useGeojson from "hooks/useGeojson";

const files = [
  { name: "Lausanne", value: "Lausanne-74981" },
  { name: "Corseaux", value: "Corseaux-119252" },
  { name: "Geneve", value: "Geneve-2026352" }
];

export default function FileSelector() {
  const { loadPredefinedFile } = useGeojson();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      loadPredefinedFile(selectedValue);
    }
  };

  return (
    <div>
      <Typography variant="h6">{LOAD_GEOJSON}</Typography>
      <Select
        fullWidth
        defaultValue=""
        onChange={handleChange}
      >
        <MenuItem value="" disabled>Select a location</MenuItem>
        {files.map((file) => (
          <MenuItem key={file.value} value={file.value}>
            {file.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
