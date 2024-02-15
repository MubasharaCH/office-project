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
import { convertFromHTML, EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import {
  AddingFunction,
  DashboardGetFun,
  GetFunction,
  UpdatingFunction,
} from '../../services/Service';
import { useEffect, useState } from 'react';
import FormData from 'form-data';
import { RxCross1 } from 'react-icons/rx';
import { selectStyles } from '../ui/select/select.styles';
import Select from '../ui/select/select';
import Loader from '../ui/loader/loader';
import Label from '../ui/label';
import dynamic from 'next/dynamic';
import { EditorProps } from 'react-draft-wysiwyg';
type BannerInput = {
  title: string;
  description: string;
  image: AttachmentInput;
};

type FormValues = {
  name?: string | null;
  link_title?: string | null;
  link_type?: string | null;
  html_content?: string | null;
  icon?: any;
  promotional_sliders: AttachmentInput[];
  banners: BannerInput[];
  settings: TypeSettingsInput;
  description: string | null;
  image: any;
};
const defaultValues = {
  image: [],
  name: '',
  link_title: '',
  link_type: '',
  html_content: '',
  details: '',
  parent: '',
  icon: '',
  type: '',
  description: '',
  short_code: '',
};
type IProps = {
  initialValues?: Type | null;
};
const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);
export default function CreateOrUpdateTypeForm(initialValues: any) {
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [DataArrray, setDataArrray] = useState([]);
  const [CategoryDataArrray, setCategoryDataArrray] = useState([]);
  const [productVal, setProductVal] = useState([]);
  const [categoryVal, setCategoryVal] = useState([]);
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

  useEffect(() => {
    GetFunction('/product?per_page=-1').then((result) => {
      let data = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          label: data.name,
        };
      });
      setDataArrray(data);
      setLoading(false);
    });
    GetFunction('/taxonomy').then((result) => {
      let data = result.data.map((data, i) => {
        return {
          key: i,
          id: data.id,
          label: data.name,
        };
      });
      setCategoryDataArrray(data);
      setLoading(false);
    });
  }, []);

  const onSubmit = (values: FormValues) => {
    form.append('name', values.name);
    form.append('link_title', values.link_title);
    form.append('link_type', values.link_type);
    form.append('html_content', termConvertedContent);
    form.append('product_ids', productVal);
    form.append('category_ids', categoryVal);

    if (initialValues.initialValues) {
      let ID = initialValues.initialValues.id;
      setCreatingLoading(true);
      UpdatingFunction('/brand-update/', form, ID).then((result) => {
        if (result.success) {
          toast.success(t('common:successfully-updated'));
          setCreatingLoading(false);

          router.back();
        } else {
          toast.error(t(result.msg));
          setCreatingLoading(false);
        }
      });
    } else {
      setCreatingLoading(true);

      AddingFunction('/size-chart', form).then((result) => {
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

  const [termEditorState, settermEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [termConvertedContent, setTermConvertedContent] = useState<any>(null);

  useEffect(() => {
    let html = convertToHTML(termEditorState.getCurrentContent());
    setTermConvertedContent(html);
  }, [termEditorState]);

  const productOnChange = (e) => {
    let global: any = [];
    e.map((res: any) => {
      global.push(res.id);
    });
    setProductVal(global);
  };
  const categoryOnChange = (e) => {
    let global: any = [];
    e.map((res: any) => {
      global.push(res.id);
    });
    setCategoryVal(global);
  };

  if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:item-description')}
          // details={t('Add New Brand Description')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            variant="outline"
            className="mb-5"
          />
          <Label>Select Product</Label>
          <Select
            className="mb-5"
            styles={selectStyles}
            name="business_location_id"
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            options={DataArrray}
            //   value={LocationVal}
            onChange={productOnChange}
            isMulti
          />
          <Label>Select Category</Label>
          <Select
            className="mb-5"
            styles={selectStyles}
            name="business_location_id"
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.id}
            options={CategoryDataArrray}
            //   value={LocationVal}
            onChange={categoryOnChange}
            isMulti
          />
          <Input
            label={t('Link Title')}
            {...register('link_title')}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('Link Type')}
            {...register('link_type')}
            variant="outline"
            className="mb-5"
          />
          {/* <Input
            label={t('Html Content')}
            {...register('html_content')}
            variant="outline"
            className="mb-5"
          /> */}
          <div>
            <Label>Html Content</Label>
            <Editor
              editorState={termEditorState}
              onEditorStateChange={settermEditorState}
              editorClassName="p-3"
              toolbarClassName="bg-gray-200"
              wrapperClassName="border border-border-base focus:border-accent rounded min-h-full"
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
            ? t('Update Size Chart')
            : t('Add Size Chart')}
        </Button>
      </div>
    </form>
  );
}
