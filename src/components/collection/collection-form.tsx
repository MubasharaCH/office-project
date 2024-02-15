import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { tagValidationSchema } from './collection-validation-schema';
import { useRouter } from 'next/router';
import ValidationError from '@/components/ui/form-validation-error';
import { useEffect,useState } from 'react';
import { toast } from 'react-toastify';
import { AddTags,GetFunction,UpdateTag} from '@/services/Service';
import Label from '@/components/ui/label';
import Select from 'react-select';
import { selectStyles } from '../ui/select/select.styles';
type FormValues = {
  title: string;
  tags:any;
};

const defaultValues = {
  title: '',
  tags:'',
};

type IProps = {
  initialValues?: any;
};

export default function CreateOrUpdateTagForm({ initialValues }: IProps) {
  const router = useRouter();
  const [loadingData, setloadingData] = useState(false);
  const [ListData, setListData] = useState([]);
  const [LocationDataArray, setLocationDataArray] =useState<any[]>([]);
  const [LocationVal, setLocation] = useState<any>([]);
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
  const locationOnChange = (e) => {
    setLocation(e);
  };



useEffect(() => {
  const fetchData = async () => {
    try {
      setloadingData(true);
      const result = await GetFunction(`/tags`);
      if (result && result.data) {
        const tagsArray = result.data.map((item, key) => ({
          id: item.id,
          key: key,
          value: item.tag,
          label: item.tag,
        }));
        setLocationDataArray(tagsArray);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setloadingData(false);
    }
  };

  fetchData();
}, []);

useEffect(() => {
  if (router?.query?.tagSlug) {
    const fetchData = async () => {
      try {
        setloadingData(true);
        const result = await GetFunction(`/get-collection/${router.query.tagSlug}`);
        if (result && result.data) {
          console.log(result.data);
          setValue('title', result.data.title);
          const tagsArray = result.data.tags.split(',').map(tag => tag.trim());
          const filteredArray = LocationDataArray.filter(item => tagsArray.includes(item.value));
          setLocation(filteredArray);
        }
      } catch (error) {
        console.error('Error fetching tag data:', error);
      } finally {
        setloadingData(false);
      }
    };

    fetchData();
  }
}, [router?.query?.tagSlug, LocationDataArray]);



  const onSubmit = async (data: FormValues) => {
    setCreatingLoading(true);
    if(!router?.query?.tagSlug){
      const valuesArray = LocationVal.map(item => item.value).join(',');

    AddTags('/collection', {'title':data?.title,'tags':valuesArray}).then((result) => {
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
    const valuesArray = LocationVal.map(item => item.value).join(',');

    UpdateTag(`/collection/${router?.query?.tagSlug}`, {'title':data?.title,'tags':valuesArray}).then((result) => {
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
          } ${t('form:collection-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-title')}
            {...register('title')}
            error={t(errors.title?.message!)}
            variant="outline"
            className="mb-5"
            style={{textAlign:'left'}}
          />
        
          {/* <ValidationError message={errors.title?.message} /> */}
          <Label>{t('form:input-label-tag')}</Label>
                <Select
                  styles={selectStyles}
                  name="business_location_id"
                  getOptionLabel={(option: any) => option.label}
                  getOptionValue={(option: any) => option.id}
                  options={LocationDataArray}
                  value={LocationVal}
                  onChange={locationOnChange}
                  isMulti
                />

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
    ? t('form:button-label-update-collection')
    : t('form:button-label-add-collection')}
</Button>
      </div>
    </form>
  );
}
