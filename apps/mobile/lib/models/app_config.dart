/// Mirrors `AppConfig['general']` from the old
/// `apps/mobile/src/services/appConfig.service.ts`.
class AppConfigGeneral {
  const AppConfigGeneral({this.email, this.author, this.contact, this.website, this.developedBy, this.description});

  final String? email;
  final String? author;
  final String? contact;
  final String? website;
  final String? developedBy;
  final String? description;

  factory AppConfigGeneral.fromJson(Map<String, dynamic> json) => AppConfigGeneral(
        email: json['email'] as String?,
        author: json['author'] as String?,
        contact: json['contact'] as String?,
        website: json['website'] as String?,
        developedBy: json['developedBy'] as String?,
        description: json['description'] as String?,
      );

  Map<String, dynamic> toJson() => {
        if (email != null) 'email': email,
        if (author != null) 'author': author,
        if (contact != null) 'contact': contact,
        if (website != null) 'website': website,
        if (developedBy != null) 'developedBy': developedBy,
        if (description != null) 'description': description,
      };
}

/// Mirrors `AppConfig['appSettings']`.
class AppConfigAppSettings {
  const AppConfigAppSettings({required this.maintenanceMode, this.maintenanceMessage, required this.screenshotBlock});

  final bool maintenanceMode;
  final String? maintenanceMessage;
  final bool screenshotBlock;

  factory AppConfigAppSettings.fromJson(Map<String, dynamic> json) => AppConfigAppSettings(
        maintenanceMode: json['maintenanceMode'] as bool? ?? false,
        maintenanceMessage: json['maintenanceMessage'] as String?,
        screenshotBlock: json['screenshotBlock'] as bool? ?? false,
      );

  Map<String, dynamic> toJson() => {
        'maintenanceMode': maintenanceMode,
        if (maintenanceMessage != null) 'maintenanceMessage': maintenanceMessage,
        'screenshotBlock': screenshotBlock,
      };
}

/// Mirrors `AppConfig['privacyPolicy']` / `AppConfig['termsConditions']`
/// (same shape for both).
class AppConfigDocument {
  const AppConfigDocument({this.url, this.content});

  final String? url;
  final String? content;

  factory AppConfigDocument.fromJson(Map<String, dynamic> json) => AppConfigDocument(
        url: json['url'] as String?,
        content: json['content'] as String?,
      );

  Map<String, dynamic> toJson() => {
        if (url != null) 'url': url,
        if (content != null) 'content': content,
      };
}

/// Mirrors `AppConfig['appUpdate']`.
class AppConfigAppUpdate {
  const AppConfigAppUpdate({
    required this.enabled,
    required this.requiredVersionCode,
    this.description,
    this.appLink,
  });

  final bool enabled;
  final int requiredVersionCode;
  final String? description;
  final String? appLink;

  factory AppConfigAppUpdate.fromJson(Map<String, dynamic> json) => AppConfigAppUpdate(
        enabled: json['enabled'] as bool? ?? false,
        requiredVersionCode: (json['requiredVersionCode'] as num?)?.toInt() ?? 0,
        description: json['description'] as String?,
        appLink: json['appLink'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'enabled': enabled,
        'requiredVersionCode': requiredVersionCode,
        if (description != null) 'description': description,
        if (appLink != null) 'appLink': appLink,
      };
}

/// Mirrors `AppConfig` from the old
/// `apps/mobile/src/services/appConfig.service.ts`, returned by the public
/// `GET /app-config` endpoint (no auth required).
class AppConfigData {
  const AppConfigData({
    required this.general,
    required this.appSettings,
    required this.privacyPolicy,
    required this.termsConditions,
    required this.appUpdate,
    this.moreAppsLink,
  });

  final AppConfigGeneral general;
  final AppConfigAppSettings appSettings;
  final AppConfigDocument privacyPolicy;
  final AppConfigDocument termsConditions;
  final AppConfigAppUpdate appUpdate;
  final String? moreAppsLink;

  factory AppConfigData.fromJson(Map<String, dynamic> json) => AppConfigData(
        general: AppConfigGeneral.fromJson(json['general'] as Map<String, dynamic>? ?? const {}),
        appSettings: AppConfigAppSettings.fromJson(json['appSettings'] as Map<String, dynamic>? ?? const {}),
        privacyPolicy: AppConfigDocument.fromJson(json['privacyPolicy'] as Map<String, dynamic>? ?? const {}),
        termsConditions: AppConfigDocument.fromJson(json['termsConditions'] as Map<String, dynamic>? ?? const {}),
        appUpdate: AppConfigAppUpdate.fromJson(json['appUpdate'] as Map<String, dynamic>? ?? const {}),
        moreAppsLink: json['moreAppsLink'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'general': general.toJson(),
        'appSettings': appSettings.toJson(),
        'privacyPolicy': privacyPolicy.toJson(),
        'termsConditions': termsConditions.toJson(),
        'appUpdate': appUpdate.toJson(),
        if (moreAppsLink != null) 'moreAppsLink': moreAppsLink,
      };
}
