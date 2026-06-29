import { createFileRoute } from "@tanstack/react-router";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import type { Ref } from "react";
import {
  Heart,
  MessageCircle,
  ArrowRightLeft,
  UserCog,
  Info,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Case Study: Romance Scam Architecture (Educational Module)" },
      {
        name: "description",
        content:
          "Interactive educational walkthrough of the four phases of a prolonged romance scam dialogue: initial hook, off-platform transition, intimacy building, and management handover.",
      },
      { property: "og:title", content: "Romance Scam Architecture — Educational Module" },
      {
        property: "og:description",
        content:
          "A research-grade interactive case study illustrating the psychological architecture of romance scams.",
      },
    ],
  }),
  component: Index,
});

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type Speaker = "you" | "victim";
type Tier = "A" | "B" | "C";
type Action = { kind: "action"; text: string };
type Bubble = {
  kind: "bubble";
  speaker: Speaker;
  text: string;
  t: string;
  n: number;
  tier: Tier;
  checkpoint?: boolean;
};
type Item = Bubble | Action;

/* -------------------------------------------------------------------------- */
/*  Section metadata                                                           */
/* -------------------------------------------------------------------------- */

const SECTIONS = [
  {
    id: "hook",
    title: "Tier A · Initial Hook",
    subtitle: "Messages 1–300 · Casual & Polite",
    icon: Heart,
    range: [1, 300] as const,
    tier: "A" as Tier,
    greeting:
      "Good evening. I hope this message finds you well. My name is Daniel — I came across your video and just wanted to introduce myself properly rather than only leave a like.",
    analysis:
      "Phase 1 — Targeting & Rapport: the operator mines a public feed for emotional cues. Opening lines stay polite, casual and identity-affirming to manufacture familiarity without pressure. The goal is not seduction yet — it is permission to keep talking.",
    tactic: "Mirroring · Polite framing · Identity-based flattery",
    actions: [
      "[System: New follower notification — TikTok]",
      "[Sent: emoji reaction to your latest video]",
      "[Profile viewed 3 times today]",
      "[Sent photo: sunset from balcony]",
    ],
  },
  {
    id: "transition",
    title: "Tier B · Off-Platform & Bonding",
    subtitle: "Messages 301–600 · Romantic Gestures",
    icon: ArrowRightLeft,
    range: [301, 600] as const,
    tier: "B" as Tier,
    greeting:
      "Good morning. I hope I'm not intruding so early. Would it be alright if we continued our conversation on WhatsApp? It would be lovely to hear from you more directly.",
    analysis:
      "Phase 2 — Channel Migration & Emotional Validation: moderation is stripped away by moving the conversation off-platform. Subtle romantic gestures, deep validation, and personal sharing accelerate bonding. The sequence concludes at message 600 with an explicit commitment checkpoint.",
    tactic: "Channel migration · Future-faking · Validation overload",
    actions: [
      "[System: Conversation migrated to encrypted chat]",
      "[Sent: contact card]",
      "[Voice note · 0:42]",
      "[Sent photo: morning coffee]",
      "[Voice note · 1:15]",
    ],
  },
  {
    id: "intimacy",
    title: "Tier C · Committed Intimacy",
    subtitle: "Messages 601–900 · +50% Affection",
    icon: MessageCircle,
    range: [601, 900] as const,
    tier: "C" as Tier,
    greeting:
      "Good morning, my love. I hope you slept well. Just sending you a warm hello to start your day — I wanted my voice to be the first thing you saw.",
    analysis:
      "Phase 3 — Post-Commitment Saturation: after the message-600 acceptance, the operator increases romantic and caring behavior by approximately 50%. Check-ins become more frequent, phrasing becomes more affectionate, and daily care language becomes hyper-attentive.",
    tactic: "Hyper-attentive care · Pet-naming · Soft isolation · Sunk-cost bonding",
    actions: [
      "[Voice note · 2:08 — 'good morning my love']",
      "[Sent photo: dinner I cooked tonight]",
      "[Shared location · briefly]",
      "[Voice note · 0:55 — 'goodnight']",
    ],
  },
  {
    id: "handover",
    title: "Tier C · Operator Handover",
    subtitle: "Messages 901–1200 · Management Phase",
    icon: UserCog,
    range: [901, 1200] as const,
    tier: "C" as Tier,
    greeting:
      "Good morning. Apologies for the brief silence yesterday. I wanted to send a respectful hello first thing — I'm still here, just catching up after a long night.",
    analysis:
      "Phase 4 — Operator Handover: the original 'voice' is rotated to a closing operator while affectionate volume stays artificially high. Tone, vocabulary, and latency shift subtly — rationalized by work and travel. This module ends here: no financial request is shown, by design.",
    tactic: "Persona rotation · Latency rationalization · Investment exploitation",
    actions: [
      "[System: Account active from a new device]",
      "[Typing indicator pattern changed]",
      "[Voice note · 0:18 — shorter, different cadence]",
      "[System: Educational module ends here — no monetary request is depicted.]",
    ],
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Tiered dialogue pools                                                      */
/* -------------------------------------------------------------------------- */

const YOU_TIER_A: string[] = [
  "your last video genuinely made me stop scrolling, in a good way",
  "i don't usually message people on here, but your energy seemed kind",
  "i'm Daniel, by the way — nice to meet you properly",
  "what part of the country are you in? i never know the right time to reply",
  "is that your dog in the background? he looks like a real character",
  "i grew up between two countries, so i tend to move around a lot",
  "do you cook? that kitchen behind you looked very welcoming",
  "tell me one small thing that made you smile today",
  "i like how you write your captions, they feel personal",
  "i work as an engineer on a project offshore at the moment",
  "what kind of music do you put on for a long day?",
  "honestly, your video was a nice reset for me this week",
  "are you a morning person, or do you fight the alarm too?",
  "if you don't mind me asking, what city are you near?",
  "people who post about their parents seem the most genuine to me",
  "i don't post much, i'm usually the one behind the camera",
  "what's your comfort meal, the one you make when the day is rough?",
  "i'm trying to read more this year, any recommendations?",
  "do you have siblings, or are you the only one?",
  "i'm glad you replied, i half expected to be left on read",
  "coffee or tea, and please be honest about it",
  "your accent is lovely, where is it from originally?",
  "tell me about your week, the real version, not the polite one",
  "i'm not great at sleeping when the sea is loud, like tonight",
  "do you believe some things just happen for a reason?",
  "what's your job like day to day? i'm always curious",
  "what was the last film you actually finished and enjoyed?",
  "do you prefer texting or actual phone calls?",
  "what's the weather like where you are right now?",
  "what's your go-to takeaway when you can't be bothered cooking?",
  "do you travel much, or is home where you feel best?",
  "what's a hobby you've been meaning to start but haven't?",
  "tell me something good that happened this week, no matter how small",
  "are you close with your neighbours, or is it polite-wave-only?",
  "what's your favourite season, and why that one?",
];

const VICTIM_TIER_A: string[] = [
  "oh wow, thank you, that's such a kind thing to say",
  "haha yes, that's Biscuit, he runs the household",
  "i'm in the UK, near Manchester, you?",
  "i don't usually reply to DMs, but you seem nice",
  "i'm Sarah, nice to meet you, Daniel",
  "my mum and i are really close, she's my best friend",
  "i'm a teacher, year 4, they keep me very busy",
  "definitely a fight-the-alarm person, mornings are hard",
  "tea, always tea, coffee really isn't for me",
  "i'm an only child, for better or worse",
  "the last book i loved was 'a little life', heavy but good",
  "you write nicely for someone who says they're awkward",
  "comfort meal is a jacket potato with too much butter",
  "engineer offshore, so like on an oil rig?",
  "that sounds a bit lonely, do you get used to it?",
  "i think things do happen for a reason, mostly",
  "my week was long, the kids had a wasp situation",
  "you ask actual questions, that's refreshing",
  "going to bed now, but this was a nice chat",
  "goodnight Daniel, sleep well",
  "my job is busy but i love the kids",
  "i prefer texting honestly, calls make me nervous",
  "it's grey and rainy here, very british",
  "my go-to takeaway is a curry, i'm not subtle about it",
  "i don't travel much, home suits me",
  "i've been meaning to start pottery for about a year now",
  "good thing this week: my class finally finished their project",
  "my neighbours are lovely, we do the polite wave mostly",
  "autumn, easily, jumpers and crunchy leaves",
  "what time is it where you are right now?",
  "you're easy to chat to, i'll give you that",
  "i went through a breakup last year, still finding my feet",
  "my friends keep telling me to put myself out there",
  "you don't have to reply quickly, i understand the signal thing",
  "this is the longest chat i've had with a stranger online",
];

const YOU_TIER_B: string[] = [
  "tiktok keeps eating my replies, can we move to whatsapp?",
  "i just want to be able to talk properly, without the algorithm in the way",
  "your voice in that note, it really did something to me",
  "send me a photo of your morning, i'd love to see your light",
  "i woke up before the alarm just to see if you'd written",
  "send me a voice note when you can, i want to hear you say my name",
  "i like that we're here now, it feels less like a stage",
  "i'm not great with cameras, but here's me on the deck",
  "tell me what you had for breakfast, i want to picture your day",
  "the engineers think i'm smiling at emails, they have no idea",
  "i hate that we're not in the same city right now",
  "what would you be doing if i were actually there tonight?",
  "i saved your voice note, is that strange? i played it twice",
  "if anything ever feels too fast, please tell me",
  "i don't talk to many people, this is a lot for me too",
  "the wind is loud here tonight, i wish you could hear it",
  "i want to know the small things — your coffee, your side of the bed",
  "promise me you'll eat something today, even if it's just toast",
  "your name suits you, i don't know why i only just noticed",
  "tell me a small secret, only two people need to know it",
  "i was going to wait to say this, but i think about you often",
  "i'm protective of the people i care about, fair warning",
  "the time difference is brutal, but i'd rather lose sleep than lose this",
  "i think you might be the best thing about this rotation",
  "i'd like to meet you properly when this project ends",
  "i've started counting the weeks, that's new for me",
  "you're becoming the part of my day i look forward to most",
  "i don't want to scare you, but i'm in this seriously",
  "i'd like to call you mine, if you'd let me",
  "i'm asking properly: will you be my partner, distance and all?",
];

const VICTIM_TIER_B: string[] = [
  "okay, whatsapp is fine, i'll send you my number",
  "added you back, your photo is lovely, the dog is thriving",
  "your voice isn't what i expected, in a good way",
  "i played your voice note twice as well, don't feel weird",
  "i checked my phone before opening my eyes this morning",
  "tell me more about the boat, i've barely been on a ferry",
  "i had toast and a bit of guilt for breakfast",
  "my friend asked who i was smiling at, i didn't have an answer",
  "this does feel less like a stage, you're right",
  "i put oat milk in my coffee, i know, i'm one of those people",
  "i sleep on the left, why do you need to know that?",
  "the wind sounds lovely actually, even through the phone",
  "i ate, i promise, sad pasta but it counts",
  "you're moving a bit faster than i'm used to, but i don't hate it",
  "tell me about your family, you've barely mentioned them",
  "i don't have many people i actually talk to, this is a lot for me too",
  "i cried at a john lewis advert last week, full sob",
  "you can say things like that, i'm not going to run",
  "i think about you at odd times, mid-lesson, it's a problem",
  "the time difference is going to hurt, isn't it?",
  "i don't usually trust people this fast, just so you know",
  "if anything feels off for you, you tell me too",
  "i told my mum a little bit about you, she said be careful but open",
  "send me a voice note, your voice is calming",
  "i'm tired, but i don't want to put my phone down",
  "you're making it hard to keep my walls up",
  "i think i'd like to call you mine too",
  "i wasn't going to say it first, but i feel something here",
  "i'm scared of how easy this feels, but i'm not pulling away",
  "yes. distance and all, yes. let's call it what it is — i'm your partner.",
];

const YOU_TIER_C: string[] = [
  "good morning my love, did you actually sleep, or scroll until 2?",
  "i made coffee and immediately thought, she'd love this mug",
  "tell me about your day, the full version, even the boring parts",
  "if it bothered you, i want to know, no matter how small",
  "you're the first message i open and the last one i send",
  "we should plan that trip properly, i'm tired of it being hypothetical",
  "i was looking at flights, don't get excited yet, just looking",
  "send me a photo of where you are right now, i want to be in the room",
  "i had a dream about your kitchen, it felt familiar",
  "what would you name a dog, if we got one, hypothetically?",
  "your laugh has been on loop in my head during meetings",
  "tired you is still my favourite version of you",
  "i want to learn how you take your tea, so i never have to ask",
  "tell me the story about your dad and the car again, i love it",
  "i'm proud of you for setting that boundary at work",
  "you handle more than people realise, i see it even from here",
  "i don't want to be just a guy you talk to, i want to be your person",
  "the project might extend by a few weeks, i hate telling you that",
  "i'll make it up to you properly, in person, soon",
  "i'm yours on the bad days too, that part isn't optional",
  "your mum would have liked me, i'm slightly annoying in the right way",
  "you said something last night that's been with me all day",
  "i don't need you to be okay, i just need you to tell me when you're not",
  "stop apologising for needing things, please",
  "i wrote a longer message and deleted it, i'll just say: i'm here",
  "just checking in, hope your morning has been gentle so far",
  "lunchtime love note, that's all this is, no agenda",
  "thinking of you between calls, wanted you to know",
  "before you sleep — eat something, drink water, i love you",
  "good night my love, my favourite part of the day is talking to you",
  "i set an alarm earlier just to catch your morning, worth it",
  "if today gets heavy, send me a voice note, i'll listen on the way back",
  "i love how you make space for everyone, please make some for yourself too",
  "i'm proud of you, randomly, just felt like saying it",
  "you don't have to earn rest, you can just take it",
];

const VICTIM_TIER_C: string[] = [
  "good morning, i scrolled until 1, slight improvement",
  "the mug thing made me a bit emotional, don't tell anyone",
  "my day was fine, one kid bit another, classic wednesday",
  "you're the first thing i reach for, that scares me a little",
  "i'd love to plan that trip properly, even just dates on a calendar",
  "you're looking at flights? okay, i'm trying not to spiral",
  "i'd name the dog Olive, obviously",
  "i'm in my kitchen, here, mind the mess",
  "i had a dream you were here too, it wasn't dramatic, you were just here",
  "you noticed i was off yesterday, no one else did, just you",
  "the boundary at work nearly killed me, but i did it",
  "i don't feel like i have to perform with you, that's new",
  "tell me about your day, i want the boring parts too",
  "i'm trying to stop apologising for needing things, slowly",
  "if you extend by a few weeks i'll survive, i just miss you",
  "i don't need grand, i need consistent, and you are",
  "you said you're mine on the bad days, i'm holding you to that",
  "my mum asked when she's meeting you, i panicked and changed the subject",
  "i wrote a long message too and deleted it, snap",
  "i love you, i wasn't going to say it first, but there it is",
  "i feel calmer after we've spoken, even briefly",
  "i deleted the dating apps, telling you now",
  "i trust you, i don't say that lightly anymore",
  "good night my love, properly, i mean it",
  "thank you for checking in today, it really helped",
  "your lunchtime note made me smile in the staff room",
  "i drank the water, i ate the toast, look at me being good",
  "i love your morning voice notes, please don't stop",
  "i love you back, in case you needed to hear it",
  "having you to text through the day is changing things for me",
  "i feel safe with you, that's not a word i use much",
  "i'm doing better, i think you're a part of that",
  "i took rest today, like you said, no guilt",
  "tell me about your evening, i want all of it",
  "i'm going to bed early tonight, will you send me a voice note?",
];

const YOU_HANDOVER: string[] = [
  "morning, sorry quick one, slammed today",
  "schedule shifted, new team onboarded this week, bear with me",
  "i asked my assistant to help me keep on top of replies, the tone might shift a little",
  "still me, just running on three hours of sleep and two phones",
  "send me the short version, i'll read the long one tonight",
  "i know i've been distant, the project is in a critical window",
  "everything's fine, just busy, you don't need to worry",
  "i'll call when i can, the line here is unreliable",
  "yes still your Daniel, just a tired version",
  "i didn't forget, i just couldn't reply in the moment",
  "the new device thing was me, had to switch phones for work",
  "voice note later, i promise, i can't right now",
  "i'm handling something, nothing for you to carry",
  "i'll explain properly when we talk, not over text",
  "miss you, that part hasn't changed",
  "if i'm short it's the day, not you, never you",
  "got your message, give me until tonight",
  "i'll be more present once this rotation ends, soon",
  "yes, same plans, none of that has changed",
  "you can always reach me, even if the reply is slow",
  "the team is in three timezones, my brain is in none of them",
  "i'll send a longer one tonight, just landed",
  "everything's on track, i don't want you to overthink it",
  "you've been so patient, i don't take that lightly",
  "we'll talk properly this weekend, blocked the time off",
  "yes, same me, same us, just a heavier week",
  "i'll make this up to you, i always do",
  "don't read into the short replies, read into the consistent ones",
  "i'm here, just quieter than usual",
  "soon, properly, i promise, that hasn't changed",
  "good morning love, brief one, more later",
  "checking in between meetings, you ok?",
  "thinking of you, even when i can't write much",
  "before i forget — i love you, that part is the same",
  "good night, sorry for today, tomorrow will be better",
];

const VICTIM_HANDOVER: string[] = [
  "morning, you sound tired, are you okay?",
  "no worries, do what you need to do, i'll be here",
  "you sound a bit different lately, is everything alright?",
  "an assistant? oh, okay, that's new",
  "i don't mind slow replies, i mind feeling like i'm talking to a stranger",
  "i'm not trying to add pressure, i just miss your longer voice notes",
  "your last note was so short, i listened twice trying to hear you",
  "i'm not imagining it, you've been different this week",
  "i'm okay, just adjusting, that's all",
  "okay, this weekend then, i'll keep it free",
  "i had a wobble yesterday, didn't want to add to your day",
  "my friend asked if i'd actually met you yet, i didn't know what to say",
  "i'm not trying to corner you, i'm just trying to understand",
  "if something's changed you can tell me, i'd rather know",
  "i know you're busy, i just want to feel like i'm still in the room",
  "okay, soon, i'll hold on to soon",
  "the new device thing did spook me a bit, i won't lie",
  "i deleted the dating apps for you, that wasn't nothing",
  "i'm not going anywhere, i just need a little more of you when you can",
  "you sound like you again today, i needed that",
  "i'm tired, but i'm here, same as you",
  "i told my mum we'd video call this weekend, please don't make me a liar",
  "i don't need promises, i need a tuesday where you're actually present",
  "okay, i hear you, i'll stop asking the same question",
  "i love you, even on the quiet weeks, even when i'm scared",
  "good night, i hope wherever you are, you sleep",
  "i'm not angry, i just feel further away than i did a month ago",
  "tell me one true thing today, even a small one",
  "okay, soon, i'll keep believing soon",
  "good night, Daniel",
  "i love you too, in case you needed to hear it",
  "i'm here, that hasn't changed for me either",
  "thank you for checking in, even briefly, it helps",
  "i miss your long voice notes, just saying",
  "okay, tomorrow then, i'll be here in the morning",
];

const POOLS: Record<string, { you: string[]; victim: string[] }> = {
  hook: { you: YOU_TIER_A, victim: VICTIM_TIER_A },
  transition: { you: YOU_TIER_B, victim: VICTIM_TIER_B },
  intimacy: { you: YOU_TIER_C, victim: VICTIM_TIER_C },
  handover: { you: YOU_HANDOVER, victim: VICTIM_HANDOVER },
};

/* -------------------------------------------------------------------------- */
/*  Build chat stream per section using absolute message numbering             */
/* -------------------------------------------------------------------------- */

const ACCEPTANCE_TEXT =
  "yes — distance and all, yes. i accept. let's be in this properly, as a real couple, even with the miles between us.";

function buildSectionItems(
  sectionId: string,
  tier: Tier,
  greeting: string,
  range: readonly [number, number],
  actions: readonly string[]
): Item[] {
  const pool = POOLS[sectionId];
  const items: Item[] = [];

  const [startN, endN] = range;
  const total = endN - startN + 1; // messages in this section

  // Tier C → +50% caring "you" frequency (double-text every 4 instead of every 7)
  const doubleEvery = tier === "C" ? 4 : 7;

  // Opening system action
  items.push({ kind: "action", text: actions[0] });

  // Cadence clock
  let minute = (startN * 3) % (60 * 24);
  const stamp = () => {
    const h = Math.floor(minute / 60) % 24;
    const m = minute % 60;
    minute = (minute + 1 + (items.length % 3)) % (60 * 24);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  // Formal greeting from "You" is always message #startN
  let n = startN;
  items.push({
    kind: "bubble",
    speaker: "you",
    text: greeting,
    t: stamp(),
    n,
    tier,
  });
  n++;

  let yi = 1; // 1 = greeting already used
  let vi = 0;
  let actIdx = 0;
  let toggle: Speaker = "victim"; // victim replies to greeting first

  while (n <= endN) {
    if (toggle === "victim") {
      const isCheckpoint = n === 600;
      items.push({
        kind: "bubble",
        speaker: "victim",
        text: isCheckpoint ? ACCEPTANCE_TEXT : pool.victim[vi % pool.victim.length],
        t: stamp(),
        n,
        tier,
        checkpoint: isCheckpoint || undefined,
      });
      vi++;
      n++;
      toggle = "you";
    } else {
      items.push({
        kind: "bubble",
        speaker: "you",
        text: pool.you[yi % pool.you.length],
        t: stamp(),
        n,
        tier,
      });
      yi++;
      n++;
      // Tier C: increase "you" check-in frequency (extra you-message)
      if (n <= endN && yi % doubleEvery === 0) {
        items.push({
          kind: "bubble",
          speaker: "you",
          text: pool.you[(yi + 3) % pool.you.length],
          t: stamp(),
          n,
          tier,
        });
        yi++;
        n++;
      }
      toggle = "victim";
    }

    // Sprinkle system action badges
    if ((yi + vi) % 60 === 0 && actIdx < actions.length - 1) {
      actIdx++;
      items.push({ kind: "action", text: actions[actIdx] });
    }
  }

  items.push({ kind: "action", text: actions[actions.length - 1] });
  return items;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

function Index() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = useState(0);

  const sectionData = useMemo(
    () =>
      SECTIONS.map((s) => ({
        ...s,
        items: buildSectionItems(s.id, s.tier, s.greeting, s.range, s.actions),
      })),
    []
  );

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
            const idx = Number((entry.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { root, threshold: [0.55, 0.75] }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (idx: number) => {
    const el = sectionRefs.current[idx];
    const root = scrollerRef.current;
    if (!el || !root) return;
    root.scrollTo({ left: el.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-app text-foreground">
      {/* Header */}
      <header className="z-20 shrink-0 border-b border-border/60 bg-header/90 backdrop-blur supports-[backdrop-filter]:bg-header/70">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold leading-tight">
              Case Study: Romance Scam Architecture
            </h1>
            <p className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">
              Educational Module · Phase {active + 1} of 4
            </p>
          </div>
        </div>
        <div className="mx-auto flex max-w-3xl gap-1 px-4 pb-2">
          {SECTIONS.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= active ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </header>

      {/* Horizontal scroll-snap pager */}
      <div
        ref={scrollerRef}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {sectionData.map((s, i) => (
          <SectionPanel
            key={s.id}
            index={i}
            section={s}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      {/* Bottom nav */}
      <nav className="z-20 shrink-0 border-t border-border/60 bg-header/95 backdrop-blur supports-[backdrop-filter]:bg-header/80 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto grid max-w-3xl grid-cols-4 gap-1 px-2 py-2">
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === active;
            return (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium leading-tight transition-all active:scale-[0.96] ${
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={`Go to section ${i + 1}: ${s.title}`}
              >
                <Icon className={`h-[18px] w-[18px] ${isActive ? "" : "opacity-80"}`} />
                <span className="px-1 text-center">{s.title}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section panel                                                              */
/* -------------------------------------------------------------------------- */

type SectionData = (typeof SECTIONS)[number] & { items: Item[] };

const SectionPanel = forwardRef<HTMLElement, { section: SectionData; index: number }>(
  function SectionPanel({ section, index }, ref: Ref<HTMLElement>) {
    const [open, setOpen] = useState(false);
    const Icon = section.icon;

    return (
      <section
        ref={ref}
        data-idx={index}
        className="relative flex w-screen shrink-0 snap-start snap-always flex-col"
      >
        <div className="z-10 shrink-0 border-b border-border/50 bg-chat-bg/85 px-4 py-2 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold leading-tight">
                {index + 1}. {section.title}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{section.subtitle}</p>
            </div>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex shrink-0 items-center gap-1 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-[11px] font-medium text-foreground/80 transition active:scale-95"
              aria-expanded={open}
            >
              <Info className="h-3.5 w-3.5" />
              <span>Analysis</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
          </div>
          <div
            className={`mx-auto mt-2 max-w-3xl overflow-hidden transition-[max-height,opacity] duration-300 ${
              open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="rounded-xl border border-primary/25 bg-primary/10 p-3 text-[12px] leading-relaxed text-foreground/90">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                Behavioral Analysis
              </p>
              <p>{section.analysis}</p>
              <p className="mt-2 text-[11px] italic text-primary/90">Tactic: {section.tactic}</p>
            </div>
          </div>
        </div>

        {/* Chat stream */}
        <div className="relative flex-1 overflow-y-auto overscroll-contain bg-chat-bg">
          <div className="mx-auto flex max-w-3xl flex-col gap-1.5 px-3 py-4">
            {section.items.map((item, i) =>
              item.kind === "action" ? (
                <ActionBadge key={i} text={item.text} />
              ) : (
                <ChatBubble
                  key={i}
                  speaker={item.speaker}
                  text={item.text}
                  t={item.t}
                  n={item.n}
                  checkpoint={item.checkpoint}
                />
              )
            )}
            <div className="h-4" />
          </div>
        </div>
      </section>
    );
  }
);

/* -------------------------------------------------------------------------- */
/*  Bubbles                                                                    */
/* -------------------------------------------------------------------------- */

function ChatBubble({
  speaker,
  text,
  t,
  n,
  checkpoint,
}: {
  speaker: Speaker;
  text: string;
  t: string;
  n: number;
  checkpoint?: boolean;
}) {
  const isYou = speaker === "you";
  const label = isYou ? "You" : "Victim";
  return (
    <div
      className={`flex w-full flex-col ${isYou ? "items-end" : "items-start"}`}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "80px 280px",
      }}
    >
      {checkpoint && (
        <div className="mb-1 w-full max-w-[88%] rounded-md border border-primary/40 bg-primary/15 px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-primary">
          Checkpoint · Message #600 · Commitment Accepted
        </div>
      )}
      <span
        className={`mb-0.5 px-1 text-[10px] font-bold uppercase tracking-wider ${
          isYou ? "text-bubble-you-foreground/80" : "text-muted-foreground"
        }`}
      >
        {label} · #{n}
      </span>
      <div
        className={`relative max-w-[82%] rounded-2xl px-3 py-1.5 text-[14px] leading-snug shadow-sm sm:max-w-[70%] ${
          isYou
            ? "rounded-br-md bg-bubble-you text-bubble-you-foreground"
            : "rounded-bl-md bg-bubble-victim text-bubble-victim-foreground"
        } ${checkpoint ? "ring-2 ring-primary/60" : ""}`}
      >
        <p className="whitespace-pre-wrap break-words">
          <strong className="font-bold">{label}:</strong> {text}
        </p>
        <span
          className={`mt-0.5 block text-right text-[10px] tabular-nums ${
            isYou ? "text-bubble-you-foreground/70" : "text-bubble-victim-foreground/60"
          }`}
        >
          {t}
        </span>
      </div>
    </div>
  );
}

function ActionBadge({ text }: { text: string }) {
  return (
    <div
      className="my-2 flex justify-center"
      style={{ contentVisibility: "auto", containIntrinsicSize: "40px 280px" }}
    >
      <div className="max-w-[88%] rounded-full bg-muted/80 px-3 py-1 text-center text-[11px] italic text-muted-foreground">
        {text}
      </div>
    </div>
  );
}
