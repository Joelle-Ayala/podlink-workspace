import { Hero, Prose, Section } from "@/components";
import { pageMetadata } from "@/lib/seo";

/**
 * Terms of Service v1 (drafted 2026-09-12, pending founder sign-off — same
 * review as the privacy policy, one B1 pass covers both). Written plainly
 * from what the product actually does; a lawyer's once-over is recommended
 * before paid plans activate. Still noindex — legal pages need to resolve,
 * not rank. Required by the ChatGPT apps directory (their checklist needs a
 * terms URL) and generally owed before charging money.
 *
 * ONE OPEN FIELD for Joelle/counsel: governing-law state (marked below).
 */
export const metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms for using Podlink — plainly written, like the rest of the site.",
  path: "/legal/terms",
  noIndex: true,
});

const EFFECTIVE = "September 12, 2026";

export default function TermsPage() {
  return (
    <>
      <Hero title="Terms of Service" tone="light" layout="center" />
      <Section tone="light" containerWidth="narrow">
        <Prose>
          <p>
            <strong>Effective {EFFECTIVE}.</strong> These terms cover
            podlink.ai, podlink.fm, app.podlink.ai, and Podlink&rsquo;s
            connectors for AI assistants. Using Podlink means you agree to
            them. We&rsquo;ve written them to be read.
          </p>

          <h2>The service</h2>
          <p>
            Podlink is podcast software: analytics measured through the open
            OP3 prefix, a public link page at podlink.fm, episode
            transcription, AI content generation, and connectors that let
            your AI assistant read your own show&rsquo;s data. Podlink also
            offers done-for-you services (editing, clips, sponsorship,
            booking, growth); those are governed by their own written
            engagement agreements, not by this page.
          </p>

          <h2>Your account</h2>
          <p>
            Keep your credentials to yourself and tell us if you think your
            account has been compromised. You must be at least 13, and you
            must have the right to connect the podcast feed and accounts you
            connect — connect only shows and channels that are yours to
            connect.
          </p>

          <h2>Your content stays yours</h2>
          <p>
            Your podcast, your feed, your transcripts, and the drafts Podlink
            generates for you are yours. We claim no ownership over any of
            it. You give us only the permission needed to operate the
            product: to fetch and process your feed and connected-account
            data, store your transcripts and drafts, and display what you
            choose to publish (your podlink.fm page, and a Show Report if
            you turn its share link on). Turn a share link off and the URL
            stops working.
          </p>

          <h2>Plans and credits</h2>
          <p>
            Podlink has a free plan. Paid plans, where offered, bill through
            Stripe at the prices shown when you subscribe; you can cancel
            anytime and keep access through the period you paid for.
            AI features (transcription, generation) consume plan credits,
            with the cost shown before you run them — credits are consumed
            only by actions you take, never automatically. We don&rsquo;t
            offer refunds on consumed credits; if something failed and
            charged you anyway, email us and we&rsquo;ll make it right.
          </p>

          <h2>Acceptable use</h2>
          <p>
            Don&rsquo;t use Podlink to break the law, infringe others&rsquo;
            rights, send spam, or probe, overload, or interfere with the
            service. The AI-assistant connector is read-only and
            rate-limited; attempting to access another account&rsquo;s data,
            circumvent rate limits, or automate abusive request volumes will
            get a connection — or an account — shut off. Contact-discovery
            tools surface publicly published information for legitimate
            outreach; using them for spam is a violation of these terms.
          </p>

          <h2>Third parties we depend on</h2>
          <p>
            Parts of Podlink rely on services we don&rsquo;t control: OP3
            for download measurement, platform APIs (YouTube and others) for
            connected-account data, AI model providers for generation, and
            Stripe for payments. If one of them changes or breaks, the
            features built on it may change or break too; we&rsquo;ll be
            honest about it when it happens.
          </p>

          <h2>The honest disclaimer</h2>
          <p>
            Podlink is provided as-is. We work to keep it accurate and
            available, but we don&rsquo;t warrant uninterrupted service,
            and analytics reflect what the measurement sources recorded —
            no counter of internet behavior is perfect, including the
            independent one we chose. To the extent the law allows, our
            total liability for any claim is limited to what you paid us in
            the twelve months before the claim. Nothing here limits
            liability that can&rsquo;t legally be limited.
          </p>

          <h2>Ending things</h2>
          <p>
            You can delete your account anytime (email{" "}
            <a href="mailto:support@podlink.ai">support@podlink.ai</a>). We
            can suspend or terminate accounts that violate these terms,
            with notice where practical. On deletion, we remove your data
            per the <a href="/legal/privacy">privacy policy</a>.
          </p>

          <h2>Changes and the boring parts</h2>
          <p>
            If we materially change these terms we&rsquo;ll date the change
            here and, for significant changes, tell active users. These
            terms are governed by the laws of the United States
            {/* TODO(legal): governing-law state + venue — Joelle/counsel */}
            . If a part of them is found unenforceable, the rest stands.
          </p>

          <h2>Contact</h2>
          <p>
            <a href="mailto:support@podlink.ai">support@podlink.ai</a>
          </p>
        </Prose>
      </Section>
    </>
  );
}
