import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SellOrNotSell",
  description: "Terms and conditions for using the SellOrNotSell property assessment service.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7" aria-hidden="true">
              <rect width="32" height="32" rx="7" fill="#0f766e"/>
              <path d="M5 16L16 7l11 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M13 20.5a3 3 0 1 1 4.5 2.6c-.6.35-1.5.9-1.5 1.9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <circle cx="16" cy="27.5" r="1.2" fill="white"/>
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
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted">Last updated: April 9, 2026</p>

        <div className="mt-6 text-sm leading-relaxed text-muted">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of SellOrNotSell.com
            (&ldquo;the Service&rdquo;), operated by SellOrNotSell (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
            &ldquo;our&rdquo;). By using the Service, you agree to these Terms.
          </p>
        </div>

        <Section title="1. Service Description">
          <p>
            SellOrNotSell provides a free, AI-powered property assessment tool for Canadian homeowners.
            The Service analyzes property details, financial information, and market data to generate a
            sell-or-hold recommendation with a financial breakdown.
          </p>
        </Section>

        <Section title="2. Not Financial or Legal Advice">
          <p>
            <strong>The Service is for informational and educational purposes only.</strong> The
            assessments, recommendations, financial breakdowns, and any other output provided by the
            Service do not constitute financial, legal, real estate, tax, or investment advice.
          </p>
          <p>
            You should consult with qualified professionals — including licensed real estate agents,
            mortgage brokers, financial advisors, tax accountants, and lawyers — before making any
            decisions about your property.
          </p>
          <p>
            AI-generated recommendations may contain errors, may not account for all relevant factors,
            and should not be relied upon as the sole basis for any property decision.
          </p>
        </Section>

        <Section title="3. Accuracy of Information">
          <p>
            The accuracy of our assessment depends on the information you provide. You agree to provide
            truthful and accurate information. We are not responsible for inaccurate results caused by
            incorrect input data.
          </p>
          <p>
            Market data, interest rates, tax rates, and other reference data used in our calculations are
            estimates and may not reflect real-time market conditions. Property valuations are based on
            user-provided estimates, not professional appraisals.
          </p>
        </Section>

        <Section title="4. Eligibility">
          <p>
            The Service is available to individuals who are at least 18 years of age and are Canadian
            residents or property owners in Canada. By using the Service, you represent that you meet
            these requirements.
          </p>
        </Section>

        <Section title="5. Acceptable Use">
          <p>You agree not to:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Use the Service for any unlawful purpose</li>
            <li>Submit false or misleading information</li>
            <li>Attempt to access other users&apos; data or assessment results</li>
            <li>Use automated systems to submit bulk assessments</li>
            <li>Reverse-engineer or attempt to extract the underlying AI prompts or algorithms</li>
            <li>Use the Service output to mislead others about property values</li>
          </ul>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            The Service, including its design, code, AI models, financial calculation logic, and content,
            is owned by SellOrNotSell and protected by intellectual property laws. Your assessment
            results are provided for your personal use only and may not be commercially redistributed.
          </p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, SellOrNotSell shall not be liable for any direct,
            indirect, incidental, consequential, or special damages arising from your use of the Service,
            including but not limited to:
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Financial losses resulting from property decisions influenced by our assessments</li>
            <li>Inaccuracies in financial calculations, market data, or AI recommendations</li>
            <li>Service interruptions or data loss</li>
            <li>Unauthorized access to your information due to circumstances beyond our reasonable control</li>
          </ul>
        </Section>

        <Section title="8. Indemnification">
          <p>
            You agree to indemnify and hold SellOrNotSell harmless from any claims, damages, or expenses
            arising from your use of the Service or violation of these Terms.
          </p>
        </Section>

        <Section title="9. Third-Party Services">
          <p>
            The Service uses third-party providers including Anthropic (AI processing) and Supabase (data
            storage). Your use of the Service is also subject to these providers&apos; terms of service.
            We are not responsible for third-party service availability or performance.
          </p>
        </Section>

        <Section title="10. Modifications">
          <p>
            We reserve the right to modify these Terms at any time. Changes will be posted on this page
            with an updated date. Continued use of the Service after changes constitutes acceptance of
            the revised Terms.
          </p>
        </Section>

        <Section title="11. Termination">
          <p>
            We may suspend or terminate access to the Service at any time, for any reason, without prior
            notice. Upon termination, your right to use the Service ceases immediately.
          </p>
        </Section>

        <Section title="12. Governing Law">
          <p>
            These Terms are governed by and construed in accordance with the laws of the Province of
            British Columbia and the federal laws of Canada applicable therein, without regard to conflict
            of law principles.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            For questions about these Terms, please contact us:
          </p>
          <div className="mt-2 rounded-lg border border-border bg-gray-50 p-4">
            <p><strong>SellOrNotSell.com</strong></p>
            <p>Email: legal@sellornotsell.com</p>
          </div>
        </Section>
      </main>

      <footer className="border-t border-border bg-white px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-sm text-muted">
            &copy; {new Date().getFullYear()} SellOrNotSell.com
          </div>
          <nav className="flex gap-6 text-sm text-muted">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/" className="hover:text-foreground">Home</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
