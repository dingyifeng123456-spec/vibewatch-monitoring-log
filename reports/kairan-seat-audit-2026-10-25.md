# Independent review — Kairan's Seat v2 (2026-10-25)

## Scope and limits

Reviewed `contracts/charity/kairan-seat-lab-ocifarsito-v2.clar` at repository commit `a0761dab03e62ae062ee70ec648fe0a720a1b4b0` (master at review time), plus the matching unit-test and mainnet-fork harness source. This was a source-level review only: I did not execute Clarinet/stxer, deploy, or send transactions. The repository describes its existing suite as 15/15 and the fork harness as 842/842; those results are not independently reproduced here.

## Result

I found **no additional reproducible vulnerability** beyond issues already present in the bounty's public submissions. I am not claiming the contract is bug-free or ready to deploy.

## Independent checks

- **Value destinations:** the only contract outflows are in `pay` and `refund-one`. `release-seat`/ `claim-reserve` pass the fixed `LAB` principal to `pay`; `refund-one` pays the map key `who`. I found no caller-controlled third-party destination.
- **Authorization:** `deposit-reserve`, `request-seat`, `release-seat`, and `claim-reserve` check `contract-caller` against their respective fixed principal. I found no proxy/contract-caller bypass in these paths.
- **Donation/refund accounting:** `donate` rejects zero and amounts above `TARGET - total`, books the donor and liability, then calls the token transfer; a failed public call rolls back state. `refund-many` zeroes each positive gift and reduces `unrefunded` by the amount actually paid. Duplicate addresses therefore do not yield a second refund. The fold is bounded by 100 addresses; a reverting transfer reverts that call atomically, so a keeper can retry smaller batches/omit the failing address rather than relying on one batch.
- **Lifecycle boundaries:** the seat path uses `height < failure-at`; refund and reserve-claim paths use `height >= failure-at`. These are disjoint at the boundary. Before the target, `failure-at = DEADLINE`; after reaching it, `failure-at = reached-at + SEAT_WINDOW`.
- **Known, non-novel concern:** `deposit-reserve` is one-shot and gated by `check-raising` (`height < DEADLINE`), while `release-seat` does not require `reserve-deposited`. Thus a seat release or reserve claim before the fundraiser deposit can permanently prevent the promised reserve from being deposited; late target completion can also leave the seat window open after reserve deposits have closed. This is already reported in multiple bounty submissions, so I do not present it as a new finding.
- **Other previously reported concerns** include request replacement before owner release, direct transfers after a claim remaining stuck, and USDCx-balance shortfall arithmetic. I did not claim these as new discoveries.

## Recommendation

Do not treat this review as deployment approval. Resolve or explicitly accept the already reported reserve/deposit and receipt-review concerns, then rerun the project tests against the exact deployment source and token contracts.
