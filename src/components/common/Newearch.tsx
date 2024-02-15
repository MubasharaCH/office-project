import { CloseIcon } from '@/components/icons/close-icon';
import { SearchIcon } from '@/components/icons/search-icon';
import cn from 'classnames';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

const classes = {
  root:
    'ps-10 pe-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0',
  normal:
    'bg-gray-100 border border-border-base focus:shadow focus:bg-light focus:border-accent',
  solid:
    'bg-gray-100 border border-border-100 focus:bg-light focus:border-accent',
  outline: 'border border-border-base focus:border-accent',
  shadow: 'focus:shadow',
};

type SearchProps = {
  className?: string;
  shadow?: boolean;
  variant?: 'normal' | 'solid' | 'outline';
  inputClassName?: string;
  // onSearch: (data: SearchValue) => void;
  textVal?: string;
  onChangeearchVal: any;
  readOnly?: any;
  placeholder?:any
};

type SearchValue = {
  searchText: string;
};

const Search: React.FC<SearchProps> = ({
  className,
  variant = 'outline',
  shadow = false,
  inputClassName,
  textVal,
  onChangeearchVal,
  readOnly,
  placeholder
}) => {
  const { t } = useTranslation();

  const rootClassName = cn(
    classes.root,
    {
      [classes.normal]: variant === 'normal',
      [classes.solid]: variant === 'solid',
      [classes.outline]: variant === 'outline',
    },
    {
      [classes.shadow]: shadow,
    },
    inputClassName
  );
  // const onChangeearchVal = (e:any) => {
  //   let val = e.target.value;
  //   textVal = val
  // };

  return (
    <form
      noValidate
      role="search"
      className={cn('relative flex w-full items-center', className)}
    >
      <label htmlFor="search" className="sr-only">
        {t('form:input-label-search')}
      </label>
      <button className="absolute p-2 text-body outline-none start-1 focus:outline-none active:outline-none">
        <SearchIcon className="h-5 w-5" />
      </button>
      <input
        readOnly={readOnly}
        autoFocus
        type="text"
        id="search"
        className={rootClassName}
        placeholder={placeholder? placeholder:t('form:input-placeholder-search')}
        onChange={onChangeearchVal}
      />
      {/* <button
        type="button"
        className="absolute p-2 text-body outline-none end-1 focus:outline-none active:outline-none"
      >
        <CloseIcon className="h-5 w-5" />
      </button> */}
    </form>
  );
};

export default Search;
