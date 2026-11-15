# Going live

The steps to make this repository the source of virkum.is. Nothing here has been done yet: the
repository exists only locally, and production is still deployed from the old `virkum-web`
repository.

The new site keeps every public URL of the redesign (`/is/…`, `/en/…`, `/sitemap.xml`,
`/robots.txt`, the RSS feeds), so no redirects are needed for pages.

## 1. Create the GitHub repository

Create an empty private repository (for example `virkum-ehf/virkum-platform`), then:

```bash
git remote add origin git@github.com:virkum-ehf/virkum-platform.git
```

```bash
git push -u origin main
```

CI (`.github/workflows/ci.yml`) runs on the first push. It only checks; it never deploys. Turn on
branch protection for `main` and require the CI checks.

## 2. Stop the old repository from deploying

The old repository's `.github/workflows/deploy.yml` runs a full `firebase deploy` on every push
**and every pull request** to `main`. Once this repository serves production, any activity there
would overwrite the new site. Disable that workflow (or delete it) in `virkum-web` before the
cut-over.

## 3. Let GitHub Actions deploy from this repository

Deploys use Workload Identity Federation, as today: pool `github-actions-pool`, provider
`github-actions-provider`, service account
`github-actions@virkum-landingpage.iam.gserviceaccount.com`. The provider's attribute condition is
limited to the old repository, so:

1. Change the condition to allow the new repository, for example
   `assertion.repository == 'virkum-ehf/virkum-platform'`.
2. Grant the service account to the new repository:

```bash
gcloud iam service-accounts add-iam-policy-binding github-actions@virkum-landingpage.iam.gserviceaccount.com --role=roles/iam.workloadIdentityUser --member="principalSet://iam.googleapis.com/projects/808959989347/locations/global/workloadIdentityPools/github-actions-pool/attribute.repository/virkum-ehf/virkum-platform"
```

3. Add a deploy workflow. A starting point, which deploys hosting only and gives every pull request
   its own preview URL:

```yaml
name: Deploy
on:
  push:
    branches: [main]
  pull_request:
permissions:
  contents: read
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v5
        with: { node-version-file: .nvmrc, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: projects/808959989347/locations/global/workloadIdentityPools/github-actions-pool/providers/github-actions-provider
          service_account: github-actions@virkum-landingpage.iam.gserviceaccount.com
      - if: github.event_name == 'pull_request'
        run: pnpm dlx firebase-tools hosting:channel:deploy pr-${{ github.event.number }} --expires 7d --project virkum-landingpage
      - if: github.ref == 'refs/heads/main'
        run: pnpm dlx firebase-tools deploy --only hosting --project virkum-landingpage
```

Pin `firebase-tools` to an exact version when you add it.

## 4. Verify a preview, then release

1. Open a pull request and wait for its preview URL.
2. Run the end-to-end suite against it:

```bash
E2E_BASE_URL=https://<preview-url> pnpm --filter @virkum/web e2e
```

3. Check by hand: the `/` redirect keeps campaign parameters (`/?utm_source=test`), and an unknown
   URL shows the branded 404.
4. Merge to `main`. The deploy replaces the live site.
5. If anything is wrong, roll back from **Firebase console → Hosting → Release history**.

## 5. Things the old site served that this one does not

- The Firebase Function `submitContactForm` lives in the old repository. Deploying with
  `--only hosting` leaves it untouched. Retire it when nothing uses it.
- These old public files were not used by the redesign and were not copied. If anything outside the
  site links to them (e-mail signatures, directories, partner sites), copy them into
  `apps/web/public/` before the cut-over: `logo.png`, `logo.svg`, `new-logo.svg`, `og-image.jpg`,
  `VirkumLogoBackground.png`, `VirkumLogoNoBackground.png`, `GearLogoWithTextGreen.png`,
  `GearLogoWithTextGreen.svg`, `team/*`, `our_work/*`, the Vegvísa logos and a few icons.
- If you turn on the Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`), update the cookie banner and privacy
  policy copy to mention it; today they describe Google Analytics only.

## 6. After the release

- Submit `https://virkum.is/sitemap.xml` in Google Search Console.
- Watch Search Console coverage and Google Analytics for a week.
- Consider adding a Content-Security-Policy header in `firebase.json` once the list of third
  parties (Google Analytics, Calendly links, Meta) is final.
