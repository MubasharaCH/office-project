import { CartIconBig } from '@/components/icons/cart-icon-bag';
import { CoinIcon } from '@/components/icons/coin-icon';
import ColumnChart from '@/components/widgets/column-chart';
import StickerCard from '@/components/widgets/sticker-card';
import { useTranslation } from 'next-i18next';
import { ShopIcon } from '@/components/icons/sidebar';
import { DollarIcon } from '@/components/icons/shops/dollar';
import DashboardSetUp from '../widgets/DashboardSetUp';
import { useState } from 'react';
import React from 'react';
import {
  DashboardGetFun,
  GetFunction,
  WalletApi,
  WalletApiPost,
} from '@/services/Service';
import Loader from '@/components/ui/loader/loader';
import cn from 'classnames';
import Label from '../ui/label';
import Select from 'react-select';
import { selectStyles } from '../../components/ui/select/select.styles';
import Button from '@/components/ui/button';
import NewButton from '../ui/NewButton';
import Router, { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Wallert from '@/assets/images/bgg.png';
import Image from 'next/image';
import { FaWallet } from 'react-icons/fa';
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
  BsPlusCircle,
} from 'react-icons/bs';
import Modal from '../ui/modal/modal';
import Card from '../common/card';
import Input from '../ui/input';
import Drawer from '../ui/drawer';
import DrawerWrapper from '../ui/drawer-wrapper';
import { toast } from 'react-toastify';
// import Carousel from 'next-seo/lib/jsonld/carousel';

export default function Dashboard() {
  const { t } = useTranslation('common');
  const [data, SetData] = useState<any>();
  const [loadingData, setloadingData] = useState(false);
  const [loadingData2, setloadingData2] = useState(false);
  const [BtnActiveState, setBtnActiveState] = useState(true);
  const [RenderData, setRenderData] = useState<any>();
  const [GraphData, setGraphData] = useState<any>([]);
  const [BusinessDetails, setBusinesDetails] = useState<any>([]);
  const [WalletAmount, setWalletAmount] = useState<any>('');
  const [closeDialog, setCloseDialog] = useState<any>(false);
  const [withDrawModal, setWithDrawModalg] = useState<any>(false);
  const [bankCrudModal, setBankCrudModal] = useState<any>(false);
  const [btnLoader, setBtnLoader] = useState<any>(false);
  const [bankLoader, setBankLoader] = useState<any>(false);
  const [addBankLoader, setAddBankLoader] = useState<any>(false);
  const [locationDataArray, setLocationDataArray] = React.useState<any>([]);
  const [bankList, setBankList] = React.useState<any>([]);
  const [locationID, setLocationID] = useState<any>();
  const [Uid, setUid] = useState<any>();
  const [amountChhange, setAmountChhange] = useState<any>('');
  const [annoucments, setAnnoucments] = useState<any>([]);
  const [BankAmount, setBankAmount] = useState<any>('');
  const [BankId, setBankId] = useState<any>('');
  const [BankValue, setBankValues] = useState<any>({
    Bname: '',
    BholderName: '',
    BAccountNumber: '',
    BranchCity: '',
    BranchName: '',
  });
  const router = useRouter();

  React.useEffect(() => {
    callinggAPI();
    setloadingData(true);
    var business: any = JSON.parse(
      localStorage.getItem('user_business_details')!
    );
    if (business) {
      if (
        business?.subscriptions[0]?.package_details?.name.toLowerCase() ===
        'free package'
      ) {
        Router.push('/updateSubscription');
      }
      setloadingData(true);
    }
  }, []);

  const callingWalletAPI = (id, curr) => {
    WalletApi(id, 'merchant-wallet-balance?currency=' + curr).then((result) => {
      if (result?.success?.status == 200) {
        setWalletAmount(result?.success?.defaultWalletBalance);
      }
    });
  };
  const callingGetBank = (id, end) => {
    WalletApi(id, end).then((result) => {
      if (result?.success?.status == 200) {
        // setBankList(result?.success?.payoutSettings);
        let ordersData = result?.success?.payoutSettings?.map((data, i) => {
          return {
            key: i,
            id: data.id,
            value: data.bank_name,
            label: data.bank_name,
          };
        });
        setBankList(ordersData);
      }
    });
  };
  const callinggAPI = () => {
    setloadingData(true);
    GetFunction('/business-location').then((result) => {
      let ordersData = result?.data?.map((data, i) => {
        return {
          key: i,
          id: data.id,
          value: data.name,
          label: data.name,
          uid: data.custom_field3,
        };
      });
      let businessDetails: any = localStorage.getItem('business_details');
      console.log("businessDetails",result)
      setBusinesDetails(JSON.parse(businessDetails));
      setUid(result.data[0]?.custom_field3);
      callingWalletAPI(
        result.data[0]?.custom_field3,
        JSON.parse(businessDetails)?.code
      );
      callingGetBank(result.data[0]?.custom_field3, 'get-banks');
      setLocationDataArray(ordersData);

      DashboardGetFun(
        '/dashboard-mobile?location_id=' + ordersData[0]?.id
      ).then((result) => {
        setloadingData(true);
        if (result.success) {
          setloadingData(true);
          SetData(result?.date);
          setRenderData(result?.date?.today);

          let salesByYear: any = [];
          let val1: any = result?.date?.sale_report;
          let newlwt: any = Object.assign({}, val1);
          salesByYear.push(
            newlwt[0]?.Mon?.toFixed(2),
            newlwt[1]?.Tue?.toFixed(2),
            newlwt[2]?.Wed?.toFixed(2),
            newlwt[3]?.Thu?.toFixed(2),
            newlwt[4]?.Fri?.toFixed(2),
            newlwt[5]?.Sat?.toFixed(2),
            newlwt[6]?.Sun?.toFixed(2)
          );

          setGraphData(salesByYear);
        }
        setloadingData(false);
      });
    });
    GetFunction('/announcement').then((result) => {
      setloadingData(true);
      if (result.success) {
        setAnnoucments(result.data);
        setloadingData(false);
      }
    });
  };
  let dataaa = [
    { node: ['This is annoucmenttt one ', 'this iis annoucment ttwoo'] },
    { node: ['This is annoucmenttt one 2 ', 'this iis annoucment ttwoo 2'] },
    { node: ['This is annoucmenttt one 3', 'this iis annoucment ttwoo 3'] },
  ];

  const concernedElement: any = document.querySelector('.click-text');

  document.addEventListener('mousedown', (event) => {
    if (concernedElement?.contains(event.target)) {
    } else {
      setBtnActiveState(true);
      setRenderData(data && data?.today);
    }
  });

  const onChangeFilter = (e) => {
    setBtnActiveState(false);
    if (e === 'today') {
      setRenderData(data.today);
    }
    if (e === 'yesterday') {
      setRenderData(data.yesterday);
    }
    if (e === 'this_week') {
      setRenderData(data.this_week);
    }
    if (e === 'this_month') {
      setRenderData(data.this_month);
    }
  };

  const OnChangeLocation = (e) => {
    let businessDetails: any = localStorage.getItem('business_details');
    setUid(e.uid);

    setLocationID(e.id);
    setloadingData2(true);
    callingWalletAPI(e.uid, JSON.parse(businessDetails)?.code);
    DashboardGetFun('/dashboard-mobile?location_id=' + e.id).then((result) => {
      if (result.success) {
        setloadingData2(true);
        SetData(result?.date);
        setRenderData(result?.date?.today);

        let salesByYear: any = [];
        let val1: any = result?.date?.sale_report;
        let newlwt: any = Object.assign({}, val1);

        salesByYear.push(
          newlwt[0]?.Mon,
          newlwt[1]?.Tue,
          newlwt[2]?.Wed,
          newlwt[3]?.Thu,
          newlwt[4]?.Fri,
          newlwt[5]?.Sat,
          newlwt[6]?.Sun
        );
        setGraphData(salesByYear);
      }
      setloadingData2(false);
    });
  };

  const onDepositPress = () => {
    setCloseDialog(true);
  };

  const onWithdrawPress = () => {
    setWithDrawModalg(true);
  };
  const onWithdraw = () => {
    router.push({
      pathname: Routes.withDraw,
      query: { Uid: Uid },
    });
  };
  const onAmountChange = (e) => {
    setAmountChhange(e.target.value);
  };

  const onNextPress = () => {
    setBtnLoader(true);
    let businessDetails: any = localStorage.getItem('business_details');
    WalletApi(
      Uid,
      'create-deposit?currency=' +
        JSON.parse(businessDetails)?.code +
        '&amount=' +
        amountChhange
    ).then((result) => {
      if (result.Url) {
        window.open(result.Url, '_blank');
        setBtnLoader(false);
        setCloseDialog(false);
      } else {
        toast.error('Something Went Wrong');
        setBtnLoader(false);
        setCloseDialog(false);
      }
    });
  };

  const onBankChange = (e) => {
    setBankId(e.id);
  };
  const onBankAmountChange = (e) => {
    setBankAmount(e.target.value);
  };
  const onBankNextPress = () => {
    setBankLoader(true);
    let obj = {
      currency_code: 'SAR',
      amount: BankAmount,
      bank_id: BankId,
    };
    WalletApiPost(Uid, 'withdraw-money', obj).then((result) => {
      if (result.status == true) {
        setBankLoader(false);
        setWithDrawModalg(false);
        toast.success(result.message);
        window.location.reload();
      } else {
        setBankLoader(false);
        toast.error(result.message);
      }
    });
  };

  const onAddBankPress = () => {
    setWithDrawModalg(false);
    setBankCrudModal(true);
  };

  const onChangeBankVal = (e) => {
    const { name, value } = e.target;
    setBankValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const onAddBank = () => {
    setAddBankLoader(true);
    let obj = {
      bank_name: BankValue.Bname,
      account_name: BankValue.BholderName,
      account_number: BankValue.BAccountNumber,
      bank_branch_name: BankValue.BranchName,
      bank_branch_city: BankValue.BranchCity,
    };
    WalletApiPost(Uid, 'add-bank', obj).then((result) => {
      if (result?.success?.status == 200) {
        toast.success(result?.success?.message);
        setBankCrudModal(false);
        setAddBankLoader(false);
        window.location.reload();
      }
    });
  };
  if (loadingData) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <div className="flex w-full flex-wrap md:flex-nowrap">
        <div className="flex lg:w-1/2 xl:1/2 flex-col rounded bg-light h-44">
          <Carousel
            showArrows={false}
            autoPlay={true}
            showStatus={false}
            showThumbs={false}
          >
            {annoucments.map((res, i) => (
              <div key={i} className="carousel-slide-container">
                <img
                  className="rounded"
                  src="/bg-50.jpg"
                  style={{ height: '176px' }}
                />

                <div className="absolute top-6 left-4 z-10">
                  <button className="bg-white text-black flex px-2 py-1 text-base rounded">
                    Announcement
                  </button>
                  <div className=" mt-3">
                    <p className="text-white flex justify-left  text-base">
                      {res.Announcement[0]}
                    </p>
                    <p className="text-white flex justify-left  text-base">
                      {res.Announcement[1]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
        {Uid != null && (
          <div className="flex lg:w-1/2 xl:1/2 w-full flex-col rounded bg-light p-7 lg:ml-6 xl:ml-6 md:ml-4  h-44 lg:mt-0 xl:mt-0 md:mt-0 mt-6">
            <div className="flex justify-between">
              <div className="flex">
                <FaWallet className="h-7 w-7 mr-3" />
                <h1 className="text-lg">Wallet Balance</h1>
                <BsPlusCircle
                  onClick={onWithdraw}
                  className="mt-1 ml-1 cursor-pointer h-5 w-5"
                />
              </div>
              <div>
                <h1 className="text-lg">{WalletAmount}</h1>
              </div>
            </div>
            <div className="flex justify-between lg:mt-10 xl:mt-10 mt-5">
              <Button onClick={onDepositPress}>Deposit</Button>
              <Button className="ml-3" onClick={onWithdrawPress}>
                Withdraw
              </Button>
            </div>
          </div>
        )}
      </div>
      <Drawer
        open={closeDialog}
        onClose={() => setCloseDialog(true)}
        variant="right"
      >
        <DrawerWrapper onClose={() => setCloseDialog(false)} hideTopBar={false}>
          <div className="m-auto rounded bg-light sm:w-[28rem]">
            <div className="p-4">
              <div className="mt-3">
                <Input
                  label={t('Enter Amount')}
                  variant="outline"
                  name="amount"
                  type="number"
                  className="mb-4"
                  onChange={onAmountChange}
                />
              </div>

              <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                <Button
                  onClick={onNextPress}
                  loading={false}
                  className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                >
                  <div className=" text-center justify-center text-light flex w-full">
                    {t('Next')}
                    {btnLoader && (
                      <span className="pl-2" role="status">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 mr-2 animate-spin dark:text-black fill-white"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </span>
                    )}
                  </div>
                </Button>
              </footer>
            </div>
          </div>
        </DrawerWrapper>
      </Drawer>
      <Drawer
        open={withDrawModal}
        onClose={() => setWithDrawModalg(true)}
        variant="right"
      >
        <DrawerWrapper
          onClose={() => setWithDrawModalg(false)}
          hideTopBar={false}
        >
          <div className="m-auto rounded bg-light sm:w-[28rem]">
            <div className="p-4">
              <div className="flex justify-end">
                <Button onClick={onAddBankPress}>Add Bank</Button>
              </div>
              <div className="mt-3">
                <Label>Select Bank</Label>
                <Select
                  styles={selectStyles}
                  className="mb-4"
                  options={bankList}
                  onChange={onBankChange}
                />
              </div>
              <div className="mt-3">
                <Input
                  label={t('Enter Amount')}
                  variant="outline"
                  name="amount"
                  type="number"
                  className="mb-4"
                  onChange={onBankAmountChange}
                />
              </div>

              <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                <Button
                  loading={bankLoader}
                  className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                >
                  <div
                    onClick={onBankNextPress}
                    className="flex-1 text-center text-light"
                  >
                    {t('Next')}
                  </div>
                </Button>
              </footer>
            </div>
          </div>
        </DrawerWrapper>
      </Drawer>
      <Drawer
        open={bankCrudModal}
        onClose={() => setBankCrudModal(true)}
        variant="right"
      >
        <DrawerWrapper
          onClose={() => setBankCrudModal(false)}
          hideTopBar={false}
        >
          <div className="m-auto rounded bg-light sm:w-[28rem]">
            <div className="p-4">
              <div className="mt-3">
                <Input
                  label={t('Bank Name')}
                  variant="outline"
                  name="Bname"
                  className="mb-4"
                  onChange={(e) => onChangeBankVal(e)}
                />
              </div>
              <div className="mt-3">
                <Input
                  label={t('Bank Account Holder Name')}
                  variant="outline"
                  name="BholderName"
                  className="mb-4"
                  onChange={(e) => onChangeBankVal(e)}
                />
              </div>
              <div className="mt-3">
                <Input
                  label={t('Bank Account Number/IBAN')}
                  variant="outline"
                  name="BAccountNumber"
                  className="mb-4"
                  onChange={(e) => onChangeBankVal(e)}
                />
              </div>{' '}
              <div className="mt-3">
                <Input
                  label={t('Branch City')}
                  variant="outline"
                  name="BranchCity"
                  className="mb-4"
                  onChange={(e) => onChangeBankVal(e)}
                />
              </div>
              <div className="mt-3">
                <Input
                  label={t('Branch Name')}
                  variant="outline"
                  name="BranchName"
                  className="mb-4"
                  onChange={(e) => onChangeBankVal(e)}
                />
              </div>
              <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light py-5 px-6">
                <Button
                  loading={addBankLoader}
                  className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
                >
                  <div
                    onClick={onAddBank}
                    className="flex-1 text-center text-light"
                  >
                    {t('Add Bank')}
                  </div>
                </Button>
              </footer>
            </div>
          </div>
        </DrawerWrapper>
      </Drawer>
      {
        <div className="mb-6 flex w-full flex-wrap md:flex-nowrap">
          <DashboardSetUp
            data={data}
            titleTransKey={t('common:dashboard-title')}
            setloadingData={setloadingData}
            callinggAPI={() => callinggAPI()}
          />
        </div>
      }

      <div className="mb-6 w-full flex-wrap rounded bg-light p-5 md:flex-nowrap">
        <div className="flex lg:justify-end Xl:justify-end md:justify-end justify-start">
          <div className="lg:w-4/12 Xl:w-4/12 md:w-4/12 w-full pb-3">
            <Label>{t('common:title-select-Location')}</Label>
            <Select
              getOptionLabel={(option: any) => option.label}
              getOptionValue={(option: any) => option.key}
              styles={selectStyles}
              options={locationDataArray}
              onChange={OnChangeLocation}
              defaultValue={locationDataArray[0]}
            />
          </div>
        </div>
        {loadingData2 ? (
          <Loader text={t('common:text-loading')} />
        ) : (
          <div>
            <div className="grid-inherit mb-4 grid gap-4 md:grid-cols-12 lg:grid-cols-12">
              <div className="col-span-3 ">
                <NewButton
                  className={`${
                    BtnActiveState
                      ? 'w-full bg-accent'
                      : 'w-full border border-border-400 bg-transparent text-body text-[#6B7280] hover:border-accent hover:bg-accent hover:text-light'
                  }`}
                  onClick={() => onChangeFilter('today')}
                >
                  {t('text-today')}
                </NewButton>
              </div>
              <div className="col-span-3 w-full">
                <NewButton
                  variant="outline"
                  onClick={() => onChangeFilter('yesterday')}
                  className="w-full"
                >
                  {t('text-yesterday')}
                </NewButton>
              </div>
              <div className="col-span-3">
                <NewButton
                  variant="outline"
                  onClick={() => onChangeFilter('this_week')}
                  className="w-full"
                >
                  {t('text-this-week')}
                </NewButton>
              </div>
              <div className="col-span-3">
                <NewButton
                  variant="outline"
                  onClick={() => onChangeFilter('this_month')}
                  className="w-full"
                >
                  {t('text-this-month')}
                </NewButton>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="w-full ">
                <StickerCard
                  titleTransKey={t('text-gross-sales')}
                  // subtitleTransKey="sticker-card-subtitle-rev"
                  icon={<DollarIcon className="h-7 w-7" color="#047857" />}
                  iconBgStyle={{ backgroundColor: '#A7F3D0' }}
                  price={
                    BusinessDetails?.symbol +
                    ' ' +
                    RenderData?.netSales.toLocaleString()
                  }
                />
              </div>
              <div className="w-full ">
                <StickerCard
                  titleTransKey={t('text-net-sales')}
                  // subtitleTransKey="sticker-card-subtitle-order"
                  icon={<CartIconBig />}
                  price={
                    BusinessDetails?.symbol +
                    ' ' +
                    RenderData?.grossSales.toLocaleString()
                  }
                />
              </div>
              <div className="w-full ">
                <StickerCard
                  titleTransKey={t('text-sold-item')}
                  icon={<CoinIcon color="#1D4ED8" />}
                  price={RenderData?.soldItems}
                />
              </div>
              <div className="w-full ">
                <StickerCard
                  titleTransKey={t('text-order')}
                  icon={<ShopIcon className="w-6" color="#1D4ED8" />}
                  iconBgStyle={{ backgroundColor: '#93C5FD' }}
                  price={RenderData?.ordersReceived}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {loadingData2 ? (
        <Loader text={t('common:text-loading')} />
      ) : (
        <div className="mb-6 flex w-full flex-wrap md:flex-nowrap">
          {GraphData && (
            <ColumnChart
              widgetTitle={t('common:sale-history')}
              colors={['#212121']}
              series={GraphData}
              categories={[
                t('common:monday'),
                t('common:tuesday'),
                t('common:wednesday'),
                t('common:thursday'),
                t('common:friday'),
                t('common:saturday'),
                t('common:sunday'),
              ]}
            />
          )}
        </div>
      )}
    </>
  );
}
