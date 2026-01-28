'use client';

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExportAnalyticsProps {
  data: any;
  filename?: string;
}

export default function ExportAnalytics({ 
  data, 
  filename = 'analytics' 
}: ExportAnalyticsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = () => {
    setIsExporting(true);
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const exportToCSV = () => {
    setIsExporting(true);
    
    // Convert data to CSV format
    if (Array.isArray(data)) {
      if (data.length === 0) return;
      
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',')
              ? `"${value}"`
              : value;
          }).join(',')
        )
      ];
      
      const csv = csvRows.join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setIsExporting(false);
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={exportToJSON}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
      >
        <FileText className="h-4 w-4" />
        <span>JSON</span>
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={exportToCSV}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span>CSV</span>
      </motion.button>
    </div>
  );
}
