import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MdOutlineDone } from 'react-icons/md';
import { adminOnly } from '@/utils/auth-utils';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { FiUserCheck } from 'react-icons/fi';
import { VscGraphLine } from 'react-icons/vsc';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { BiWallet } from 'react-icons/bi';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { GrAppleAppStore } from 'react-icons/gr';
import { ExpandLessIcon } from '@/components/icons/expand-less-icon';
import { ExpandMoreIcon } from '@/components/icons/expand-more-icon';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import dfImg from '../../public/image/dfImg.png';
import playStore from '../../../public/image/playstore.png';
import appImg1 from '../../../public/image/appImg1.png';
import appImg2 from '../../../public/image/appImg2.png';
import appImg3 from '../../../public/image/appImg3.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';

interface TrengoWindow extends Window {
  Trengo?: {
    open: (arg: any) => any;
  };
}

export default function MobileApp() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const router = useRouter();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const [isOpen, setOpen] = useState(false);
  const [section, setSection] = useState();
  const [featureIndex, setFeatureIndex] = useState<any>();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const items = [
    {
      title: 'faq-first-title',
      content: 'faq-first-content',
    },
    {
      title: 'faq-second-title',
      content: 'faq-second-content',
    },
    {
      title: 'faq-third-title',
      content: 'faq-third-content',
    },
  ];
  const boxArray = [
    {
      icon: <FiUserCheck style={{ color: 'white' }} />,
      text: 'customer-retension-rate',
      type: '3x',
    },
    {
      icon: <VscGraphLine style={{ color: 'white' }} />,
      text: 'customer-into-buyers',
      type: '5x',
    },
    {
      icon: <FaRegMoneyBillAlt style={{ color: 'white' }} />,
      text: 'increase-profit',
      type: '70%',
    },
    {
      icon: <AiOutlineUserAdd style={{ color: 'white' }} />,
      text: 'access-to-store',
      type: '98%',
    },
    {
      icon: <BiWallet style={{ color: 'white' }} />,
      text: 'low-cost',
      type: '40%',
    },
  ];
  const featureArray = [
    { text: 'dashboard-feature', img: appImg1 },
    { text: 'abandoned-cart-feature', img: appImg2 },
    { text: 'discount-feature', img: appImg3 },
    { text: 'sending-notification-feature', img: appImg1 },
  ];

  let expandIcon;
  if (Array.isArray(items) && items.length) {
    expandIcon = !isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />;
  }
  const handleFAQ = (e) => {
    setSection(e);
    setOpen(!isOpen);
  };
  const handleFeature = (e) => {
    setFeatureIndex(e);
  };

  const myFunction = () => {
    const myWindow: any = window as TrengoWindow;

    myWindow?.Trengo?.Api.Widget.open('chat');
  };
  // const handleButtonClick = () => {
  //   if (!scriptLoaded) {
  //     const script = document.createElement('script');
  //     script.type = 'text/javascript';
  //     script.async = true;
  //     script.src = 'https://static.widget.trengo.eu/embed.js';
  //     script.onload = () => {
  //       setScriptLoaded(true);
  //     };
  //     document.head.appendChild(script);
  //   }
  // };

  return (
    <>
      <div>
        <h1 className="py-2 text-lg font-semibold ">
          {t('common:mobile-app')}
        </h1>
        <div
          className="bg-red my-2 rounded border py-2 lg:grid lg:grid-cols-12 lg:gap-4 xl:grid xl:grid-cols-12 xl:gap-4"
          style={{
            background: `linear-gradient(90deg, rgba(47,112,95,1) 0%, rgba(47,112,95,1) 73%, rgba(22,175,51,1) 100%)`,
          }}
        >
          <div className="p-2 lg:col-span-3 xl:col-span-3">
            <Image
              src={appImg2}
              width={400}
              height={300}
              className="object-contain"
              alt="dj"
            />
          </div>
          <div className="flex flex-col justify-center p-4 lg:col-span-5   xl:col-span-5">
            <h3 className="font-semibold text-white">
              {t('common:create-heading')}
            </h3>
            <p className="text-white ">{t('common:create-description')}</p>
          </div>
          <div className="flex items-center justify-center p-2 lg:col-span-4  xl:col-span-4">
            <Button
              // variant="outline"
              onClick={myFunction}
              className="me-4"
              type="button"
            >
              {t('common:create-button')}
              <span className="px-2">
                <AiOutlineArrowRight
                  style={{ transform: `scaleX(${dir === 'rtl' ? -1 : 1})` }}
                />
              </span>
            </Button>
          </div>
        </div>
      </div>
      <div className="my-2 rounded border bg-white">
        <div className="p-4">
          <h3 className=" text-lg font-semibold text-accent">
            {t('common:mobile-detail-heading')}
          </h3>
        </div>
        <div className="p-4 lg:grid lg:grid-cols-12 lg:gap-4 xl:grid xl:grid-cols-12 xl:gap-4">
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="grid grid-cols-6 gap-4">
              {boxArray.map((box, index) => (
                <div
                  key={index}
                  className="col-span-3 flex flex-col rounded bg-gray-100 p-3 "
                >
                  <div className="p-1">
                    <div className="color-white w-fit rounded border bg-accent p-2">
                      {box.icon}
                    </div>
                  </div>
                  <div className="p-1 font-bold">
                    <span>{box.type}</span>
                  </div>
                  <div className="flex items-center p-1 text-sm">
                    <span>{t(`common:${box.text}`)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="py-4 lg:col-span-5 xl:col-span-5">
            <Image
              src={appImg2}
              width={500}
              height={400}
              className="object-contain "
              alt="img"
            />
          </div>
        </div>
      </div>
      <div className="my-2 rounded border bg-white">
        <div className="p-4">
          <h3 className=" text-lg font-semibold text-accent">
            {t('common:feature-heading')}
          </h3>
        </div>
        <div className="p-4 lg:grid lg:grid-cols-12 lg:gap-6 xl:grid xl:grid-cols-12 xl:gap-6">
          <div className=" lg:col-span-6 xl:col-span-6">
            {featureArray.map((feature, index) => (
              <div
                key={index}
                className={`${
                  featureIndex === index ? 'bg-accent' : 'bg-gray-100'
                }
                   my-2 grid  cursor-pointer grid-cols-8 gap-2 rounded-lg bg-gray-100 hover:bg-accent  `}
                onMouseEnter={() => {
                  handleFeature(index);
                }}
                onMouseLeave={() => {
                  setFeatureIndex('');
                }}
                style={{ padding: '1.3rem' }}
              >
                <div className="col-span-2 flex items-center justify-center  ">
                  <span className="rounded-full bg-gray-200">
                    <MdOutlineDone className="h-5 w-5" />
                  </span>
                </div>
                <div
                  className={`${featureIndex === index ? 'text-white' : ''}
                col-span-6  `}
                >
                  {t(`common:${feature.text}`)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center py-2 lg:col-span-6 xl:col-span-6">
            {featureIndex ? (
              <Image
                src={featureArray[featureIndex].img}
                width={400}
                height={400}
                className="object-contain"
                alt="img"
              />
            ) : (
              <Image
                src={featureArray[0].img}
                width={400}
                height={400}
                className="object-contain"
                alt="img"
              />
            )}
            {/* <Image src={dfImg} width={400} height={400} className="object-contain" alt="img" /> */}
          </div>
        </div>
      </div>

      <div className="my-2 rounded border bg-white">
        <div className="p-4">
          <h3 className=" text-lg font-semibold text-accent">
            {t('common:demo-store-heading')}
          </h3>
        </div>
        <div className="p-4 lg:grid lg:grid-cols-12 lg:gap-2 xl:grid xl:grid-cols-12 xl:gap-2">
          <div className="rounded-lg bg-gray-100 lg:col-span-3  xl:col-span-3 ">
            <span className="rounded">
              {' '}
              <Image
                src={appImg1}
                width={400}
                height={500}
                className="object-contain "
                alt="img"
              />
            </span>

            <div className="flex justify-center">
              <a
                href="https://play.google.com/store/apps/details?id=com.ignitehq.app"
                target="_blank"
                className=""
                rel="noreferrer"
              >
                <Image src={playStore} width={25} height={25} alt={'img'} />
              </a>
              <a
                href="https://apps.apple.com/us/app/ignite-%D8%A7%D8%AC%D9%86%D8%A7%D9%8A%D8%AA/id1641743448"
                target="_blank"
                className=""
                rel="noreferrer"
              >
                {' '}
                <GrAppleAppStore className="h-7 w-7" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="my-2 rounded border bg-white">
        <div className="p-4">
          <h3 className=" text-lg font-semibold text-accent">
            {t('common:nav-menuu-faq')}
          </h3>
        </div>
        <div className="p-4">
          {items.map((item, index) => (
            <>
              <div className="my-2 ">
                <button
                  className="flex w-full items-center rounded-t border-0 bg-slate-200 p-2 text-base outline-none text-start  focus:ring-0"
                  onClick={() => {
                    handleFAQ(index);
                  }}
                >
                  <p className="flex-1 text-emerald-700">
                    {t(`common:${item.title}`)}
                  </p>
                  <span className="text-emerald-700">{expandIcon}</span>
                </button>

                {isOpen && section === index && (
                  <div className="rounded-b bg-stone-100 p-2 ">
                    <section>{t(`common:${item.content}`)}</section>
                  </div>
                )}
              </div>
            </>
          ))}
        </div>
      </div>

      <div className="my-2 rounded border bg-white">
        <div className="lg:grid lg:grid-cols-12 lg:gap-4 xl:grid xl:grid-cols-12 xl:gap-4">
          <div className="flex flex-col p-4 lg:col-span-8 xl:col-span-8">
            <h3 className=" py-2 text-lg font-semibold">
              {t('common:create-heading')}
            </h3>
            {/* <span className="text-accent py-1">1000.00 SAR / yearly</span> */}
            <span className=" py-1">
              <Button
                // variant="outline"
                onClick={myFunction}
                className="me-4"
                type="button"
              >
                {t('common:create-button')}
                <span className="px-2">
                  <AiOutlineArrowRight
                    style={{ transform: `scaleX(${dir === 'rtl' ? -1 : 1})` }}
                  />
                </span>
              </Button>
            </span>
            {/* {scriptLoaded && (
              <Helmet>
                <script>
                  {`
      window.Trengo = window.Trengo || {};
      window.Trengo.key = 'GRMl3SFGyc4GHMvkE4CX';
    `}
                </script>
                <script
                  async
                  src="https://static.widget.trengo.eu/embed.js"
                ></script>
              </Helmet>
            )} */}
            {/* <span className=" py-1">By:App Bunches</span> */}
          </div>
          <div className="py-2 lg:col-span-4 xl:col-span-4">
            <Image
              src={appImg3}
              width={500}
              height={300}
              className="object-contain"
              alt="img"
            />
          </div>
        </div>
      </div>
    </>
  );
}

MobileApp.authenticate = {
  permissions: adminOnly,
};
MobileApp.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
