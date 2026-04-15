import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SellOrNotSell",
  description:
    "How SellOrNotSell collects, uses, and protects your personal information under PIPEDA and provincial privacy legislation.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#0f766e"/>
              <path d="M6 16L16 7l10 9" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.5 15.5v10h13v-10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.5 19.5c0-1.8 3-1.8 3 0 0 1.1-1.5 1.3-1.5 2.8" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              <circle cx="16" cy="24" r="0.85" fill="white"/>
            </svg>
            <span>
              <span className="text-primary">Sell</span>
              <span className="text-muted">Or</span>
              <span className="text-foreground">NotSell</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated: April 9, 2026</p>

        <div className="mt-6 text-sm leading-relaxed text-muted">
          <p>
            SellOrNotSell.com (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to
            protecting the privacy of individuals who use our property assessment service. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your personal information in
            compliance with the <strong>Personal Information Protection and Electronic Documents Act
            (PIPEDA)</strong>, British Columbia&apos;s <strong>Personal Information Protection Act
            (PIPA)</strong>, Alberta&apos;s <strong>Personal Information Protection Act (PIPA)</strong>,
            and Quebec&apos;s <strong>Act Respecting the Protection of Personal Information in the Private
            Sector (Law 25)</strong>.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p>We collect the following personal information when you use our assessment service:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>Contact Information:</strong> First name, last name, email address, phone number</li>
            <li><strong>Property Address:</strong> Street address, city, province, postal code</li>
            <li><strong>Financial Information:</strong> Purchase price, mortgage details (balance, rate, type, amortization), property tax, condo fees</li>
            <li><strong>Property Details:</strong> Property type, bedrooms, bathrooms, square footage, estimated value, renovations</li>
            <li><strong>Goals & Preferences:</strong> Selling reason, timeline, move destination, additional notes</li>
          </ul>
          <p>
            We also automatically collect technical information such as IP address, browser type, and
            device information when you visit our website.
          </p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use your personal information for the following purposes:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>Assessment Delivery:</strong> To generate your personalized sell-or-hold recommendation and financial breakdown</li>
            <li><strong>AI Processing:</strong> Your property and financial data is sent to our AI provider (Anthropic Claude) to generate the recommendation. Only property details and financial data are sent — not your name, email, or phone number</li>
            <li><strong>Communication:</strong> To deliver your assessment results and, with your consent, send relevant property-related information</li>
            <li><strong>Service Improvement:</strong> To improve our assessment models and user experience (using aggregated, de-identified data)</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </Section>

        <Section title="3. Consent">
          <p>
            We obtain your express consent before collecting your personal information through the consent
            checkbox on our assessment form. You may withdraw your consent at any time by contacting us
            at the address below, subject to legal or contractual restrictions and reasonable notice.
          </p>
          <p>
            <strong>Quebec residents:</strong> In accordance with Law 25, we collect only the personal
            information necessary to provide our assessment service. You have the right to access,
            rectify, and request deletion of your personal information, as well as the right to data
            portability.
          </p>
        </Section>

        <Section title="4. Disclosure & Third Parties">
          <p>We may share your personal information with:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>Anthropic (Claude AI):</strong> Property and financial data only (no contact information) to generate your assessment</li>
            <li><strong>Supabase:</strong> Our database provider, which stores your information with encryption at rest and in transit</li>
            <li><strong>SearchStrata:</strong> If you own a condo and opt in, your contact information may be shared with our affiliated strata document review service</li>
            <li><strong>Legal Requirements:</strong> If required by law, regulation, or court order</li>
          </ul>
          <p>
            We do not sell your personal information to third parties. We do not transfer your personal
            information outside of Canada without your consent, except as required for AI processing
            through Anthropic&apos;s servers.
          </p>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined
            in this policy, or as required by law. Assessment data is retained for up to 24 months after
            your last interaction. You may request deletion at any time.
          </p>
        </Section>

        <Section title="6. Security">
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            information, including:
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Encryption in transit (TLS/HTTPS) and at rest</li>
            <li>Server-side only access to database credentials and API keys</li>
            <li>Row-level security policies on our database</li>
            <li>Regular security reviews of our infrastructure</li>
          </ul>
        </Section>

        <Section title="7. Your Rights">
          <p>Under Canadian privacy law, you have the right to:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Withdrawal of Consent:</strong> Withdraw your consent to the collection, use, or disclosure of your information</li>
            <li><strong>Complaint:</strong> File a complaint with the Office of the Privacy Commissioner of Canada or your provincial privacy commissioner</li>
          </ul>
          <p>
            <strong>Quebec residents</strong> additionally have the right to data portability and the
            right to be informed of automated decision-making. Our AI-generated recommendations are
            provided as informational guidance only and do not constitute binding automated decisions.
          </p>
        </Section>

        <Section title="8. Cookies & Analytics">
          <p>
            Our website may use essential cookies to maintain functionality. We do not currently use
            third-party tracking cookies or advertising pixels. If this changes, we will update this
            policy and obtain your consent where required.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            Our service is not directed to individuals under the age of 18. We do not knowingly collect
            personal information from minors.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes
            by posting the updated policy on our website with a revised &ldquo;Last updated&rdquo; date.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            If you have questions about this Privacy Policy, wish to exercise your rights, or want to
            file a complaint, please contact our Privacy Officer:
          </p>
          <div className="mt-2 rounded-lg border border-border bg-surface p-4">
            <p><strong>SellOrNotSell.com — Privacy Officer</strong></p>
            <p>Email: privacy@sellornotsell.com</p>
          </div>
          <p className="mt-3">
            You may also contact the <strong>Office of the Privacy Commissioner of Canada</strong> at{" "}
            <span className="font-medium">1-800-282-1376</span> or visit{" "}
            <span className="font-medium">priv.gc.ca</span>.
          </p>
        </Section>
      </main>

      <footer className="border-t border-border bg-card px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-xs text-muted">
            &copy; {new Date().getFullYear()} SellOrNotSell.com
          </div>
          <nav className="flex gap-6 text-xs text-muted">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
