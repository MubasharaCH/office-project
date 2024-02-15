import Uploader from '@/components/common/uploaderStoreFront';
import { Controller } from 'react-hook-form';

interface FileInputProps {
  control: any;
  name: string;
  multiple?: boolean;
  acceptFile?: boolean;
  helperText?: string;
  defaultValue?: any;
  setImageFile?: any;
  index?: any;
}

const FileInput = ({
  control,
  name,
  multiple = true,
  acceptFile = true,
  helperText,
  defaultValue = [],
  setImageFile,
  index,
}: FileInputProps) => {
  // console.log('>>>>>>>>>>>', setIndex);
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { ref, ...rest } }) => (
        <Uploader
          {...rest}
          multiple={multiple}
          acceptFile={acceptFile}
          helperText={helperText}
          setImageFile={setImageFile}
        />
      )}
    />
  );
};

export default FileInput;
