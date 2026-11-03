import Script from "next/script";
import { CONSENT_KEY, GTAG, gtagEnabled } from "@/services/analytics";

// โหลด gtag.js ครั้งเดียวสำหรับทั้ง Google Ads และ GA4
// Consent Mode v2: ตั้งค่าเริ่มต้นเป็น denied ก่อนโหลดแท็ก แล้วอ่านค่าที่ผู้ใช้เคยเลือกไว้จาก localStorage
export function GoogleTag() {
  if (!gtagEnabled) return null;
  const ids = [GTAG.adsId, GTAG.ga4Id].filter(Boolean);
  const init = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
  wait_for_update: 500
});
try {
  var c = localStorage.getItem(${JSON.stringify(CONSENT_KEY)});
  if (c === 'granted') gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
} catch (e) {}
gtag('set', 'url_passthrough', true);
gtag('set', 'ads_data_redaction', true);
gtag('js', new Date());
${ids.map((id) => `gtag('config', ${JSON.stringify(id)});`).join("\n")}
`;
  return (
    <>
      <Script id="gtag-init" strategy="afterInteractive">{init}</Script>
      <Script id="gtag-js" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`} />
    </>
  );
}
