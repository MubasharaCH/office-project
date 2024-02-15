import { useRouter } from 'next/router';
import { SAFlag } from '@/components/icons/flags/SAFlag';
import { CNFlag } from '@/components/icons/flags/CNFlag';
import { USFlag } from '@/components/icons/flags/USFlag';
import { DEFlag } from '@/components/icons/flags/DEFlag';
import { ILFlag } from '@/components/icons/flags/ILFlag';
import { ESFlag } from '@/components/icons/flags/ESFlag';
import { useState } from 'react';
import React from 'react';

const localeRTLList = ['ar', 'he'];
export function useIsRTL() {
  const { locale } = useRouter();
  const [isGreater, setIsGreater] = useState(false);
  const [dateArray, setDateArray] = useState([
    
  ]);
  const router = useRouter();
  
  // console.log('there is');
  React.useEffect(() => {
    let businessDetail: any = localStorage.getItem('user_business_details');
    let businessName: any = JSON.parse(businessDetail);
    if(businessName){
      let subscriptions = businessName.subscriptions;
      let subscriptionData = subscriptions.map((data, i) => {
        // console.log(dataa[data]);
     let date = new Date(data.end_date);
      return date;
      });
      // console.log(subscriptionData);
      
      setDateArray(subscriptionData);
      
    }
    // setLoading(false);
    document.body.style.fontFamily = 'poppins';
  }, []);
  
  React.useEffect(() => {
  //  console.log(dateArray);
   
    const today = new Date();
    for (let i = 0; i < dateArray.length; i++) {
      if (today > dateArray[i]) {
        setIsGreater(true);
        break;
      }
    }
  }, [dateArray]);
  React.useEffect(() => {
    

    // if (isGreater){  
    //   router.push('/settings/subscription'); // If not authenticated, force log in   
    // }
  }, []);
  if (locale && localeRTLList.includes(locale)) {
    return { isRTL: true, alignLeft: 'right', alignRight: 'left' };
  }
  return { isRTL: false, alignLeft: 'left', alignRight: 'right' };
}

export let languageMenu = [
  {
    id: 'ar',
    name: 'عربى',
    value: 'ar',
    icon: <SAFlag width="20px" height="15px" />,
  },
  // {
  //   id: 'zh',
  //   name: '中国人',
  //   value: 'zh',
  //   icon: <CNFlag width="20px" height="15px" />,
  // },
  {
    id: 'en',
    name: 'English',
    value: 'en',
    icon: <USFlag width="20px" height="15px" />,
  },
  // {
  //   id: 'de',
  //   name: 'Deutsch',
  //   value: 'de',
  //   icon: <DEFlag width="20px" height="15px" />,
  // },
  // {
  //   id: 'he',
  //   name: 'rעברית',
  //   value: 'he',
  //   icon: <ILFlag width="20px" height="15px" />,
  // },
  // {
  //   id: 'es',
  //   name: 'Español',
  //   value: 'es',
  //   icon: <ESFlag width="20px" height="15px" />,
  // },
];
