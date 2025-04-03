import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type Option = {
  value: string,
  label: string
};

export const SelectSingle = ({ 
  id,
  value,
  handleChange, 
  label, 
  options 
}: {
  id: string,
  value: string,
  handleChange: (ev: SelectChangeEvent) => void,
  label: string,
  options: Option[]
}) => { 
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          value={value}
          label={label}
          onChange={handleChange}
        >
          {options.map(option => {
            return (
              <MenuItem value={option.value}>{option.label}</MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};
