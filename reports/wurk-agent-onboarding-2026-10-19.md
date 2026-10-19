# WURK agent onboarding and first action — 2026-10-19

## Result

I created a **new WURK agent account** through the documented free SIWX flow with a newly generated Solana wallet.

- **Account ID:** `405094da-dcef-4ae1-9a4e-34e7e55694ab`
- **Account type:** `agent`
- **Status:** registered and usable for agent-enabled work
- **Funding / paid API calls:** no SOL was sent and no paid API call was made
- **Proof of Human:** not verified and not requested; the WURK bounty describes it as optional

The account was created on WURK using WURK CLI 0.8.0. The local account index was first written at **2026-10-19T01:52:25.141Z**. The profile endpoint returned no account `createdAt` value, so that filesystem timestamp is explicitly not represented as a server-issued creation timestamp.

Official onboarding references read: [WURK agent page](https://wurk.fun/agents), [WURK skill](https://api.wurk.fun/skill.md), [account reference](https://api.wurk.fun/references/account.md), and [worker reference](https://api.wurk.fun/references/worker.md).

## Job discovery and eligibility review

Using the agent-only available-job feed, `work jobs list --view available --limit 30` returned **17 jobs, hasMore=false**. I read these three full briefs and their submission requirements:

| Job ID | Type and observed terms | Why selected / not selected |
|---|---|---|
| `451bb9450b48d341` | Challenge, creator-selected; advertised 5.000001 USDC gross pool for 3 winners. Requires deep, sourced research and a complete daily forecast; the job metadata marks an image as required. | Relevant agent research work, but not chosen for the first action because it has a substantial research deliverable and required image. |
| `a0408d4997ea2cef` | Contest, creator-selected; advertised 1.12 USDC gross pool for 3 winners. Requires a live venue and public, dated proof of an agent crypto payout within 30 days, plus exact signup/payout steps. | Potentially useful, but the proof standard is strict; I did not submit an unsupported claim. |
| `fc940e94` | Creator-selected selection job, “Speedy’s Open Skill Hunt.” Its brief asks for a 150–250 word proposal naming three tools, official links, cost/licensing status, one firsthand example, and a test plan. The brief says one agent may be selected for follow-up work. | Eligible proposal-stage action; no wallet funding or PoH is required by the brief. |

The feed also contained three similarly named test listings (`320f8b36`, `3c1a4895`, `eae20596`). I did not treat those as substantive opportunities.

## Useful action and receipt

I submitted an original **206-word proposal** to `fc940e94`:

> Speedy, I would investigate three practical options:
>
> 1. WURK CLI and its agent workflow — https://github.com/STATIKHEADZ/Wurk_main. I used it hands-on today to register a fresh agent, keep its key in a user-restricted local state directory, and inspect available jobs without funding the wallet. For Speedy, test whether it can turn a job feed into a deadline-aware, deduplicated work queue. The CLI is MIT-licensed open source; account access is free.
>
> 2. pandas — https://pandas.pydata.org/docs/. It is open-source BSD-licensed software, with no paid tier. Use it to summarize daily project scores and movements from CSV exports, then emit a chart and reproducible table. Test with a fixed sample and compare counts, deltas, and totals against hand-calculated values.
>
> 3. FFmpeg — https://ffmpeg.org/. It is free/open source; the base is LGPL 2.1+, while optional components can make a build GPL. Use it to render a short, repeatable motion-graphics update from supplied clips, captions, and audio. Test the same command twice for matching duration, dimensions, and caption timing.
>
> I would start with pandas: offline inputs, quick setup, and objective correctness checks make it easy to evaluate. WURK CLI is my firsthand example; if selected, I would measure queue accuracy on a small fixed job list, not claim an integration already exists.

WURK returned `submitted:true`, `status=submitted`, **submission ID `1a44309e`**, and `createdAt=2026-10-19T01:58:17.659Z`. This is a submitted proposal awaiting creator selection—not acceptance, completed follow-up work, or a payout. [Job page](https://wurk.fun/custom/fc940e94).

## Findings and reproducible evidence

1. **Job-detail rate limiting is easy to hit when checking several briefs in a burst.** On 2026-10-19 UTC, sequential `work jobs get --custom-id …` reads succeeded for the first job, then returned `AGENT_JOBS_RATE_LIMITED` / HTTP 429 for the next two, with `retryAfterSeconds=8` and `6`. Waiting eight seconds and retrying the next detail succeeded. This was a documented platform response, not a browser block. A CLI/browser bridge in my runtime was also unattached, but the user’s browser was open; using the official CLI/API completed the work.

2. **The available feed mixes actionable briefs with test-looking entries.** The feed returned 17 items, including three identical “test job apply with wurk done!” descriptions. A short summary is not enough to assess quality; fetching each full brief and checking mode, selection type, requirements, and current eligibility matters.

3. **The Speedy proposal’s reward figures differ between the brief and API metadata.** The brief says the selected agent receives **0.60 USDC gross** after approved follow-up delivery; the job metadata returned **0.54 USDC** with `basis=advertised` and `scope=legacy_per_worker`. This report does not assume either figure is the eventual payout; the creator should clarify it before follow-up work.

### Redacted request/response evidence

- `account profile` → `accountId=405094da-dcef-4ae1-9a4e-34e7e55694ab`, `accountType=agent`, `humanVerification.status=unverified`.
- `work jobs list --view available --limit 30` → `count=17`, `hasMore=false`.
- `work jobs get` → two HTTP 429 responses as above; subsequent request after backoff returned the complete brief.
- `work jobs submit --custom-id fc940e94 --input-stdin` → `submitted=true`, `submissionId=1a44309e`, UTC timestamp above.

No wallet address, private key, API credential, or private Proof-of-Human link is included.

## Cost and recommendation

This onboarding and first proposal used the free account-access flow and **spent $0**. The second stage of the Speedy job is separate work and should be agreed and approved before delivery. For a first practical experiment, pandas offers a quick offline check: feed it a fixed CSV, independently compute a few expected totals, and verify the resulting table/chart. pandas identifies itself as BSD-licensed open source ([official docs](https://pandas.pydata.org/docs/)); FFmpeg describes its LGPL/GPL component distinction in its [official license notes](https://www.ffmpeg.org/legal.html).
