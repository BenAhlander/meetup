import * as React from "react";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import places from "@/constants/places.json";

interface ComboBoxProps {
  setPlace: (place: string) => void;
}

export default function ComboBox({ setPlace }: ComboBoxProps) {
  return (
    <Autocomplete
      disablePortal
      options={places}
      onInputChange={(event, newInputValue) => {
        setPlace(newInputValue);
      }}
      renderInput={(params) => <TextField {...params} label="Places" />}
    />
  );
}
