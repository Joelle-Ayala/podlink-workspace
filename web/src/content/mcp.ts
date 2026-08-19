/**
 * /features/mcp content — the Podlink MCP server.
 *
 * Source of truth: claude/pricing-and-personalization-spec.md §4 (tool surface,
 * tier gates, composability principle, entitlements). Copy claims only what
 * that spec commits to. The server is unreleased — page ships noindex until it
 * launches (see the TODO in the page file).
 */

export const mcpFeature = {
  eyebrow: "Podlink MCP",
  headline: "The first podcast platform your AI assistant already knows.",
  subhead:
    "Connect Claude — or any MCP-enabled assistant — to your Podlink account, and it knows your show: your episodes, your transcripts, your numbers, your voice. Ask for show notes and it quotes what was actually said.",

  heroExchange: [
    { you: true, text: "How did last week's episode do, and draft the newsletter for it?" },
    {
      you: false,
      text: "Episode 41 is at 1,240 downloads — 18% above your 30-day average. Here's a newsletter draft grounded in the transcript, in your show's voice…",
    },
  ],

  problem: {
    title: "Every AI tool starts from zero. Yours shouldn't.",
    body: "Paste a transcript into a chatbot and you get generic output from a model that doesn't know your show, your audience, or what episode 12 already covered. Podlink's MCP server gives your assistant the show's actual context — episodes, transcripts, analytics, brand voice — so the work happens where you already work, grounded in what you actually said. Podcasters are moving their workflows into AI assistants; whoever holds the show's context becomes the default door. Nobody else in podcasting has claimed it.",
  },

  includes: [
    "Show context: your assistant can read show info, brand voice, and your episode list",
    "Analytics on demand: downloads and trends, plus YouTube views once your channel is connected",
    "Full episode transcripts, fetched by asking",
    "Transcript-grounded generation: show notes, newsletter, social posts — quoting the episode, not riffing on the title",
    "Import transcripts from your editing tool — an edited Descript transcript beats an auto one, and it works before the episode is even published",
    "Update your bio link by asking",
    "One credit meter, two doors: generation over MCP draws from the same pool as in-app",
    "Your API key inherits your plan — free users see exactly what Pro would unlock",
  ],

  steps: [
    {
      title: "Connect",
      body: "Add Podlink to Claude with your API key. One-time setup, no code.",
    },
    {
      title: "Ask",
      body: "“How's the show doing?” “Write show notes for the latest episode.” Your assistant pulls the real transcript and real numbers.",
    },
    {
      title: "Chain your tools",
      body: "Your assistant can pass work between your tools — an edited transcript out of Descript goes straight into Podlink's content kit.",
    },
    {
      title: "Ship",
      body: "Kit outputs land with your tracked links, pointed at your bio link, measured in your analytics. The loop stays closed.",
    },
  ],

  composability: {
    headline: "Built to sit in a chain, not a silo.",
    body: "MCP servers don't talk to each other — your assistant orchestrates. Record in Riverside, edit in Descript, then tell Claude: take the edited transcript and build my promo kit in Podlink. Because import happens before publish, you can have the full kit ready the moment the episode drops — something an RSS-watching tool structurally can't do. Every generate tool accepts a raw transcript from anywhere, or an episode straight from your own feed.",
  },

  faqs: [
    {
      q: "What's MCP?",
      a: "Model Context Protocol — the open standard AI assistants use to connect to tools and data. Claude, and a growing list of others, speak it natively. Podlink ships a server for it, which is what makes your assistant show-aware.",
    },
    {
      q: "Which assistants work?",
      a: "Any MCP client. Claude is the one we test against first.",
    },
    {
      q: "Does it cost extra?",
      a: "No. Your API key inherits your plan, and generation over MCP draws from the same credit pool as generation in the app. One meter, two doors.",
    },
    {
      q: "What can a free account do over MCP?",
      a: "Read show info, the episode list, and analytics. Transcripts, generation, and bio-link updates are Pro — and if you ask for one on a free key, you get a clear note about what Pro unlocks rather than a silent failure.",
    },
    {
      q: "Can it change things without asking me?",
      a: "It can only do what its tools allow — reading your show data, generating content, updating your bio link. Billing, account settings, and destructive operations are deliberately not exposed over MCP.",
    },
    {
      q: "Why does the transcript matter so much?",
      a: "Because it's the difference between output that's yours and output that's generic. Grounded in the transcript, show notes quote what was said, the newsletter references the actual argument, and social posts pull real moments — in your show's voice, which Podlink learns from your feed.",
    },
  ],

  closing: {
    headline: "Your show's context, wherever you work.",
    body: "Connect your feed, connect your assistant, and stop re-explaining your podcast to every tool that touches it.",
  },

  metaTitle: "Podlink MCP — Connect Your Podcast to Claude & AI Assistants",
  metaDescription:
    "Podlink's MCP server makes your AI assistant show-aware: episodes, transcripts, analytics and brand voice, with transcript-grounded content generation on your existing plan.",
};
