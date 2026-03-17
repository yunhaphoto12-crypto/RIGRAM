'use client';

import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface FileInputProps {
  id?: string;
  name?: string;
  accept?: string;
  multiple?: boolean;
  value?: File | string | null;
  onChange?: (files: FileList | File | null) => void;
  className?: string;
  size?: 'sm' | 'lg';
}

export default function FileInput({
  id = 'fileInput',
  name = 'fileInput',
  accept = 'image/*, video/*',
  multiple = false,
  value = null,
  onChange,
  className,
  size = 'sm',
}: FileInputProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ✅ value가 바뀔 때마다 previewUrl 동기화
  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      setFileName(null);
      return;
    }

    if (typeof value === 'string') {
      // URL인 경우 (예: 기존 이미지)
      setPreviewUrl(value);
      setFileName(value.split('/').pop() ?? 'logo.svg');
    } else if (value instanceof File) {
      // File 객체인 경우
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);
      setFileName(value.name);

      return () => URL.revokeObjectURL(objectUrl); // cleanup
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      onChange?.(null);
      return;
    }

    const selected = multiple ? files : files[0];
    onChange?.(selected);
  };

  return (
    <div className={`${className || ''}`}>
      <label
        htmlFor={id}
        className="flex justify-start items-center gap-4 w-full p-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
      >
        <div
          className={`shrink-0 relative flex justify-center items-center bg-primary-100 p-5 rounded-lg ${size === 'sm' ? '' : 'w-34 h-40'}`}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="미리보기"
              fill
              sizes="(max-width: 768px) 10px 10px"
              className="object-cover w-full h-full rounded-lg"
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-gray-500" />
          )}
        </div>
        <div className="overflow-hidden">
          {fileName ? (
            <p className="text-16 text-gray-600 truncate">{fileName}</p>
          ) : (
            <>
              <p className="text-16 text-gray-600">여기를 클릭하거나 이미지를 올려주세요.</p>
              <p className="text-14 text-gray-500">파일명이 영문명으로 된 파일을 업로드해주세요.</p>
            </>
          )}
        </div>
      </label>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
