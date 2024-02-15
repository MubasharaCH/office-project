import Logo from '@/components/ui/logo';
import { useUI } from '@/contexts/ui.context';
import AuthorizedMenu from './authorized-menu';
import LinkButton from '@/components/ui/link-button';
import { NavbarIcon } from '@/components/icons/navbar-icon';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { adminAndOwnerOnly, getAuthCredentials } from '@/utils/auth-utils';
import LanguageSwitcher from './language-switer';
import { Config } from '@/config';
import Button from '@/components/ui/button';
import { GetFunction, GetPosFun, pos_url } from '@/services/Service';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { t } = useTranslation();
  const { toggleSidebar } = useUI();
  const [businessName, setBusinessName] = useState('');
  const [loader, setLoader] = useState(false);
  // let businessName:any = localStorage.getItem('business_name');
  const { enableMultiLang } = Config;
  let POS_URL = pos_url;

  useEffect(() => {
    let businessName: any = localStorage.getItem('business_name');
    setBusinessName(businessName);
  }, []);

  const handleLinkClick = () => {
    setLoader(true);
    GetPosFun('/request-session').then((result) => {
      if (result.success) {
        window.open(
          pos_url + '/login-with-console?id=' + result?.data?.business_id,
          '_blank'
        );
        setLoader(false);
      } else {
        toast.error('There is some problem');
      }
    });
    // fetch(POS_URL, {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // })
    //   .then((response) => {
    //     // Handle the response as needed
    //   })
    //   .catch((error) => {
    //     // Handle errors
    //   });
  };

  return (
    <header className="fixed z-40 w-full bg-white shadow top-0">
      <nav className="flex items-center justify-between px-5 py-4 md:px-8">
        {/* <!-- Mobile menu button --> */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleSidebar}
          className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-none lg:hidden"
        >
          <NavbarIcon />
        </motion.button>

        <div className="hidden ms-5 me-auto md:flex">
          <span className="bold"> {businessName}</span>
        </div>

        <div className="flex items-center space-s-8">
          {/* <a
            rel="noreferrer"
            href={POS_URL}
            target="_blank"
            className="cursor-pointer rounded bg-accent p-2 text-light"
          >
            {t('POS')}
          </a> */}
          {/* <Button
            loading={loader}
            onClick={handleLinkClick}
            className="cursor-pointer rounded bg-accent p-2 text-light"
          >
            POS
          </Button> */}
          <LanguageSwitcher />
          <AuthorizedMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
