import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';
import { PushSubscription } from '../../schemas/push-subscription.schema';
import { SubscribePushDto } from './dto/subscribe-push.dto';

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

@Injectable()
export class PushService implements OnModuleInit {
  private readonly logger = new Logger(PushService.name);
  private enabled = false;

  constructor(
    @InjectModel(PushSubscription.name) private readonly subscriptionModel: Model<PushSubscription>,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    const publicKey = this.config.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.config.get<string>('VAPID_PRIVATE_KEY');
    const subject = this.config.get<string>('VAPID_SUBJECT');

    if (!publicKey || !privateKey || !subject) {
      this.logger.warn('VAPID keys are not configured — push notifications are disabled.');
      return;
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);
    this.enabled = true;
  }

  async subscribe(userId: string, dto: SubscribePushDto) {
    await this.subscriptionModel.findOneAndUpdate(
      { endpoint: dto.endpoint },
      { userId, endpoint: dto.endpoint, p256dh: dto.keys.p256dh, auth: dto.keys.auth },
      { upsert: true },
    );
    return { message: 'Subscribed' };
  }

  async unsubscribe(endpoint: string) {
    await this.subscriptionModel.deleteOne({ endpoint });
    return { message: 'Unsubscribed' };
  }

  /** Best-effort: notification delivery failures never bubble up to the caller (an interest/message must still succeed). */
  async sendToUser(userId: string, payload: PushPayload): Promise<void> {
    if (!this.enabled) return;

    const subscriptions = await this.subscriptionModel.find({ userId });
    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            JSON.stringify(payload),
          );
        } catch (err: any) {
          if (err?.statusCode === 404 || err?.statusCode === 410) {
            await this.subscriptionModel.deleteOne({ _id: sub._id });
          } else {
            this.logger.warn(`Push send failed for subscription ${sub._id}: ${err?.message ?? err}`);
          }
        }
      }),
    );
  }
}
