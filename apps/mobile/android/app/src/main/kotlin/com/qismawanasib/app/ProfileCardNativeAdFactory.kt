package com.qismawanasib.app

import android.content.Context
import android.view.LayoutInflater
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import com.google.android.gms.ads.nativead.MediaView
import com.google.android.gms.ads.nativead.NativeAd
import com.google.android.gms.ads.nativead.NativeAdView
import io.flutter.plugins.googlemobileads.GoogleMobileAdsPlugin

/**
 * Native ad factory for the Dart-side `NativeAdCard` widget
 * (`lib/widgets/ads/native_ad_card.dart`), registered under
 * [FACTORY_ID] (matches `nativeAdFactoryId` in that Dart file).
 *
 * Inflates `res/layout/native_ad_profile_card.xml`, which is styled to sit
 * in the same discover-feed grid slot a `ProfileCard` occupies — a direct
 * port of the previous Expo app's `src/components/ads/NativeAdCard.tsx`.
 */
class ProfileCardNativeAdFactory(private val context: Context) : GoogleMobileAdsPlugin.NativeAdFactory {

    companion object {
        const val FACTORY_ID = "profileCardNativeAd"
    }

    override fun createNativeAd(
        nativeAd: NativeAd,
        customOptions: MutableMap<String, Any>?
    ): NativeAdView {
        val adView = LayoutInflater.from(context)
            .inflate(R.layout.native_ad_profile_card, null) as NativeAdView

        val headlineView = adView.findViewById<TextView>(R.id.ad_headline)
        val mediaView = adView.findViewById<MediaView>(R.id.ad_media)
        val iconView = adView.findViewById<ImageView>(R.id.ad_icon)
        val ctaView = adView.findViewById<Button>(R.id.ad_call_to_action)

        headlineView.text = nativeAd.headline
        adView.headlineView = headlineView

        adView.mediaView = mediaView
        mediaView.setMediaContent(nativeAd.mediaContent)

        val icon = nativeAd.icon
        if (icon != null) {
            iconView.setImageDrawable(icon.drawable)
            iconView.visibility = android.view.View.VISIBLE
        } else {
            iconView.visibility = android.view.View.GONE
        }
        adView.iconView = iconView

        val callToAction = nativeAd.callToAction
        if (callToAction != null) {
            ctaView.text = callToAction
            ctaView.visibility = android.view.View.VISIBLE
        } else {
            ctaView.visibility = android.view.View.GONE
        }
        adView.callToActionView = ctaView

        adView.setNativeAd(nativeAd)
        return adView
    }
}
