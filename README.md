# Sunny Day Orebić — premium static website

Deployment: upload this folder to GitHub and deploy with Cloudflare Pages as a static site (no build command required).

## Before production
1. `assets/js/config.js`: replace phone, WhatsApp and e-mail with the owner's confirmed direct contact details if different. Current contact values are the publicly listed property-manager contact used as a temporary production-safe fallback.
2. Add your Web3Forms access key to `web3formsKey` in `assets/js/config.js`. Until then, forms deliberately do not transmit data and show a status message.
3. Prices shown are indicative public 2026 rates and can be edited in the generated HTML if the owner wants direct-booking prices or no price display.

## Structure
- HR + EN
- Home, Apartments, 8 apartment detail pages, Amenities, Gallery, About, Location, Contact
- Orebić & Pelješac
- Experiences + SEO pages for Korčula, Mljet, Ston, Viganj, Baćina Lakes and Kravica
- OpenStreetMap embed requires no API key
- All property imagery comes from the supplied AVIF archive.


## Privacy / GDPR
- Added HR/EN Privacy Policy and GDPR rights pages.
- Added required privacy consent checkbox to inquiry forms.
- Added a privacy consent banner. No analytics/marketing scripts are loaded by default.
- Before final production launch, replace controller/contact details with the exact legal owner details if needed.
