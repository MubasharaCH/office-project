import Layout from '@/components/layouts/admin';
import SalesChannelForm from '@/components/salesChannel/salesChannel-from';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Card from '@/components/common/card';
import { selectStyles } from '@/components/ui/select/select.styles';
// import { selectStyles } from '../../../components/ui/select/select.styles';
import { Switch } from '@headlessui/react';
import Select, { createFilter } from 'react-select';
import Label from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import Description from '@/components/ui/description';
import Input from '@/components/ui/input';
import { useRouter } from 'next/router';
import {
  AddShipping,
  DashboardGetFun,
  GetFunction,
  UpdatingShipFunction,
} from '@/services/Service';
import Loader from '@/components/ui/loader/loader';
import Button from '@/components/ui/button';
import { toast } from 'react-toastify';
import { FixedSizeList as List } from 'react-window';

export default function OrderDetailsPage() {
  const { query } = useRouter();
  const [loading, setLoading] = useState<any>(false);
  const [btnLoader, setBtnLoader] = useState<any>(false);
  const [data, setData] = useState<any>(false);
  const [CountryList, setCountryList] = useState<any>([]);
  const [CountryListPayload, setCountryListPayload] = useState<any>([]);
  const [CityListPayload, setCityListPayload] = useState([]);
  const [CityList, setCityList] = useState<any>([]);
  const [CityListNew, setCityListNew] = useState<any>([]);
  const [shippingTier, setShippingTier] = useState<any>();
  const { t } = useTranslation();
  const [value, setValues] = React.useState<any>(false);
  const [rateValue, setRateValue] = React.useState<any>('fixed');
  const [codeFee, setCodeFee] = React.useState<any>(false);
  const [shippingRate, setShippingRate] = React.useState<any>(false);
  const [isList, setIsList] = React.useState<any>(false);
  const [newCountry, setNewCountry] = useState<any>([]);
  const [defaultCountry, setDefaultCountry] = useState<any>([]);
  const [newCity, setNewCity] = useState<any>([]);
  // const [shippingMethod, setShippingMethod] = useState<any>([]);
  // const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>({});
  const router = useRouter();
  // console.log(router,'router');

  // useEffect(() => {
  //   GetFunction('/all-shipping-methods').then((result) => {
  //     const shippingList = result?.data.map((item, i) => {
  //       return {
  //         key: i,
  //         id: item.id,
  //         value: item.name,
  //         label: item.name,
  //       };
  //     });
  //     setShippingMethod(shippingList);
  //   });
  // }, []);

  useEffect(() => {
    let ID = router?.query?.igniteShipId;
    setLoading(true);

    DashboardGetFun('/business-shipping').then((result) => {
      setLoading(false);
      let array = result.data;
      const object = array.find((obj) => obj.id == query.igniteShipId);
      setData(object);

    });

    // DashboardGetFun('/currencies').then((result1) => {
    //   // console.log(result1);

    //   let ordersData = result1.map((data, i) => {
    //     return {
    //       id: data.id,
    //       value: data.country.toLowerCase(),
    //       label: data.country,
    //       city: data.cities,
    //     };
    //   });
    //   setCountryList(ordersData);
    // });
    setLoading(true);
    DashboardGetFun('/get-business-shipping-tier/' + ID).then((result) => {
      // console.log(result?.data[0], 'this is result')
      // let tier=result?.data[0]
      setShippingTier(result?.data[0]);
      setLoading(false);
      // const selectedMethod=shippingMethod?.filter((method)=>{
      //   if(result.data[0].shipping_method_id===method.id){
      //     return method
      //   }
      // })
      // console.log(selectedMethod,'selected method');


    });
  }, []);

// console.log(shippingTier);

  useEffect(() => {
    if (shippingTier) {

      setIsList(true);
      setShippingRate(shippingTier?.base_shipping_fee);
      setValues(shippingTier?.is_cod === 0 ? false : true);
      setCodeFee(shippingTier?.cod_rate);
      setRateValue(shippingTier?.shipping_rate_type);
      setCityListPayload(shippingTier?.country_city);
      const country = Object.keys(shippingTier?.country_city).flat();
      const cities = Object.values(shippingTier?.country_city).flat();

      
      // console.log(country,'country');
      // console.log(cities,'cities');

      // setNewCity(cities)

      if (country) {
        DashboardGetFun('/currencies').then((result1) => {
          // console.log(result1);

          let ordersData = result1.map((data, i) => {
            return {
              id: data.id,
              value: data.country.toLowerCase(),
              label: data.country,
              city: data.cities,
            };
          });
          setCountryList(ordersData);
          // console.log(ordersData);

          if (ordersData) {
            setDefaultCountry([]);
            setNewCity([]);
            if (country.length == 0) {
              setIsList(false);
            }
            {
              country.map((item, index) => {
                setIsList(true);
                ordersData.filter((country) => {
                  if (country.value === item) {
                    setDefaultCountry((current) => [...current, country]);
                    // setCountryListPayload((current) => [...current, country])
                  }
                });

                setIsList(false);
              });
            }

            {
              cities.map((val, key) => {
                setLoading(true);
                if (val === 'all') {
                  setNewCity((current) => [
                    ...current,
                    {
                      id: key,
                      value: `All-${country[key].charAt(0).toUpperCase() +
                        country[key].slice(1)
                        }`,
                      label: `All-${country[key].charAt(0).toUpperCase() +
                        country[key].slice(1)
                        }`,
                    },
                  ]);
                } else {
                  ordersData.map((item) => {
                    item?.city?.filter((city, index) => {
                      if (city.toLowerCase() === val) {
                        setNewCity((current) => [
                          ...current,
                          {
                            id: index,
                            value: city,
                            label: city,
                          },
                        ]);
                      }
                    });
                  });
                }

                setLoading(false);
                // console.log(defaultCountry,'val')
              });
            }
          }
        });
      }
      // setLoading(true)
      // const selectedMethod = shippingMethod?.filter((method) => {
      //   if (shippingTier.shipping_method_id === method.id) {
      //     return method
      //   }

      // })
      // setLoading(false)
      // // console.log(selectedMethod, 'selected method');
      // setSelectedShippingMethod(selectedMethod[0])
    }
  }, [shippingTier]);


  useEffect(() => {
    if (defaultCountry) {
      setCountryListPayload(defaultCountry);
      setCityListNew([]);
      setCityList([]);
      defaultCountry.map((res) => {
        let cityLiast = res?.city?.map((aa, i) => {
          return {
            label: aa,
            value: aa,
            id: i,
          };
        });
        setCityList([...CityList, cityLiast]);
        let cities: any = [];
        [...CityList, cityLiast]?.map((resss) => {
          resss?.map((res, i) => {
            cities.push({ value: res.value, label: res.label, id: i });
          });
        });
        // defaultCountry.map((item)=>{
        //   cities.push({value:`All(${item.label})`,label:`All(${item.label})`,id:cities.length+1})
        // })
        let finalArray=cities.sort(function(a, b) {
          var labelA = a.label.toUpperCase();
          var labelB = b.label.toUpperCase();
        
          // Check if the label contains "All"
          var containsAllA = labelA.includes("ALL");
          var containsAllB = labelB.includes("ALL");
        
          // Sort cities with "All" label at the start
          if (containsAllA && !containsAllB) {
            return -1;
          }
          if (!containsAllA && containsAllB) {
            return 1;
          }
        
          // Sort remaining cities alphabetically
          if (labelA < labelB) {
            return -1;
          }
          if (labelA > labelB) {
            return 1;
          }
          return 0;
        });
        setCityListNew(finalArray);
      });
    }
  }, [defaultCountry]);

  // useEffect(()=>{

  //   // if(CountryList.length!=0 && newCountry.length!=0){
  //   //   setLoading(true)
  //   //   {newCountry.map((item,index)=>{
  //   //     CountryList.filter((country)=>{
  //   //       if(country.value===item){
  //   //         setDefaultCountry((current) => [...current, country])
  //   //       }
  //   //     })
  //   //     // console.log(defaultCountry,'val')
  //   //   })}
  //   //   setLoading(false)
  //   // }
  // },[newCountry])
  // console.log(newCountry,'new counter');

  let shippingRateArray = [
    { label: 'Fixed', value: 'fixed' },
    // { label: 'Free', value: 'free' },
    // { label: 'Weight', value: 'weight' },
  ];

  const onChangeShippingRate = (e) => {
    setRateValue(e.value);
  };

  const onChange = (e: any) => {
    setValues((value: any) => !value);
  };

  const onClickSave = () => {
    // console.log(CityListPayload);
    let countryAndCity = CityListPayload;
    setBtnLoader(true);
    let payload = {
      shipping_method_id: data.shipping_method_id,
      business_shipping_id: data.id,
      name: data.title,
      country_city: countryAndCity,
      is_cod: value == false ? 0 : 1,
      cod_rate: codeFee,
      shipping_rate_type: rateValue,
      // base_shipping_fee: 1,
      // base_weight: 2,
      // additional_shipping_fee: 'fixed',
      // weight_increment: 1,
      status: data.status,
      base_shipping_fee: shippingRate,
    };
    // console.log(payload);

    UpdatingShipFunction(
      '/business-shipping-tier/' + shippingTier.id,
      payload
    ).then((result) => {
      // console.log(result);

      if (result.success) {
        toast.success(result.msg);
        setBtnLoader(false);
        router.back();
      } else {
        toast.error(result.message);
        setBtnLoader(false);
      }
    });
  };

  const onChangeCodeFee = (e) => {
    setCodeFee(e.target.value);
  };

  const onCHnageShippingRate = (e) => {
    setShippingRate(e.target.value);
  };

  const onChangeCountry = (e) => {
    // console.log(e,'default');
    setCityListNew([]);
    setCityList([]);
    // setDefaultCountry(e)
    setCountryListPayload(e);
    e.map((res) => {
      let cityLiast = res?.city?.map((aa, i) => {
        return {
          label: aa,
          value: aa,
          id: i,
        };
      });
      setCityList([...CityList, cityLiast]);
      let cities: any = [];
      [...CityList, cityLiast]?.map((resss) => {
        resss?.map((res, i) => {
          cities.push({ value: res.value, label: res.label, id: i });
        });
      });
      // e.map((item)=>{
      //   cities.push({value:`All(${item.label})`,label:`All(${item.label})`,id:cities.length+1})
      // })
      let finalArray=cities.sort(function(a, b) {
        var labelA = a.label.toUpperCase();
        var labelB = b.label.toUpperCase();
      
        // Check if the label contains "All"
        var containsAllA = labelA.includes("ALL");
        var containsAllB = labelB.includes("ALL");
      
        // Sort cities with "All" label at the start
        if (containsAllA && !containsAllB) {
          return -1;
        }
        if (!containsAllA && containsAllB) {
          return 1;
        }
      
        // Sort remaining cities alphabetically
        if (labelA < labelB) {
          return -1;
        }
        if (labelA > labelB) {
          return 1;
        }
        return 0;
      });
      setCityListNew(finalArray);
    });
  };
  // console.log(CityList,'cityList');

  const onChangeCityLIst = (e) => {
    let newwarr: any = {};
    e.map((ew) => {
      const selectedCountry = CountryListPayload.find((country) =>
        country.city.some((city) => city === ew.value)
      );
      if (selectedCountry) {
        if (Array.isArray(newwarr[selectedCountry.value])) {
          if (ew.value.toLowerCase().includes('all')) {
            newwarr[selectedCountry.value].push('all');
          } else {
            newwarr[selectedCountry.value].push(ew.value.toLowerCase());
          }
        } else {
          if (ew.value.toLowerCase().includes('all')) {
            newwarr[selectedCountry.value] = ['all'];
          } else {
            newwarr[selectedCountry.value] = [ew.value.toLowerCase()];
          }
        }
      }
    });
    setCityListPayload(newwarr);
  };

  const height = 35;

  const MenuList = ({ options, children, maxHeight, getValue }) => {
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;

    return (
      <List
        width="100%"
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  };
  // console.log(codeFee,'default');
  // const onChangeShipping = (e) => {
  //   setSelectedShippingMethod(e);
  // };

  if (loading || isList) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('common:ignite-ship')}
        </h1>
      </div>
      {/* <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-title-shipping')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            <Label>{t('form:input-label-select-shipping-method')}</Label>
            <Select
              styles={selectStyles}
              name="shipping_method_id"
              options={shippingMethod}
              defaultValue={selectedShippingMethod}
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.id}
              //   defaultValue={shippingRateArray[0]}
              onChange={onChangeShipping}
            />
          </div>
        </Card>
      </div> */}
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:label-countries-cities')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            <Label>{t('form:input-label-select-country')}</Label>

            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              defaultValue={defaultCountry}
              styles={selectStyles}
              name="business_location_id"
              options={CountryList}
              isMulti
              onChange={onChangeCountry}
            />
          </div>
          <div className="pt-5">
            <Label>{t('form:input-label-select-city')}</Label>
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              styles={selectStyles}
              defaultValue={newCity}
              components={{ MenuList }}
              isMulti
              options={CityListNew}
              onChange={onChangeCityLIst}
            />
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-shippings')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div>
            <Label>{t('form:input-label-select-shipping-rate-type')}</Label>
            <Select
              styles={selectStyles}
              name="business_location_id"
              options={shippingRateArray}
              defaultValue={shippingRateArray[0]}
              onChange={onChangeShippingRate}
            />
          </div>
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-cash-on-delivery')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>{t('form:input-label-cash-on-delivery')}</Label>
            <Switch
              checked={value}
              className={`${value ? 'bg-accent' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
              dir="ltr"
              name=""
              onChange={onChange}
            >
              <span className="sr-only">Enable </span>
              <span
                className={`${value ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-light transition-transform`}
              />
            </Switch>
          </div>
          {value && (
            <>
              <div>
                <Input
                  label={t('form:input-label-cod-fee')}
                  name=""
                  type="number"
                  variant="outline"
                  className="mb-5"
                  value={codeFee}
                  onChange={onChangeCodeFee}
                />
              </div>
            </>
          )}
        </Card>
      </div>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-shipping-rate')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-shipping-rate')}
            name=""
            type="number"
            variant="outline"
            className="mb-5"
            value={shippingRate}
            onChange={onCHnageShippingRate}
          />
        </Card>
      </div>
      <div className="mt-8 flex justify-end">
        <Button className=" me-4" loading={btnLoader} onClick={onClickSave}>
          {t('form:button-label-save')}
        </Button>
      </div>
    </>
  );
}
OrderDetailsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form', 'table'])),
  },
});
function UpdatingSellFunction(
  arg0: string,
  payload: {
    shipping_method_id: any;
    business_shipping_id: any;
    name: any;
    country_city: never[];
    is_cod: number;
    cod_rate: any;
    shipping_rate_type: any;
    // base_shipping_fee: 1,
    // base_weight: 2,
    // additional_shipping_fee: 'fixed',
    // weight_increment: 1,
    status: any;
  }
) {
  throw new Error('Function not implemented.');
}
