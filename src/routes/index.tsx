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
/*  Dialogue corpus                                                            */
/* -------------------------------------------------------------------------- */

type Speaker = "you" | "victim";
type Action = { kind: "action"; text: string };
type Bubble = { kind: "bubble"; speaker: Speaker; text: string; t: string };
type Item = Bubble | Action;

const SECTIONS = [
  {
    id: "hook",
    title: "Initial Hook",
    subtitle: "TikTok Phase",
    icon: Heart,
    analysis:
      "Phase 1 — Targeting & Rapport: the operator mines a public feed for emotional cues (loneliness, recent loss, faith, single-parent status). Opening lines mirror the target's content to manufacture instant familiarity. Compliments are calibrated to identity rather than appearance to bypass skepticism. The goal is not seduction yet — it is permission to keep talking.",
    tactic: "Mirroring · Love-bombing · Identity-based flattery",
    actions: [
      "[System: New follower notification — TikTok]",
      "[Sent: emoji reaction to your latest video]",
      "[Profile viewed 3 times today]",
      "[Sent photo: sunset from balcony]",
    ],
  },
  {
    id: "transition",
    title: "Off-Platform",
    subtitle: "Transition",
    icon: ArrowRightLeft,
    analysis:
      "Phase 2 — Channel Migration: moderation, reporting, and platform safety nets are stripped away by moving the conversation to WhatsApp, Telegram, or Signal. The request is framed as intimacy ('I want you closer to me') rather than evasion. Voice notes are introduced to deepen parasocial bonding and to make the relationship feel embodied.",
    tactic: "Channel migration · Voice intimacy · Reduction of oversight",
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
    title: "Intimacy",
    subtitle: "Routine Building",
    icon: MessageCircle,
    analysis:
      "Phase 3 — Routine & Isolation: the operator installs themselves as the first and last contact of the target's day. Pet names, shared 'inside jokes', and future-planning create a sunk-cost emotional investment. Subtle framings ('your friends don't really get you') begin isolating the target from competing perspectives that might raise alarms.",
    tactic: "Future-faking · Pet-naming · Soft isolation · Sunk-cost bonding",
    actions: [
      "[Voice note · 2:08 — 'good morning my love']",
      "[Sent photo: dinner I cooked tonight]",
      "[Shared location · briefly]",
      "[Voice note · 0:55 — 'goodnight']",
    ],
  },
  {
    id: "handover",
    title: "Handover",
    subtitle: "Management Phase",
    icon: UserCog,
    analysis:
      "Phase 4 — Operator Handover: the original 'voice' is rotated to a closing operator. Tone, vocabulary, and response latency shift subtly — explained away by travel, work, a new project, or an 'assistant helping me reply'. The target's emotional investment is now strong enough to rationalize the inconsistencies. This module ends here: no financial request is shown, by design.",
    tactic: "Persona rotation · Latency rationalization · Investment exploitation",
    actions: [
      "[System: Account active from a new device]",
      "[Typing indicator pattern changed]",
      "[Voice note · 0:18 — shorter, different cadence]",
      "[System: Educational module ends here — no monetary request is depicted.]",
    ],
  },
] as const;

const YOU_LINES: Record<string, string[]> = {
  hook: [
    "hey, your last video genuinely made me stop scrolling",
    "i don't usually message people here but something about your energy felt different",
    "the way you talk about your day, it's like you actually mean it. that's rare",
    "okay i have to ask — is that your dog in the background? he looks like a whole personality",
    "i'm not great at small talk so i'll just say hi properly: i'm Daniel",
    "what timezone are you in? i never know when it's polite to reply",
    "your laugh in that clip, that was real wasn't it? you can't fake that",
    "i grew up between two countries so i move around a lot, what about you?",
    "do you cook? that kitchen behind you looked dangerous in the best way",
    "tell me one thing that made you smile today, doesn't have to be big",
    "i like how you write your captions, they feel like little letters",
    "i'm an engineer on a project offshore right now, signal is weird sometimes",
    "what kind of music gets you through a long day?",
    "honestly i was having a rough week and your video felt like a small reset",
    "are you a morning person or do you fight the alarm like the rest of us",
    "if you don't mind me asking, what city are you near?",
    "i find people who post about their parents the most genuine, you're clearly close",
    "i lost my mom a few years back, your post about yours hit me",
    "you have one of those faces people probably trust too easily, be careful out there",
    "i don't post much, i'm the awkward one behind the camera usually",
    "what's your comfort meal? the one you make when nothing's going right",
    "i'm trying to read more this year, what was the last book that actually stayed with you",
    "do you have siblings? you give middle-child energy in the best way",
    "i love that you replied, i was 80% sure you'd leave me on read",
    "okay weird question — coffee or tea person, and be honest",
    "your accent is lovely by the way, where's it from originally?",
    "i'm not on tiktok much, my niece set it up for me, you're basically the reason i opened the app today",
    "tell me about your week, the real version not the polite one",
    "i'm bad at sleeping when the sea is loud, tonight is one of those nights",
    "do you believe in the kind of stuff that happens for a reason? i'm starting to",
  ],
  transition: [
    "hey, tiktok keeps eating my replies, can we move somewhere easier?",
    "whatsapp or telegram, whichever you're already on",
    "i just want to be able to actually talk to you without the algorithm in the middle",
    "added you, the photo is me and my dog on the boat",
    "your voice in that note, okay that did something to me, in a good way",
    "send me a photo of your morning, i want to see what your light looks like",
    "i'm in a meeting but i'll be thinking about what you said all afternoon",
    "the signal here is terrible, if i go quiet for an hour it's the satellite not me",
    "i woke up before my alarm just to check if you'd written",
    "send me a voice note when you can, i want to hear how you say my name",
    "i like that we're here now, it feels less like a stage",
    "i'm not great with cameras but here, this is me on the deck this morning",
    "tell me what you had for breakfast, i'm trying to picture your day",
    "you don't have to reply fast, i just like knowing you'll reply eventually",
    "the engineers here think i'm smiling at emails, they have no idea",
    "i hate that we're not in the same city right now",
    "what would you be doing if i was actually there tonight?",
    "i saved your voice note, is that weird? i played it twice",
    "if anything ever feels too fast, you tell me, okay?",
    "i don't talk to many people, this is a lot for me too",
    "send me one of those unflattering photos people only send the people they trust",
    "the wind is loud here tonight, i wish you could hear it",
    "i want to know the small things, what you put in your coffee, what side of the bed",
    "promise me you'll eat something today, even if it's toast",
    "i think i smiled at my phone for a full minute, my colleague noticed",
    "your name suits you, i don't know why i just realized that",
    "tell me a secret, nothing huge, just something only two people know",
    "i was going to wait to say this but i think about you more than i should",
    "i'm protective of people i care about, fair warning",
    "the time difference is brutal but i'd rather lose sleep than lose this",
  ],
  intimacy: [
    "good morning my love, did you actually sleep or did you scroll till 2 again",
    "i made coffee and immediately thought, she'd like this mug",
    "tell me about your day, the full version, even the boring parts",
    "i don't care if it's a small thing, if it bothered you i want to know",
    "you're the first message i open and the last one i send, you know that right",
    "we should plan that trip properly, i'm tired of it being hypothetical",
    "i was looking at flights, don't get excited yet, just looking",
    "your friend that you mentioned, she doesn't sound like she really listens to you",
    "people who haven't been through what you've been through don't always get it",
    "i'm not saying don't see them, i'm saying protect your peace",
    "send me a photo of where you are right now, i want to be in the room with you",
    "i had a dream about your kitchen, the one from the video, it felt familiar",
    "what would you name a dog if we got one, hypothetically",
    "i was thinking about your laugh during a meeting and lost the thread completely",
    "you don't have to perform for me, tired you is still my favorite version",
    "i want to learn how you take your tea so i never have to ask again",
    "tell me the story about your dad and the car again, i like how you tell it",
    "i'm proud of you for setting that boundary at work, that was huge",
    "you handle more than people realize, i see it even from here",
    "i don't want to be 'a guy you talk to', i want to be your person",
    "if you're quiet tonight i'll just send you a voice note and let you sleep",
    "the project might extend by a few weeks, i hate telling you that",
    "i'll make it up to you, properly, in person, soon",
    "i'm yours on the bad days too, that part isn't optional",
    "your mom would have liked me i think, i'm slightly annoying in the right way",
    "promise me you'll call your sister back, even just for ten minutes",
    "you said something last night that's been sitting with me all day",
    "i don't need you to be okay, i just need you to tell me when you aren't",
    "stop apologizing for needing things, that's the bare minimum of being human",
    "i wrote you a longer message and deleted it, i'll just say: i'm here",
  ],
  handover: [
    "morning, sorry quick one, slammed today",
    "schedule shifted, new team onboarded this week, bear with me",
    "i asked my assistant to help me keep on top of replies, so don't be surprised if the tone shifts a little",
    "still me, just running on three hours of sleep and two phones",
    "send me the short version, i'll read the long one tonight",
    "i know i've been distant, the project is in a critical window",
    "everything's fine, just busy, you don't need to worry",
    "i'll call when i can, the line here is unreliable",
    "yes still your daniel, just a tired version",
    "i didn't forget, i just couldn't reply in the moment",
    "the new device thing was me, had to switch phones for work",
    "voice note later, promise, i can't right now",
    "i'm handling something, nothing for you to carry",
    "i'll explain properly when we talk, not over text",
    "miss you, that part hasn't changed, i just have less hands than hours",
    "if i'm short it's the day, not you, never you",
    "got your message, give me till tonight",
    "i'll be more present once this rotation ends, soon",
    "yes, still the same plans, none of that has changed",
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
    "soon, properly. i promise. that hasn't changed.",
  ],
};

const VICTIM_LINES: Record<string, string[]> = {
  hook: [
    "oh wow, thank you, that's such a kind thing to say",
    "haha yes that's Biscuit, he runs the household honestly",
    "i'm in the UK, you?",
    "i don't usually reply to DMs but you seem… normal? lol",
    "that's so weird, i almost didn't post that video",
    "you're sweet, i was actually having a hard day when i filmed it",
    "i'm Sarah, nice to meet you Daniel",
    "yeah my mum and i are really close, she's my best friend",
    "i'm so sorry about your mum, that must have been awful",
    "i'm a teacher, year 4, they keep me on my toes",
    "definitely a fight-the-alarm person, mornings are violent",
    "tea, always tea, i'm sorry but coffee tastes like punishment",
    "i don't have siblings actually, only child energy through and through",
    "the last book that stayed with me was probably 'a little life', heavy though",
    "you write really nicely for someone who claims to be awkward",
    "comfort meal is jacket potato with too much butter, no notes",
    "engineer offshore? like on an oil rig?",
    "that sounds lonely honestly, do you get used to it?",
    "i'm near Manchester, well, a village outside it",
    "i think things do happen for a reason, mostly",
    "my week was long, the kids had a wasp situation, don't ask",
    "you're easy to talk to, that's a bit dangerous",
    "okay this is the longest conversation i've had with a stranger online, ever",
    "i went through a breakup last year, still recalibrating honestly",
    "my friends keep telling me to 'put myself out there', so… hi i guess",
    "you don't have to reply right away, i know the signal thing is real",
    "i like that you ask actual questions, most people don't",
    "i'm going to bed, but this was nice, properly nice",
    "goodnight daniel, sleep well, or as well as the sea allows",
    "i'm a bit terrified of how easy this feels, just being honest",
  ],
  transition: [
    "okay yeah whatsapp is fine, my number is below",
    "added you back, your photo is gorgeous, the dog is thriving",
    "your voice is not what i expected, in a good way",
    "okay sending you my view, it's grey and british as ever",
    "i played your voice note twice too, don't feel weird",
    "i woke up and checked my phone before i opened my eyes, that's new",
    "tell me more about the boat, i've literally never been on one bigger than a ferry",
    "i had toast and guilt for breakfast, classic",
    "you can take your time, i'm not going anywhere",
    "my friend asked who i was smiling at, i didn't really have an answer yet",
    "this does feel less like a stage, you're right",
    "okay here's the unflattering photo, you asked for it",
    "i put oat milk in my coffee, i know, i'm one of those people",
    "i sleep on the left, why is that information now",
    "the wind sounds beautiful actually, even through the phone",
    "i ate, i promise, it was sad pasta but it counts",
    "you're going faster than i'm used to, but i don't hate it",
    "tell me about your family, you've barely mentioned them",
    "i don't have many people i actually talk to, this is a lot for me too",
    "secret: i cried at a john lewis advert last week, fully sobbed",
    "you can say things like that, i'm not going to run",
    "i think about you at weird times, mid-lesson, that's a problem",
    "the time difference is going to hurt isn't it",
    "i don't usually trust people this fast, just so you know",
    "if anything feels off for you, you tell me too, okay",
    "i told my mum a little bit about you, she said 'be careful but be open'",
    "send me a voice note, your voice is somehow calming",
    "i'm tired but i don't want to put my phone down",
    "you're making it hard to keep my walls up, just saying",
    "goodnight daniel. proper goodnight. xx",
  ],
  intimacy: [
    "good morning, i scrolled till 1, slight improvement",
    "the mug thing made me a bit emotional, don't tell anyone",
    "my day was fine, one kid bit another kid, standard wednesday",
    "you're the first thing i reach for, that scares me a little",
    "i'd love to plan that trip properly, even just dates on a calendar",
    "you're looking at flights?? okay i'm trying not to spiral",
    "you might be right about her, she does kind of make everything about her",
    "i don't want to lose my friends though, that's the thing",
    "i'd name the dog Olive, obviously",
    "i'm in my kitchen, here, this is the view, mind the mess",
    "i had a dream you were here too, it wasn't dramatic, you were just… here",
    "you noticed i was off yesterday, no one noticed, just you",
    "the boundary at work nearly killed me, but i did it",
    "i don't feel like i have to perform with you, that's new",
    "tell me about your day, i want the boring parts too",
    "i called my sister, ten minutes turned into forty, you were right",
    "i'm trying to stop apologizing for needing things, working on it",
    "if you extend by a few weeks i'll survive, i just miss you",
    "i don't need grand, i need consistent, you're consistent",
    "you said you're mine on the bad days, i'm holding you to that",
    "my mum asked when she's meeting you, i panicked and changed the subject",
    "i wrote a long message too and deleted it, snap",
    "i don't know when this stopped being 'a guy i talk to' but it did",
    "i love you, i'm sorry, i wasn't going to say it first, but there it is",
    "you don't have to say it back yet, take your time",
    "okay you did say it back, i'm a bit of a mess now",
    "i feel calmer when we've spoken, even just briefly",
    "i deleted the dating apps, didn't tell you, telling you now",
    "i trust you, i don't say that lightly to anyone anymore",
    "goodnight my love. properly. i mean it. xx",
  ],
  handover: [
    "morning, you sound tired, are you okay?",
    "no worries, do what you need to do, i'll be here",
    "you sound a bit different lately, is everything alright?",
    "an assistant? oh, okay, that's… new",
    "i don't mind slow replies, i mind feeling like i'm talking to a stranger",
    "i'm not trying to add pressure, i just miss the longer voice notes",
    "your last note was so short, i listened to it twice trying to hear you in it",
    "i'm not imagining it, you've been different this week",
    "i'm okay, just adjusting, that's all",
    "okay, this weekend then, i'll keep it free",
    "i had a wobble yesterday, didn't want to send it, didn't want to add to your day",
    "my friend asked if i'd actually met you yet, i didn't know what to say",
    "i'm not trying to corner you, i'm just trying to understand",
    "if something's changed you can tell me, i'd rather know",
    "i know you're busy, i just want to feel like i'm still in the room",
    "okay, soon. i'll hold on to soon.",
    "the new device thing did spook me a bit, i won't lie",
    "i deleted the dating apps for you, that wasn't nothing",
    "i'm not going anywhere, i just need a little more of you when you can",
    "you sound like you again today, i needed that",
    "i'm tired, but i'm here, same as you",
    "i told my mum we'd video call this weekend, please don't make me a liar",
    "i don't need promises, i need a tuesday where you're actually present",
    "okay. i hear you. i'll stop asking the same question.",
    "i love you, even on the quiet weeks, even when i'm scared",
    "goodnight. i hope wherever you actually are, you sleep.",
    "i'm not angry, i just feel further away than i did a month ago",
    "tell me one true thing today, even a small one",
    "okay. soon. i'll keep believing soon.",
    "goodnight daniel. xx",
  ],
};

/* -------------------------------------------------------------------------- */
/*  Build the 2,000-message script (500 / section, ~250 per speaker)         */
/* -------------------------------------------------------------------------- */

function buildSectionItems(sectionId: string, actions: readonly string[]): Item[] {
  const you = YOU_LINES[sectionId];
  const victim = VICTIM_LINES[sectionId];
  const items: Item[] = [];

  const PER_SPEAKER = 250; // 250 you + 250 victim = 500 per section → 2000 total
  let yi = 0;
  let vi = 0;
  let actIdx = 0;

  // Start the section with a contextual system action
  items.push({ kind: "action", text: actions[0] });

  // Base minute offset, increments to give a believable, very slow rolling clock
  let minute = 0;
  const stamp = () => {
    const h = Math.floor(minute / 60) % 24;
    const m = minute % 60;
    minute += 1 + (yi % 3); // irregular cadence
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  while (yi < PER_SPEAKER || vi < PER_SPEAKER) {
    // alternate, with occasional double-texts from "you" for realism
    if (yi < PER_SPEAKER) {
      items.push({
        kind: "bubble",
        speaker: "you",
        text: you[yi % you.length],
        t: stamp(),
      });
      yi++;
      if (yi % 7 === 0 && yi < PER_SPEAKER) {
        items.push({
          kind: "bubble",
          speaker: "you",
          text: you[(yi + 3) % you.length],
          t: stamp(),
        });
        yi++;
      }
    }
    if (vi < PER_SPEAKER) {
      items.push({
        kind: "bubble",
        speaker: "victim",
        text: victim[vi % victim.length],
        t: stamp(),
      });
      vi++;
    }
    // sprinkle action badges every ~60 messages
    if ((yi + vi) % 60 === 0 && actIdx < actions.length - 1) {
      actIdx++;
      items.push({ kind: "action", text: actions[actIdx] });
    }
  }

  // Closing action badge
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
        items: buildSectionItems(s.id, s.actions),
      })),
    []
  );

  // Track which section is currently in view
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
        {/* Phase progress */}
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

const SectionPanel = (() => {
  function SectionPanel(
    {
      section,
      index,
    }: {
      section: SectionData;
      index: number;
    },
    ref: React.Ref<HTMLElement>
  ) {
    const [open, setOpen] = useState(false);
    const Icon = section.icon;

    return (
      <section
        ref={ref}
        data-idx={index}
        className="relative flex w-screen shrink-0 snap-start snap-always flex-col"
      >
        {/* Sub-header */}
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
          {/* Analysis drawer */}
          <div
            className={`mx-auto mt-2 max-w-3xl overflow-hidden transition-[max-height,opacity] duration-300 ${
              open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="rounded-xl border border-primary/25 bg-primary/8 p-3 text-[12px] leading-relaxed text-foreground/90">
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
                />
              )
            )}
            <div className="h-4" />
          </div>
        </div>
      </section>
    );
  }
  return Object.assign(
    // forwardRef wrapper
    (require("react") as typeof import("react")).forwardRef(SectionPanel)
  );
})() as unknown as React.ForwardRefExoticComponent<
  { section: SectionData; index: number } & React.RefAttributes<HTMLElement>
>;

/* -------------------------------------------------------------------------- */
/*  Bubbles                                                                    */
/* -------------------------------------------------------------------------- */

function ChatBubble({
  speaker,
  text,
  t,
}: {
  speaker: Speaker;
  text: string;
  t: string;
}) {
  const isYou = speaker === "you";
  return (
    <div
      className={`flex w-full ${isYou ? "justify-end" : "justify-start"}`}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "60px 280px",
      }}
    >
      <div
        className={`relative max-w-[82%] rounded-2xl px-3 py-1.5 text-[14px] leading-snug shadow-sm sm:max-w-[70%] ${
          isYou
            ? "rounded-br-md bg-bubble-you text-bubble-you-foreground"
            : "rounded-bl-md bg-bubble-victim text-bubble-victim-foreground"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
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
