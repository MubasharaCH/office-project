import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { setAuthCredentials } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import AuthPageLayout from '@/components/layouts/auth-layout';
import {
  AddingFunction,
  AddingUserFunction,
  GetFunction,
  GetFunctionBDetail,
  GetSocialData,
  SelectBusiness,
} from '@/services/Service';
import { toast } from 'react-toastify';
import { AiOutlineRight } from 'react-icons/ai';
import { FiCalendar } from 'react-icons/fi';
import moment from 'moment';

export default function RegisterPage() {
  const router: any = useRouter();
  const myArray = JSON.parse(router.query.data);

  const getBusinessDetails = (token) => {
    GetFunctionBDetail('/business-details', token).then((result) => {
      localStorage.setItem(
        'business_details',
        JSON.stringify(result.data.currency)
      );

      let currentDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      localStorage.setItem('login_time_stamp', currentDate);

      localStorage.setItem(
        'user_business_details',
        JSON.stringify(result.data)
      );
      localStorage.setItem('business_name', result.data.name);
    });
    GetFunctionBDetail('/product', token).then((result) => {
      localStorage.setItem('product_list', JSON.stringify(result.data));
    });
    GetFunctionBDetail('/user/loggedin', token).then((result) => {
      localStorage.setItem('user_detail', JSON.stringify(result.data));
    });
    toast.success('Login Successfully');
    setTimeout(() => {
      Router.push(Routes.dashboard);
    }, 1000);
  };

  const { t } = useTranslation('common');

  const onClickGetUser = (id, email) => {
    let obj = {
      email: email,
      business_id: id,
    };
    SelectBusiness('/business-multiple-login', obj).then((result) => {
      localStorage.setItem('user_token', result?.token);
      setAuthCredentials(result?.token);
      getBusinessDetails(result?.token);
    });
  };

  return (
    <AuthPageLayout>
      <h3 className="mb-6 mt-4 text-center text-base text-gray-500">
        {t('Select Your Business')}
      </h3>
      <div className="mb-10">
        {myArray &&
          myArray.map((res, i) => (
            <div
              key={i}
              onClick={() => onClickGetUser(res?.business.id, res?.email)}
              className="m-2  cursor-pointer  rounded border	p-3 "
            >
              <div className="flex items-center justify-between">
                <div className="flex">
                  <img
                    style={{
                      width: 35,
                      height: 35,
                      marginRight: 10,
                      borderRadius: 5,
                    }}
                    src={res?.business?.logo}
                  />
                  <div>
                    <p className="text-base">{res?.business?.name}</p>
                    <p className=" text-xs">{res?.username}</p>
                  </div>
                </div>
                <AiOutlineRight color="#A3A4A6" className="pt-1" />
              </div>
            </div>
          ))}
      </div>
    </AuthPageLayout>
  );
}
