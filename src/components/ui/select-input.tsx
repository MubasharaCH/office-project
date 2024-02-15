import Select from '@/components/ui/select/select';
import { Controller } from 'react-hook-form';
import { GetOptionLabel } from 'react-select';

interface SelectInputProps {
  control: any;
  rules?: any;
  name: string;
  options: object[];
  getOptionLabel?: GetOptionLabel<unknown>;
  getOptionValue?: GetOptionLabel<unknown>;
  isMulti?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  defaultValue?: any;
  placeholder?: string;
  onChange?: (value: any) => void; // Add the onChange prop here
}

const SelectInput = ({
  control,
  options,
  name,
  rules,
  getOptionLabel,
  getOptionValue,
  disabled,
  isMulti,
  isClearable,
  isLoading,
  defaultValue,
  placeholder,
  onChange, // Destructure onChange from props
}: SelectInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <Select
          {...field}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isMulti={isMulti}
          isClearable={isClearable}
          isLoading={isLoading}
          options={options}
          isDisabled={disabled as boolean}
          value={field.value}
          onChange={(value) => {
            field.onChange(value);
            if (onChange) {
              onChange(value); // Call the custom onChange prop if provided
            }
          }}
        />
      )}
    />
  );
};

export default SelectInput;
