/**
 * Feature content for /features and /features/[slug].
 *
 * Ported from the MagicAI-era config/marketing.php and expanded: every feature
 * now carries `sections` and `faq` because each one gets its own page with its
 * own search intent.
 *
 * Rules that hold this file together:
 *   * slugs are stable — they are the URLs, do not rename them casually,
 *   * nothing here claims anything the product does not do,
 *   * no social proof, no counts of customers, no testimonials. The proof is
 *     product fact: analytics come from OP3, an open source we do not control.
 *
 * Note on groups: `publish` is a framing section on the index (connect the feed
 * you already have) and deliberately has no detail page of its own, so
 * getFeaturesByGroup("publish") returns an empty array. Render its intro, not
 * an empty grid.
 */

import type { Feature, FeatureGroup, GroupId } from "./types";

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: "publish",
    title: "Keep publishing where you publish",
    intro:
      "Point Podlink at the feed you already have. Nothing moves, nothing breaks, and every episode from here on is measured, transcribed and ready to be repurposed.",
  },
  {
    id: "understand",
    title: "Know what actually landed",
    intro:
      "Download numbers you can put in front of a sponsor, and a searchable record of every word you said.",
  },
  {
    id: "create",
    title: "Get the writing off your evening",
    intro:
      "The post-production writing that eats your night, done in the time it takes to make coffee — in your format, because you set it once.",
  },
  {
    id: "grow",
    title: "Turn one episode into a week of promotion",
    intro:
      "Every episode is a week of marketing material. Podlink cuts it, writes it, and gives it somewhere to live.",
  },
];

export const FEATURES: Feature[] = [
  /* ------------------------------------------------------------------ */
  /* understand                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "download-analytics",
    name: "Download analytics",
    tagline: "Know which episodes actually got downloaded",
    group: "understand",
    icon: "chart",
    summary:
      "Podlink reads your download data from OP3, the open podcast prefix — not from a counter we run ourselves. You get downloads and unique listeners per episode, a breakdown by listening app and country, and a trend line across the whole show. When a sponsor asks how you measure, you have an answer that stands up.",
    bullets: [
      "Downloads and unique listeners, per episode and across the show",
      "Which apps your audience listens in, and which countries they are in",
      "Episode-over-episode comparison, so topic and title patterns show up",
      "An open measurement source a sponsor could check without you",
    ],
    sections: [
      {
        heading: "Measurement that isn't ours to spin",
        body: "Most podcast tools count your downloads with their own counter and ask you to trust the output. Podlink doesn't. Your numbers come from OP3 — an open source, independently operated analytics prefix that anyone can inspect. We read what OP3 recorded and show it to you. That means we cannot flatter your show, which is the entire point of using it.",
        bullets: [
          "OP3 is open source and independently run, not a Podlink product",
          "The prefix sits in front of your audio file at https://op3.dev/e/",
          "The same source is available to anyone you are asking for money",
        ],
      },
      {
        heading: "Add the prefix once, then forget about it",
        body: "You paste one prefix into your podcast host's settings. From that moment every episode you publish reports its downloads, and Podlink charts them against the episodes either side. There is nothing to install, no script on a website, and no change to how you record or upload.",
        bullets: [
          "One setting in the host you already use — Buzzsprout, Transistor, Libsyn, Captivate, Acast and anything else with a standard RSS feed",
          "Applies to every new episode automatically",
          "Only episodes published behind the prefix are measured, so your numbers start the day you add it",
        ],
      },
      {
        heading: "Numbers you can send to a sponsor",
        body: "A sponsor conversation stalls on one question: how do you know? Downloads per episode, listener countries and the trend over your last ten episodes answer it — and because the measurement is public and independent, you are handing over evidence rather than a screenshot of your own dashboard.",
        bullets: [
          "Per-episode downloads for the window a sponsor cares about",
          "Country and app splits, so a regional advertiser can size the fit",
          "A measurement method you can name in one sentence",
        ],
      },
    ],
    faq: [
      {
        q: "Where do the download numbers come from?",
        a: "From OP3, an open, independently operated podcast analytics prefix. You add the prefix once in your host, OP3 measures the downloads, and Podlink reads them back and charts them. It is not our own counter, which is exactly why it is worth having.",
      },
      {
        q: "Do I have to add the prefix?",
        a: "Only if you want download charts. Everything else in Podlink — transcripts, show notes, clips, the newsletter, your podlink.fm page — works from your RSS feed whether or not you add it.",
      },
      {
        q: "Will these numbers match my host's stats?",
        a: "Close, but not to the exact download. Your host and OP3 both filter bots and duplicate requests, and they do it slightly differently. Two honest counters of the same audience will never agree perfectly; anyone who tells you otherwise is rounding something.",
      },
      {
        q: "What happens to episodes I published before I added the prefix?",
        a: "They stay exactly where they are and keep playing normally. They just aren't measured by OP3, because the prefix wasn't in front of them at the time. Your host's own historical stats are unaffected.",
      },
    ],
  },

  {
    slug: "transcripts",
    name: "Transcripts",
    tagline: "Every word you said, searchable",
    group: "understand",
    icon: "transcript",
    summary:
      "Every episode is transcribed on arrival with speaker labels and timestamps. Search the whole archive to find the moment you half-remember, quote yourself correctly, and give search engines something to actually index. The transcript is also what every other draft in Podlink is written from.",
    bullets: [
      "Speaker labels and timestamps, not a wall of text",
      "Search across every episode you have published, not just the last one",
      "Quote a guest accurately without scrubbing through the audio",
      "The source your show notes, clips and social copy are generated from",
    ],
    sections: [
      {
        heading: "Transcribed on arrival, not on request",
        body: "You don't queue anything. When an episode shows up in your feed, Podlink transcribes it and the text is waiting when you open the episode. Speakers are separated and every line is timestamped, so jumping from a sentence to the moment in the audio is one click rather than a hunt.",
        bullets: [
          "Speaker labels for hosts and guests",
          "Timestamps down to the line",
          "Ready before you have finished writing the episode title",
        ],
      },
      {
        heading: "Your back catalogue becomes searchable",
        body: "Two years of episodes is a research archive you cannot currently read. Search the transcript archive and the answer to \"which episode was that story in?\" takes seconds. It changes what you can do with old work: pull a callback, find the clip you always meant to cut, check whether you have already covered a topic before you book the guest.",
        bullets: [
          "Search names, topics and phrases across the whole show",
          "Land on the exact line, with the timestamp attached",
          "Useful the day you connect your feed, because the back catalogue imports with it",
        ],
      },
      {
        heading: "It is the substrate for everything else",
        body: "Show notes, chapter timestamps, clip suggestions and social copy are all generated from the transcript rather than from a guess about what a podcast episode usually contains. That is why the summary reflects what was actually said, and why a takeaway can be traced back to the line it came from.",
        bullets: [
          "Summaries and takeaways are grounded in the transcript",
          "Clip suggestions come from moments that exist in the audio",
          "Names, companies and links are pulled from what was said, not invented",
        ],
      },
    ],
    faq: [
      {
        q: "How accurate is the transcription?",
        a: "Good enough to publish after a skim, and reliably good on ordinary conversation. Unusual names, product names and heavy crosstalk are where any transcription tool struggles, so those are the lines worth a glance before you post it.",
      },
      {
        q: "Can I fix mistakes?",
        a: "Yes. The transcript is editable text — correct a name once and use the corrected version everywhere you need it.",
      },
      {
        q: "Does it work in languages other than English?",
        a: "Yes, across the major podcasting languages. If your show is bilingual, transcribe it in the language it was recorded in and generate the written output in the language your audience reads.",
      },
      {
        q: "Can I publish the transcript with my episode?",
        a: "That's what most shows do with it. Copy it out and put it on your episode page — a full transcript is one of the few things a podcast can give a search engine to index, and it makes the episode usable for anyone who would rather read.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* create                                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "show-notes",
    name: "AI show notes",
    tagline: "Hit publish with the notes already written",
    group: "create",
    icon: "notes",
    summary:
      "Podlink writes your show notes from the transcript, so the summary reflects what was actually said. You get a structured set of notes with chapter timestamps, takeaways and every link and name that came up — plus title options and a description sized to fit the directories. It arrives in your format, because you set that once.",
    bullets: [
      "Summary, chapter timestamps and key takeaways from the transcript",
      "Names, companies, books and URLs mentioned, pulled out and listed",
      "Title options ranked for clarity over clickbait",
      "A description that fits Apple Podcasts and Spotify without truncating",
      "Guest intros and sponsor reads from the same episode",
    ],
    sections: [
      {
        heading: "Written from the transcript, not guessed at",
        body: "The notes are generated from what the episode actually contains. Chapters mark where the conversation turned, takeaways come from things that were said, and the resource list is built from the names, books, companies and links that came up. You review and publish instead of writing from a blank page at eleven at night.",
        bullets: [
          "Episode summary in the length your show uses",
          "Chapter timestamps that match the audio",
          "Three to five takeaways a listener could act on",
          "Everything mentioned, listed with links where there are links",
        ],
      },
      {
        heading: "Titles and descriptions that fit where they're going",
        body: "A title has to survive a truncated app list, and a description has to survive Apple Podcasts and Spotify handling text differently. Podlink gives you a set of title options ranked for clarity rather than bait, and a description written to sit inside those limits — so nothing gets cut off mid-sentence in the one place a stranger sees your show.",
        bullets: [
          "Several title options per episode, so you are choosing rather than inventing",
          "A short description for directory listings and a longer one for your site",
          "Written to the character limits the directories actually enforce",
        ],
      },
      {
        heading: "Guest intros and sponsor reads, from the same episode",
        body: "The writing around an episode isn't only show notes. Paste a guest's bio and get a warm, factual introduction you can read cold — including a note on how to say their name, which is the thing you always forget to ask. Turn a sponsor brief into a host-read script in your voice, in 15, 30 and 60-second cuts, with the required disclosures kept in.",
        bullets: [
          "Guest intros built from the bio you were sent, with a pronunciation note",
          "Sponsor reads that sound like you rather than like ad copy",
          "Three lengths from one brief, so you can fit whatever slot you sold",
        ],
      },
    ],
    faq: [
      {
        q: "Is the AI going to make things up about my episode?",
        a: "Summaries, takeaways and timestamps are generated from the transcript, so they are anchored in what was said. Nothing publishes on its own either — Podlink drafts, you approve. Give the resource list a glance before you post it, the same way you would check a link you typed yourself.",
      },
      {
        q: "Will it sound like a chatbot wrote it?",
        a: "Only if you skip the setup. Set your structure, your section headings and your tone once in templates and brand voice, and every episode after that comes out in that shape. Most hosts spend one session on this and then stop editing output almost entirely.",
      },
      {
        q: "Can I edit the notes before they go out?",
        a: "Always. Everything Podlink generates is a draft in an editor. You change what you want and copy it into your host, your site, or wherever your notes live.",
      },
      {
        q: "What if my show doesn't use chapters?",
        a: "Turn them off in your template and they stop appearing. The notes are built to your structure, so a show that wants a summary and three bullets gets a summary and three bullets.",
      },
    ],
  },

  {
    slug: "templates",
    name: "Templates and brand voice",
    tagline: "Set your format once, stop rewriting the output",
    group: "create",
    icon: "template",
    summary:
      "Tell Podlink how your show writes — the structure, the section headings, the tone — and every episode after that arrives in that shape. On top of your own format there are over 100 ready-made templates for the writing that isn't an episode: the launch post, the sponsor pitch, the blog version, the ad copy.",
    bullets: [
      "Your structure and section headings applied to every episode",
      "A tone setting, so output reads like your show rather than like a tool",
      "Over 100 templates for posts, pitches, blogs and ad copy",
      "Editing becomes a read-through instead of a rewrite",
    ],
    sections: [
      {
        heading: "Your format, applied every time",
        body: "Most people abandon AI writing tools for the same reason: the output is fine but it is never their format, so every episode turns into a rewrite. Set the structure once — what sections you use, what order they go in, how long the summary runs, whether you use chapters — and the drafts arrive in that shape from then on. No re-prompting, no pasting the same instructions every week.",
        bullets: [
          "Section order and headings you control",
          "Length targets for the summary and the description",
          "Applies to notes, newsletter and social copy, not just one surface",
        ],
      },
      {
        heading: "Brand voice is the difference between good and generic",
        body: "Structure fixes the shape. Voice fixes the sound. Tell Podlink how your show talks — dry or warm, first person or third, whether you swear, whether you use exclamation marks — and the difference in the first draft is obvious. It is the single setting most worth ten minutes of your attention.",
        bullets: [
          "Tone, person and register set at the show level",
          "Consistent across every episode, including ones a producer runs for you",
          "Change it once when the show changes",
        ],
      },
      {
        heading: "Over 100 templates for everything around the show",
        body: "Not everything you write is an episode. There is a template library for the rest of it — the announcement post, the pitch email to a potential guest, the blog version of the episode, the ad copy for a paid test, the copy for your podlink.fm page. Same brand voice, different job.",
        bullets: [
          "Templates for social, email, blog and ad copy",
          "Multilingual output from the same template",
          "Start from a template and adjust, rather than from nothing",
        ],
      },
    ],
    faq: [
      {
        q: "How long does the setup take?",
        a: "One sitting. You are describing how your show already writes, not designing something new — the fastest way through it is to paste in show notes you were happy with and let the format follow from that.",
      },
      {
        q: "Does brand voice apply to clips and the newsletter too?",
        a: "Yes. Voice and structure are set at the show level and every draft Podlink writes for that show inherits them, whether it is show notes, a LinkedIn post or the episode newsletter.",
      },
      {
        q: "Can I have more than one format?",
        a: "Yes — plenty of shows want a different shape for interviews than for solo episodes. Keep both and pick per episode.",
      },
      {
        q: "What if I change my mind later?",
        a: "Edit the template. It applies to what you generate from then on, and nothing you have already published or exported changes underneath you.",
      },
    ],
  },

  {
    slug: "multilingual",
    name: "Multilingual output",
    tagline: "Publish in the languages your audience listens in",
    group: "create",
    icon: "globe",
    summary:
      "Your show can be in English and half your audience still not be. Podlink transcribes across the major podcasting languages and generates a second-language version of an episode's notes, description and social copy in one pass — in the same format and voice as the original.",
    bullets: [
      "Transcription across the major podcasting languages",
      "Notes, descriptions and social copy translated in one pass",
      "Your template and tone carried into the second language",
      "Useful for a show in one language with listeners in several",
    ],
    sections: [
      {
        heading: "One episode, more than one written output",
        body: "Translating an episode's written material by hand means paying a translator for something that has to happen every week, so most shows simply never do it — and then wonder why a big listener market never converts. Generate the whole output set in a second language from the same transcript and the cost of trying is an extra pass.",
        bullets: [
          "Show notes, episode description and social posts in the target language",
          "Generated from the transcript, not from a machine translation of a summary",
          "Run it for one episode to test the market before committing to it",
        ],
      },
      {
        heading: "Recorded in one language, published in another",
        body: "Transcription works in the language the episode was recorded in, so a Spanish-language show gets a Spanish transcript and can publish English notes for a directory listing that reaches further. It works in either direction, and the format you set stays the format you get.",
        bullets: [
          "Transcribe in the recording language",
          "Generate written output in the language you want to publish in",
          "Same structure, same tone settings, different language",
        ],
      },
    ],
    faq: [
      {
        q: "Which languages are supported?",
        a: "Dozens, covering the major podcasting languages. If you are publishing in a language you can name, it is worth running one episode through to see the output quality for yourself rather than taking a list's word for it.",
      },
      {
        q: "Is this good enough to publish without a translator?",
        a: "For show notes, descriptions and social copy, usually yes — and for a market you are testing rather than committing to, it is the difference between publishing something and publishing nothing. If a language becomes a real audience, have a native speaker read it. That is a much smaller job than translating from scratch.",
      },
      {
        q: "Does it translate the audio?",
        a: "No. Podlink writes text, it does not re-record or dub your episode. The audio stays exactly as you published it.",
      },
      {
        q: "Can I publish notes in two languages for the same episode?",
        a: "Yes. Generate each language you need from the same episode and put them wherever they belong — your host, your site or your podlink.fm page.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* grow                                                                */
  /* ------------------------------------------------------------------ */
  {
    slug: "clips-and-social",
    name: "Clips and social posts",
    tagline: "One episode, a week of things to post",
    group: "grow",
    icon: "clip",
    summary:
      "The reason most shows don't grow isn't the audio — it's that nobody had two spare hours to cut clips and write posts. Podlink finds the moments worth clipping, cuts them vertical with captions burned in, and writes the copy that goes around each one, per platform.",
    bullets: [
      "Clip suggestions ranked by how well the moment stands on its own",
      "Vertical cuts with captions, ready for the platforms that want them",
      "Post copy written per platform, because LinkedIn and TikTok don't read alike",
      "Enough material from one episode to cover the week",
    ],
    sections: [
      {
        heading: "Podlink finds the moments, you pick the keepers",
        body: "Finding a clip means listening back to an hour you have already heard. Podlink reads the transcript and surfaces the moments that work out of context — the sharp answer, the story with a beginning and an end, the line a guest will want to share. You listen to a handful of candidates instead of the whole episode.",
        bullets: [
          "Candidates ranked, so the best one is near the top",
          "Cut to start and end on a complete thought",
          "Vertical format with captions burned in",
        ],
      },
      {
        heading: "Copy written for the platform it's going on",
        body: "The same clip needs a different post on every platform, which is why cross-posting reads so badly. Podlink writes the copy per platform — a LinkedIn post that opens with the point, a shorter X version, an Instagram caption, a TikTok hook — from the clip rather than from the episode title.",
        bullets: [
          "LinkedIn, X, Instagram and TikTok versions of the same moment",
          "Written from what happens in the clip",
          "In your brand voice, so it doesn't read like a template",
        ],
      },
      {
        heading: "Publishing stays yours",
        body: "Podlink writes and cuts. You post. That means no connected accounts to re-authorise every few weeks, no scheduler quietly failing at 6am, and no chance of something going out that you hadn't read. Copy, download, publish — from the platform you were going to open anyway.",
        bullets: [
          "Nothing posts without you",
          "Download the clip, copy the caption, publish",
          "No social account connections required to get value out of it",
        ],
      },
    ],
    faq: [
      {
        q: "Does Podlink post to my social accounts for me?",
        a: "No. It writes the posts and cuts the clips; you publish them. Plenty of tools will schedule for you and most podcasters end up turning that off — the failure mode of an automated post is worse than the two minutes it saves.",
      },
      {
        q: "My show is audio only. Can I still get clips?",
        a: "Yes. Clips are cut from the episode with the words on screen, so an audio-only show still has something postable on the platforms that expect video.",
      },
      {
        q: "How many clips come out of one episode?",
        a: "Enough to post through the week from a normal-length episode. How many are worth posting is your call — that's why they come ranked rather than dumped in a folder.",
      },
      {
        q: "Can I change the copy before it goes out?",
        a: "Yes, everything is an editable draft. Set your brand voice first, though — most of the editing people do in week one is voice, and voice is a setting, not a rewrite.",
      },
    ],
  },

  {
    slug: "newsletter",
    name: "Episode newsletter",
    tagline: "The issue that goes with the episode, already drafted",
    group: "grow",
    icon: "mail",
    summary:
      "A ready-to-send issue for every episode: the hook, the three things worth knowing, the links that came up and a listen button. It is written from the transcript in your voice, so sending the newsletter stops being the job you skip when the week gets busy.",
    bullets: [
      "A full draft per episode, not a subject line and a link",
      "The hook, three things worth knowing, the links, a listen button",
      "Written from the transcript, so it says what the episode said",
      "Paste it into whatever you send from",
    ],
    sections: [
      {
        heading: "What's in the draft",
        body: "An episode newsletter that works has a shape: a reason to keep reading, a few things a subscriber gets even if they never press play, the links from the conversation, and an obvious way to listen. Podlink writes that, from the episode, every time — instead of the \"new episode is out\" email that trains people to stop opening.",
        bullets: [
          "An opening hook drawn from the strongest moment in the episode",
          "Three things worth knowing, so the email is useful on its own",
          "Names, books and links mentioned in the conversation",
          "A clear listen link at the end",
        ],
      },
      {
        heading: "Send it from wherever you already send",
        body: "Podlink drafts the issue; it doesn't own your list. Paste it into the tool you already use and send it from there, with your subscribers, your deliverability and your archive staying exactly where they are. Nothing to migrate, nothing to re-import, no second list to keep in sync.",
        bullets: [
          "Works with any email tool that accepts pasted content",
          "Your list stays where it is",
          "Subject line options come with the draft",
        ],
      },
      {
        heading: "In your voice, in your format",
        body: "The newsletter inherits the same brand voice and structure settings as your show notes, so it reads like your show and not like a product update. Change the shape once — shorter intro, five bullets instead of three, no links section — and every issue after that follows.",
        bullets: [
          "Same voice as the rest of your output",
          "Structure you set once at the show level",
          "Editable before you send, like everything else",
        ],
      },
    ],
    faq: [
      {
        q: "Does Podlink send the newsletter for me?",
        a: "No, and that's deliberate. It writes the issue and you send it from the tool that already has your subscribers, your sender reputation and your archive. Moving a list to a podcast tool is a much bigger decision than getting a draft written.",
      },
      {
        q: "Which email tools does it work with?",
        a: "Any of them. The draft is text you paste into your usual editor — there is nothing to connect and nothing to break when your email tool ships a change.",
      },
      {
        q: "Can I write about more than one episode in an issue?",
        a: "The draft is per episode, but it's a starting point, not a wall. If you publish twice a week and send once, generate both and combine them in your editor.",
      },
      {
        q: "Do I get subject lines?",
        a: "Yes, several per issue, so you are choosing between options rather than staring at an empty subject field with a finished email underneath it.",
      },
    ],
  },

  {
    slug: "link-in-bio",
    name: "Your podlink.fm page",
    tagline: "One link that points at every place your show lives",
    group: "grow",
    icon: "link",
    summary:
      "Every podcast needs a link to put in a bio, and \"listen on Apple, Spotify, Pocket Casts, YouTube\" doesn't fit in one. Your podlink.fm/yourshow page holds every listening app, your latest episodes and whatever you are pointing people at this week — and it updates itself from your feed.",
    bullets: [
      "Every listening app behind a single, short link",
      "Latest episodes pulled straight from your RSS feed",
      "Room for whatever matters this week — newsletter, sponsor, merch",
      "Fast, branded and live the day you connect your show",
    ],
    sections: [
      {
        heading: "One link instead of a list of them",
        body: "A guest wants to share the episode. A listener asks where to find you. An Instagram bio has room for one URL. podlink.fm/yourshow is that URL: the person lands on your show, picks the app they already use, and presses play — instead of bouncing off a directory link for a platform they don't have.",
        bullets: [
          "Apple Podcasts, Spotify, YouTube, Pocket Casts, Overcast and the rest, in one place",
          "Short enough to say out loud on the episode",
          "Works as the link in every bio you have",
        ],
      },
      {
        heading: "It keeps itself current",
        body: "The page reads your RSS feed, so your latest episodes are on it without you doing anything. Publish on your host as normal and the page is already right — which matters, because an out-of-date show page is worse than no show page.",
        bullets: [
          "Latest episodes update from the feed",
          "Artwork and show details come across on connect",
          "Nothing to rebuild when you publish",
        ],
      },
      {
        heading: "Point people at what matters this week",
        body: "Some weeks the important link is the newsletter signup. Some weeks it's a live show, a sponsor code, or the guest's book. The page has room for that alongside the listen links, so the one URL you have circulating can do a second job when you need it to.",
        bullets: [
          "Add links for a newsletter, a sponsor, merch or a live date",
          "Reorder as priorities change",
          "No website build, no theme, no plugin to update",
        ],
      },
    ],
    faq: [
      {
        q: "What is podlink.fm?",
        a: "It's the link-in-bio page that comes with Podlink, at podlink.fm/yourshow. Every place your show is available to listen, your latest episodes, and whatever else you are pointing people at.",
      },
      {
        q: "Do I still need a website for my podcast?",
        a: "Plenty of shows run on the page alone. If you already have a site, use the page as the thing you put in bios and comments — it loads fast, it's built for one decision, and it doesn't need maintaining.",
      },
      {
        q: "Does it update when I publish a new episode?",
        a: "Yes. It reads the same RSS feed you already publish to, so the latest episodes appear on their own.",
      },
      {
        q: "Can I change how it looks?",
        a: "Your show's artwork and details carry across when you connect the feed, and you control the links and their order. It is meant to look like your show, not like a Podlink page.",
      },
    ],
  },
];

/** Look up a single feature by its URL slug. */
export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((feature) => feature.slug === slug);
}

/**
 * Features belonging to one group, in FEATURES order.
 * Returns [] for "publish" — see the note at the top of this file.
 */
export function getFeaturesByGroup(id: GroupId): Feature[] {
  return FEATURES.filter((feature) => feature.group === id);
}
