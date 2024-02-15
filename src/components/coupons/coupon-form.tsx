import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '../ui/label';
import Select, { createFilter } from 'react-select';
import { selectStyles } from '../ui/select/select.styles';
import { useRouter } from 'next/router';
import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import FormData from 'form-data';
import moment from 'moment';
import { Calendar } from 'react-date-range';
import {
  AddingCouponsFunction,
  AddingFunction,
  UpdatingCouponFunction,
  UpdatingFunction,
  GetFunction,
} from '@/services/Service';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

type FormValues = {
  code?: string | null;
  amount?: string | null;
  radio?: string | null;
  qty?: string | null;
  note?: string | null;
  date?: string | null;
};
const defaultValues = {
  code: '',
  amount: '',
  radio: '',
  qty: '',
  note: '',
  date: '',
};
type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateTypeForm(initialValues: any) {
  // console.log(initialValues);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const [showCalander, setShowCalander] = useState(false);
  const [showCalanderEnd, setShowCalanderEnd] = useState(false);
  const [Dates, setDate] = useState<any>();
  const [DatesEnd, setDateEnd] = useState<any>();

  const [couponType, setCouponType] = useState<any>([
    {
      key: 0,
      id: 0,
      value: 'product',
      label: 'Product',
    },
    {
      key: 1,
      id: 1,
      value: 'category',
      label: 'Category',
    },
    // {
    //   key: 2,
    //   id: 2,
    //   value: 'invoice',
    //   label: 'Invoice',
    // },
  ]);

  const [coupon_type, setSelectedCouponType] = useState<any>(""); //coupon_type (product,category,invoice)

  const [coupon_type_value, setCouponTypeValue] = useState<any>(); //coupon_type_value (comma seprated ids)
  const [commonList, setCommonList] = useState<any>([]);

  const valueType = [
    {
      key: 0,
      id: 0,
      value: 'fixed',
      label: 'Fixed',
    },
    {
      key: 1,
      id: 1,
      value: 'percentage',
      label: 'Percentage',
    },
  ];

  const [selectedValueType, setSelectedValueType] = useState<any>(valueType[0]); //value_type  (fixed,percentage)

  // console.log(selectedValueType);

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
  let currentDate = moment(new Date()).format('YYYY-MM-DD');
  useEffect(() => {
    if (initialValues?.initialValues) {
      setDate(initialValues?.initialValues?.start_date);
      setDateEnd(initialValues?.initialValues?.expire_date);
      setSelectedValueType(
        valueType.find(
          (item) => item.value === initialValues?.initialValues?.value_type
        )
      );
      setSelectedCouponType(
        couponType.find(
          (item) => item.value === initialValues?.initialValues?.coupon_type
        )
      );

      const couponTypeValueIds = initialValues?.initialValues?.coupon_type_value
        ?.split(',')
        ?.map(Number); // Convert the string of IDs to an array of numbers

      if (initialValues?.initialValues?.coupon_type === 'product') {
        setCreatingLoading(true);
        GetFunction(
          '/product?brand_id=&category_id=&name=&sku=&location_id=&per_page=-1'
        ).then((result) => {
          let newvariable: any = result?.data.map((item, i) => ({
            key: i,
            id: item.id,
            value: item.name,
            label: item.name,
          }));
          // console.log(result?.data?.length);
          setCommonList(newvariable);

          const selectedItems = newvariable?.filter((item) =>
            couponTypeValueIds?.includes(item.id)
          );

          // Assuming you have a state function like setCouponTypeValue to set the selected items
          setCouponTypeValue(selectedItems);

          setCreatingLoading(false);
        });
      } else if (initialValues?.initialValues?.coupon_type === 'category') {
        setCreatingLoading(true);
        GetFunction('/taxonomy').then((result) => {
          let newvariable: any = result?.data.map((item, i) => ({
            key: i,
            id: item.id,
            value: item.name,
            label: item.name,
          }));
          // console.log(result?.data?.length);
          setCommonList(newvariable);
          const selectedItems = newvariable?.filter((item) =>
            couponTypeValueIds?.includes(item.id)
          );

          // Assuming you have a state function like setCouponTypeValue to set the selected items
          setCouponTypeValue(selectedItems);
          setCreatingLoading(false);
        });
      }

      // value_type: selectedValueType.value,
      // coupon_type: coupon_type.value,
      // coupon_type_value: idsString
    }
  }, [initialValues.initialValues]);

  const onSubmit = (values: FormValues) => {
    const selectedIds = coupon_type_value?.map((item) => item.id);
    const idsString = selectedIds?.join(',');
    let ID = initialValues?.initialValues?.id;
    let form = {
      code: values.code,
      amount: values.amount,
      radio: 'yes',
      qty: values.qty,
      start_date: Dates,
      expire_date: DatesEnd,
      note: values.note,
      value_type: selectedValueType.value,
      coupon_type: coupon_type.value,
      coupon_type_value: idsString,
    };

    let UpdateForm = {
      coupon_id: ID,
      code: values.code,
      amount: values.amount,
      radio: 'yes',
      qty: values.qty,
      start_date: Dates,
      expire_date: DatesEnd,
      note: values.note,
      value_type: selectedValueType.value,
      coupon_type: coupon_type.value,
      coupon_type_value: idsString,
    };
    if (initialValues.initialValues) {
      setCreatingLoading(true);

      UpdateForm.value_type = selectedValueType.value;
      UpdateForm.coupon_type = coupon_type.value;
      UpdateForm.coupon_type_value = idsString;

      UpdatingCouponFunction('/update-coupons', UpdateForm).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          // toast.error('Something Went Wrong');
          // setCreatingLoading(false);

          // console.log(form);
          let missingKey = ''; // Initialize a variable to store the first missing key
          // Iterate through the object and check for missing or undefined values
          for (const key in UpdateForm) {
            if (
              UpdateForm.hasOwnProperty(key) &&
              (UpdateForm[key] === undefined || UpdateForm[key] === '')
            ) {
              if (key === 'amount') {
                missingKey = 'Amount';
              } else if (key === 'code') {
                missingKey = 'Code';
              } else if (key === 'coupon_type') {
                missingKey = 'Coupon type';
              } else if (
                key === 'coupon_type_value' &&
                UpdateForm.value_type !== 'invoice'
              ) {
                missingKey = 'Coupon Type Value';
              } else if (key === 'expire_date') {
                missingKey = 'Expire date';
              } else if (key === 'note') {
                missingKey = 'Note';
              } else if (key === 'qty') {
                missingKey = 'Quantity';
              } else if (key === 'start_date') {
                missingKey = 'Start Date';
              } else if (key === 'value_type') {
                missingKey = 'Value Type';
              }
              break; // Exit the loop
            }
          }
          if (missingKey) {
            toast.error(`${missingKey} is required`);
          } else {
            toast.error(`${result.message}`);
          }
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);
      form.value_type = selectedValueType.value;
      form.coupon_type = coupon_type.value;
      form.coupon_type_value = idsString;

      AddingCouponsFunction('/create-coupon', form).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          // console.log(form);
          let missingKey = ''; // Initialize a variable to store the first missing key
          // Iterate through the object and check for missing or undefined values
          for (const key in form) {
            if (
              form.hasOwnProperty(key) &&
              (form[key] === undefined || form[key] === '')
            ) {
              if (key === 'amount') {
                missingKey = 'Amount';
              } else if (key === 'code') {
                missingKey = 'Code';
              } else if (key === 'coupon_type') {
                missingKey = 'Coupon type';
              } else if (
                key === 'coupon_type_value' &&
                form.coupon_type != 'invoice'
              ) {
                console.log(
                  key === 'coupon_type_value' && form.coupon_type != 'invoice'
                );
                missingKey = 'Coupon Type Value';
              } else if (key === 'expire_date') {
                missingKey = 'Expire date';
              } else if (key === 'note') {
                missingKey = 'Note';
              } else if (key === 'qty') {
                missingKey = 'Quantity';
              } else if (key === 'start_date') {
                missingKey = 'Start Date';
              } else if (key === 'value_type') {
                missingKey = 'Value Type';
              }
              break; // Exit the loop
            }
          }
          if (missingKey) {
            toast.error(`${missingKey} is required`);
          } else {
            toast.error(`${result.message}`);
          }
          setCreatingLoading(false);
        }
      });
    }
  };

  const OnChangeValueType = (e) => {
    // console.log(e);
    setSelectedValueType(e);
  };

  const OnChangeCouponType = (e) => {
    if (e.value === coupon_type.value) {
      return;
    }
    setSelectedCouponType(e);
    setCommonList([]);
    setCouponTypeValue([]);
    if (e.value === 'product') {
      setCreatingLoading(true);
      GetFunction(
        '/product?brand_id=&category_id=&name=&sku=&location_id=&per_page=-1'
      ).then((result) => {
        let newvariable: any = result?.data.map((item, i) => ({
          key: i,
          id: item.id,
          value: item.name,
          label: item.name,
        }));
        // console.log(result?.data?.length);
        setCommonList(newvariable);
        setCreatingLoading(false);
      });
    } else if (e.value === 'category') {
      setCreatingLoading(true);
      GetFunction('/taxonomy').then((result) => {
        let newvariable: any = result?.data.map((item, i) => ({
          key: i,
          id: item.id,
          value: item.name,
          label: item.name,
        }));
        // console.log(result?.data?.length);
        setCommonList(newvariable);
        setCreatingLoading(false);
      });
    } else if (e.value === 'invoice') {
    }
  };

  const OnChangeCouponTypeValue = (e) => {
    setCouponTypeValue(e);
  };

  const onhowCalannder = () => {
    setShowCalander(!showCalander);
  };

  const onhowCalannderEnd = () => {
    setShowCalanderEnd(!showCalanderEnd);
  };

  const handleSelect = (date) => {
    let dates = moment(date).format('YYYY-MM-DD');
    setDate(dates);
    setShowCalander(!showCalander);
  };

  const handleSelectEnd = (date) => {
    let dates = moment(date).format('YYYY-MM-DD');
    setDateEnd(dates);
    setShowCalanderEnd(!showCalanderEnd);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('common:desccription')}
          details={t('common:add-new-coupons')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('common:code')}
            {...register('code')}
            error={t(errors.code?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('common:amount')}
            {...register('amount', { min: 0 })}
            error={t(
              errors?.amount?.type === 'min'
                ? 'Please Enter Valid Value'
                : errors.amount?.message!
            )}
            min={0}
            variant="outline"
            type="number"
            className="mb-5"
          />
          <Input
            label={t('common:qty')}
            {...register('qty', { min: 0 })}
            type="number"
            min={0}
            error={t(
              errors?.qty?.type === 'min'
                ? 'Please Enter Valid Value'
                : errors.qty?.message!
            )}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('common:note')}
            {...register('note')}
            error={t(errors.note?.message!)}
            variant="outline"
            className="mb-5"
          />
          <div className="mb-5 w-full ">
            <div onClick={onhowCalannder}>
              <Input
                // {...register('date')}
                label={t('form:form-item-start-date')}
                name="credit_limit"
                variant="outline"
                value={Dates}
              />
            </div>
            {showCalander && (
              <div style={{ zIndex: 999 }}>
                <Calendar
                  color="bg-accent"
                  date={new Date()}
                  onChange={handleSelect}
                />
              </div>
            )}
          </div>
          <div className="mb-5 w-full ">
            <div onClick={onhowCalannderEnd}>
              <Input
                // {...register('date')}
                label={t('form:form-item-end-date')}
                name="credit_limit"
                variant="outline"
                value={DatesEnd}
              />
            </div>
            {showCalanderEnd && (
              <div style={{ zIndex: 999 }}>
                <Calendar
                  color="bg-accent"
                  date={new Date()}
                  onChange={handleSelectEnd}
                />
              </div>
            )}
          </div>

          <div className="mb-5 w-full ">
            <Label>{t('form:form-item-value-type')}</Label>
            <Select
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.key}
              options={valueType}
              value={selectedValueType} // Set the default value
              onChange={OnChangeValueType}
            />
          </div>

          <div className="mb-5 w-full ">
            <Label>{t('form:form-item-coupon-type')}</Label>
            {/* <Select
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.key}
              value={coupon_type}
              options={couponType}
              onChange={OnChangeCouponType}
            /> */}

            <Select
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.key}
              value={coupon_type} // Set the default value
              options={couponType}
              onChange={OnChangeCouponType}
            />
          </div>

          {coupon_type?.value && coupon_type?.value !== 'invoice' && (
            <div className="mb-5 w-full ">
              <Label>{t('form:form-item-coupon-type-value')}</Label>
              <Select
                styles={selectStyles}
                name="business_location_id"
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.id}
                options={commonList}
                value={coupon_type_value}
                onChange={OnChangeCouponTypeValue}
                isMulti
              />
            </div>
          )}
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button loading={creatingLoading}>
          {initialValues.initialValues
            ? t('common:update-coupon')
            : t('common:add-coupon')}
        </Button>
      </div>
    </form>
  );
}
