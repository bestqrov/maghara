import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadToCloudinary } from '@/services/cloudinary.service';
import { colors } from '@/theme/colors';
import { useAppDict } from '@/hooks/useLocale';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onUploaded: (url: string) => void;
  folder?: string;
}

export function ImageUploader({ label, value, onUploaded, folder }: ImageUploaderProps) {
  const { dict, textAlign, row } = useAppDict();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError(dict.imageUploader.permissionDenied);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;

    const uri = result.assets[0].uri;
    setPreview(uri);
    setError(null);
    setUploading(true);
    try {
      const url = await uploadToCloudinary(uri, folder);
      onUploaded(url);
    } catch (err) {
      setError(`${dict.imageUploader.errorUploadFailed} [${err instanceof Error ? err.message : String(err)}]`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={{ gap: 6 }}>
      <Text style={[styles.label, { textAlign }]}>{label}</Text>
      <Pressable onPress={pickImage} style={[styles.box, { flexDirection: row }]}>
        {preview ? (
          <Image source={{ uri: preview }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ fontSize: 22 }}>📷</Text>
          </View>
        )}
        <Text style={styles.actionText}>
          {uploading ? dict.imageUploader.uploading : preview ? dict.imageUploader.changePhoto : dict.imageUploader.choosePhoto}
        </Text>
        {uploading && <ActivityIndicator color={colors.emerald600} />}
      </Pressable>
      {error && <Text style={[styles.error, { textAlign }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: colors.ink700 },
  box: {
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.emerald300,
    backgroundColor: colors.emerald50,
    borderRadius: 14,
    padding: 12,
  },
  placeholder: { width: 56, height: 56, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  preview: { width: 56, height: 56, borderRadius: 12 },
  actionText: { fontSize: 13, color: colors.emerald700 },
  error: { fontSize: 12, color: colors.red500 },
});
