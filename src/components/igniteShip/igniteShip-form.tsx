import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from '@/components/ui/file-input';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import TextArea from '@/components/ui/text-area';
import { toast } from 'react-toastify';
import {
  AddingFunction,
  AddShipping,
  DashboardGetFun,
  UpdatingLayoutFunction,
} from '../../services/Service';
import { useEffect, useState } from 'react';
import FormData from 'form-data';
import { Switch } from '@headlessui/react';
import Label from '../ui/label';
import Select, { createFilter } from 'react-select';
// import Select from '../ui/select/select';
import { selectStyles } from '../ui/select/select.styles';
import { FixedSizeList as List } from 'react-window';
import { GetFunction } from '@/services/Service';

// type BannerInput = {
//   title: string;
//   description: string;
//   image: AttachmentInput;
// };

type FormValues = {
  name?: string | null;
  //  title?: string | null;
  icon?: any;
  promotional_sliders: AttachmentInput[];
  // banners: BannerInput[];
  settings: TypeSettingsInput;
  description: string | null;
  image: any;
  design: any;
  sub_heading_line1: any;
  sub_heading_line2: any;
  sub_heading_line3: any;
  footer_text: any;
};
const defaultValues = {
  image: [],
  name: '',
  details: '',
  parent: '',
  icon: '',
  type: '',
  description: '',
  short_code: '',
  sub_heading_line1: '',
  sub_heading_line2: '',
  sub_heading_line3: '',
  footer_text: '',
};
type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateTypeForm(initialValues: any) {
  const [creatingLoading, setCreatingLoading] = useState(false);
  var form = new FormData();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: initialValues.initialValues
      ? {
          ...initialValues.initialValues,
        }
      : defaultValues,
  });
  // const base_url = process.env.NEXT_PUBLIC_URL
  const [status, setStatus] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<any>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>([]);
  const [title, setTitle] = useState('');
  const [arabicTitle, setArabicTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [arabicNotes, setArabicNotes] = useState('');
  const [CountryList, setCountryList] = useState<any>([]);
  const [CountryListPayload, setCountryListPayload] = useState<any>([]);
  const [CityList, setCityList] = useState<any>([]);
  const [CityListNew, setCityListNew] = useState<any>([]);
  const [CityListPayload, setCityListPayload] = useState([]);
  const [value, setValues] = useState<any>(false);
  const [rateValue, setRateValue] = useState<any>('fixed');
  const [codeFee, setCodeFee] = useState<any>(false);
  const [shippingRate, setShippingRate] = useState<any>();

  const height = 35;

  const MenuList = ({ options, children, maxHeight, getValue }) => {
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;

    return (
      <List
        width="100%"
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  };
  let shippingRateArray = [
    { label: 'Fixed', value: 'fixed' },
    // { label: 'Free', value: 'free' },
    // { label: 'Weight', value: 'weight' },
  ];

  useEffect(() => {
    DashboardGetFun('/currencies').then((result1) => {
      let ordersData = result1.map((data, i) => {
        return {
          id: data.id,
          value: data.country.toLowerCase(),
          label: data.country,
          city: data.cities,
        };
      });
      setCountryList(ordersData);
    });
  }, []);

  useEffect(() => {
    GetFunction('/all-shipping-methods').then((result) => {
      const shippingList = result?.data.map((item, i) => {
        return {
          key: i,
          id: item.id,
          value: item.name,
          label: item.name,
        };
      });
      setShippingMethod(shippingList);
    });
  }, []);

  const onSubmit = () => {
    setCreatingLoading(true);
    let newStatus = '';
    {
      status === true ? (newStatus = 'active') : (newStatus = 'inactive');
    }
    const formValue = {
      shipping_method_id: selectedShippingMethod.id,
      title: title,
      arabic_title: arabicTitle,
      notes: notes,
      arabic_notes: arabicNotes,
      status: newStatus,
      country_city: CityListPayload,
      is_cod: value == false ? 0 : 1,
      cod_rate: codeFee,
      shipping_rate_type: rateValue,
      base_shipping_fee: shippingRate,
      // additional_shipping_fee: 'fixed',
    };

    // "is_cod": 1,
    //  "cod_rate": 100,
    //   "shipping_rate_type": "free",
    //
    //    "base_weight": 2,
    //    "additional_shipping_fee": 10,
    //    "weight_increment": 11,
    //     "country_city": [{ "pakistan": ["lahore", "karachi"] }]
    AddShipping('/business-shipping', formValue).then((result) => {
      if (result.success == true) {
        toast.success(result.msg);
        setCreatingLoading(false);

        router.back();
      } else {
        toast.error(result.message);
        setCreatingLoading(false);
      }
    });

    // if (initialValues.initialValues) {
    //     let ID = initialValues.initialValues.id;
    //     setCreatingLoading(true);
    //     UpdatingLayoutFunction('/invoice-layouts', form, ID).then((result) => {
    //         if (result.success) {
    //             toast.success(t('common:successfully-Updated'));
    //             setCreatingLoading(false);

    //             router.back();
    //         } else {
    //             toast.error(t(result.message));
    //             setCreatingLoading(false);
    //         }
    //     });
    // } else {
    //     setCreatingLoading(true);

    //     AddingFunction('/invoice-layouts', form).then((result) => {
    //         if (result.success) {
    //             toast.success(t('common:successfully-created'));
    //             setCreatingLoading(false);
    //             router.back();
    //         } else {
    //             toast.error(t(result.message));
    //             setCreatingLoading(false);
    //         }
    //     });
    // }
  };
  const onChangeCountry = (e) => {
    setCityListNew([]);
    setCityList([]);
    setCountryListPayload(e);
    e.map((res) => {
      let cityLiast = res?.city?.map((aa, i) => {
        return {
          label: aa,
          value: aa,
          id: i,
        };
      });

      setCityList([...CityList, cityLiast]);
      let cities: any = [];
      [...CityList, cityLiast]?.map((resss) => {
        resss?.map((res, i) => {
          cities.push({ value: res.value, label: res.label, id: i });
        });
      });
      let finalArray = cities.sort(function (a, b) {
        var labelA = a.label.toUpperCase();
        var labelB = b.label.toUpperCase();

        // Check if the label contains "All"
        var containsAllA = labelA.includes('ALL');
        var containsAllB = labelB.includes('ALL');

        // Sort cities with "All" label at the start
        if (containsAllA && !containsAllB) {
          return -1;
        }
        if (!containsAllA && containsAllB) {
          return 1;
        }

        // Sort remaining cities alphabetically
        if (labelA < labelB) {
          return -1;
        }
        if (labelA > labelB) {
          return 1;
        }
        return 0;
      });

      setCityListNew(finalArray);
    });
  };

  const onChangeCityLIst = (e) => {
    let newwarr: any = {};

    e.map((ew) => {
      const selectedCountry = CountryListPayload.find((country) =>
        country.city.some((city) => city === ew.value)
      );

      if (selectedCountry) {
        if (Array.isArray(newwarr[selectedCountry.value])) {
          if (ew.value.toLowerCase().includes('all')) {
            newwarr[selectedCountry.value].push('all');
          } else {
            newwarr[selectedCountry.value].push(ew.value.toLowerCase());
          }
        } else {
          if (ew.value.toLowerCase().includes('all')) {
            newwarr[selectedCountry.value] = ['all'];
          } else {
            newwarr[selectedCountry.value] = [ew.value.toLowerCase()];
          }
        }
        // if (Array.isArray(newwarr[selectedCountry.value])) {
        //     newwarr[selectedCountry.value].push(ew.value.toLowerCase());
        // } else {
        //     newwarr[selectedCountry.value] = [ew.value.toLowerCase()];
        // }
      }
    });

    setCityListPayload(newwarr);
  };
  const onChangeRate = (e) => {
    setRateValue(e.value);
  };
  const onChangeShippingRate = (e) => {
    setShippingRate(e.target.value);
  };

  const onChangeCodeFee = (e) => {
    setCodeFee(e.target.value);
  };

  const onChangeShipping = (e) => {
    setSelectedShippingMethod(e);
  };
  const onChangeStatus = (e: any) => {
    setStatus((value: any) => !value);
  };
  const onChange = (e: any) => {
    setValues((value: any) => !value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-title-shipping')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            <Label>{t('form:input-label-select-shipping-method')}</Label>
            <Select
              styles={selectStyles}
              name="shipping_method_id"
              options={shippingMethod}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.id}
              //   defaultValue={shippingRateArray[0]}
              onChange={onChangeShipping}
            />
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-title')}
          // details={t('Add New Brand Description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-title')}
            name={'newTitle'}
            // {...register('name')}
            // error={t(errors.name?.message!)}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            variant="outline"
            className="mb-5 text-start"
          />

          <Input
            label={t('form:input-arabic-title')}
            name={'arabicTitle'}
            // {...register('name')}
            value={arabicTitle}
            onChange={(e) => {
              setArabicTitle(e.target.value);
            }}
            // error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5 text-start"
          />
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-notes')}
          // details={t('Add New Brand Description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <TextArea
            label={t('form:input-label-notes')}
            name={'notes'}
            // {...register('details')}
            variant="outline"
            className="mb-5"
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
          />
          <TextArea
            label={t('form:input-label-arabic-notes')}
            // {...register('details')}
            name={'arabicNotes'}
            variant="outline"
            className="mb-5"
            value={arabicNotes}
            onChange={(e) => {
              setArabicNotes(e.target.value);
            }}
          />
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-status')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-status')}</Label>
            <Switch
              checked={status}
              className={`${
                status ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
              name=""
              onChange={onChangeStatus}
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${
                  status ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
        </Card>
      </div>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        {/* <h1 className="text-lg font-semibold text-heading">
                    {t('Ignite Ship')}
                </h1> */}
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:label-countries-cities')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            <Label>{t('form:input-label-select-country')}</Label>

            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              styles={selectStyles}
              name="business_location_id"
              options={CountryList}
              isMulti
              onChange={onChangeCountry}
            />
          </div>
          <div className="pt-5">
            <Label>{t('form:input-label-select-city')}</Label>
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              styles={selectStyles}
              components={{ MenuList }}
              isMulti
              options={CityListNew}
              onChange={onChangeCityLIst}
            />
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-title-shipping')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            <Label>{t('form:input-label-select-shipping-rate-type')}</Label>
            <Select
              styles={selectStyles}
              name="business_location_id"
              options={shippingRateArray}
              defaultValue={shippingRateArray[0]}
              onChange={onChangeRate}
            />
          </div>
          <div className="mt-5">
            <Input
              label={t('form:input-label-shipping-rate')}
              name=""
              type="number"
              variant="outline"
              className="mb-5"
              value={shippingRate}
              onChange={onChangeShippingRate}
            />
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-cash-on-delivery')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-cash-on-delivery')}</Label>
            <Switch
              checked={value}
              className={`${
                value ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
              name=""
              onChange={onChange}
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${
                  value ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
          {value && (
            <>
              <div>
                <Input
                  label={t('form:input-label-cod-fee')}
                  name=""
                  type="number"
                  variant="outline"
                  className="mb-5"
                  value={codeFee}
                  onChange={onChangeCodeFee}
                />
              </div>
            </>
          )}
        </Card>
      </div>
      {/* <div className="my-5 flex flex-wrap sm:my-8">
                <Description
                    title={t('form:input-label-shipping-rate')}
                    className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
                />
                <Card className="w-full sm:w-8/12 md:w-2/3">
                    <Input
                        label={t('form:input-label-shipping-rate')}
                        name=""
                        type="number"
                        variant="outline"
                        className="mb-5"
                        value={shippingRate}
                        onChange={onChangeShippingRate}
                    />
                </Card>
            </div> */}

      <div className="mb-4 text-end">
        {/* {initialValues.initialValues && (
                    <Button
                        variant="outline"
                        onClick={router.back}
                        className="me-4"
                        type="button"
                    >
                        {t('form:button-label-back')}
                    </Button>
                )} */}

        <Button loading={creatingLoading}>
          {initialValues.initialValues
            ? t('Update Invoice Layout')
            : t('form:button-title-add-shipping')}
        </Button>
      </div>
    </form>
  );
}
