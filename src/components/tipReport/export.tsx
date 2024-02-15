import React from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Button from '../ui/button';
import { DownloadIcon } from '../icons/download-icon';

export const ExportCSV = ({ csvData, fileName }) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button
      className={
        'flex w-full space-x-3 px-5 py-2.5 font-semibold focus:outline-none text-body hovel:text-accent'
      }
      onClick={(e) => exportToCSV(csvData, fileName)}
    >
      {' '}
      <DownloadIcon className="w-5 shrink-0" />{' '}
      <h6 className="ml-2 text-sm">Export to excel</h6>
    </button>
  );
};
