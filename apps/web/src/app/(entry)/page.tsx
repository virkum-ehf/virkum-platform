import { LocaleRedirect } from "@/components/navigation/LocaleRedirect";

// Production hosting 301s `/` to `/is/`. This fallback covers local preview:
// Icelandic is the default, and `preferred-locale` overrides when set.
export default function RootPage() {
  return <LocaleRedirect />;
}
