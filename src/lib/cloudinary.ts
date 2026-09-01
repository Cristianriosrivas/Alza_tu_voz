// src/lib/cloudinary.ts

const CLOUD_NAME = 'db546rbgs';
const UPLOAD_PRESET = 'denuncias_preset';

export async function uploadSingleToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Error al subir la imagen a Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}

export async function uploadMultipleToCloudinary(files: File[]): Promise<string[]> {
  if (!files || files.length === 0) return [];
  const uploadPromises = files.map((file) => uploadSingleToCloudinary(file));
  return await Promise.all(uploadPromises);
}