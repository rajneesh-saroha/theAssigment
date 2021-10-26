import React from "react";

function Table({ tableData }) {
  const createExcelURL = () => {
    let colData = ["uName", "uEmail"];
    let rowsData = tableData;
    let table = `<html xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
      <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
      <xml>
      <x:ExcelWorkbook>
      <x:ExcelWorksheets>
      <x:ExcelWorksheet>
      <x:Name>DataRecords</x:Name>
      <x:WorksheetOptions>
      <x:Panes>
      </x:Panes>
      </x:WorksheetOptions>
      </x:ExcelWorksheet>
      </x:ExcelWorksheets>
      </x:ExcelWorkbook>
</xml>
</head>
<body>
<table>
<tr>`;
    colData.forEach((element) => {
      table = `${table}<th style="text-align:'left';"> ${element} </th>`;
    });
    table = `${table}</tr>`;
    rowsData.forEach((listData) => {
      table = `${table}<tr>`;
      colData.forEach((header) => {
        table = `${table}<td style="text-align:'left';">${
          listData[header] || ""
        }</td>`;
      });
      table = `${table}</tr>`;
    });
    table = `${table}<tr></tr>`;
    table = `${table}</table></body></html>`;
    const myBlob = new Blob([table], {
      type: "application/ms-excel",
    });
    return window.URL.createObjectURL(myBlob);
  };
  return (
    <>
      {tableData?.length > 0 && (
        <>
          <a href={createExcelURL()} download="DataRecords.xls">
            Download Excel file
          </a>
          <table>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Download Image</th>
            </tr>
            {tableData?.map((data) => {
              return (
                <tr>
                  <td>{data.uName}</td>
                  <td>{data.uEmail}</td>
                  <td>
                    {data.providerIdentityImg ? (
                      <a
                        href={data.providerIdentityImg}
                        download={"profilePic.png"}
                      >
                        Download Image
                      </a>
                    ) : (
                      "NA"
                    )}
                  </td>
                </tr>
              );
            })}
          </table>
        </>
      )}
    </>
  );
}

export default Table;
