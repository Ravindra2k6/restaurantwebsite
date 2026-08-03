import { useRef } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

/**
 * Manually-managed (non-react-hook-form) file input since RHF doesn't
 * meaningfully control native file inputs. Parent components hold the
 * File[] state and pass it in/out via `files`/`onChange`.
 *
 * `existingImages` renders already-uploaded images (from the backend) with
 * their own remove handler, separate from newly-selected local files —
 * keeps "remove existing" vs "cancel new upload" unambiguous.
 */
const ImageUploader = ({
  label = "Images",
  multiple = true,
  files = [],
  onChange,
  existingImages = [],
  onRemoveExisting,
  hint,
}) => {
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    onChange(multiple ? [...files, ...selected] : selected.slice(0, 1));
    e.target.value = "";
  };

  const removeLocalFile = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="form-label">{label}</label>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-8 text-slate-400 transition-colors hover:border-primary-400 hover:text-primary-500 dark:border-slate-700 dark:bg-slate-900"
      >
        <FiUploadCloud size={28} />
        <span className="text-sm font-medium">Click to upload {multiple ? "images" : "an image"}</span>
        {hint && <span className="text-xs">{hint}</span>}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        multiple={multiple}
        className="hidden"
        onChange={handleFileSelect}
      />

      {(existingImages.length > 0 || files.length > 0) && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {existingImages.map((img) => (
            <div key={img.publicId} className="group relative aspect-square overflow-hidden rounded-lg">
              <img src={img.url} alt={img.alt || ""} className="h-full w-full object-cover" />
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(img.publicId)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          ))}
          {files.map((file, index) => (
            <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
              <img
                src={URL.createObjectURL(file)}
                alt={`New upload ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-1 top-1 rounded bg-primary-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                NEW
              </span>
              <button
                type="button"
                onClick={() => removeLocalFile(index)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove selected image"
              >
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
