import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MdOutlineDone } from 'react-icons/md';
import { adminOnly } from '@/utils/auth-utils';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { FaTiktok } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { BsInstagram } from 'react-icons/bs';
import { IoIosArrowForward } from 'react-icons/io';
import { FiUserCheck } from 'react-icons/fi';
import { VscGraphLine } from 'react-icons/vsc';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import insta from '../../../public/image/insta.png';
import integrat from '../../../public/image/integrat.png';
import { BsFacebook } from 'react-icons/bs';
import { BiWallet } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
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
import modal from '../../../public/image/modal.png';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import Modal from '@/components/ui/modal/modal';
interface TrengoWindow extends Window {
  Trengo?: {
    open: (arg: any) => any;
  };
}
const customStyles = {
  content: {
    width: '35%',
    top: '55%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function MobileApp() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const router = useRouter();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const [isOpen, setOpen] = useState(false);
  const [section, setSection] = useState();
  const [featureIndex, setFeatureIndex] = useState<any>();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [closeDialog, setCloseDialog] = useState<any>(false);
  const [openDialog, setopenDialog] = useState<any>(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [shippings, setshipping] = useState<any>();
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const onClickClose = () => {
    setCloseDialog(false);
    setopenDialog(false);
  };
  function onShareModel(index) {
    setshipping(index);
    setCloseDialog(true);
  }

  const model = [
    {
      img: modal,
      hed: 'Integrate with Google Shopping',
      heading: 'Integrate with',
      head: 'Facebook/Instagram Shopping',
      para:
        'Copy the integration link below and paste it on the specific field on Facebook Shopping',
      button: 'Copy the link for integration ',
      buton: 'Access Facebook Shopping',
      url: 'https://pos-dev.myignite.online/api/feed/royaltag',
    },
    {
      img: modal,
      heading: 'Integrate with Google Shopping',
      para:
        'Copy the integration link below and paste it on the specific field on Facebook Shopping',
      button: 'Copy the link for integration ',
      buton: 'Access Google Shopping',
      url: 'https://pos-dev.myignite.online/api/feed/royaltag',
    },
  ];

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
        <h1 className="py-2 text-lg font-semibold ">{t('Social Commerce')}</h1>
      </div>

      <div className="pt-5 text-center ">
        <Image className="relative" src={integrat} width={70} height={70} />
        <h5 className=" text-sm font-semibold  ">Integrations</h5>
        <p className=" pb-2 text-xs">
          Set up your sales channels and increase your sales
        </p>
      </div>
      <div className="mt-5 flex justify-between">
        <div className="mr-3 w-full">
          <div
            className="flex flex bg-slate-200 pt-3 pb-3 pl-3"
            style={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}
          >
            {' '}
            <Image src={insta} width={20} height={10} />
            <BsFacebook
              className="text-xl  "
              style={{ color: 'blue', marginLeft: '10px' }}
            />{' '}
            <label className="pl-3 text-sm"> Facebook / Instagram </label>{' '}
          </div>
          <Card className=" md:p-0">
            <div
              className="flex cursor-pointer  justify-between hover:bg-[#ececec]    "
              onClick={() => {
                onShareModel(0);
              }}
            >
              <div>
                {' '}
                <h6 className="pl-4 pt-6 text-sm font-semibold">Shopping</h6>
                <p className="pl-4 pb-4 text-xs ">
                  connect your online catalog to facebook and instagram stores
                </p>
              </div>
              <div className=" mt-2 ml-3  pt-6 ">
                <IoIosArrowForward className="mr-7 text-lg" />
              </div>
            </div>

            <hr className="ml-4 mr-4" />
            <div className=" flex cursor-pointer justify-between hover:bg-[#ececec] ">
              <div>
                {' '}
                <h6 className="pl-4 pt-6 text-sm font-semibold ">
                  Facebook Pixek
                </h6>
                <p className="pl-4 pb-4 text-xs">Know the impact of out add </p>
              </div>
            </div>
          </Card>
        </div>
        <div className="ml-3 w-full">
          <div
            className="flex bg-slate-200 pt-3 pb-3 pl-2  "
            style={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}
          >
            {' '}
            <FcGoogle className="text-xl" />{' '}
            <label className="pl-2 text-sm">Google</label>{' '}
          </div>

          <Card className="cursor-pointer  hover:bg-[#ececec] md:p-6">
            <div
              className="flex justify-between"
              onClick={() => {
                onShareModel(1);
              }}
            >
              <div>
                {' '}
                <h6 className="text-sm font-semibold">Shopping</h6>
                <p className="text-xs">Reach out customer on Google</p>
              </div>
              <div className=" mt-2 text-lg">
                <IoIosArrowForward />
              </div>
            </div>
          </Card>
        </div>
      </div>
      {shippings != null ? (
        <Modal open={closeDialog} onClose={() => setCloseDialog(false)}>
          <Card className="mt-4" style={{ width: 480 }}>
            <div className="center">
              <h6
                className="cursor-pointer"
                onClick={onClickClose}
                style={{ marginLeft: '420px' }}
              >
                {' '}
                <RxCross2 />
              </h6>
            </div>

            <div className="pt-7 text-center">
              <Image className="mt-6" src={modal} />
              <h1 className="pt-2 text-2xl font-bold ">
                {model[shippings]?.heading}
              </h1>
              <h1 className="text-2xl font-bold ">{model[shippings]?.head} </h1>
              <p className="pt-2 text-sm">{model[shippings]?.para}</p>
              <a href={model[shippings].url} target="_sajid">
                <button
                  style={{ width: '410px' }}
                  className="mt-3  rounded-lg bg-green-300 pt-2 pb-2 text-sm text-white"
                >
                  {' '}
                  {model[shippings]?.button}
                  <br />
                  <span className=" text-xs"> {model[shippings].url}</span>
                </button>
              </a>
              <button
                style={{ paddingLeft: '107px', paddingRight: '107px' }}
                className="mt-3 rounded-md border-2 bg-white pt-3 pb-3 text-sm text-black "
              >
                {' '}
                {model[shippings]?.buton}
              </button>
            </div>
          </Card>
        </Modal>
      ) : (
        ''
      )}
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
