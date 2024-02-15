import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import ImportProductList from '@/components/importProducts/importProduct-list';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTypesQuery } from '@/data/type';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/router';
import { adminOnly } from '@/utils/auth-utils';
import { Config } from '@/config';
import Button from '@/components/ui/button';
import { AddImportProduct, GetFunction } from '@/services/Service';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

export default function TypesPage() {
  const { t } = useTranslation();
  const [loading, setloadingData] = useState(false);
  const [tableLoading, setloadingTableData] = useState(false);
  const [data, setData] = useState<any>();
  const [file, setFile] = useState<any>();
  let form = new FormData();

  const getListFun = () => {
    setloadingTableData(true);
    GetFunction('/import-requests?type=invoice').then((result) => {
      setData(result.data);
      setloadingTableData(false);
    });
  };

  useEffect(() => {
    getListFun();
  }, []);

  const onChannge = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = () => {
    setloadingTableData(true);
    form.append('import_request', file);

    AddImportProduct('/import-request?type=invoice', form).then((result) => {
      if (result.success) {
        getListFun();
        setloadingTableData(false);
        toast.success('invoice imported Successfully');
      } else {
        toast.error('Something went wrong');
        setloadingTableData(false);
      }
    });
  };
  const handleDownloadClick = () => {
    const header =
      'Invoice No.\tCustomer name\tCustomer Phone number\tCustomer Email\tSale Date\tProduct name\tProduct SKU\tQuantity\tProduct Unit\tUnit Price\tItem Tax\tItem Discount\tTypes of service\tCustom Field 1\tCustom Field 2\tCustom Field 3\tCustom Field 4\tLocation id\tReference No\n'; // Replace with your desired header
    const blob = new Blob([header], { type: 'application/vnd.ms-excel' });
    saveAs(blob, 'import_invoice_csv_template.xls');
  };

  // if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <Card className="mb-8 flex-col items-center xl:flex-row">
        <div className="flex justify-between flex-col xl:flex-row">
          <div className="mb-4 md:w-1/4 xl:mb-0">
            <h1 className="text-xl font-semibold text-heading">
              {t('common:import-invoice')}
            </h1>
          </div>
          <div className="flex w-full flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-4 ">
            <div className="">
              <input
                id="file-upload"
                type="file"
                onChange={onChannge}
                className="block w-full xl:w-5/6 rounded-md border border-gray-400 bg-white py-2 px-3 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Button className="h-12 w-full md:w-auto" onClick={onSubmit}>
              {t('form:button-label-submit')}
            </Button>
            <Button
              className="h-12 w-full md:w-auto"
              onClick={handleDownloadClick}
            >
              {t('form:label-download-file')}
            </Button>
          </div>
        </div>
      </Card>

      <ImportProductList tableLoading={tableLoading} list={data} />
    </>
  );
}

TypesPage.authenticate = {
  permissions: adminOnly,
};

TypesPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
  },
});
