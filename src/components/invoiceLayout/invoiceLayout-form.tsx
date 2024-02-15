import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import dynamic from 'next/dynamic';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { AttachmentInput, Type, TypeSettingsInput } from '@/types';
import { useTranslation } from 'next-i18next';
import { ContentState, convertToRaw } from 'draft-js';
import { yupResolver } from '@hookform/resolvers/yup';
import { EditorProps } from 'react-draft-wysiwyg';
const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);


import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import FileInput from '@/components/ui/file-input';
import Router from 'next/router';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import TextArea from '@/components/ui/text-area';
import { toast } from 'react-toastify';
import { AddingFunction, UpdatingLayoutFunction } from '../../services/Service';
import { useEffect, useState } from 'react';
import FormData from 'form-data';
import { Switch } from '@headlessui/react';
import Label from '../ui/label';
import Select from '../ui/select/select';
import { selectStyles } from '../ui/select/select.styles';
import { site_url } from '../../services/Service';
import { convertToHTML } from 'draft-convert';
import { convertFromHTML, EditorState } from 'draft-js';
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
  sub_heading_line5: any;
  sub_heading_line4: any;
  show_signature?:any;
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
  sub_heading_line5: '',
  sub_heading_line4: '',
  show_signature:false
};
type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateTypeForm(initialValues: any) {
  console.log(initialValues);

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
  // const base_url=process.env.NEXT_PUBLIC_URL
  const [imageFile, setImageFile] = useState<any>();
  const [path, setPath] = useState<string>(getValues('image'));
  const [designVal, setdesignVal] = useState<any>('');
  const [labelValue, setLabelValue] = useState<any>('');
  const [qrType, setQrType] = useState<any>('');
  const [showQR, setshowQR] = useState<any>(false);
  const [showCutomerTin, setShowCutomerTin] = useState<any>(false);
  const [showLogo, setShowLogo] = useState<any>(false);
  const [showProduct, setShowProduct] = useState<any>(false);
  const [showTax, setShowTax] = useState<any>(false);
  const [showSignature, setShowSignature] = useState<any>(false);
  const [invoiceHeading, setInvoiceHeading] = useState<any>('');

  const [aboutEditorState, setaboutEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [aboutConvertedContent, setAboutConvertedContent] = useState<any>(null);
  const [LocationDataArray, setLocationDataArray] = useState<any[]>([]);
  const [LocationVal, setLocation] = useState<any>();
  const [domainName, setDomainName] = useState('');
  useEffect(() => {
    let html = convertToHTML(aboutEditorState.getCurrentContent());
    setAboutConvertedContent(html);
  }, [aboutEditorState]);
  useEffect(() => {
    let vall: any =
      initialValues?.initialValues?.footer_text == undefined
        ? ''
        : initialValues?.initialValues?.footer_text;

    const blocksFromHTML = convertFromHTML(vall);
    setaboutEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        )
      )
    );
    let dataArray = initialValues?.data?.locations?.map((res) => {
      setLocation(res.id);
    });
    initialValues?.data?.dns && setDomainName(initialValues?.data?.dns);

    const show_tax_11 = initialValues?.initialValues?.show_tax_1 === 0 || initialValues?.initialValues?.show_tax_1===undefined? false : true;
    // console.log("show_tax_11" + show_tax_11);
    setShowCutomerTin(show_tax_11);

  }, []);
  const onChange = (e) => {
    setshowQR((value: any) => !value);
  };
  const onChangeCustomerTin = (e) => {
    setShowCutomerTin((value: any) => !value);
  }
  const onChangeProduct = (e) => {
    setShowProduct((value: any) => !value);
  };
  const onChangeTax = (e) => {
    setShowTax((value: any) => !value);
  };
  const onChangeSignature=(e)=>{
    setShowSignature((value: any) => !value);
  }
  const onChangeLogo = (e) => {
    setShowLogo((value: any) => !value);
  };
  const OnChangeDesign = (e) => {
    setdesignVal(e);
  };
  const OnChangeLabel = (e) => {
    setLabelValue(e);
  };
  const onChangeQR = (e) => {
    setQrType(e);
  };
  const DesignArray = [
    { label: 'Standard', key: 'detailed' },
    { label: 'Simplified tax invoice', key: 'slim' },
    { label: 'Tax invoice', key: 'tax_invoice' },
  ];
  const LabelArray = [
    { label: 'EN', key: 'en' },
    { label: 'AR', key: 'ar' },
    { label: 'EN/AR', key: 'en_ar' },
    { label: 'UR', key: 'ur' },
    { label: 'FR', key: 'fr' },
  ];
  const qrTypeArray = [
    { label: 'qr', key: 'qr' },
    { label: 'zatca_qr', key: 'zatca_qr' },
  ];
  useEffect(() => {
    {
      initialValues?.initialValues != undefined &&
        DesignArray?.map((item) => {
          if (item.key === initialValues?.initialValues?.design) {
            setdesignVal(item);
          }
        });

      setInvoiceHeading(initialValues?.initialValues?.invoice_heading);
      {
        initialValues?.initialValues?.logo &&
          setPath(initialValues?.initialValues?.logo);
      }

      {
        initialValues?.initialValues?.show_alternate_product_name === 1
          ? setShowProduct(true)
          : setShowProduct(false);
      }
      {
        initialValues?.initialValues?.show_tax_identification_no === 1
          ? setShowTax(true)
          : setShowTax(false);
      }
      {initialValues?.initialValues?.show_signature === 1
        ?setShowSignature(true)
        :setShowSignature(false);
      }
      {
        initialValues?.initialValues?.show_logo === 1
          ? setShowLogo(true)
          : setShowLogo(false);
      }
      {
        initialValues?.initialValues?.show_barcode === 1
          ? setshowQR(true)
          : setshowQR(false);
      }
      LabelArray?.map((item) => {
        if (item.label === initialValues?.initialValues?.labels) {
          setLabelValue(item);
        }
      });
      qrTypeArray?.map((item) => {
        if (item.label === initialValues?.initialValues?.qr_type) {
          setQrType(item);
        }
      });
    }
  }, [initialValues.initialValues]);
  useEffect(() => {
    if (imageFile) {
      setPath(URL.createObjectURL(imageFile));
    }
  }, [imageFile]);

  const onSubmit = (values: FormValues) => {

    let showQRVal = showQR == true ? 1 : 0;
    let show_tax_1 = showCutomerTin == true ? 1 : 0;
    let newShowProduct = showProduct == true ? 1 : 0;
    let newShowTax = showTax == true ? 1 : 0;
    let newShowSignature =showSignature==true?1:0;
    let newShowLogo = showLogo == true ? 1 : 0;
    let newQr = '';
    {
      qrType ? (newQr = qrType?.label) : (newQr = '');
    }
    let newLabel = '';
    {
      labelValue ? (newLabel = labelValue?.label) : (newLabel = '');
    }
    let newName = '';
    {
      values.name != null ? (newName = values.name) : (newName = '');
    }
    let newHeading = '';
    {
      invoiceHeading != null
        ? (newHeading = invoiceHeading)
        : (newHeading = '');
    }
    let newHeading1 = '';
    {
      values.sub_heading_line1 != null
        ? (newHeading1 = values.sub_heading_line1)
        : (newHeading1 = '');
    }
    let newHeading2 = '';
    {
      values.sub_heading_line2 != null
        ? (newHeading2 = values.sub_heading_line2)
        : (newHeading2 = '');
    }
    let newHeading3 = '';
    {
      values.sub_heading_line3 != null
        ? (newHeading3 = values.sub_heading_line3)
        : (newHeading3 = '');
    }
    let newFooterText = '';
    {
      values.sub_heading_line4 != null
        ? (newFooterText = values.sub_heading_line4)
        : (newFooterText = '');
    }
    let footerLine2 = '';
    {
      values.sub_heading_line5 != null
        ? (footerLine2 = values.sub_heading_line5)
        : (footerLine2 = '');
    }
    form.append('name', newName);
    form.append('invoice_heading', newHeading);
    form.append('design', designVal.key);
    form.append('sub_heading_line1', newHeading1);
    form.append('sub_heading_line2', newHeading2);
    form.append('sub_heading_line3', newHeading3);
    form.append('sub_heading_line5', footerLine2);
    form.append('sub_heading_line4', newFooterText);
    form.append('show_barcode', showQRVal);

    form.append('show_tax_1', show_tax_1);
    aboutConvertedContent && form.append('footer_text', aboutConvertedContent);

    form.append('show_logo', newShowLogo);
    form.append('qr_type', newQr);
    form.append('labels', newLabel);
    form.append('show_alternate_product_name', newShowProduct);
    form.append('show_tax_identification_no', newShowTax);
    form.append('show_signature', newShowSignature);
  


    if (initialValues.initialValues === undefined || imageFile != undefined) {
      form.append('logo', imageFile);
    }

    /*  let formVal = {
      name: values.name,
      description: values.description,
    }; */
    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);
      UpdatingLayoutFunction('/invoice-layouts', form, ID).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-Updated'));
          setCreatingLoading(false);

          router.back();
        } else {
          toast.error(t(result.message));
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);

      AddingFunction('/invoice-layouts', form).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-created'));
          setCreatingLoading(false);
          router.back();
        } else {
          toast.error(t(result.message));
          setCreatingLoading(false);
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-name')}
          // details={t('Add New Brand Description')}
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
          <Label>{t('form:input-label-design')}</Label>
          <Select
            styles={selectStyles}
            options={DesignArray}
            value={designVal}
            onChange={OnChangeDesign}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.key}
          />
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
            name={'titleItem'}
            // {...register('name')}
            value={invoiceHeading}
            onChange={(e) => {
              setInvoiceHeading(e.target.value);
            }}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5 text-start"
          />
          {/* <Input
            label={t('form:input-title')}
            name={'title'}
          //  {...register('title')}
          value={title}
          onChange={(e)=>{setTitle(e.target.value)}}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          /> */}
          <Label>{t('form:input-label-label')}</Label>
          <Select
            styles={selectStyles}
            options={LabelArray}
            value={labelValue}
            onChange={OnChangeLabel}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.key}
          />
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:sub-heading')}
          // details={t('Add Description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-heading-line1')}
            {...register('sub_heading_line1')}
            error={t(errors.sub_heading_line1?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-heading-line2')}
            {...register('sub_heading_line2')}
            error={t(errors.sub_heading_line2?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-heading-line3')}
            {...register('sub_heading_line3')}
            error={t(errors.sub_heading_line3?.message!)}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-show-alter-product')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-show-alter-product')}</Label>
            <Switch
              checked={showProduct}
              // {...register('enable_stock')}

              onChange={onChangeProduct}
              className={`${showProduct ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${showProduct ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-show-tax-number')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-show-tax-number')}</Label>
            <Switch
              checked={showTax}
              // {...register('enable_stock')}

              onChange={onChangeTax}
              className={`${showTax ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${showTax ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-show-signature')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-show-signature')}</Label>
            <Switch
              checked={showSignature}
              // {...register('enable_stock')}

              onChange={onChangeSignature}
              className={`${showSignature ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${showSignature ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-enable-QR')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('QR')}</Label>

            <Switch
              checked={showQR}
              // {...register('enable_stock')}
              onChange={onChange}
              className={`${showQR ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${showQR ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>



            <Label className="py-2">{t('form:input-label-qrType')}</Label>
            <Select
              styles={selectStyles}
              options={qrTypeArray}
              value={qrType}
              onChange={onChangeQR}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.key}
            />
          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:footer-line')}
          // details={t('Add Description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-footer-line1')}
            {...register('sub_heading_line4')}
            error={t(errors.sub_heading_line4?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-footer-line2')}
            {...register('sub_heading_line5')}
            error={t(errors.sub_heading_line4?.message!)}
            variant="outline"
            className="mb-5"
          />
          <div className="mb-5">
            <Label className="py-2">{t('form:input-label-term-condition')}</Label>
            <Editor
              editorState={aboutEditorState}
              onEditorStateChange={setaboutEditorState}
              editorClassName="p-3"
              toolbarClassName="bg-gray-200 "
              wrapperClassName="border border-border-base focus:border-accent rounded min-h-full "
              toolbar={{
                options: [
                  'inline',
                  'blockType',
                  'fontSize',
                  'fontFamily',
                  'list',
                  'textAlign',
                  'colorPicker',
                  'link',
                  'emoji',
                ],
                inline: { inDropdown: false },
                list: { inDropdown: false },
                textAlign: { inDropdown: false },
                link: { inDropdown: false },
                history: { inDropdown: false },
              }}
            />
          </div>
        </Card>



      </div>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-show-invoice-logo')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-show-invoice-logo')}</Label>
            <Switch
              checked={showLogo}
              // {...register('enable_stock')}

              onChange={onChangeLogo}
              className={`${showLogo ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${showLogo ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-Show-customer-tin')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-Show-customer-tin')}</Label>
            <Switch
              checked={showCutomerTin}
              // {...register('enable_stock')}
              onChange={onChangeCustomerTin}
              className={`${showCutomerTin ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${showCutomerTin ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>





          </div>
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-invoice-logo')}
          details={t('form:input-label-upload-logo')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput
            name="logo"
            control={control}
            setImageFile={setImageFile}
            multiple={false}
          />
          {path && path.length != 0 && (
            <img
              style={{ width: '50px', height: '50px', marginTop: '1rem' }}
              src={path}
              alt="cate-image"
            />
          )}
        </Card>
      </div>

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
            ? t('form:button-update-invoiceLayout')
            : t('form:button-add-invoiceLayout')}
        </Button>
      </div>
    </form>
  );
}
