import { verifiedResponseAtom } from '@/contexts/checkout';
import { useAtom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import UnverifiedItemList from '../../components/checkout/item/unverified-item-list'
import VerifiedItemList from '../../components/checkout/item/verified-item-list'

// const UnverifiedItemList = dynamic(
//   () => import('@/components/checkout/item/unverified-item-list')
// );
// const VerifiedItemList = dynamic(
//   () => import('@/components/checkout/item/verified-item-list')
// );

export const RightSideView = () => {
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  if (isEmpty(verifiedResponse)) {
    return <UnverifiedItemList />;
  }
  return <VerifiedItemList />;
};

export default RightSideView;
