// import { motion } from 'framer-motion';
import { FileSpreadsheet, Upload } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../ui/toast';

// Batch import students/faculty from Excel files.
export function BatchImport() {
  const { show } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);

  // Validates that the file is an Excel spreadsheet.
  const isExcelFile = (candidate) => [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ].includes(candidate?.type);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    // Shows error if file is not Excel format.
    if (!isExcelFile(selectedFile)) {
      show({
        title: 'Invalid File',
        description: 'Please select an Excel file (.xlsx or .xls)',
        type: 'error'
      });
      return;
    }

    setFile(selectedFile);
    show({ title: 'File Selected', description: 'Excel file ready for import' });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    // Processes dropped file through validation.
    handleFileSelect(droppedFile);
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
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:scale-102 transition-transform">
          <Upload className="w-4 h-4 mr-2" />
          Browse Files
          <input
            type="file"
            className="hidden"
            accept=".xlsx,.xls"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        </label>
      </div>

      {file && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium mb-2">Selected File:</h4>
          <p className="text-sm text-gray-600">{file.name}</p>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Process Import</button>
        </div>
      )}
    </div>
  );
}
