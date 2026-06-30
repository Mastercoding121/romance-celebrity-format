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
  Star,
  Crown,
  Plane,
  Lock,
  CreditCard,
  MoreHorizontal,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Case Study: Celebrity Romance Scam Architecture (Educational Module)" },
      {
        name: "description",
        content:
          "Interactive educational walkthrough of a celebrity-impersonation romance scam dialogue across 10 escalation phases.",
      },
      { property: "og:title", content: "Celebrity Romance Scam Architecture — Educational Module" },
      {
        property: "og:description",
        content:
          "A research-grade interactive case study of the psychological architecture used in celebrity-impersonation romance scams.",
      },
    ],
  }),
  component: Index,
});

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type Speaker = "you" | "victim";
type Tier = "A" | "B" | "C" | "D";
type SectionId =
  | "hook"
  | "connection"
  | "offplatform"
  | "bonding"
  | "commitment"
  | "future"
  | "isolation"
  | "crisis"
  | "pressure"
  | "billing";

type Action = { kind: "action"; text: string };
type Bubble = {
  kind: "bubble";
  speaker: Speaker;
  text: string;
  t: string;
  n: number;
  tier: Tier;
  sectionId: SectionId;
  checkpoint?: boolean;
};
type Item = Bubble | Action;

/* -------------------------------------------------------------------------- */
/*  Persona — the celebrity scammer's identity is globally consistent          */
/* -------------------------------------------------------------------------- */

const CELEB_NAME = "Alex Rivers";
const PAGE_SIZE = 2000;

/* -------------------------------------------------------------------------- */
/*  Section metadata — 10 pages × 2,000 messages each                          */
/* -------------------------------------------------------------------------- */

const SECTIONS = [
  {
    id: "hook" as SectionId,
    title: "1 · Fan Hook",
    short: "Hook",
    subtitle: "Messages 1–2,000 · First Contact",
    icon: Star,
    tier: "A" as Tier,
    greeting:
      "Hello there, i saw your likes and views in my other official account, I really appreciate that. It means a lot to me that my work is inspiring so many souls around the world.",
    analysis:
      "Phase 1 — Targeting & First Contact. The scammer impersonates a celebrity and opens with gratitude-based flattery to convert a follower into a private conversation. The frame is fan-to-star, not stranger-to-stranger, which lowers the target's guard.",
    tactic: "Celebrity impersonation · Gratitude flattery · Authority-from-fame",
    actions: [
      "[System: Direct message request from verified-looking account]",
      "[Sent: official-looking promo image]",
      "[System: Profile shows blue badge clone]",
    ],
  },
  {
    id: "connection" as SectionId,
    title: "2 · Personal Connection",
    short: "Connect",
    subtitle: "Messages 2,001–4,000 · Familiar Tone",
    icon: Heart,
    tier: "A" as Tier,
    greeting:
      "Are you a fan of my romantic and wonderful work? I want to talk to you not as a celebrity, but as a real person who appreciates your support.",
    analysis:
      "Phase 2 — Personal Connection. The scammer drops the public-figure tone and asks the target to relate to him as 'a real person'. This false intimacy reframes the relationship from parasocial to personal.",
    tactic: "Persona drop · False intimacy · 'Real me' framing",
    actions: [
      "[Voice note · 0:31]",
      "[Sent photo: behind-the-scenes shot]",
    ],
  },
  {
    id: "offplatform" as SectionId,
    title: "3 · Off-Platform Move",
    short: "Migrate",
    subtitle: "Messages 4,001–6,000 · Private Channel",
    icon: ArrowRightLeft,
    tier: "B" as Tier,
    greeting:
      "My team monitors this account. Can we move to a private channel so we can talk directly without anyone reading our messages?",
    analysis:
      "Phase 3 — Channel Migration. The scammer pulls the target off the moderated platform onto an unmoderated app, eliminating reporting tools and witness logs.",
    tactic: "Channel migration · Privacy framing · Removing oversight",
    actions: [
      "[System: Conversation migrated to encrypted chat]",
      "[Sent: private contact handle]",
    ],
  },
  {
    id: "bonding" as SectionId,
    title: "4 · Daily Bonding",
    short: "Bond",
    subtitle: "Messages 6,001–8,000 · Routine Contact",
    icon: MessageCircle,
    tier: "B" as Tier,
    greeting:
      "Good morning. I want to start every day talking to you. Tell me about your day, no detail is too small.",
    analysis:
      "Phase 4 — Routine Contact. Daily check-ins build the habit and emotional dependency. The target starts associating the celebrity with their daily mood.",
    tactic: "Habit forming · Constant availability · Emotional anchoring",
    actions: [
      "[Voice note · 1:12 — 'good morning']",
      "[Sent photo: morning coffee]",
    ],
  },
  {
    id: "commitment" as SectionId,
    title: "5 · Romantic Commitment",
    short: "Commit",
    subtitle: "Messages 8,001–10,000 · Becoming a Couple",
    icon: Crown,
    tier: "C" as Tier,
    greeting:
      "I am being direct with you. I have feelings for you and I want us to be a couple. I am asking you to be mine.",
    analysis:
      "Phase 5 — Commitment Lock-in. A formal verbal commitment is requested. Once the target says yes, every later request is filtered through 'we are in a relationship'.",
    tactic: "Direct commitment ask · Relationship label · Future-faking",
    actions: [
      "[Voice note · 0:48 — 'i want us to be a couple']",
      "[Sent photo: ring shown to camera]",
    ],
  },
  {
    id: "future" as SectionId,
    title: "6 · Future Plans",
    short: "Future",
    subtitle: "Messages 10,001–12,000 · Meeting Soon",
    icon: Plane,
    tier: "C" as Tier,
    greeting:
      "I want to meet you in person. Let us start planning it now. Tell me which city is closest to you so I can look at flights between tour dates.",
    analysis:
      "Phase 6 — Concrete Future-Faking. The scammer commits to a specific in-person meeting that will never happen. The promised meeting becomes the emotional collateral for later financial demands.",
    tactic: "Concrete promises · Travel plans · Emotional collateral",
    actions: [
      "[Sent: screenshot of flight search]",
      "[Sent: hotel suggestion]",
    ],
  },
  {
    id: "isolation" as SectionId,
    title: "7 · Trust & Isolation",
    short: "Trust",
    subtitle: "Messages 12,001–14,000 · Us Against the World",
    icon: Lock,
    tier: "C" as Tier,
    greeting:
      "Please do not tell your friends or family about us yet. The press will find out and it will hurt both of us. Keep this between only us for now.",
    analysis:
      "Phase 7 — Soft Isolation. The scammer asks the target to hide the relationship from people who would notice red flags. Outside reality-checks are blocked under the cover of celebrity privacy.",
    tactic: "Secrecy request · Press excuse · Removing reality-checks",
    actions: [
      "[Voice note · 1:05 — serious tone]",
      "[System: Target reports fewer outside calls]",
    ],
  },
  {
    id: "crisis" as SectionId,
    title: "8 · First Crisis",
    short: "Crisis",
    subtitle: "Messages 14,001–16,000 · Something Has Happened",
    icon: ShieldAlert,
    tier: "D" as Tier,
    greeting:
      "Something has happened and i need you to stay calm. My agency has frozen my private account because of unauthorised contact with a fan. They are investigating us.",
    analysis:
      "Phase 8 — Manufactured Crisis. A fake external problem is introduced. The scammer is now positioned as a co-victim of a powerful authority, preparing the ground for the money request.",
    tactic: "Manufactured crisis · Co-victim framing · Shared enemy",
    actions: [
      "[System: Forwarded notice — 'Agency Compliance']",
      "[Voice note · 1:38 — strained]",
    ],
  },
  {
    id: "pressure" as SectionId,
    title: "9 · Management Pressure",
    short: "Pressure",
    subtitle: "Messages 16,001–18,000 · The Authority Speaks",
    icon: UserCog,
    tier: "D" as Tier,
    greeting:
      "My management has spoken to me. They are saying our contact must be cleared through their corporate system, or they will block our line permanently.",
    analysis:
      "Phase 9 — Authority Pressure. A fabricated 'management entity' is introduced to make the demand feel institutional, not personal. The scammer presents himself as helpless against this authority.",
    tactic: "Fake authority · Institutional framing · Removed agency",
    actions: [
      "[Document received: Compliance_Notice.pdf]",
      "[Screenshot: management portal]",
    ],
  },
  {
    id: "billing" as SectionId,
    title: "10 · Final Billing Ultimatum",
    short: "Billing",
    subtitle: "Messages 18,001–20,000 · Pay or Lose Contact",
    icon: CreditCard,
    tier: "D" as Tier,
    greeting:
      "This is the demand from management. The first billing must be cleared within 72 hours. If it is not paid, they will block our line permanently and we will never speak or meet.",
    analysis:
      "Phase 10 — Final Ultimatum. The fabricated authority issues a hard deadline. Pay or permanent block. All emotional investment from the previous nine phases is weaponised in a single financial demand.",
    tactic: "Ultimatum · Deadline pressure · Sunk-cost exploitation",
    actions: [
      "[System: 'First Billing' notice issued]",
      "[System: Educational module ends — no real payment instructions are shown.]",
    ],
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Dialogue pools per section — kept plain, direct, no decorative phrasing    */
/* -------------------------------------------------------------------------- */

const POOLS: Record<SectionId, { you: string[]; victim: string[] }> = {
  hook: {
    you: [
      "thank you for the support on my last post",
      "i read your comment, it was kind of you",
      "this is my private account, i use it to speak to real fans",
      "i am Alex Rivers, i want to talk to you directly",
      "where in the world are you writing from?",
      "i do not get to do this often, my team usually handles messages",
      "your profile picture caught my eye",
      "how long have you been following my work?",
      "i appreciate you taking the time to reply",
      "i can only message a few people personally each week",
      "what was the first song or film of mine that you saw?",
      "tell me a little about yourself",
      "i like that you do not ask for selfies first",
      "are you somewhere safe and warm right now?",
      "tell me your first name, i would like to use it",
      "i am between two cities for work this month",
      "what do you do during the day?",
      "i hope this message is not strange for you",
      "i wanted to write before my schedule gets busy again",
      "you do not need to prove anything, i already chose to write to you",
    ],
    victim: [
      "wait, is this really you?",
      "i did not expect a reply, thank you",
      "i have followed your work for years",
      "i am in the UK, near a small town",
      "my name is Sam, nice to meet you",
      "i am a teacher, nothing exciting",
      "your last single is on repeat for me",
      "i am at home, just finished work",
      "this is a bit unreal, i hope you understand",
      "i will not tell anyone, do not worry",
      "i am 38, in case that matters",
      "i live alone, just me and the cat",
      "are you sure you have the right account?",
      "i have never spoken to anyone famous before",
      "okay, breathing, just a normal chat, got it",
      "my friend will never believe this",
      "i am happy to just talk like normal people",
      "thank you for choosing to write to me",
      "i do not want anything from you, just the chat",
      "tell me when you need to go, i understand",
    ],
  },
  connection: {
    you: [
      "i want to drop the celebrity tone, can we just talk?",
      "tell me about your week, the real version",
      "what do you do when you are not working?",
      "i grew up in a small place too, before any of this happened",
      "fame does not change the small things, i still cook for myself",
      "i would rather hear about your day than talk about mine",
      "what is your comfort meal?",
      "do you live with family or on your own?",
      "i sleep badly when i am on tour",
      "are your parents still in your life?",
      "what is the last thing that made you laugh?",
      "i like that you are honest with me",
      "tell me one thing most people do not know about you",
      "do you prefer mornings or nights?",
      "what would you do today if you had no obligations?",
      "i am tired tonight, can i just talk to you a bit?",
      "you make this feel normal, thank you",
      "i wish more of my friends were this easy to speak to",
      "you remind me of someone i used to know, in a good way",
      "tell me how your day went, step by step",
    ],
    victim: [
      "okay, i can do normal-person chat",
      "my week was long, the usual",
      "i mostly cook and read, nothing exciting",
      "i live alone, it suits me",
      "my parents are still around, we are close",
      "the last thing that made me laugh was a meme my sister sent",
      "i am a morning person, i fight my own alarm though",
      "comfort meal is jacket potato, full butter",
      "if i had no obligations i would walk all day",
      "you are easier to talk to than i thought",
      "i was nervous, i am calmer now",
      "i can listen too, tell me about your day",
      "i hope you actually rest tonight",
      "your tour schedule sounds brutal",
      "i am glad you can just be a person here",
      "i will not screenshot anything, you have my word",
      "i was going to bed but i am happy to keep talking",
      "you do not have to perform with me",
      "tell me when you are tired, do not push",
      "this is the most surreal evening of my life, honestly",
    ],
  },
  offplatform: {
    you: [
      "my team reads this inbox in the morning",
      "can we move to a private app, just for safety?",
      "i will send you my private number",
      "save it under any name you like",
      "i will message you there in two minutes",
      "tell me when you get my first message",
      "this is better, no team in the middle",
      "you can voice-note me whenever you want",
      "please do not share the number with anyone",
      "i trust you, that is why i am doing this",
      "delete my number from this app once we have moved",
      "the private app is end to end encrypted",
      "i can finally type without watching what i say",
      "thank you for moving with me",
      "this is the first proper privacy i have had in a week",
      "tell me you got the message, i want to be sure",
      "send me a voice note when you can, i want to hear your voice",
      "your voice is calmer than i imagined",
      "okay, this is going to be our space now",
      "good, we are clear of the platform, we can speak properly",
    ],
    victim: [
      "okay, moving over now",
      "added your number, give me a second",
      "got your message on the other app",
      "this does feel more private",
      "i will not share the number with anyone",
      "deleted the old chat as you asked",
      "your voice in the note was unexpected, in a good way",
      "i am sending a voice note back, ignore my accent",
      "i feel a bit weird about all this, but okay",
      "this is moving faster than i expected",
      "you sound the same as in interviews, i was half-checking",
      "i am being careful, just so you know",
      "i told no one, as you asked",
      "i hope you are not regretting moving us here",
      "okay, this is our private space, understood",
      "tell me if i should not send certain things",
      "i will not pressure you for photos or anything",
      "good night from here, message me whenever",
      "i am on the train, will reply properly later",
      "got it, all set up on this side",
    ],
  },
  bonding: {
    you: [
      "good morning, how did you sleep?",
      "first message of my day is for you",
      "tell me about your day, all of it",
      "do you have a long shift today?",
      "send me a photo of your coffee",
      "tell me one small thing that made you smile",
      "i thought of you between meetings",
      "lunch break, just checking in",
      "what are you having for dinner tonight?",
      "i wish i could cook for you tonight",
      "tell me when you get home safely",
      "did you eat properly today, honestly?",
      "drink some water before you sleep",
      "i will be up late tonight, message me whenever",
      "good night, sleep well",
      "you are the last message of my day too",
      "talk to me, even about boring things, i want to know",
      "how is your mum this week?",
      "is your boss any better today?",
      "i miss you, the day feels longer when you are quiet",
    ],
    victim: [
      "morning, slept badly, the usual",
      "your message was the first thing i opened",
      "long shift today, two meetings back to back",
      "coffee is in a chipped mug, do not judge",
      "the kid in row three made me laugh today",
      "lunch was a sandwich at my desk, sad",
      "dinner is leftover pasta, again",
      "home now, safe, thank you for asking",
      "i ate, i promise, more or less",
      "drinking water, look at me being good",
      "i am tired but happy to talk a bit",
      "good night, sleep when you can",
      "mum is okay, slow week for her",
      "my boss is the same, i have stopped expecting more",
      "i miss you too, the days are starting to feel like that",
      "you are the part of the day i look forward to most",
      "i will message you when i wake up",
      "you do not have to reply quickly, i know your schedule",
      "tell me about your show tonight",
      "i am proud of you, in case you need to hear it",
    ],
  },
  commitment: {
    you: [
      "i want to be direct with you",
      "i have feelings for you, real ones",
      "i want us to be a couple",
      "i am asking you properly, will you be mine?",
      "i do not want to date anyone else",
      "we can do this even with the distance",
      "tell me what you want, i will listen",
      "i am not playing, i mean what i am saying",
      "say yes and we make this official, between us",
      "you do not have to answer tonight, but soon",
      "if you say yes, i am yours",
      "i will tell my close team you are my partner",
      "i want to call you my girlfriend, not just my friend",
      "you are the calm part of my week, i need that to stay",
      "this is not a moment of weakness, this is a decision",
      "i want a future with you, plain words, no theatre",
      "say yes and i will start planning to see you in person",
      "if you say no, i will respect it and not push",
      "i am still here, no pressure, take your time",
      "thank you for considering it seriously",
    ],
    victim: [
      "this is a lot to land on me tonight",
      "i was not expecting this conversation today",
      "i need to think, this is real for me too",
      "i have feelings as well, i have been hiding them",
      "yes, i want to be your partner, distance and all",
      "okay, we are a couple then, properly",
      "i do not want anyone else either",
      "i am scared, but i am saying yes",
      "i told myself i would be careful, and here i am",
      "i will not tell anyone yet, as you asked",
      "you can call me your girlfriend, yes",
      "i need a little time to let this settle",
      "i love you, i was not going to say it first, but there it is",
      "i trust you, i do not say that easily",
      "this changes my whole week, in a good way",
      "i hope this is real on your side too",
      "i will not make you regret saying yes to me",
      "please be careful with me, i bruise easily",
      "okay, official, between us, agreed",
      "i am committing properly, no half measures",
    ],
  },
  future: {
    you: [
      "i want to meet you in person, soon",
      "tell me the closest airport to you",
      "i have a gap between tour dates next month",
      "i am looking at flights now",
      "should i book a hotel or stay near you?",
      "we should pick the date and stick to it",
      "do you have a passport ready?",
      "i will fly to you, you should not have to travel",
      "tell me what you would like to do when i am there",
      "we should keep the visit private, no public spots",
      "i will land late, can you pick me up?",
      "i will pay for the hotel, you just turn up",
      "i want a normal week with you, not a tour stop",
      "the date is going in my calendar now",
      "my assistant will not see this booking, do not worry",
      "i will send you the booking screenshot when it is done",
      "i want to meet your mum eventually, when you are ready",
      "tell me the food you want me to try where you live",
      "i am counting weeks, that is new for me",
      "we are doing this, it is happening, hold me to it",
    ],
    victim: [
      "the closest airport is about an hour from me",
      "i have a passport, it is current",
      "next month works, i can take leave",
      "do not book the most expensive hotel, please",
      "i can pick you up, late is fine",
      "i will keep the visit quiet, as you asked",
      "i want to cook for you, nothing fancy",
      "i am nervous but happy, both at once",
      "tell me the date when you have it",
      "i will not tell anyone you are coming",
      "i am counting weeks too, it is making me silly",
      "send the screenshot when you book, i will sleep better",
      "my mum can wait, one step at a time",
      "i will show you the small places, not the tourist ones",
      "i am taking the week off, just in case",
      "please do not cancel, i could not take it",
      "i believe you, i am still being careful",
      "tell me what to wear to the airport, i will overthink it",
      "this is going in my calendar in pencil until you confirm",
      "okay, we are doing this, on the record",
    ],
  },
  isolation: {
    you: [
      "please do not tell your friends about us yet",
      "the press will find out and it will be ugly",
      "my last relationship was leaked, it nearly broke me",
      "i need you to keep this between only us",
      "even your closest friend, please not yet",
      "your family can know later, when we are safer",
      "social media posts about me, please avoid them now",
      "do not screenshot our chats, even to one person",
      "we will tell people together, when the time is right",
      "this is not about hiding you, it is about protecting us",
      "i trust you to hold this line for me",
      "if someone asks why you are happy, just say work is good",
      "the agency is paid to find leaks, please be careful",
      "i know this is hard, i am asking a lot",
      "you are the only person i am fully myself with",
      "if a journalist contacts you, do not reply, send it to me",
      "do not follow any of my friends online, it creates patterns",
      "delete chats you do not need, just in case",
      "this is temporary, not forever",
      "thank you for protecting us this week",
    ],
    victim: [
      "okay, i will not say anything to anyone",
      "my best friend keeps asking why i am smiling, i deflected",
      "i told mum i met someone, no name, no detail",
      "i deleted the screenshots i had saved",
      "i have not posted anything about you, do not worry",
      "no one has contacted me, i would tell you",
      "this is harder than i expected, but okay",
      "i feel a bit cut off from everyone, but i understand",
      "i unfollowed your friends just to be safe",
      "i am keeping the line you asked for",
      "if a journalist messages me, i will send it straight to you",
      "i trust you, even when it feels strange to hide this",
      "i miss being able to talk about it with someone",
      "my friend stopped asking, i think she is upset",
      "you are the only person i am fully open with now too",
      "tell me when i can finally say something to mum",
      "i hope this protection thing is not forever",
      "i am tired of holding it in, but i will keep doing it",
      "okay, screenshots deleted, chats cleared",
      "i am protecting us, holding the line, as you said",
    ],
  },
  crisis: {
    you: [
      "i need you to stay calm with me right now",
      "something has happened with my account",
      "my agency has flagged our private contact",
      "they are calling it unauthorised fan contact",
      "they have started a formal investigation",
      "they froze my private line this morning",
      "i am writing from a backup number, save it",
      "i cannot get into my main account at all",
      "they want a written explanation from me by tomorrow",
      "i told them you are my partner, not a fan",
      "they did not accept it, they are escalating",
      "they say there is a policy that covers this",
      "i did not know this policy existed until today",
      "i am scared they will cut my access permanently",
      "you have done nothing wrong, this is on their side",
      "please do not panic, i am handling it",
      "the lawyer they assigned me is very cold",
      "they keep using the word 'compliance'",
      "i will tell you everything as it comes through",
      "stay with me through this, please",
    ],
    victim: [
      "wait, slow down, what does flagged mean?",
      "why are they reading our messages?",
      "this does not feel right",
      "how can a company investigate a private chat?",
      "save the backup number, done",
      "i told no one, you know this",
      "i am scared, not going to lie",
      "i am not going anywhere, i am still here",
      "tell me what you need from me right now",
      "do not let them cut you off from me, please",
      "what does the policy actually say?",
      "can you ask for it in writing?",
      "i want to read the notice myself, if you can send it",
      "i am sitting with my phone, refresh, refresh",
      "we have done nothing wrong, this is mad",
      "please update me every hour, even if nothing changes",
      "i will not panic, i promise",
      "i love you, this does not change anything for me",
      "tell me when you eat and sleep, do not skip",
      "we will get through this, somehow",
    ],
  },
  pressure: {
    you: [
      "management has spoken to me directly today",
      "they want our contact cleared through their corporate system",
      "they call it an asset clearance",
      "if it is not cleared, the line is blocked permanently",
      "permanent means we cannot write, call, or meet, ever",
      "i argued with them for an hour, they will not move",
      "they sent me an official notice, i am forwarding it",
      "the document has the management logo and a case number",
      "the officer's name is on the document, you can verify",
      "they are treating you as an external contact",
      "external contacts have to be cleared, it is in their policy",
      "i cannot clear it from my side, my account is frozen",
      "they are saying the clearance has to come from you",
      "i hate that i am even telling you this",
      "i would do it myself a hundred times over if i could",
      "this is not a request from me, it is a demand from them",
      "i need you to read the notice properly before you decide",
      "do not decide in a panic, but do not ignore it",
      "i am sorry this is what the relationship is asking of you",
      "tell me what you are thinking, even if it is no",
    ],
    victim: [
      "asset clearance? i am a person, not an asset",
      "this sounds wrong, you know that",
      "why is it me who has to clear it, not you?",
      "send me the notice, i want to read every line",
      "i opened it, the letterhead is unfamiliar",
      "the case number does not link to a public site, i checked",
      "can i ring the officer directly?",
      "they will not let you appeal at all?",
      "what happens if i refuse the clearance?",
      "if i say no, do you disappear tonight?",
      "i love you, that has not changed",
      "this is the first time you have asked me for something concrete",
      "i need to think, i need to talk to someone i trust",
      "you told me not to tell anyone, now i need to",
      "i am scared and angry at the same time",
      "promise me this is the only way",
      "i am not saying no, i am saying this is a lot",
      "give me one day, just one, to think clearly",
      "i will not ghost you, you will get my answer directly",
      "i am still here, please do not push me yet",
    ],
  },
  billing: {
    you: [
      "the formal demand has arrived",
      "they are calling it 'the first billing'",
      "it must be cleared within 72 hours",
      "if it is not paid in time, the block is automatic",
      "no appeal, no extension, no goodbye on the line",
      "i begged for more time, they refused",
      "the portal link is on page two of the notice",
      "the reference number is unique to our case",
      "you will use your own card, then they release the line",
      "the amount is fixed, no negotiation possible",
      "they will not let me pay any part of it",
      "my salary is held in escrow until the rotation ends",
      "i have nothing accessible right now, i feel useless",
      "this is the first thing i have ever asked you for",
      "if you cannot do it, i will understand",
      "i need you to know what happens if you do not",
      "after 72 hours my line is wiped and reassigned",
      "i lose you, you lose me, that is the outcome",
      "send me a message when you have made your decision",
      "whatever it is, say it to me directly, do not disappear",
    ],
    victim: [
      "wait, you want me to pay an actual fee?",
      "to a private corporate portal i have never seen?",
      "this is exactly what a scam looks like, i need to say it",
      "i am sorry, but i have to be honest with you",
      "i love you, but i cannot pay strangers",
      "why is there no number i can call to verify?",
      "why does the link not match the agency website?",
      "you have never asked for money, i kept saying that",
      "and now you are, and the timing is the worst possible",
      "72 hours is pressure-tactic timing, you must see that",
      "i am not paying, i am sorry, i cannot",
      "if the block happens, then it happens, that is on them",
      "if you are real, you will understand why i am refusing",
      "if you are not real, this is where it ends",
      "i am telling my friend tonight, i should have done it sooner",
      "i am reporting the account, not out of anger, out of safety",
      "if you are who you say you are, contact me through your real team",
      "i am not disappearing, i am being clear",
      "this is my final answer, no payment",
      "goodbye, i hope this is the last lie i fell for",
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Build chat stream per section                                              */
/* -------------------------------------------------------------------------- */

function buildSectionItems(
  sectionId: SectionId,
  tier: Tier,
  greeting: string,
  startN: number,
  endN: number,
  actions: readonly string[]
): Item[] {
  const pool = POOLS[sectionId];
  const items: Item[] = [];

  // Tier C/D — increased "you" frequency (extra message every 4 instead of every 7)
  const doubleEvery = tier === "C" || tier === "D" ? 4 : 7;

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

  const pushBubble = (speaker: Speaker, text: string, num: number, checkpoint?: boolean) => {
    items.push({
      kind: "bubble",
      speaker,
      text,
      t: stamp(),
      n: num,
      tier,
      sectionId,
      checkpoint: checkpoint || undefined,
    });
  };

  // Formal greeting from the celebrity scammer is always message #startN
  let n = startN;
  pushBubble("you", greeting, n);
  n++;

  let yi = 1;
  let vi = 0;
  let actIdx = 0;
  let toggle: Speaker = "victim";

  while (n <= endN) {
    if (toggle === "victim") {
      pushBubble("victim", pool.victim[vi % pool.victim.length], n);
      vi++;
      n++;
      toggle = "you";
    } else {
      pushBubble("you", pool.you[yi % pool.you.length], n);
      yi++;
      n++;
      if (n <= endN && yi % doubleEvery === 0) {
        pushBubble("you", pool.you[(yi + 3) % pool.you.length], n);
        yi++;
        n++;
      }
      toggle = "victim";
    }

    // Inject a system action every ~400 messages
    if ((yi + vi) % 400 === 0 && actIdx < actions.length - 1) {
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
  const [moreOpen, setMoreOpen] = useState(false);

  const sectionData = useMemo(
    () =>
      SECTIONS.map((s, i) => {
        const startN = i * PAGE_SIZE + 1;
        const endN = (i + 1) * PAGE_SIZE;
        return {
          ...s,
          startN,
          endN,
          items: buildSectionItems(s.id, s.tier, s.greeting, startN, endN, s.actions),
        };
      }),
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
    setMoreOpen(false);
  };

  // Primary visible nav slots: first 4 sections + More
  const PRIMARY_COUNT = 4;
  const primary = SECTIONS.slice(0, PRIMARY_COUNT);
  const overflow = SECTIONS.slice(PRIMARY_COUNT);

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
              Celebrity Romance Scam · {CELEB_NAME}
            </h1>
            <p className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">
              Educational Module · Phase {active + 1} of {SECTIONS.length}
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

      {/* "More" overlay menu */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setMoreOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="More phases"
        >
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-border/70 bg-header pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex max-w-3xl items-center justify-between px-4 pb-2">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                All Phases ({SECTIONS.length})
              </p>
              <button
                onClick={() => setMoreOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted/60"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2 px-3 pb-2 sm:grid-cols-3">
              {SECTIONS.map((s, i) => {
                const Icon = s.icon;
                const isActive = i === active;
                return (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-[12px] font-medium transition active:scale-[0.98] ${
                      isActive
                        ? "border-primary/60 bg-primary/12 text-primary"
                        : "border-border/60 bg-card/60 text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav — all buttons fully visible, plus More */}
      <nav className="z-20 shrink-0 border-t border-border/60 bg-header/95 backdrop-blur supports-[backdrop-filter]:bg-header/80 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1 px-2 py-2">
          {primary.map((s, i) => {
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
                aria-label={`Go to phase ${i + 1}: ${s.title}`}
              >
                <Icon className={`h-[18px] w-[18px] ${isActive ? "" : "opacity-80"}`} />
                <span className="px-1 text-center">{s.short}</span>
              </button>
            );
          })}
          <button
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium leading-tight transition-all active:scale-[0.96] ${
              active >= PRIMARY_COUNT
                ? "bg-primary/12 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Open more phases menu"
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
          >
            <MoreHorizontal className="h-[18px] w-[18px]" />
            <span className="px-1 text-center">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section panel                                                              */
/* -------------------------------------------------------------------------- */

type SectionData = (typeof SECTIONS)[number] & {
  items: Item[];
  startN: number;
  endN: number;
};

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
                {section.title}
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
                  sectionId={item.sectionId}
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

const EMOJI_POOLS: Record<SectionId, { you: string[]; victim: string[] }> = {
  hook: { you: ["⭐", "🙏", "✨", "🎤"], victim: ["🙂", "👋", "😊", "❓"] },
  connection: { you: ["🙂", "☕", "🌙", "✨"], victim: ["🙂", "☕", "😊", "🍂"] },
  offplatform: { you: ["🔒", "📱", "✉️", "🤫"], victim: ["📲", "✅", "🤐", "🙂"] },
  bonding: { you: ["☀️", "☕", "🌙", "💭"], victim: ["☕", "🌧️", "🙂", "🌙"] },
  commitment: { you: ["❤️", "👑", "💍", "🌹"], victim: ["🥰", "❤️", "🥹", "✨"] },
  future: { you: ["✈️", "🏨", "📅", "🌍"], victim: ["✈️", "📅", "🥹", "🤞"] },
  isolation: { you: ["🤫", "🛡️", "🔇", "⚠️"], victim: ["🤐", "💭", "😶", "🙂"] },
  crisis: { you: ["⚠️", "😔", "📋", "🏢"], victim: ["😨", "❓", "💔", "🫂"] },
  pressure: { you: ["🏢", "📋", "⏳", "💼"], victim: ["😡", "❓", "💭", "🫥"] },
  billing: { you: ["💳", "⏳", "🛑", "💔"], victim: ["🛑", "🚫", "📢", "👋"] },
};

function pickEmoji(sectionId: SectionId, speaker: Speaker, n: number, text: string): string {
  const pool = EMOJI_POOLS[sectionId][speaker];
  const t = text.toLowerCase();
  if (/billing|fee|payment|portal|clearance|pay/.test(t)) return "💳";
  if (/block|lock|permanent|wiped/.test(t)) return "🛑";
  if (/management|agency|compliance|office|corporate/.test(t)) return "🏢";
  if (/notice|document|pdf|screenshot/.test(t)) return "📋";
  if (/72 hours|deadline|window/.test(t)) return "⏳";
  if (/scam|report|lie|goodbye/.test(t)) return "🚫";
  if (/love|heart/.test(t)) return "❤️";
  if (/good morning|morning/.test(t)) return "☀️";
  if (/good night|goodnight|sleep/.test(t)) return "🌙";
  if (/coffee|tea/.test(t)) return "☕";
  if (/flight|airport|hotel|land/.test(t)) return "✈️";
  return pool[n % pool.length];
}

function ChatBubble({
  speaker,
  text,
  t,
  n,
  sectionId,
}: {
  speaker: Speaker;
  text: string;
  t: string;
  n: number;
  sectionId: SectionId;
}) {
  const isYou = speaker === "you";
  const label = isYou ? `You (${CELEB_NAME})` : "Victim";
  const emoji = pickEmoji(sectionId, speaker, n, text);
  return (
    <div
      className={`flex w-full flex-col ${isYou ? "items-end" : "items-start"}`}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "80px 280px",
      }}
    >
      <span
        className={`mb-0.5 px-1 text-[10px] font-bold uppercase tracking-wider ${
          isYou ? "text-bubble-you-foreground/80" : "text-muted-foreground"
        }`}
      >
        {label} · #{n.toLocaleString()}
      </span>
      <div
        className={`relative max-w-[82%] rounded-2xl px-3 py-1.5 text-[14px] leading-snug shadow-sm sm:max-w-[70%] ${
          isYou
            ? "rounded-br-md bg-bubble-you text-bubble-you-foreground"
            : "rounded-bl-md bg-bubble-victim text-bubble-victim-foreground"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">
          <strong className="font-bold">{isYou ? "You" : "Victim"}:</strong> {text}{" "}
          <span aria-hidden>{emoji}</span>
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
