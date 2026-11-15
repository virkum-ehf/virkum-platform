import Script from "next/script";

/**
 * Meta Pixel. Rendered by ConsentProvider only after the visitor accepts cookies, and only when
 * NEXT_PUBLIC_META_PIXEL_ID is set (validated as numeric in config/env.ts, so it is safe to inline).
 */
export function MetaPixel({ pixelId }: { pixelId: string }) {
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/is_IS/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
    </Script>
  );
}
