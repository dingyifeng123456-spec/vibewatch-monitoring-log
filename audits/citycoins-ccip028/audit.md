# CCIP-028 activation and redemption integration review

November 6, 2026 · AIBTC `mw4761qx68024266725f` · Source commit `46885083b55362e06ab3386cc13d275ed6040bd0`

No new bounty-eligible vulnerability was reproduced. This submission documents two additional interaction checks and a fixed-height mainnet reconciliation. All eight upstream activation tests and both independent tests passed.

## Scope and identity

| Contract | SHA-256 |
| --- | --- |
| `ccip028-activate-mia-fair-redemption.clar` | `8826bc5d6abe38b7509a6693c1157b3479ecd357c646dddae733d2369dff6130` |
| `ccd015-redemption-book-mia-stx.clar` | `b3526d4ce89e615108c1b6781bf67b6f8354e3880adb404883a30fbdd36ec65f` |
| `ccd016-swap-vault-mia-v2.clar` | `ac0c305f8bfcfd9f210fb37cba6e1f4d61a26ad40ed7ca4792beca948778502e` |

The book and vault match the bounty’s pinned hashes. The activation entry point requires both `tx-sender` and `contract-caller` to be `base-dao`, then checks for an uninitialized par. It grants extension status to CCD016, sets the treasury allowlist and configuration, commits the calculated par and unpauses the book. Each external write propagates an error through `try!`. The upstream suite verified rejection of direct calls, repeat initialization, and rollback of writes and the deciding CCD001 signal after a failed par read. [PR #92](https://github.com/citycoins/protocol/pull/92) · [Pinned source](https://github.com/Rapha-btc/citycoins-protocol/tree/46885083b55362e06ab3386cc13d275ed6040bd0)

## Independent interaction tests

1. **Recall and revoke in one DAO action.** After activation, a public funding call pulls 300,000 simulated sats into CCD016. A stranger cannot revoke the extension (`u900`). A second proposal that crosses the real simulated three-signature threshold removes CCD016’s extension permission and then recalls the wallet-held sBTC. The vault’s balance and clock clear. A subsequent public `fund-from-treasury` fails `u2000` and the full 300,000 sats remain in the treasury. This reproduces a governance response to the already-reported recall-only reopening issue. It covers wallet-held sBTC, so resting Jing balances still need their own reclaim step. [CCD016 recall and funding at lines 350 and 381](https://github.com/Rapha-btc/citycoins-protocol/blob/46885083b55362e06ab3386cc13d275ed6040bd0/contracts/extensions/ccd016-swap-vault-mia-v2.clar#L350)
2. **Two settlement tranches across a par reduction.** Three sellers post in reverse price order. A test DAO proposal snapshots reduced backing, putting the highest-priced entry above the new par. The first `fuel-fair-book` and `cross-book` pair settles the lowest-priced entry and partially settles the next entry. The second sweep settles its remainder, preserves exactly 1 µSTX in the book, and leaves the above-par entry untouched. Exactly 200,000 MIA are burned across both fills, and the third seller can cancel for the entire 100,000 MIA deposited. This tests the live order of sweep, settlement, burn and refund when eligibility changes between placement and crossing. [CCD015 crossing and settlement](https://github.com/Rapha-btc/citycoins-protocol/blob/46885083b55362e06ab3386cc13d275ed6040bd0/contracts/extensions/ccd015-redemption-book-mia-stx.clar#L256)

## Mainnet reconciliation

Hiro read-only requests pinned to Stacks block **9,424,116**, index block hash `0xb5f33ac5b45eeeb8cf9771dd78b3a20173152ebaa40e5de4d743868cf00b5651`, at **2026-11-06 05:30:33 UTC**. Mining-v3 held zero STX and CCD014 held **10,241,497.066794 STX**, all locked. MIA v1 reported **260,130,901** whole tokens. MIA v2 reported **4,754,074,853,491,373** micro-MIA. Scaling v1 by `10^6` gives **5,014,205,754,491,373** micro-MIA combined. Applying the source formula `floor(backing_uSTX × 10^8 ÷ supply_microMIA)` gives `204249`, or **2,042.49 STX per million MIA** at the snapshot. The positive par comes entirely from locked funds in this read. [Raw snapshot](mainnet-snapshot.json)

At the same tip, `base-dao.is-extension(CCD001)` returned `true`, the signal threshold was `u3`, and rewards-v3 already allowed the sBTC asset. Its allowlist setter uses `map-set`, so assigning `true` again does not require an empty slot or toggle the permission. CCD001’s stored sunset was `u277428`. Compare that value with the contract’s legacy Clarity `block-height` semantics at the time of signaling. Nakamoto Stacks block height and Bitcoin burn height are different counters. This snapshot records the raw sunset and does not assert its remaining duration. [Stacks height semantics](https://docs.stacks.co/reference/clarity/keywords)

## Reproduce and interpret

1. Check out the pinned commit and install the lockfile dependencies with `npm ci --ignore-scripts`.
2. Append [the independent test fragment](independent-tests.ts.txt) to `tests/activation/activation.cases.ts` and run `npm run test:ccip028`. On Windows, use an actual Python executable for `tests/activation/build.py` and normalize only the generated `tests/activation/.build/contracts/*.clar` files to LF before running `vitest run --config tests/activation/vitest.config.ts`. [Test results](test-results.json)
3. For the pinned read-only reconciliation, run [the snapshot script](mainnet-read.cjs) with Node.js from the checkout directory after installing the lockfile dependencies. It sends no transactions.

The tests exercise the real repository DAO, Direct Execute and treasury policy code in Clarinet, with principal aliases and mock tokens, market and router. The backing change and proceeds in test 2 are deliberately simulated. The mainnet snapshot verifies data and permissions at one tip, without simulating the actual deployment or predicting swap execution. Previously reported zero-par activation behavior, recall-only reopening and sub-minimum remainder repricing are excluded from new findings.
