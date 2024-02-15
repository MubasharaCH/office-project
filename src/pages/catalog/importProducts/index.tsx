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
import {
  AddImportProduct,
  GetBusinessDetail,
  GetFunction,
  site_url,
} from '@/services/Service';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import XLSX from 'xlsx';

export default function TypesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setloadingData] = useState(false);
  const [tableLoading, setloadingTableData] = useState(false);
  const [data, setData] = useState<any>();
  const [file, setFile] = useState<any>();
  let form = new FormData();

  const getListFun = () => {
    setloadingTableData(true);
    GetFunction('/import-requests').then((result) => {
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

    AddImportProduct('/import-request', form).then((result) => {
      if (result.success) {
        getListFun();
        setloadingTableData(false);
        toast.success('Product imported Successfully');
        resetFileInput();
      } else {
        toast.error(result.message);
        setloadingTableData(false);
      }
    });
  };
  const onSubmitUpdate = () => {
    setloadingTableData(true);
    form.append('product_group_prices', file);

    AddImportProduct('/import-product-price', form).then((result) => {
      if (result.success) {
        getListFun();
        setloadingTableData(false);
        toast.success(result.message);
        resetFileInput();
      } else {
        toast.error(result.message);
        setloadingTableData(false);
      }
    });
  };

  const handleDownloadClickUpdate = () => {
    GetFunction('/export-product-price').then((result) => {
      // Create a new <a> element
      const link = document.createElement('a');
      link.href = result.url;
      link.target = '_blank'; // Open in a new tab

      // Simulate a click on the link
      link.click();
    });
  };

  const handleDownloadClick = () => {
    const link = document.createElement('a');
    link.href = site_url + 'files/import_products_csv_template.xls';
    link.target = '_blank'; // Open in a new tab

    // Simulate a click on the link
    link.click();
  };

  const resetFileInput = () => {
    const inputElement: any = document.getElementById('file-upload');
    if (inputElement) {
      inputElement.value = ''; // Clear the selected file
    }
  };

  // if (loading) return <Loader text={t('common:text-loading')} />;

  return (
    <>
      <Card className="mb-8 flex-col items-center xl:flex-row">
        <div className="flex justify-between flex-col xl:flex-row">
          <div className="mb-4 md:w-1/4 xl:mb-0">
            <h1 className="text-xl font-semibold text-heading">
              {t('form:label-import-product')}
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
      <Card className="mb-8 flex-col items-center xl:flex-row">
        <div className="flex justify-between flex-col xl:flex-row">
          <div className="mb-4 md:w-1/4 xl:mb-0">
            <h1 className="text-xl font-semibold text-heading">
              {t('Update Product Price')}
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
            <Button className="h-12 w-full md:w-auto" onClick={onSubmitUpdate}>
              {t('form:button-label-submit')}
            </Button>
            <Button
              className="h-12 w-full md:w-auto"
              onClick={handleDownloadClickUpdate}
            >
              {t('Download All Products')}
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <h1 className="text-xl font-semibold text-heading">Instructions:</h1>
          <ul style={{ listStyleType: 'square' }}>
            <li>Explore Product prices by clicking on above button</li>
            <li>Do not change any product name, sku & header</li>
            <li>After making changes import the file</li>
          </ul>
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
