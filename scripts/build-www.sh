#!/usr/bin/env bash
# Assembles the Capacitor webDir (www/) from the static PWA source.
# iOS-specific packaging only — never mutates the deployed GitHub Pages site.
# The deployed site lives under /unseen-march-pwa/ (Pages subpath); inside the
# Capacitor app bundle content is served from the scheme root, so the absolute
# base is normalized to "/" in the www/ copy.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf www
mkdir -p www

# Web assets that ship inside the app bundle (screenshots/docs/ios excluded).
cp index.html manifest.json sw.js privacy-policy.html www/
cp -R assets icons widgets www/

# Normalize the GitHub Pages subpath to the bundle root in text assets only.
while IFS= read -r -d '' f; do
  LC_ALL=C sed -i '' 's#/unseen-march-pwa/#/#g' "$f"
done < <(find www -type f \( -name '*.html' -o -name '*.json' -o -name '*.js' -o -name '*.css' \) -print0)

echo "www/ assembled ($(find www -type f | wc -l | tr -d ' ') files)"
