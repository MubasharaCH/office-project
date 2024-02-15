import Link from '@/components/ui/link';
import { getIcon } from '@/utils/get-icon';
import * as sidebarIcons from '@/components/icons/sidebar';
import { useUI } from '@/contexts/ui.context';
import NavItemHeaders from './nav-item-header-new';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
const SidebarItem = (props: any) => {
  const { t } = useTranslation('common');
  const { href, label, icon, children } = props.item;
  const { closeSidebar } = useUI();
  const router = useRouter();

  const isActive = useMemo(() => {
    return router?.asPath === href || router?.asPath.includes(`${href}/`);
  }, [router?.asPath, href]);
  
  const [expanded, setExpand] = useState(isActive);
  useEffect(() => {
    setExpand(isActive);
  }, [isActive]);
  const toggleCollapse = useCallback(() => {
    setExpand((prevValue) => !prevValue);
  }, [expanded]);
  const onExpandChange = useCallback(
    (e: any) => {
      e.preventDefault();
      toggleCollapse();
      closeSidebar()
      router.push(href);
    },
    [expanded]
  );


  if (children) {
    return (
      <NavItemHeaders
        child={props.item.children}
        item={props.item}
        expanded={expanded}
        setExpand={setExpand}
      />
    );
  }

  return (
     <>
     
       <span
       onClick={onExpandChange}
       className={`flex cursor-pointer 
        text-sm w-full items-center rounded-md px-3 py-2.5 text-body-dark  hover:bg-gray-100 focus:text-accent  
       ${expanded ? 'bg-gray-100 font-medium' : ''}`}
       >
          {getIcon({
            iconList: sidebarIcons,
            iconName: icon,
            className: 'w-5 h-5 me-3 ',
          })}
          <span >{t(`common:${label}`)}</span>
        </span>
    </>
  );
};

export default SidebarItem;
