'use client';

import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'json' | 'pdf') => void;
  dataType: string;
}

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  dataType,
}: ExportModalProps) {
  const formats = [
    { id: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma-separated values for Excel' },
    { id: 'json', label: 'JSON', icon: FileText, description: 'JavaScript Object Notation' },
    { id: 'pdf', label: 'PDF', icon: FileText, description: 'Portable Document Format' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Export ${dataType}`}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Choose a format to export your {dataType.toLowerCase()}
        </p>

        <div className="grid grid-cols-1 gap-3">
          {formats.map((format) => {
            const Icon = format.icon;
            return (
              <button
                key={format.id}
                onClick={() => {
                  onExport(format.id as 'csv' | 'json' | 'pdf');
                  onClose();
                }}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <Icon className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{format.label}</div>
                  <div className="text-xs text-gray-500">{format.description}</div>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
