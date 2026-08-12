import { Platform } from 'react-native';

const CLOUD_NAME = 'dysrmslea';
const UPLOAD_PRESET = 'zawajrecepte';

export async function uploadToCloudinary(uri: string, folder?: string): Promise<string> {
  const formData = new FormData();
  const filename = uri.split('/').pop() ?? 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  if (Platform.OS === 'web') {
    const blob = await (await fetch(uri)).blob();
    formData.append('file', blob, filename);
  } else {
    formData.append('file', { uri, name: filename, type } as unknown as Blob);
  }

  formData.append('upload_preset', UPLOAD_PRESET);
  if (folder) formData.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Image upload failed');
  }

  const data = await res.json();
  return data.secure_url as string;
}
