import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useUpdateUserMutation } from '@/data/user';
import TextArea from '@/components/ui/text-area';
import { useTranslation } from 'next-i18next';
import FileInput from '@/components/ui/file-input';
import pick from 'lodash/pick';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetFunction, AddingFunction, UpdateProfile } from '@/services/Service';
import router from 'next/router';
import { toast } from 'react-toastify';
type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  contact_no: string;
};

export default function ProfileUpdate(data) {
  const [loading, setIsloading] = useState<any>();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: data.data
      ? {
          ...data.data,
        }
      : data,
  });

  async function onSubmit(values: FormValues) {
    setIsloading(true);
    let ID = data?.data?.id;

    let formVal = {
      user_id: ID,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      contact_no: values.contact_no,
    };

    UpdateProfile('/update-business-user', formVal).then((result) => {
      if (result.success === true) {
        setIsloading(false);
        toast.success(result.message);
        window.location.reload();
      } else {
        toast.error(result.message);
        setIsloading(false);
      }
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base sm:my-8">
        <Description
          title={'form:input-label-update-profile'}
          // details={t('form:password-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-Fname')}
            type="text"
            // name="firstName"
            // value={firstName}
            // ref={register}
            {...register('first_name')}
            variant="outline"
            //error={t(errors.oldPassword?.message!)}
            className="mb-5"
            // onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label={t('form:input-label-Lname')}
            type="text"
            // name="lastName"
            // value={lastName}
            // ref={register}
            {...register('last_name')}
            variant="outline"
            //error={t(errors.oldPassword?.message!)}
            className="mb-5"
            // onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            label={t('form:input-label-email')}
            type="email"
            // name="email"
            // ref={register}
            // value={email}
            {...register('email')}
            variant="outline"
            //error={t(errors.oldPassword?.message!)}
            className="mb-5"
            // onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label={t('form:input-label-mobileNumber')}
            type="tel"
            //name="phone"
            // ref={register}
            //value={phoneNumber}
            {...register('contact_no')}
            variant="outline"
            //error={t(errors.oldPassword?.message!)}
            className="mb-5"
            // onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Card>

        <div className="w-full pb-2 text-end">
          <Button loading={loading} disabled={loading}>
            {t('form:button-label-update')}
          </Button>
        </div>
      </div>
    </form>
  );
}
