import { SUPER_ADMIN } from '@/utils/constants';
import dynamic from 'next/dynamic';
import AdminLayout from '@/components/layouts/admin'

// const AdminLayout = dynamic(() => import('@/components/layouts/admin'));
const OwnerLayout = dynamic(() => import('@/components/layouts/owner'));

export default function AppLayout({
  ...props
}: {
}) {
  return <AdminLayout {...props} />;
  // if (userPermissions?.includes(SUPER_ADMIN)) {
  //   return <AdminLayout {...props} />;
  // }
  // return <OwnerLayout {...props} />;
}
