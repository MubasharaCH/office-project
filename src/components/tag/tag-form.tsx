import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { tagValidationSchema } from './tag-validation-schema';
import { useRouter } from 'next/router';
import ValidationError from '@/components/ui/form-validation-error';
import { useEffect,useState } from 'react';
import { toast } from 'react-toastify';
import { AddTags,GetFunction,UpdateTag} from '@/services/Service';
type FormValues = {
  tag: string;
};

const defaultValues = {
  tag: '',
};

type IProps = {
  initialValues?: any;
};

export default function CreateOrUpdateTagForm({ initialValues }: IProps) {
  const router = useRouter();
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);

  const [creatingLoading, setCreatingLoading] = useState(false);
  const { t } = useTranslation();


  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<FormValues>({
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
        }
      : defaultValues,
  });

 const GetTagData=(id)=>{
  setloadingData(true);
  GetFunction(`/get-tag/${id}`).then((result) => {
      if(result){
        // console.log(result.data)
        // setListData(result.data);
        setValue('tag', result.data.tag);
        setloadingData(false);
      }
     
    });
}
  useEffect(() => {
    if(router?.query?.tagSlug){
    GetTagData(router.query.tagSlug);
  }
},[router?.query?.tagSlug])



  const onSubmit = async (data: FormValues) => {
    setCreatingLoading(true);
    if(!router?.query?.tagSlug){
    AddTags('/tag', {'tag':data?.tag}).then((result) => {
      if (result.success) {
        toast.success(t('common:successfully-created'));
        setCreatingLoading(false);
        router.back();
      } else {
        toast.error(t(result.message));
        setCreatingLoading(false);
      }
    });
  }else{
    UpdateTag(`/tag/${router?.query?.tagSlug}`, {'tag':data?.tag}).then((result) => {
      if (result.success) {
        toast.success(t('common:successfully-updated'));
        setCreatingLoading(false);
        router.back();
      } else {
        toast.error(t(result.message));
        setCreatingLoading(false);
      }
    });
  }
  };
  
  // Add similar statements in other parts of your component
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:tag-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('tag')}
            error={t(errors.tag?.message!)}
            variant="outline"
            className="mb-5"
          />
          <ValidationError message={errors.tag?.message} />
        </Card>
      </div>
      <div className="mb-4 text-end">
        {initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="me-4"
            type="button"
          >
            {t('form:button-label-back')}
          </Button>
        )}

<Button type="submit" loading={creatingLoading}>
  {initialValues
    ? t('form:button-label-update-tag')
    : t('form:button-label-add-tag')}
</Button>
      </div>
    </form>
  );
}
