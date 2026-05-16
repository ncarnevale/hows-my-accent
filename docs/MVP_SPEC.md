# How's My Accent — MVP Spec

## Overview

"How's My Accent" is a lightweight AI-assisted web app for English speakers learning Latin American Spanish pronunciation.

The MVP focuses on:

- polished UI/UX
- simple architecture
- fast iteration
- AI-assisted pronunciation feedback
- drill-based correction loops

This is a portfolio/demo-quality product first, not a scientifically rigorous pronunciation platform.

Domain:

- howsmyaccent.cool

---

# Product Goals

The app should:

1. let a user record themselves reading Spanish
2. transcribe the recording using AI
3. identify likely pronunciation mistakes
4. isolate difficult words/sounds
5. guide the user through focused drills
6. let the user retry the original passage

The experience should feel:

- modern
- lightweight
- encouraging
- responsive
- visually polished

---

# Non-Goals (Explicitly Out of Scope)

The MVP should NOT include:

- user accounts
- databases
- subscriptions/payments
- social features
- streaks/gamification systems
- real-time transcription
- streaming audio
- custom ML models
- phoneme-level scientific scoring
- native mobile apps
- multiple languages
- multiple dialects
- curriculum/progression systems

---

# Target User

Primary user:

- native English speaker
- learning Latin American Spanish
- wants better pronunciation/accent

The MVP assumes:

- beginner to intermediate learners
- casual usage
- mobile + desktop browser access

---

# Core User Flow

## 1. Landing Page

### Requirements

- minimal hero section
- clear CTA
- no auth
- mobile responsive
- visually polished

### Primary CTA

- "Test Your Accent"

---

## 2. Reading Prompt Screen

The app displays:

- one hardcoded Spanish passage
- record button
- optional replay of native pronunciation

### Passage Requirements

The passage should intentionally include:

- rolled R
- tapped R
- ñ
- ll/y
- soft and hard G
- J sound
- B/V distinctions
- vowel-heavy words
- common stress patterns

### Initial MVP Constraint

- only one hardcoded passage

---

## 3. Recording Flow

### Requirements

- browser-native microphone recording
- no streaming
- record -> stop -> upload
- works on desktop + mobile browsers

### Technical Notes

Use:

- MediaRecorder API

Store:

- temporary blob in memory only

No permanent storage.

---

## 4. Processing Flow

After upload:

1. audio is sent to backend API route
2. backend sends audio to Whisper API
3. transcript is returned
4. transcript compared against expected passage
5. likely pronunciation issues generated
6. structured feedback returned to frontend

### UX Requirement

Show polished loading state:

- waveform animation OR subtle spinner
- "Analyzing your pronunciation..."

Target processing time:

- under 10 seconds

---

# Pronunciation Analysis

## MVP Philosophy

The MVP does NOT attempt true phoneme analysis.

Instead:

- compare expected transcript vs actual transcript
- infer likely pronunciation problems heuristically

Example:

- expected: "perro"
- actual: "pero"
- inferred issue: rolled R weakness

This is acceptable for MVP.

---

# Feedback System

The app should return:

- overall accent score (approximate/friendly)
- list of likely pronunciation issues
- isolated practice words
- short coaching tips

Example feedback item:

```json
{
  "issue": "Rolled R",
  "description": "Your tongue trill is inconsistent.",
  "examples": ["perro", "ferrocarril"],
  "practiceWords": ["perro", "rojo", "rápido"]
}
```

---

# Drill Loop

For each identified issue:

## Flow

1. play native pronunciation
2. user records attempt
3. app evaluates attempt
4. success/failure shown
5. repeat until 3 successes

### MVP Simplification

Evaluation may be approximate.

The system should feel:

- strict enough to be meaningful
- forgiving enough to avoid frustration

---

# Completion Flow

After all drills complete:

- user may retry the original passage
- app reruns pronunciation analysis

Optional:

- show improvement score delta

---

# Technical Architecture

## Frontend

### Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### State

- React state
- localStorage for lightweight persistence

No backend database.

---

## Backend

### Initial Architecture

Use:

- Next.js API routes OR server actions

Single backend responsibility:

- receive audio
- call AI APIs
- return structured feedback JSON

No separate backend service.

---

# AI Services

## Speech-to-Text

Use:

- OpenAI Whisper API

Responsibilities:

- transcription
- approximate speech recognition

---

## Feedback Generation

Use:

- OpenAI Responses API OR Chat Completions API

Responsibilities:

- infer likely pronunciation issues
- generate coaching text
- generate drill suggestions

LLM output should always be structured JSON.

---

# Suggested API Shape

## POST /api/analyze

### Input

Multipart form:

- audio file
- expected passage id

### Output

```json
{
  "transcript": "...",
  "score": 72,
  "issues": [
    {
      "type": "rolled_r",
      "severity": "medium",
      "examples": ["perro"],
      "practiceWords": ["rojo", "rápido"],
      "tip": "Try vibrating the tongue against the roof of the mouth."
    }
  ]
}
```

---

# Design Direction

## Visual Style

Should feel:

- contemporary
- minimal
- elegant
- language-learning adjacent
- AI-native but not gimmicky

Avoid:

- Duolingo clone aesthetics
- overly playful gamification
- enterprise dashboard styling

Preferred:

- subtle gradients
- glassmorphism/light depth
- clean typography
- tasteful animations
- large recording CTA

---

# Persistence

## MVP Persistence

Use:

- localStorage only

Persist:

- last passage attempt
- drill completion state
- retry progress

No accounts required.

---

# Deployment

## Hosting

- Vercel

## Environment Variables

Required:

- OPENAI_API_KEY

---

# Performance Constraints

## MVP Expectations

- first load under 3s
- mobile responsive
- processing under 10s
- smooth animations
- no janky audio UX

---

# Security Constraints

Do NOT:

- permanently store audio
- expose API keys client-side
- upload recordings to public storage

Audio should be:

- transient
- processed server-side only

---

# Future Expansion Possibilities

Not part of MVP, but architecture should not block:

- phoneme-level analysis
- multiple passages
- multiple dialects
- user accounts
- spaced repetition
- native apps
- conversational mode
- teacher dashboards
- personalized learning history
- progress analytics

---

# MVP Success Criteria

The MVP is successful if:

- users can record audio successfully
- feedback feels plausibly intelligent
- drill loop feels satisfying
- UI feels polished
- deployment is stable
- the app demos well in interviews/portfolio walkthroughs

The MVP does NOT need:

- scientific pronunciation accuracy
- production-scale infrastructure
- monetization
- massive feature scope
