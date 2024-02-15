import { BanUser } from '@/components/icons/ban-user';
import { EditIcon } from '@/components/icons/edit';
import { TrashIcon } from '@/components/icons/trash';
import { Eye } from '@/components/icons/eye-icon';
import { WalletPointsIcon } from '@/components/icons/wallet-point';
import Link from '@/components/ui/link';
import { useTranslation } from 'next-i18next';
import { CheckMarkCircle } from '@/components/icons/checkmark-circle';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { CloseFillIcon } from '@/components/icons/close-fill';
import { AdminIcon } from '@/components/icons/admin-icon';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import cn from 'classnames';
import Card from '@/components/common/card';
import Modal from '@/components/ui/modal/modal';
import { DeleteFunction, DeleteFunctionWithUrl } from '@/services/Service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

type Props = {
  id: any;
  editModalView?: string | any;
  deleteModalView?: string | any;
  editUrl?: string;
  detailsUrl?: string;
  isUserActive?: boolean;
  userStatus?: boolean;
  isShopActive?: boolean;
  approveButton?: boolean;
  showAddWalletPoints?: boolean;
  changeRefundStatus?: boolean;
  showMakeAdminButton?: boolean;
  showReplyQuestion?: boolean;
  customLocale?: string;
  isUpdate?: boolean;
  isView?: boolean;
  isDelete?: boolean;
  editText?: boolean;
  deleteAPIendPoint?: any;
  deleteWithUrl?: boolean;
};

const ActionButtons = ({
  id,
  editModalView,
  deleteModalView,
  editUrl,
  detailsUrl,
  userStatus = false,
  isUserActive = false,
  isShopActive,
  approveButton = false,
  showAddWalletPoints = false,
  changeRefundStatus = false,
  showMakeAdminButton = false,
  showReplyQuestion = false,
  customLocale,
  isUpdate,
  isView,
  isDelete,
  editText = false,
  deleteAPIendPoint,
  deleteWithUrl,
}: Props) => {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const { openModal } = useModalAction();
  const router = useRouter();

  function handleDelete() {
    setOpenDialog(true);
  }

  const onDeletePress = () => {
    setLoading(true);
    let form = {
      coupon_id: id,
    };
    deleteWithUrl
      ? DeleteFunctionWithUrl(deleteAPIendPoint).then((result) => {
          if (result.success) {
            toast.success(t('common:successfully-deleted'));
            setLoading(false);
            setOpenDialog(false);
            router.reload();
          } else {
            toast.error(t(result.msg));
            setLoading(false);
          }
        })
      : DeleteFunction(deleteAPIendPoint, form).then((result) => {
          if (result.success) {
            toast.success(t('common:successfully-deleted'));
            setLoading(false);
            setOpenDialog(false);
            router.reload();
          } else {
            toast.error(t(result.msg));
            setLoading(false);
          }
        });
  };

  function handleEditModal() {
    openModal(editModalView, id);
  }

  function handleUserStatus(type: string) {
    openModal('BAN_CUSTOMER', { id, type });
  }

  function handleAddWalletPoints() {
    openModal('ADD_WALLET_POINTS', id);
  }

  function handleMakeAdmin() {
    openModal('MAKE_ADMIN', id);
  }

  function handleUpdateRefundStatus() {
    openModal('UPDATE_REFUND', id);
  }

  function handleShopStatus(status: boolean) {
    if (status === true) {
      openModal('SHOP_APPROVE_VIEW', id);
    } else {
      openModal('SHOP_DISAPPROVE_VIEW', id);
    }
  }

  function handleReplyQuestion() {
    openModal('REPLY_QUESTION', id);
  }

  return (
    <div className="inline-flex w-auto items-center gap-3">
      {showReplyQuestion && (
        <button
          onClick={handleReplyQuestion}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
        >
          {t('form:button-text-reply')}
        </button>
      )}
      {showMakeAdminButton && (
        <button
          onClick={handleMakeAdmin}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
          title={t('common:text-make-admin')}
        >
          <AdminIcon width={18} />
        </button>
      )}
      {showAddWalletPoints && (
        <button
          onClick={handleAddWalletPoints}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
          title={t('common:text-add-wallet-points')}
        >
          <WalletPointsIcon width={22} />
        </button>
      )}

      {changeRefundStatus && (
        <button
          onClick={handleUpdateRefundStatus}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
          title={t('common:text-change-refund-status')}
        >
          <CheckMarkCircle width={20} />
        </button>
      )}
      {deleteModalView && isDelete && (
        <button
          onClick={handleDelete}
          className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
          title={t('common:text-delete')}
        >
          <TrashIcon width={16} />
        </button>
      )}
      {editModalView && (
        <button
          onClick={handleEditModal}
          className="text-body transition duration-200 hover:text-heading focus:outline-none"
          title={t('common:text-edit')}
        >
          <EditIcon width={16} />
        </button>
      )}
      {approveButton &&
        (!isShopActive ? (
          <button
            onClick={() => handleShopStatus(true)}
            className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
            title={t('common:text-approve-shop')}
          >
            <CheckMarkCircle width={20} />
          </button>
        ) : (
          <button
            onClick={() => handleShopStatus(false)}
            className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
            title={t('common:text-disapprove-shop')}
          >
            <CloseFillIcon width={20} />
          </button>
        ))}
      {userStatus && (
        <>
          {isUserActive ? (
            <button
              onClick={() => handleUserStatus('ban')}
              className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
              title={t('common:text-ban-user')}
            >
              <BanUser width={20} />
            </button>
          ) : (
            <button
              onClick={() => handleUserStatus('active')}
              className="text-accent transition duration-200 hover:text-accent focus:outline-none"
              title={t('common:text-activate-user')}
            >
              <CheckMarkCircle width={20} />
            </button>
          )}
        </>
      )}
      {editUrl && isUpdate && (
        <Link
          href={editUrl}
          className="text-sm transition duration-200 hover:text-white"
          title={t('common:text-edit')}
        >
          {editText == true ? (
            <span className="group flex w-full items-center rounded-md px-2 py-2 text-sm">
           {t('common:text-edit')}
            </span>
          ) : (
            <EditIcon width={16} />
          )}
        </Link>
      )}
      {detailsUrl && isView && (
        <Link
          href={detailsUrl}
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={t('common:text-view')}
          locale={customLocale}
        >
          <Eye width={24} />
        </Link>
      )}
      <Modal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        style={{ width: '45%' }}
      >
        <Card className="mt-4" style={{ width: 400 }}>
          <div className="m-auto w-full">
            <div className="h-full w-full text-center">
              <div className="flex h-full flex-col justify-between">
                <TrashIcon className="m-auto mt-4 h-12 w-12 text-accent" />
                <p className="mt-4 text-xl font-bold text-heading">Delete</p>
                <p className="py-2 px-6 leading-relaxed text-body-dark dark:text-muted">
              {t('common:delete-item-confirm')}
                </p>
                <div className="mt-8 flex w-full items-center justify-between space-s-4">
                  <div className="w-1/2">
                    <Button
                      onClick={() => setOpenDialog(false)}
                      variant="custom"
                      className={cn(
                        'w-full rounded bg-accent py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-accent-hover focus:bg-accent-hover focus:outline-none'
                      )}
                    >
                   {t('common:button-cancel')}
                    </Button>
                  </div>
                  <div className="w-1/2">
                    <Button
                      onClick={onDeletePress}
                      loading={loading}
                      variant="custom"
                      className={cn(
                        'w-full rounded bg-red-600 py-2 px-4 text-center text-base font-semibold text-light shadow-md transition duration-200 ease-in hover:bg-red-700 focus:bg-red-700 focus:outline-none'
                        // deleteBtnClassName
                      )}
                    >
                 {t('common:button-delete')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default ActionButtons;
