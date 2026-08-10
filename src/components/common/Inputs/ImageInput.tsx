import React, { useEffect, useMemo, useState } from "react";

export interface inputImageProps {
  label: string;
  name: string;
  multiple?: boolean;
  oldImg?: string;
  oldImgs?: string[]; // existing gallery images when editing
}

const ImageInput = ({ label, name, multiple = false, oldImg, oldImgs }: inputImageProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  // FIX: previews are fully derived from `files` — compute them during render
  // instead of pushing them into their own state via an effect.
  const previews = useMemo(() => {
    if (!multiple) return [];
    return files.map((f) => URL.createObjectURL(f));
  }, [files, multiple]);

  // The effect now only does the actual side effect (revoking blob URLs),
  // it never calls setState.
  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (multiple) {
      setFiles(Array.from(e.target.files ?? []));
    } else {
      setFile(e.target.files?.[0] || null);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm text-gray-600 mb-2">{label}</label>
      <label className="flex flex-col items-center justify-center w-full min-h-24 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer text-sm text-gray-500 transition-all duration-300 hover:border-green-500 hover:text-green-600 hover:bg-green-50">
        {multiple ? (
          files.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {previews.map((src, i) => (
                <img key={i} src={src} alt={`preview-${i}`} className="h-16 w-16 object-cover rounded" />
              ))}
              <p className="w-full text-center font-medium text-gray-700 mt-1">{files.length} file(s) selected</p>
            </div>
          ) : oldImgs && oldImgs.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {oldImgs.map((src, i) => (
                <img key={i} src={src} alt={`current-${i}`} className="h-16 w-16 object-cover rounded" />
              ))}
              <p className="w-full text-center font-medium text-gray-700 mt-1">Current images (select to replace)</p>
            </div>
          ) : (
            <span>Upload Images</span>
          )
        ) : file ? (
          <>
            <p className="font-medium text-gray-700">{file.name}</p>
            <img src={URL.createObjectURL(file)} alt="preview" className="mt-2 h-16 object-cover rounded" />
          </>
        ) : oldImg ? (
          <>
            <p className="font-medium text-gray-700">Current image</p>
            <img src={oldImg} alt="current" className="mt-2 h-16 object-cover rounded" />
          </>
        ) : (
          <span>Upload Image</span>
        )}
        <input type="file" accept="image/*" name={name} className="hidden" onChange={handleChange} multiple={multiple} />
      </label>
    </div>
  );
};

export default ImageInput;