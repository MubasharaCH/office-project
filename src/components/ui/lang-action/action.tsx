import ActionButtons from '@/components/common/action-buttons';
import { Config } from '@/config';
import LanguageAction from './language-switcher';
import shop from '@/components/layouts/shop';
import { useRouter } from 'next/router';

export type LanguageSwitcherProps = {
  record: any;
  slug: any;
  deleteModalView?: string | any;
  routes: any;
  className?: string | undefined;
  isProductList?: boolean;
  isUpdate: boolean;
  isView: boolean;
  isDelete?: boolean;
  editText?: boolean;
  deleteAPIendPoint?:any
  deleteWithUrl?:any
};

export default function LanguageSwitcher({
  record,
  slug,
  deleteModalView,
  routes,
  className,
  isProductList,
  isUpdate,
  isView,
  isDelete,
  editText,
  deleteAPIendPoint,
  deleteWithUrl
}: LanguageSwitcherProps) {
  const router = useRouter();
  const { enableMultiLang } = Config;
  const {
    query: { shop },
  } = useRouter();

  // console.log('lkajdlsasdj', shop);
  return (
    <>
      {enableMultiLang ? (
        <LanguageAction
          slug={slug}
          record={record}
          deleteModalView={deleteModalView}
          routes={routes}
          className={className}
        />
      ) : isProductList ? (
        <ActionButtons
          id={slug}
          editUrl={routes.editWithoutLang(slug, shop)}
          deleteModalView={deleteModalView}
          detailsUrl={routes.details(slug)}
          isUpdate={isUpdate}
          editText={editText}
          isView={isView}
          isDelete={isDelete}
          deleteAPIendPoint={deleteAPIendPoint}
          deleteWithUrl={deleteWithUrl}
        />
      ) : (
        <ActionButtons
          id={record?.id}
          editText={editText}
          editUrl={routes.editWithoutLang(slug, shop)}
          deleteModalView={deleteModalView}
          isUpdate={isUpdate}
          isView={isView}
          isDelete={isDelete}
          deleteAPIendPoint={deleteAPIendPoint}
          deleteWithUrl={deleteWithUrl}
        />
      )}
    </>
  );
}
