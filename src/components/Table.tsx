import React from 'react';

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  className?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowActions?: (row: T) => React.ReactNode;
  gridClassName?: string;
  noDataText?: string;
}

export default function Table<T>({ columns, data, rowActions, gridClassName = 'grid grid-cols-12 gap-4', noDataText = 'Không có dữ liệu' }: TableProps<T>) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className={`${gridClassName} px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700`}>
        {columns.map(col => (
          <div className={col.className || ''} key={`head-${String(col.key)}`}>{col.label}</div>
        ))}
        {rowActions && <div className="text-right">HÀNH ĐỘNG</div>}
      </div>
      {/* Body */}
      <div className="divide-y divide-gray-200">
        {data.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">{noDataText}</div>
        ) : (
          data.map((row, i) => (
            <div className={`${gridClassName} px-6 py-4 hover:bg-gray-50 transition-colors`} key={`row-${i}`}>
              {columns.map(col => (
                <div className={col.className || ''} key={`${i}-${String(col.key)}`}>
                  {col.render ? col.render((row as any)[col.key], row) : (row as any)[col.key]}
                </div>
              ))}
              {rowActions && <div className="flex items-center justify-end gap-2">{rowActions(row)}</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
