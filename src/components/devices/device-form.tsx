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
  AddingDeviceFunction,
  UpdatingLocationFunction,
  GetFunction,
  GetSpecificFunction,
} from '../../services/Service';
import { useEffect, useState } from 'react';
import FormData from 'form-data';
import Select from 'react-select';

import { Switch } from '@headlessui/react';
import { selectStyles } from '../ui/select/select.styles';
import Label from '../ui/label';

type BannerInput = {
  title: string;
  description: string;
  image: AttachmentInput;
};

type FormValues = {
  name?: string | null;
  //   license_code?: string | null;
  //   last_invoice_no?: string | null;
  //   invoice_sequence?: string | null;
};
const defaultValues = {
  name: '',
  //   license_code: '',
  //   last_invoice_no: '',
  //   invoice_sequence: ''
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
  const [paymentMethods, setPaymentMethods] = useState<any>({});
  const [isLoading, setIsLoading] = useState<any>(false);
  const [isStatus, setIsStatus] = useState<any>(false);
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

    {
      initialValues.initialValues &&
        initialValues?.initialValues?.payment_methods?.map((item: any) => {
          setEnableMethod((current: any) => [...current, item?.name]);
          // setPaymentMethods({ ...paymentMethods, [item?.name]: { 'is_enabled': 1, 'account': null } })
        });
      initialValues?.initialValues?.featured_products?.map((item: any) => {
        setProductIdList((current: any) => [...current, item]);
        setProductIdInitial((current: any) => [...current, item]);
      });
    }
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
  }, [initialValues?.initialValues]);

  const onSubmit = (values: FormValues) => {
    const form = {
      //   "name": values.name,
      //   "city": values.city,
      //   "state": values.state,
      //   "country": values.country,
      //   "custom_field3": values.ignite_pay_merchant,
      //   "featured_products": productIdList,
      //   "default_payment_accounts": paymentMethods,
      //   "invoice_layout_id": "123"
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

      AddingDeviceFunction('/create-device').then((result) => {
        setCreatingLoading(false);
        // setProductIdList([])
        if (result?.success === 'true') {
          toast.success(result.message);
          setCreatingLoading(false);
          router.back();
        }

        toast.error(result.message);
        setCreatingLoading(false);
        //   router.back();
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-device')}
          details={t('form:text-add-new-device')}
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
          {/* <Input
            label={t('form:input-label-license-code')}
            {...register('license_code')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-last-invoice-number')}
            {...register('last_invoice_no')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-invoice-sequence')}
            {...register('invoice_sequence')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
        </Card>
      </div>
      {/* <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-text-enable-status')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-status')}</Label>
            <Switch
              checked={isStatus}
              // {...register('enable_stock')}
              onChange={onChangeStatus}
              className={`${
                isStatus ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${
                    isStatus ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
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
            ? t('common:update-device')
            : t('common:add-device')}
        </Button>
      </div>
    </form>
  );
}
