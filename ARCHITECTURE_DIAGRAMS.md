# AI-Studio System Architecture & Diagrams

This document contains visual representations of the system architecture, ER diagram, and workflows.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│                    (React + TypeScript)                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP/REST
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API Server                            │
│              (Node.js + Express + TypeScript)                    │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Auth    │  │ Projects │  │Characters│  │  Scenes  │       │
│  │Controller│  │Controller│  │Controller│  │Controller│       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Render  │  │ Billing  │  │  Voice   │  │  Notify  │       │
│  │Controller│  │Controller│  │Controller│  │Controller│       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└───────────┬───────────────────────┬─────────────────────────────┘
            │                       │
            ↓                       ↓
┌───────────────────────┐   ┌──────────────────┐
│   PostgreSQL DB       │   │   Redis Queue    │
│   (Prisma ORM)        │   │   (BullMQ)       │
│                       │   │                  │
│ • Users               │   │ • Render Jobs    │
│ • Projects            │   │ • Scene Jobs     │
│ • Characters          │   │ • Notifications  │
│ • Scenes              │   │                  │
│ • RenderJobs          │   └──────────────────┘
│ • Notifications       │            │
└───────────────────────┘            ↓
                            ┌──────────────────┐
                            │  Job Workers     │
                            │                  │
                            │ • Scene Render   │
                            │ • Final Video    │
                            │ • Notification   │
                            └────────┬─────────┘
                                     │
                                     ↓
                    ┌────────────────────────────────┐
                    │     External AI Services       │
                    │                                │
                    │ • AI Character Generator       │
                    │ • AI Scene Breakdown           │
                    │ • AI Voice Synthesis           │
                    │ • Video Rendering Engine       │
                    └────────────────────────────────┘
                                     │
                                     ↓
                            ┌──────────────────┐
                            │  Asset Storage   │
                            │   (AWS S3/CDN)   │
                            │                  │
                            │ • Character Imgs │
                            │ • Scene Videos   │
                            │ • Final Videos   │
                            │ • Audio Files    │
                            └──────────────────┘
```

## Entity-Relationship Diagram

```
┌─────────────┐         ┌──────────────┐
│    User     │────────<│   Project    │
│             │ 1    N  │              │
│ • user_id   │         │ • project_id │
│ • email     │         │ • user_id    │
│ • name      │         │ • title      │
│ • password  │         │ • status     │
│ • credits   │         │ • style      │
└──────┬──────┘         └──────┬───────┘
       │                       │
       │ 1                     │ 1
       │                       │
       │ N                     │ N
       │                ┌──────┴───────┐
┌──────┴──────┐         │              │
│TeamMember   │    ┌────┴─────┐   ┌───┴────────┐
│             │    │Character │   │   Scene    │
│• user_id    │    │          │   │            │
│• team_id    │    │• char_id │   │ • scene_id │
│• role       │    │• name    │   │ • number   │
└─────────────┘    │• role    │   │ • title    │
                   │• image   │   │ • duration │
       ┌───────────┴──────────┴───┴────────────┐
       │                                        │
       │ N                                   N  │
       │                                        │
┌──────┴──────┐                      ┌─────────┴──────┐
│ VoiceStyle  │                      │SceneCharacter  │
│             │                      │  (Join Table)  │
│• voice_id   │                      │                │
│• name       │                      │ • scene_id     │
│• language   │                      │ • character_id │
│• accent     │                      │                │
└─────────────┘                      └────────────────┘

┌─────────────┐         ┌──────────────┐
│ RenderJob   │────────<│   Project    │
│             │ N    1  │              │
│ • job_id    │         │ • project_id │
│ • type      │         └──────────────┘
│ • status    │
│ • output    │         ┌──────────────┐
└─────────────┘         │ Notification │
                        │              │
┌─────────────┐         │ • notif_id   │
│   Asset     │         │ • user_id    │
│             │         │ • type       │
│ • asset_id  │         │ • is_read    │
│ • type      │         └──────────────┘
│ • url       │
└─────────────┘         ┌──────────────┐
                        │BillingRecord │
┌─────────────┐         │              │
│  Version    │         │ • billing_id │
│             │         │ • user_id    │
│ • version_id│         │ • credits    │
│ • project_id│         │ • amount     │
│ • number    │         └──────────────┘
└─────────────┘
```

## Data Flow Diagram: Project Creation to Video Delivery

```
1. User Input
   │
   ├─→ Story Prompt
   ├─→ Animation Style
   ├─→ Target Length
   └─→ Submit
        │
        ↓
2. Project Creation
   │
   ├─→ Save to Database
   ├─→ Deduct Credits
   └─→ Queue AI Processing
        │
        ↓
3. AI Character Generation
   │
   ├─→ Analyze Prompt
   ├─→ Generate Character Designs
   ├─→ Create Images
   └─→ Save Characters to DB
        │
        ↓
4. Scene Breakdown
   │
   ├─→ NLP Analysis
   ├─→ Identify Story Beats
   ├─→ Calculate Timing
   ├─→ Generate Dialogue
   └─→ Create Scene Records
        │
        ↓
5. User Review & Approval
   │
   ├─→ View Characters
   ├─→ Edit Scenes
   ├─→ Approve
   └─→ Trigger Render
        │
        ↓
6. Parallel Scene Rendering
   │
   ├─→ Worker 1: Scene 1
   ├─→ Worker 2: Scene 2
   ├─→ Worker 3: Scene 3
   └─→ Worker N: Scene N
        │
        ↓
7. Scene Rendering (Each Worker)
   │
   ├─→ Fetch Character Images
   ├─→ Generate Voice/Audio
   ├─→ Apply Animations
   ├─→ Render Video Segment
   └─→ Upload to Storage
        │
        ↓
8. Final Video Assembly
   │
   ├─→ Collect All Scenes
   ├─→ Stitch Together
   ├─→ Add Transitions
   ├─→ Encode Video
   └─→ Upload Final Video
        │
        ↓
9. Completion
   │
   ├─→ Update Project Status
   ├─→ Send Notification
   ├─→ Update Credits
   └─→ User Downloads/Streams
```

## State Machine: Project Status

```
┌────────┐
│ START  │
└───┬────┘
    │
    ↓
┌───────┐
│ draft │ ←──────────────────┐
└───┬───┘                    │
    │                        │
    │ User: Submit Render    │ User: Edit
    ↓                        │
┌──────────┐                 │
│processing│─────────────────┘
└────┬─────┘
     │
     ├───→ Success ───→ ┌──────────┐
     │                  │completed │
     │                  └──────────┘
     │
     └───→ Error ─────→ ┌──────┐
                        │failed│
                        └──────┘
```

## Render Job State Machine

```
┌────────┐
│ queued │
└───┬────┘
    │
    ↓
┌─────────┐
│ running │
└────┬────┘
     │
     ├───→ Success ───→ ┌─────────┐
     │                  │ success │
     │                  └─────────┘
     │
     └───→ Error ─────→ ┌────────┐
                        │ failed │
                        └────────┘
```

## Authentication Flow

```
User                Frontend            Backend              Database
 │                     │                   │                    │
 │  Enter Credentials  │                   │                    │
 ├────────────────────>│                   │                    │
 │                     │  POST /login      │                    │
 │                     ├──────────────────>│                    │
 │                     │                   │  Query User        │
 │                     │                   ├───────────────────>│
 │                     │                   │  User Data         │
 │                     │                   │<───────────────────┤
 │                     │                   │                    │
 │                     │                   │  Verify Password   │
 │                     │                   │  (bcrypt compare)  │
 │                     │                   │                    │
 │                     │                   │  Generate JWT      │
 │                     │                   │                    │
 │                     │  JWT Token        │                    │
 │                     │<──────────────────┤                    │
 │  Token Stored       │                   │                    │
 │<────────────────────┤                   │                    │
 │                     │                   │                    │
 │  Subsequent Requests with Token         │                    │
 ├────────────────────>├──────────────────>│                    │
 │                     │  Header:          │                    │
 │                     │  Authorization:   │  Verify JWT        │
 │                     │  Bearer <token>   │                    │
 │                     │                   │                    │
```

## Credit System Flow

```
┌──────────────┐
│ User Signs Up│
└──────┬───────┘
       │
       ↓
┌──────────────────┐
│ Award 100 Credits│
└──────┬───────────┘
       │
       ↓
┌──────────────────────┐
│ User Creates Project │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────────┐
│ Estimate Credit Cost:    │
│ • Character Gen: 10 each │
│ • Scene Render: 20 each  │
│ • Final Video: 50        │
└──────┬───────────────────┘
       │
       ↓
┌──────────────────┐      ┌─────────────────┐
│ Check Balance    │─────>│ Insufficient?   │
└──────┬───────────┘      │ Prompt Purchase │
       │                  └─────────────────┘
       │ Sufficient
       ↓
┌──────────────────┐
│ Deduct Credits   │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│ Create Billing   │
│ Record           │
└──────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────┐
│           Presentation Layer                 │
│                                              │
│  React + TypeScript + Tailwind CSS          │
│  • Components  • Pages  • Routing           │
│  • State (Zustand)  • API Client (Axios)    │
└──────────────────┬──────────────────────────┘
                   │ REST API (JSON)
┌──────────────────┴──────────────────────────┐
│           Application Layer                  │
│                                              │
│  Node.js + Express + TypeScript             │
│  • Controllers  • Routes  • Middleware      │
│  • Validators   • Services                  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────┴──────────────────────────┐
│           Business Logic Layer               │
│                                              │
│  • AI Character Service                     │
│  • AI Scene Service                         │
│  • Render Service                           │
│  • Queue Service (BullMQ)                   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────┴──────────────────────────┐
│           Data Layer                         │
│                                              │
│  PostgreSQL + Prisma ORM                    │
│  • Users  • Projects  • Characters          │
│  • Scenes • RenderJobs • Billing            │
└──────────────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────┐
│           Infrastructure Layer               │
│                                              │
│  • Redis (Queue/Cache)                      │
│  • AWS S3 (Asset Storage)                   │
│  • CDN (Content Delivery)                   │
│  • SMTP (Email)                             │
└──────────────────────────────────────────────┘
```

## Deployment Architecture (Production)

```
                    ┌──────────────┐
                    │   Users      │
                    └──────┬───────┘
                           │
                           ↓
                    ┌──────────────┐
                    │ Load Balancer│
                    │  (AWS ALB)   │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ↓              ↓              ↓
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │Frontend  │   │Frontend  │   │Frontend  │
    │Instance 1│   │Instance 2│   │Instance 3│
    │(CloudFront)  │          │   │          │
    └──────────┘   └──────────┘   └──────────┘
                           │
                           ↓
                    ┌──────────────┐
                    │API Gateway   │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ↓              ↓              ↓
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │Backend   │   │Backend   │   │Backend   │
    │Instance 1│   │Instance 2│   │Instance 3│
    │(ECS/K8s) │   │          │   │          │
    └──────────┘   └──────────┘   └──────────┘
            │              │              │
            └──────────────┼──────────────┘
                           │
            ┌──────────────┴──────────────┐
            │              │              │
            ↓              ↓              ↓
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │PostgreSQL│   │  Redis   │   │   S3     │
    │  (RDS)   │   │(ElastiC) │   │ Bucket   │
    └──────────┘   └──────────┘   └──────────┘
```

---

## Legend

- `│` : Connection/Flow
- `├─→` : Branch/Multiple paths
- `┌─┐` : Component/Service boundary
- `<` : One-to-many relationship
- `>` : Many-to-one relationship
- `↔` : Many-to-many relationship
- `N` : Many
- `1` : One

---

These diagrams provide a comprehensive visual overview of the AI-Studio platform architecture, data relationships, and workflows.
