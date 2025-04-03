import { motion } from 'framer-motion';
import { FileSpreadsheet, Upload } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../ui/toast';

export function BatchImport() {
  const { show } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/vnd.ms-excel' || 
        droppedFile?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(droppedFile);
      show({ title: 'File Selected', description: 'Excel file ready for import' });
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300'
        }`}
      >
        <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">Drop Excel File Here</h3>
        <p className="text-sm text-gray-500 mb-4">or</p>
        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-2" />
          Browse Files
          <input type="file" className="hidden" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files[0])} />
        </motion.label>
      </div>

      {file && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium mb-2">Selected File:</h4>
          <p className="text-sm text-gray-600">{file.name}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Process Import
          </motion.button>
        </div>
      )}
    </div>
  );
}
