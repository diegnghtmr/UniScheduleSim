import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onUpload: (data: any) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onabort = () => toast.error('File reading was aborted');
    reader.onerror = () => toast.error('File reading has failed');
    reader.onload = () => {
      try {
        const binaryStr = reader.result;
        if (typeof binaryStr === 'string') {
          const data = JSON.parse(binaryStr);
          onUpload(data);
          toast.success('File uploaded successfully!');
        }
      } catch (error) {
        toast.error('Invalid file format. Please upload a valid JSON file.');
      }
    };

    reader.readAsText(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive 
          ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400'
        } dark:bg-gray-800`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {isDragActive
          ? 'Drop the file here...'
          : 'Drag and drop a JSON or CSV file here, or click to select'}
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
        Only JSON and CSV files are supported
      </p>
    </div>
  );
}