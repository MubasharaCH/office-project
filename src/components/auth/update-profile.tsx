import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import { toast } from 'react-toastify';
import PasswordInput from '@/components/ui/password-input';
import Input from '@/components/ui/input';
import { useChangePasswordMutation } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface FormValues {
  oldPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('form:error-old-password-required'),
  newPassword: yup.string().required('form:error-password-required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'form:error-match-passwords')
    .required('form:error-confirm-password'),
});

const UpdateProfile = () => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjI3NmExMDE1YjJkMGZlY2M3NzcxYjQxMjVhMmU2NjM1ZWU5YzkwNjBlZDM1NzNhZGE1NmU3MmUxMDQzM2NlMzk1OTc0NDY5ZWFhMzMxOGE1In0.eyJhdWQiOiIzMiIsImp0aSI6IjI3NmExMDE1YjJkMGZlY2M3NzcxYjQxMjVhMmU2NjM1ZWU5YzkwNjBlZDM1NzNhZGE1NmU3MmUxMDQzM2NlMzk1OTc0NDY5ZWFhMzMxOGE1IiwiaWF0IjoxNjcxNTIyMzA2LCJuYmYiOjE2NzE1MjIzMDYsImV4cCI6MTcwMzA1ODMwNiwic3ViIjoiODc1Iiwic2NvcGVzIjpbXX0.z0_gbgdjxgWGm-a12nRBtCi0mQYtCeUiqudclOHgro5JvCfrqLczJG2ZVqK670fbk6_sPw1ZDp89Jgk8kSytR0nsCpaViSVHdCHxZUtEaP1nKAXkPtHsiRvXm-RGM1GCrOXFbekssJoHqbZZtQXngSbmE4tf1wu8YRk5eOAiazB_pActcFbWuqjr0xpZm3qvll8IV09lF01ZEtl1iwmEQUuSxKOn0eSAIRUeLWBX19q5gAZnH6sVftDyRrm_DBW29e-Ii29Z-O74mH_TkFV4VVsmEDsHQjjVHARdKkVkjNedRWWZAmH7XMnU74z5dsyzyARx2TpoalJEg7kFsC418JY8Zu4uemqtqtzXo5MQk1rbCngmGPT3vAsQ5uIW4n3Q67jHqvhGgnIsobsg1UFbg5tkhC2la21fgJqzKkdDtFcLMovxP-3_XhJw9uhRS9HuVNI657dSRPFc3r5ykqlvWhAb1bh7REQoJaSRFx2iuI01PGNPlkOZya3aiTf2wZ6jgN6LMjx6LJUetK_5JpZADsfxwtVCp2ez5i6dKmpNSSfonLtufsJnfQtHjQb9QHkvBp010qPMy5S2OnjJcvQrVSGnVvXKafRrdYK4Y8RcGzNt_IXFMipdBX4W8VFTiQMU_ICW6XTxphPGqMBBbgVv3o2MokWqMGAN4Fezp0hDP4I';
  const { t } = useTranslation();
  const [user, setUser] = useState<any>({});
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const {
    mutate: changePassword,
    isLoading: loading,
  } = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    setError,
    reset,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(changePasswordSchema),
  });

  async function onSubmit(values: FormValues) {
    /*  axios({
      method: 'post',
      url: '',
      // data: bodyFormData,
      headers: {
        'Content-Type': 'Application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        user_id: 875,
        first_name: 'Muhammad',
        last_name: 'Ahmad',
        email: 'abcd@gmail.com',
        contact_no: '+923042596211',
      },
    })
      .then((response: any) => {
        alert(response.message);
      })
      .catch(function (err: any) {
        //handle error
        console.log(err);
      }); */
  }
  const getUser = () => {
    //  setCategoryLoading(true);
    axios({
      method: 'get',
      url: '',
      // data: bodyFormData,
      headers: {
        'Content-Type': 'Application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response: any) => {
        setUser(response.data.data);
      })
      .catch(function (err: any) {
        //handle error
        console.log(err);
      });
  };

  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setPhoneNumber(user.contact_no);
  }, [user]);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base sm:my-8">
        <Description
          title={'Edit Profile'}
          // details={t('form:password-help-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        {user && (
          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <Input
              label="First Name"
              type="text"
              name="firstName"
              value={firstName}
              // {...register('oldPassword')}
              variant="outline"
              //error={t(errors.oldPassword?.message!)}
              className="mb-5"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last Name"
              type="text"
              name="lastName"
              value={lastName}
              // {...register('oldPassword')}
              variant="outline"
              //error={t(errors.oldPassword?.message!)}
              className="mb-5"
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              // {...register('oldPassword')}
              variant="outline"
              //error={t(errors.oldPassword?.message!)}
              className="mb-5"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={phoneNumber}
              // {...register('oldPassword')}
              variant="outline"
              //error={t(errors.oldPassword?.message!)}
              className="mb-5"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Card>
        )}
        <div className="w-full pb-2 text-end">
          <Button loading={loading} disabled={loading}>
            {'Update'}
          </Button>
        </div>
      </div>
    </form>
  );
};
export default UpdateProfile;
