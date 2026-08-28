import { Hero, Prose, Section } from "@/components";
import { pageMetadata } from "@/lib/seo";

/**
 * Privacy policy v1 (drafted 2026-08-27, pending founder sign-off — see
 * claude/SESSION_LOG.md). Written from what the product actually does today;
 * anything unshipped is stated conditionally. Still noindex: legal pages
 * don't need to rank, they need to resolve. The URL is what the connector
 * directories require.
 */
export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "What Podlink collects, why, and who else touches it. Written to be read.",
  path: "/legal/privacy",
  noIndex: true,
});

const EFFECTIVE = "August 27, 2026";

export default function PrivacyPage() {
  return (
    <>
      <Hero title="Privacy Policy" tone="light" layout="center" />
      <Section tone="light" containerWidth="narrow">
        <Prose>
          <p>
            <strong>Effective {EFFECTIVE}.</strong> This policy covers
            podlink.ai, podlink.fm, app.podlink.ai, and Podlink&rsquo;s
            connectors for AI assistants. It&rsquo;s written to be read, not to
            cover us.
          </p>

          <h2>What we collect</h2>
          <p>
            <strong>Account data.</strong> Name, email address, and a hashed
            password when you create an account.
          </p>
          <p>
            <strong>Your podcast data.</strong> The RSS feed URL you connect,
            the public information in that feed (episodes, titles, artwork),
            and download statistics measured through{" "}
            <a href="https://op3.dev">OP3</a>, the Open Podcast Prefix Project
            — an independent, open-source analytics service. We chose OP3
            precisely because its numbers are independently checkable; the
            same openness means aggregate download stats for prefixed feeds
            are part of OP3&rsquo;s public dataset.
          </p>
          <p>
            <strong>Your Podlink page.</strong> The links, text and images you
            put on your public podlink.fm page, and aggregate click and view
            counts on it.
          </p>
          <p>
            <strong>Usage data.</strong> Standard analytics on our marketing
            site via Google Analytics (page views, referrers, approximate
            location). Session cookies to keep you signed in.
          </p>
          <p>
            <strong>What we don&rsquo;t collect:</strong> we never ask you to
            upload exported audience files or scraped follower lists. Where a
            platform integration exists, data comes only through that
            platform&rsquo;s official API with your explicit OAuth consent,
            and you can revoke it at any time.
          </p>

          <h2>How we use it</h2>
          <p>
            To run the product: show you your own analytics, generate content
            you ask for, serve your public page, and bill you if you&rsquo;re
            on a paid plan. When you use generation features, the content you
            submit (for example an episode topic or transcript excerpt) is
            processed by the AI model providers that power those features.
            We don&rsquo;t sell your data, and we don&rsquo;t use your private
            data to market to anyone else.
          </p>

          <h2>AI assistant connectors (MCP)</h2>
          <p>
            If you connect Podlink to an AI assistant such as Claude, that
            connection is authorized by you through OAuth, is scoped
            read-only, and only ever accesses your own account&rsquo;s data.
            No tool accepts another user&rsquo;s identity as input. Your
            assistant&rsquo;s provider handles what happens to data inside
            your conversation; our side serves only what you could already
            see in your dashboard. You can revoke a connected assistant from
            your dashboard at any time.
          </p>

          <h2>Who else touches your data</h2>
          <p>
            Service providers we run on: Railway and Vercel (hosting),
            Cloudflare (DNS and networking), OP3 (download measurement),
            Google Analytics (site usage), Google Workspace (email), AI model
            providers (content generation you initiate), and Stripe (payment
            processing when you buy a paid plan — card details go to Stripe,
            not to us). Each receives only what its function requires.
          </p>

          <h2>Retention and deletion</h2>
          <p>
            We keep your data while your account exists. Email{" "}
            <a href="mailto:support@podlink.ai">support@podlink.ai</a> to
            delete your account and its data, export what we hold about you,
            or ask anything this page doesn&rsquo;t answer. We reply within 2
            business days. Note that OP3&rsquo;s public aggregate statistics
            are governed by OP3, and anything you published on your public
            page may persist in caches and archives outside our control.
          </p>

          <h2>The boring but true parts</h2>
          <p>
            We use cookies for sign-in sessions and analytics — no
            third-party ad cookies. Podlink isn&rsquo;t directed at children
            under 13. If we materially change this policy we&rsquo;ll date the
            change at the top of this page. This service is operated from the
            United States.
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
