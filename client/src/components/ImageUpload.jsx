import { useState, useEffect } from 'react';

const ImageUpload = ({ onUpload }) => {

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  const validateFile = (file) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif'
    ];

    const maxSizeInBytes = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return 'Please select an image file (JPEG, PNG, WebP, or GIF)';
    }

    if (file.size > maxSizeInBytes) {
      return `File is too large. Maximum size is 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`;
    }

    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setError('');

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    const formData = new FormData();

    formData.append('image', selectedFile);

    if (onUpload) {
      onUpload(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
      />

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      {previewUrl && (
        <div>
          <p>Preview:</p>

          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={!selectedFile || !!error}
      >
        Upload Image
      </button>

    </form>
  );
};

export default ImageUpload;