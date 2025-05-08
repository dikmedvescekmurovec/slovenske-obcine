import { Close } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

  const regions = ['Koroška', 'Štajerska', 'Dolenjska, Štaj.', 'Dolenj., Gorenjska', 'Prekmurje', 'Primorska, Notr.', 'Notranjska', 'Gorenjska', 
    'Dolenjska', 'Primorska']

interface RegionSelectProps {
  onChange: (e: any) => void;
};

const RegionSelect: React.FC<RegionSelectProps> = (props) => {
  const [selectedRegions, setSelectedRegions] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selectedRegions>) => {
    const {
      target: { value },
    } = event;
    setSelectedRegions(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    props.onChange(typeof value === 'string' ? value.split(',') : value)
  };

  return (
    <Stack direction={'row'}>
      <FormControl sx={{ m: 1, width: '100%' }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedRegions}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {regions.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={selectedRegions.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
        <IconButton onClick={() => {setSelectedRegions([]); props.onChange([])}}>
          <Close></Close>
        </IconButton>
    </Stack>
  );
}

export default RegionSelect;