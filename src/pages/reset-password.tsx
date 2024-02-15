import Button from '@/components/ui/button';
import PasswordInput from '@/components/ui/password-input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'next-i18next';
import Logo from '@/components/ui/logo';
import router, { useRouter } from 'next/router';
import { setForgotPassword } from '../services/Service';
import { toast } from 'react-toastify';

/* interface Props {
  onSubmit: (values: { password: string }) => void;
  loading: boolean;
} */
interface FormVal {
  password: string;
  passwordConfirmation: string;
}

const schema = yup.object().shape({
  password: yup.string().required('Password is Required!'),
  // newPassword: yup.string().required('form:error-password-required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords should match!')
    .required('Please confirm password!'),
});

const EnterNewPasswordView = () => {
  const { t } = useTranslation();
  const { query } = useRouter();
  const uuid = query.uuid
 
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormVal>({ resolver: yupResolver(schema) });

  async function onSubmit(values: FormVal) {

    let formVal = {
      uuid: uuid,
      new_password: values.password,
    };

    setForgotPassword('/forget-password-set', formVal).then((result) => {
      toast.info(result.message);
      if (result.message === 'Your Password reset Successfully') {
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      }
    });
  }

  return (
    <div
      className="flex h-screen items-center justify-center bg-light sm:bg-gray-100"
      // dir={dir}
    >
      <div className="m-auto w-full max-w-[420px] rounded bg-light p-5 sm:p-8 sm:shadow">
        <div className="mb-2 flex justify-center">
          <Logo />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <PasswordInput
            label={'Enter New Password'}
            {...register('password')}
            error={t(errors.password?.message!)}
            variant="outline"
            className="mb-5 mt-5"
          />
          <PasswordInput
            label={'Confirm Password'}
            {...register('passwordConfirmation')}
            variant="outline"
            error={t(errors.passwordConfirmation?.message!)}
            className="mb-5"
          />

          <Button
            className="h-11 w-full" /* loading={loading} disabled={loading} */
          >
            {t('Reset Password')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EnterNewPasswordView;
