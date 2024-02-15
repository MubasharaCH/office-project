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
  AddingLocationFunction,
  UpdatingLocationFunction,
  GetFunction,
  GetSpecificFunction,
} from '../../services/Service';
import { useEffect, useState } from 'react';
import FormData from 'form-data';
import Select from 'react-select';

import { Switch } from '@headlessui/react';
import { selectStyles } from '../ui/select/select.styles';

type BannerInput = {
  title: string;
  description: string;
  image: AttachmentInput;
};

type FormValues = {
  name?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  ignite_pay_merchant?: string | null;
  feature_product?: string | null;
  payment_method?: string | null;
  custom_field3?: string | null;
};
const defaultValues = {
  // image: [],
  name: '',
  city: '',
  state: '',
  country: '',
  custom_field3: '',
  feature_product: '',
  payment_method: '',
  //details: '',
  // parent: '',
  //icon: '',
  // type: '',
  // description: '',
  //short_code: '',
};
type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateTypeForm(initialValues: any) {
  const [creatingLoading, setCreatingLoading] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState<any>([]);
  const [initialProduct, setInitialProduct] = useState<any>([]);
  const [productIdList, setProductIdList] = useState<any>([]);
  const [productIdInitial, setProductIdInitial] = useState<any>([]);
  const [enableMethod, setEnableMethod] = useState<any>([]);
  const [paymentKeys, setPaymentKeys] = useState<any>([]);
  const [paymentValues, setPaymentValues] = useState<any>([]);
  const [paymentMethods, setPaymentMethods] = useState<any>('');
  const [invoiceLayoutList, setInvoiceLayoutList] = useState<any>([]);
  const [selectedInvoiceLayout, setSelectedInvoiceLayout] = useState<any>({});
  const [isLoading, setIsLoading] = useState<any>(false);
  // const list:Array<T> = JSON.parse(localStorage.getItem('product_list')!);
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
  const [imageFile, setImageFile] = useState<any>();
  // const [path, setPath] = useState<string>(getValues('image'));
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('product_list')!);

    if (list) {
      const productList = list?.map((item, i) => {
        return {
          key: i,
          id: item.id,
          value: item.name,
          label: item.name,
        };
      });

      setProductList(productList);
    }
    GetFunction('/payment-methods').then((result) => {
      setPaymentKeys(Object.keys(result));
      setPaymentValues(Object.values(result));
    });

    let userDetail: any = localStorage.getItem('user_business_details');
    let parsingUserDetail = JSON.parse(userDetail);
    GetFunction('/invoice-layouts?business_id=' + parsingUserDetail?.id).then(
      (result) => {
        let value = result?.data?.map((item: any, index: any) => {
          return {
            key: index,
            id: item.id,
            value: item.name,
            label: item.name,
          };
        });
        setInvoiceLayoutList(value);
      }
    );
  }, []);

  useEffect(() => {
    const object = initialValues?.initialValues?.payment_methods?.reduce(
      (obj, item) => {
        obj[item.name] = { is_enabled: 1, account: null };
        return obj;
      },
      {}
    );
    setPaymentMethods(object);

    {
      initialValues.initialValues &&
        initialValues?.initialValues?.payment_methods?.map((item: any) => {
          setEnableMethod((current: any) => [...current, item?.name]);
          // setPaymentMethods({ ...paymentMethods, [item?.name]: { 'is_enabled': 1, 'account': null } })
        });
      let convert = eval(initialValues?.initialValues?.featured_products);
      convert?.map((item: any) => {
        setProductIdList((current: any) => [...current, item]);
        setProductIdInitial((current: any) => [...current, item]);
      });
      let invoiceDetail = {
        key: 1,
        id: initialValues?.initialValues?.invoice_layouts[0].id,
        value: initialValues?.initialValues?.invoice_layouts[0].name,
        label: initialValues?.initialValues?.invoice_layouts[0].name,
      };
      setSelectedInvoiceLayout(invoiceDetail);
    }

    //get invoice layout list
  }, [initialValues?.initialValues]);
  useEffect(() => {
    setIsLoading(true);
    if (productIdList.length != 0) {
      GetSpecificFunction('/product', productIdList).then((result) => {
        let value = result?.data?.map((item: any, index: any) => {
          return {
            key: index,
            id: item.id,
            value: item.name,
            label: item.name,
          };
        });
        setInitialProduct(value);
      });
      setIsLoading(false);
    } else {
      setInitialProduct([]);
    }
  }, [productIdList]);

  const handleFeatureProduct = (e) => {
    if (e.length != 0) {
      let value = e?.map((y) => {
        return y.id;
      });
      setProductIdList(value);
    } else {
      setProductIdList([]);
    }
  };
  const handleInvoiceList = (e) => {
    setSelectedInvoiceLayout(e);
  };

  const onChange = (item: string) => {
    if (enableMethod.includes(item)) {
      setEnableMethod(enableMethod.filter((i) => i !== item));
      // delete paymentMethods[item]
      setPaymentMethods({
        ...paymentMethods,
        [item]: { is_enabled: 0, account: null },
      });
    } else {
      setEnableMethod((current) => [...current, item]);
      setPaymentMethods({
        ...paymentMethods,
        [item]: { is_enabled: 1, account: null },
      });
    }
  };

  const onSubmit = (values: FormValues) => {
    let stringfy = JSON.stringify(paymentMethods);

    const form = {
      name: values.name,
      city: values.city,
      state: values.state,
      country: values.country,
      custom_field3: values.custom_field3,
      featured_products: productIdList,
      default_payment_accounts: stringfy,
      invoice_layout_id: selectedInvoiceLayout.id,
    };

    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);
      UpdatingLocationFunction('/business-location/', form, ID).then(
        (result) => {
          if (result.success) {
            toast.success(t('common:successfully-Updated'));
            setCreatingLoading(false);
            router.back();
          } else {
            toast.error(t(result.msg));
            setCreatingLoading(false);
          }
        }
      );
    } else {
      setCreatingLoading(true);

      AddingLocationFunction('/business-location', form).then((result) => {
        // setCreatingLoading(false);
        // setProductIdList([])
        if (result.success) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error(t(result.msg));
          setCreatingLoading(false);
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-location')}
          details={t('form:input-label-locat')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-city')}
            {...register('city')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-state')}
            {...register('state')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-country')}
            {...register('country')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          {/* <Input
            label={t('form:input-label-ignite-pay-merchant')}
            {...register('custom_field3')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
          {/* <Input
            label={t('form:input-label-feature-product')}
            {...register('feature_product')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          /> */}

          {/* <Input
            label={t('form:input-label-payment-method')}
            {...register('payment_method')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
          {/* <div>
            <label className='block mb-3 text-sm font-semibold leading-none text-body-dark'>{t('form:input-label-feature-product')}</label>

            <Select
            //defaultValue={initialProduct}
              options={productList}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.id}
              //{...register('feature_product')}
               value={initialProduct}
              onChange={handleFeatureProduct}
              isMulti
              styles={selectStyles}
            /> */}
          {/* <label className='block mb-3 mt-3 text-sm font-semibold leading-none text-body-dark'>{t('form:input-label-payment-method')}</label>
            <div className="grid grid-col-1 p-1">
              {paymentValues?.filter((item:any)=>{
                if(item?.toLowerCase()?.includes("custom")){
                  return
                }else{
                  return item
                }
              })?.map((item: any, i) => (
                <div key={i} className='p-2 mb-1 border rounded bg-slate-50 flex justify-between'>
                  <span className='' key={item}>{paymentValues[i]}</span>
                  <Switch
                    checked={enableMethod}
                    onChange={() => onChange(paymentKeys[i])}
                    className={`${enableMethod.includes(paymentKeys[i]) ? 'bg-accent' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                    dir="ltr"
                  >
                    <span className="sr-only">Enable </span>
                    <span
                      className={`${enableMethod.includes(paymentKeys[i]) ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                    />
                  </Switch>
                </div>

              ))}
            </div> */}

          {/* </div> */}
          {/* <TextArea
            label={t('form:input-description')}
            {...register('description')}
            error={t(errors.description?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-feature-product')}
          // details={t('Add New Location ')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            <label className="block mb-3 text-sm font-semibold leading-none text-body-dark">
              {t('form:input-label-feature-product')}
            </label>
            {initialValues?.initialValues ? (
              <Select
                //defaultValue={initialProduct}
                options={productList}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.id}
                //{...register('feature_product')}
                value={initialProduct}
                onChange={handleFeatureProduct}
                isMulti
                styles={selectStyles}
              />
            ) : (
              <Select
                //defaultValue={initialProduct}
                options={productList}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.id}
                //{...register('feature_product')}
                // value={initialProduct}
                onChange={handleFeatureProduct}
                isMulti
                styles={selectStyles}
              />
            )}
          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-invoice-layout')}
          // details={t('Add New Location ')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            <label className="block mb-3 text-sm font-semibold leading-none text-body-dark">
              {t('form:input-label-invoice-layout')}
            </label>
            <Select
              //defaultValue={initialProduct}
              options={invoiceLayoutList}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.id}
              //{...register('feature_product')}
              value={selectedInvoiceLayout}
              onChange={handleInvoiceList}
              styles={selectStyles}
            />
          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-payment-method')}
          // details={t('Add New Location ')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            <label className="block mb-3 mt-3 text-sm font-semibold leading-none text-body-dark">
              {t('form:input-label-payment-method')}
            </label>
            <div className="grid grid-col-1 p-1">
              {paymentValues
                ?.filter((item: any) => {
                  if (item?.toLowerCase()?.includes('custom')) {
                    return;
                  } else {
                    return item;
                  }
                })
                ?.map((item: any, i) => (
                  <div key={i} className="p-2 mb-1  flex justify-between">
                    <span className="" key={item}>
                      {paymentValues[i]}
                    </span>
                    <Switch
                      checked={enableMethod}
                      onChange={() => onChange(paymentKeys[i])}
                      className={`${
                        enableMethod.includes(paymentKeys[i])
                          ? 'bg-accent'
                          : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
                      dir="ltr"
                    >
                      <span className="sr-only">Enable </span>
                      <span
                        className={`${
                          enableMethod.includes(paymentKeys[i])
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
                      />
                    </Switch>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>

      {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('Brand Image')}
          details={t('Upload Brand Image')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="promotional_sliders"
            control={control}
            setImageFile={setImageFile}
            multiple={false}

          />
          <img
            style={{ width: '50px', height: '50px', marginTop: '1rem' }}
            src={path}
            alt="cate-image"
          />
        </Card>
      </div> */}

      <div className="mb-4 text-end">
        {initialValues.initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
        )}

        <Button loading={creatingLoading}>
          {initialValues.initialValues
            ? t('common:update-location')
            : t('common:add-location')}
        </Button>
      </div>
    </form>
  );
}
