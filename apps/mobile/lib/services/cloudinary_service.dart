import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../core/config.dart';

/// Port of `apps/mobile/src/services/cloudinary.service.ts`.
///
/// Uploads directly to Cloudinary's unsigned upload endpoint using a plain
/// [Dio] instance (deliberately *not* the app's [ApiClient]/[dioProvider] —
/// Cloudinary is a separate third-party host and must never receive the
/// backend's `Authorization` header).
///
/// The old RN code branched on `Platform.OS === 'web'` to build a `Blob`
/// vs. a React Native file-part object. [XFile] (from `image_picker`)
/// abstracts that away uniformly for both mobile and web: reading bytes via
/// `readAsBytes()` works on every platform, so a single code path covers
/// both what the TS source did with `fetch(uri).blob()` and with the RN
/// `{ uri, name, type }` part.
class CloudinaryService {
  CloudinaryService({Dio? dio}) : _dio = dio ?? Dio();

  final Dio _dio;

  static const String _cloudName = AppConfig.cloudinaryCloudName;
  static const String _uploadPreset = AppConfig.cloudinaryUploadPreset;

  /// Uploads [file] to Cloudinary and returns the resulting `secure_url`.
  ///
  /// [folder], if given, is passed through as Cloudinary's `folder` form
  /// field, matching the TS source.
  Future<String> uploadImage(XFile file, {String? folder}) async {
    final bytes = await file.readAsBytes();
    final filename = file.name.isNotEmpty ? file.name : 'photo.jpg';
    final match = RegExp(r'\.(\w+)$').firstMatch(filename);
    final contentType = match != null ? 'image/${match.group(1)}' : 'image/jpeg';

    final formData = FormData.fromMap({
      'file': MultipartFile.fromBytes(bytes, filename: filename, contentType: DioMediaType.parse(contentType)),
      'upload_preset': _uploadPreset,
      if (folder != null) 'folder': folder,
    });

    final res = await _dio.post<Map<String, dynamic>>(
      'https://api.cloudinary.com/v1_1/$_cloudName/image/upload',
      data: formData,
    );

    return res.data!['secure_url'] as String;
  }
}

final cloudinaryServiceProvider = Provider<CloudinaryService>((ref) => CloudinaryService());
