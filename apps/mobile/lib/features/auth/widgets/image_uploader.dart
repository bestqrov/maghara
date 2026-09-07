import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../../core/i18n/locale_provider.dart';
import '../../../core/theme/colors.dart';
import '../../../services/cloudinary_service.dart';

/// Port of the old Expo `src/components/ImageUploader.tsx`.
///
/// Lets the user pick one image from the gallery, previews it immediately,
/// then uploads it to Cloudinary in [folder] and reports the resulting
/// secure URL via [onUploaded]. Used by both the register wizard's photo
/// step and the verification screen's document pickers.
class ImageUploader extends ConsumerStatefulWidget {
  const ImageUploader({super.key, required this.label, required this.onUploaded, this.folder});

  final String label;
  final ValueChanged<String> onUploaded;
  final String? folder;

  @override
  ConsumerState<ImageUploader> createState() => _ImageUploaderState();
}

class _ImageUploaderState extends ConsumerState<ImageUploader> {
  XFile? _picked;
  bool _uploading = false;
  String? _error;

  Future<void> _pickImage() async {
    final dict = ref.read(appDictProvider).imageUploader;
    try {
      final picker = ImagePicker();
      final file = await picker.pickImage(source: ImageSource.gallery, imageQuality: 80);
      if (file == null) return;

      setState(() {
        _picked = file;
        _error = null;
        _uploading = true;
      });

      final url = await ref.read(cloudinaryServiceProvider).uploadImage(file, folder: widget.folder);
      widget.onUploaded(url);
    } catch (_) {
      if (mounted) setState(() => _error = dict.errorUploadFailed);
    } finally {
      if (mounted) setState(() => _uploading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dict = ref.watch(appDictProvider).imageUploader;
    final textAlign = Directionality.of(context) == TextDirection.rtl ? TextAlign.right : TextAlign.left;

    final actionText = _uploading
        ? dict.uploading
        : _picked != null
            ? dict.changePhoto
            : dict.choosePhoto;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          widget.label,
          textAlign: textAlign,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.ink700),
        ),
        const SizedBox(height: 6),
        InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: _uploading ? null : _pickImage,
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.emerald50,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.emerald300),
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: _picked != null
                      ? (kIsWeb
                          ? Image.network(_picked!.path, width: 56, height: 56, fit: BoxFit.cover)
                          : Image.file(File(_picked!.path), width: 56, height: 56, fit: BoxFit.cover))
                      : Container(
                          width: 56,
                          height: 56,
                          color: AppColors.white,
                          alignment: Alignment.center,
                          child: const Text('📷', style: TextStyle(fontSize: 22)),
                        ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(actionText, style: const TextStyle(fontSize: 13, color: AppColors.emerald700)),
                ),
                if (_uploading)
                  const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.emerald600),
                  ),
              ],
            ),
          ),
        ),
        if (_error != null) ...[
          const SizedBox(height: 6),
          Text(_error!, textAlign: textAlign, style: const TextStyle(fontSize: 12, color: AppColors.red500)),
        ],
      ],
    );
  }
}
