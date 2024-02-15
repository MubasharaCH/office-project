import cn from 'classnames';
import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Avatar from '@/components/common/avatar';
import Link from '@/components/ui/link';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import React from 'react';
import {
  GetFunction,
  GetFunctionBDetail,
  SelectBusiness,
} from '@/services/Service';
import Loader from '@/components/ui/loader/loader';
import { setAuthCredentials } from '@/utils/auth-utils';
import moment from 'moment';
import { toast } from 'react-toastify';
import Router, { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
// import { useMeQuery } from '@/data/user';

export default function AuthorizedMenu() {
  const [userData, setUserData] = useState<any>('');
  const [userBusiness, setUserBusiness] = useState<any>('');
  const [loadingData, setloadingData] = useState<any>(true);
  const [packageDetail, setPackageDetail] = useState<any>({});

  React.useEffect(() => {
    let businessDetails: any = localStorage.getItem('user_detail');
    setUserData(JSON.parse(businessDetails));
    GetFunction('/get-user-businesses').then((result) => {
      setUserBusiness(result.data);
      setloadingData(false);
    });
  }, []);
  React.useEffect(() => {
    const businessDetail = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (businessDetail) {
      setPackageDetail(businessDetail?.subscriptions[0]?.package_details);
    }
  }, []);

  const router = useRouter();

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
      router.reload();
    }, 1000);
  };

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

  // const { data } = useMeQuery();
  const { t } = useTranslation('common');
  // if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center focus:outline-none">
        <Avatar
          src={
            // data?.profile?.avatar?.thumbnail ??
            siteSettings?.avatar?.placeholder
          }
          alt="avatar"
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="ul"
          className="absolute mt-1 w-48 rounded bg-white shadow-md end-0 origin-top-end focus:outline-none"
        >
          <Menu.Item>
            <li
              className="flex w-full flex-col space-y-1 rounded-t
             bg-[#212121] px-4 py-3 text-sm text-white"
            >
              <span className="font-semibold capitalize">
                {userData?.first_name + ' ' + userData?.last_name}
              </span>
              <span className="text-xs">{userData?.username}</span>
            </li>
          </Menu.Item>
          {loadingData == true
            ? 'loading....'
            : userBusiness?.map((res, i) => (
                <Menu.Item key={i}>
                  {({ active }) => (
                    <li className="cursor-pointer border-b border-gray-100 last:border-0">
                      <div
                        onClick={() =>
                          onClickGetUser(res?.business.id, res?.email)
                        }
                        className={cn(
                          'block px-4 py-3 text-sm font-semibold capitalize transition duration-200 hover:text-accent',
                          active ? 'text-accent' : 'text-heading'
                        )}
                      >
                        <div className="flex">
                          <img
                            className="mr-2 rounded"
                            style={{ width: 20, height: 20 }}
                            src={res.business.logo}
                          />
                          {res?.business?.name}
                        </div>
                      </div>
                    </li>
                  )}
                </Menu.Item>
              ))}
          {siteSettings.authorizedLinks.map(({ href, labelTransKey }) => {
            if (
              packageDetail?.name == 'Free package' &&
              labelTransKey === 'authorized-nav-item-profile'
            ) {
              // Skip rendering this menu item
              return null;
            }
            return (
              <Menu.Item key={`${href}${labelTransKey}`}>
                {({ active }) => (
                  <li className="cursor-pointer border-b border-gray-100 last:border-0">
                    <Link
                      href={href}
                      className={cn(
                        'block px-4 py-3 text-sm font-semibold capitalize transition duration-200 hover:text-accent',
                        active ? 'text-accent' : 'text-heading'
                      )}
                    >
                      {t(labelTransKey)}
                    </Link>
                  </li>
                )}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
