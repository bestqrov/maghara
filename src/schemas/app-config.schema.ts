import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class AppConfigGeneral {
  @Prop() email?: string;
  @Prop() author?: string;
  @Prop() contact?: string;
  @Prop() website?: string;
  @Prop() developedBy?: string;
  @Prop() description?: string;
}
export const AppConfigGeneralSchema = SchemaFactory.createForClass(AppConfigGeneral);

@Schema({ _id: false })
export class AppConfigSettings {
  @Prop({ default: false }) maintenanceMode: boolean;
  @Prop() maintenanceMessage?: string;
  @Prop({ default: false }) screenshotBlock: boolean;
}
export const AppConfigSettingsSchema = SchemaFactory.createForClass(AppConfigSettings);

@Schema({ _id: false })
export class LegalDoc {
  @Prop() url?: string;
  @Prop() content?: string;
}
export const LegalDocSchema = SchemaFactory.createForClass(LegalDoc);

@Schema({ _id: false })
export class AppUpdateConfig {
  @Prop({ default: false }) enabled: boolean;
  @Prop({ default: 1, min: 1 }) requiredVersionCode: number;
  @Prop() description?: string;
  @Prop() appLink?: string;
}
export const AppUpdateConfigSchema = SchemaFactory.createForClass(AppUpdateConfig);

/** Singleton document: general app metadata, mobile-app behavior toggles, legal docs, and forced-update config. */
@Schema({ timestamps: true })
export class AppConfig extends Document {
  @Prop({ type: AppConfigGeneralSchema, default: {} }) general: AppConfigGeneral;
  @Prop({ type: AppConfigSettingsSchema, default: {} }) appSettings: AppConfigSettings;
  @Prop({ type: LegalDocSchema, default: {} }) privacyPolicy: LegalDoc;
  @Prop({ type: LegalDocSchema, default: {} }) termsConditions: LegalDoc;
  @Prop({ type: AppUpdateConfigSchema, default: {} }) appUpdate: AppUpdateConfig;
  @Prop() moreAppsLink?: string;
}

export const AppConfigSchema = SchemaFactory.createForClass(AppConfig);
