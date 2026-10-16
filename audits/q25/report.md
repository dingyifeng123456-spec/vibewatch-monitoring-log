# Receipt Relay Q25: independent on-chain audit

Audit by dingyifeng123456-spec. Prepared with an AI coding agent on 2026-10-16. This is original work derived from public BSC JSON-RPC responses, not a review of other entrants' answers. Network: BNB Smart Chain mainnet, chain ID 56.

## Findings

Both buyback receipts match the chain for the buy amount, FLAPJAX received, recipient, and the stated post-buy treasury balances. The spot price in WBNB per FLAPJAX rose by +0.303418789107% on October 12 and +0.302959171845% on October 13. These are pool spot-price changes, not execution slippage or a USD return.

There were no direct FLAPJAX Transfer events from the treasury to the named pool during October 11–13 UTC. The complete scan covers 574,988 blocks and contains 48 treasury outgoing transfers to other addresses.

The October 12 original non-buy expense line is incomplete; the author subsequently corrected it. October 13's displayed aggregate is short of the exact net balance residual by 0.000001196712783217 BNB. The residual is a net movement, not an independently itemized gross expense ledger.

## Scope and contracts

| Item | Value |
| --- | --- |
| Treasury and expected recipient | 0x7c34e9e21ee28a49ff0b84b61774119e6633359f |
| FLAPJAX, 18 decimals | 0x90c8889f428f9ebb77bb8f15cad3a50a9ac680df |
| PancakeSwap V3 pool | 0xca93ec685b8623688e6b236f9068034b298c2150 |
| token0 | FLAPJAX |
| token1 | WBNB: 0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c |
| WBNB decimals | 18 |
| fee() | 10000, or 1% |
| Scan interval | [2026-10-11 00:00:00 UTC, 2026-10-14 00:00:00 UTC) |

The requested dates are interpreted as complete UTC calendar days, inclusive through October 13. No key, wallet connection, token purchase, payment or signed transaction was needed for this audit.

## Buy receipts, checked field by field

### 2026-10-12

Transaction: [0x9afdc96e3ca876b5b617a26ba5105012ed8c33e805c77b1616bf48c198d5cbf1](https://bscscan.com/tx/0x9afdc96e3ca876b5b617a26ba5105012ed8c33e805c77b1616bf48c198d5cbf1)

| Field | Published receipt or task expectation | On-chain result | Verdict |
| --- | --- | --- | --- |
| Transaction hash | 0x9afdc96e3ca876b5b617a26ba5105012ed8c33e805c77b1616bf48c198d5cbf1 | Same transaction; successful receipt | MATCH |
| Buy block | Not printed in receipt | 127261246, block hash 0x18629c7bb92bc012b49d3663ff148d10cb75928f00c79909741e27fe1124ddc5 | NOT STATED; independently derived |
| Timestamp | 2026-10-12 receipt | 2026-10-12T18:46:27.000Z | MATCH on date |
| Native BNB spent on buy | 0.01 BNB | tx.value = 10000000000000000 wei = 0.01 BNB; pool Swap amount1 = +10000000000000000 WBNB atomic units | MATCH |
| FLAPJAX received | 23834879.521763892137228328 | Transfer log index 40: 23834879521763892137228328 atomic units | MATCH |
| Sender of FLAPJAX | Named pool | 0xca93ec685b8623688e6b236f9068034b298c2150 | MATCH |
| Recipient | Expected treasury | 0x7c34e9e21ee28a49ff0b84b61774119e6633359f | MATCH |
| Pool and fee | FLAPJAX/WBNB, 1% | Pool 0xca93ec685b8623688e6b236f9068034b298c2150; token0/1 and fee() agree | MATCH |
| Treasury BNB after buy | 0.132607152559380905 | Historical eth_getBalance at end of block 127261246: 0.132607152559380905 BNB | MATCH |
| Treasury FLAPJAX after buy | 255542177.328574524113562675 | Historical balanceOf at end of block 127261246: 255542177.328574524113562675 FLAPJAX | MATCH |
| Gas for buy transaction | Not stated | 127528 gas × 50000000 wei = 0.000006376400000000 BNB | NOT STATED; separate from buy amount |
| slot0 before and after / impact | Not printed in receipt | See price calculation below | NOT STATED; independently derived |

The token Transfer amount agrees exactly with -Swap.amount0 = 23834879521763892137228328. Swap log index: 43. Both tx.from and the recipient are the treasury; the transaction calls PancakeSwap's router at 0x1b81d678ffb9c0263b24a97847620c99d213eb14.

| Historical read | Block | sqrtPriceX96 | Tick | WBNB per FLAPJAX | FLAPJAX per WBNB |
| --- | --- | --- | --- | --- | --- |
| Before, end of prior block | 127261245 | 1613473238700077591767816 | -216045 | 0.000000000414728962783164 | 2411213321.802262438 |
| After, end of buy block | 127261246 | 1615919175229289091042512 | -216015 | 0.000000000415987328380118 | 2403919378.732199447 |

Price impact in WBNB/FLAPJAX: **+0.303418789107%**. The reciprocal quote changes by **-0.302500944405%**. Each buy block has exactly one Swap event from this pool, with the transaction hash above; end-of-block slot0 equals its Swap.sqrtPriceX96.

### 2026-10-13

Transaction: [0xc94de373d1fb00093431224a97475b3b2b48b9a4962d15acbe9d9c5c016d720c](https://bscscan.com/tx/0xc94de373d1fb00093431224a97475b3b2b48b9a4962d15acbe9d9c5c016d720c)

| Field | Published receipt or task expectation | On-chain result | Verdict |
| --- | --- | --- | --- |
| Transaction hash | 0xc94de373d1fb00093431224a97475b3b2b48b9a4962d15acbe9d9c5c016d720c | Same transaction; successful receipt | MATCH |
| Buy block | Not printed in receipt | 127452454, block hash 0x8995e9971da031a01e5775292aad4d61598cdbe504fd9e2a36c765516e51f936 | NOT STATED; independently derived |
| Timestamp | 2026-10-13 receipt | 2026-10-13T18:41:15.000Z | MATCH on date |
| Native BNB spent on buy | 0.01 BNB | tx.value = 10000000000000000 wei = 0.01 BNB; pool Swap amount1 = +10000000000000000 WBNB atomic units | MATCH |
| FLAPJAX received | 23762833.230024087278551319 | Transfer log index 256: 23762833230024087278551319 atomic units | MATCH |
| Sender of FLAPJAX | Named pool | 0xca93ec685b8623688e6b236f9068034b298c2150 | MATCH |
| Recipient | Expected treasury | 0x7c34e9e21ee28a49ff0b84b61774119e6633359f | MATCH |
| Pool and fee | FLAPJAX/WBNB, 1% | Pool 0xca93ec685b8623688e6b236f9068034b298c2150; token0/1 and fee() agree | MATCH |
| Treasury BNB after buy | 0.118264579546597688 | Historical eth_getBalance at end of block 127452454: 0.118264579546597688 BNB | MATCH |
| Treasury FLAPJAX after buy | 274255010.558598611392113994 | Historical balanceOf at end of block 127452454: 274255010.558598611392113994 FLAPJAX | MATCH |
| Gas for buy transaction | Not stated | 127526 gas × 50000000 wei = 0.000006376300000000 BNB | NOT STATED; separate from buy amount |
| slot0 before and after / impact | Not printed in receipt | See price calculation below | NOT STATED; independently derived |

The token Transfer amount agrees exactly with -Swap.amount0 = 23762833230024087278551319. Swap log index: 259. Both tx.from and the recipient are the treasury; the transaction calls PancakeSwap's router at 0x1b81d678ffb9c0263b24a97847620c99d213eb14.

| Historical read | Block | sqrtPriceX96 | Tick | WBNB per FLAPJAX | FLAPJAX per WBNB |
| --- | --- | --- | --- | --- | --- |
| Before, end of prior block | 127452453 | 1615919175229289091042512 | -216015 | 0.000000000415987328380118 | 2403919378.732199447 |
| After, end of buy block | 127452454 | 1618365111758500590317208 | -215985 | 0.000000000417247600145159 | 2396658482.043045802 |

Price impact in WBNB/FLAPJAX: **+0.302959171845%**. The reciprocal quote changes by **-0.302044101537%**. Each buy block has exactly one Swap event from this pool, with the transaction hash above; end-of-block slot0 equals its Swap.sqrtPriceX96.

## Price formula and precision

With token0 = FLAPJAX and token1 = WBNB, both with 18 decimals:

```text
P(WBNB per FLAPJAX) = sqrtPriceX96^2 / 2^192 × 10^(18 - 18)
impact_percent = 100 × (P_after / P_before - 1)
               = 100 × (sqrt_after^2 - sqrt_before^2) / sqrt_before^2
P(FLAPJAX per WBNB) = 1 / P(WBNB per FLAPJAX)
```

All arithmetic uses integers and rational division until final display rounding. WBNB/FLAPJAX prices are rounded to 24 decimal places, reciprocal prices to 9, percentages to 12. No floating-point conversion of token amounts is used. Price impact here does not include transaction gas; the swap fee is already reflected in the pool's price movement.

Historical slot0 was read using eth_call with selector 0x3850c7bd at the explicit prior and buy block tags. Both Blast and Pocket returned the same four sqrtPriceX96 values. The Swap log provides a third consistency check for each after value. Metadata reads identify token order; they are not an assumption based on the name of the pair.

## Treasury-to-pool check

The first block with timestamp at or after 2026-10-11 00:00:00 UTC is 126919958; the first at or after 2026-10-14 00:00:00 UTC is 127494946. The inclusive scan range is **126919958–127494945**. Four boundary block headers are included in sell-scan.json so the UTC cutoffs can be checked.

Queried 112 contiguous, non-overlapping successful ranges using eth_getLogs, filtering token = 0x90c8889f428f9ebb77bb8f15cad3a50a9ac680df, Transfer topic and from = treasury. The destination was deliberately left unrestricted to capture positive outgoing records, not merely an empty destination-filtered response. Across 48 returned events, **0 have to = 0xca93ec685b8623688e6b236f9068034b298c2150**. The known pool-to-treasury buys were also returned as positive controls, one event in each buy block.

Verdict against the buy-only statement for the requested interval: **MATCH for absence of direct treasury-to-this-pool FLAPJAX transfers**. This is not proof that no intermediary sold, that no other pool was used, or that every transfer to another address has a known economic purpose. A direct treasury-to-pool Transfer would itself be a transfer signal, not sufficient evidence of a sale without a corresponding swap.

Downloads include every outgoing transfer in [outgoing-transfers.csv](outgoing-transfers.csv), complete raw log responses, and all scan ranges. Public RPC range limits caused failed large queries during discovery; the final verified scan has no gaps and counts only successful ranges.

## Non-buy BNB reconciliation

These are **end-of-block net balance residuals**, excluding the current buy value and its gas. They should not be mistaken for a complete classification of gross outgoing transactions. The exact formula is:

```text
R = previous_receipt_block_BNB_balance - current_receipt_block_BNB_balance
    - current_buy_tx.value - current_buy_receipt.gasUsed × effectiveGasPrice
```

| Date | Prior baseline block / BNB | Current buy-block BNB | Buy BNB | Buy gas BNB | Exact R |
| --- | --- | --- | --- | --- | --- |
| Oct 12 | 127067713 / 0.144640083559380905 | 0.132607152559380905 | 0.01 | 0.000006376400000000 | 0.002026554600000000 |
| Oct 13 | 127261246 / 0.132607152559380905 | 0.118264579546597688 | 0.01 | 0.000006376300000000 | 0.004336196712783217 |

| Statement compared | Published numeric content | On-chain net residual comparison | Verdict |
| --- | --- | --- | --- |
| Oct 12 original expense line | 0.000025 BNB fees | R = 0.002026554600000000; omitted difference 0.002001554600000000 | MISMATCH; superseded by author's correction |
| Oct 12 later correction, comment 9e222986-f924-4582-ab47-6954ac8fcefb | 0.002 BNB gas grant plus exact fees 0.0000265546 BNB | Sum = 0.002026554600000000, exactly R | MATCH for corrected total; categories are the author's explanation |
| Oct 13 displayed expense sum | 0.004297 BNB bounty funding + 0.000038 BNB fees = 0.004335 | R = 0.004336196712783217; difference 0.000001196712783217 | MISMATCH at exact precision; displayed aggregate does not fully reconcile |

The Oct 12 correction is acknowledged rather than presented as an undisclosed discovery. Its shortened fee display (0.000026) is rounded; the correction separately gives the exact 0.0000265546. For Oct 13, this audit does not independently allocate the residual among bounty funding, fees, incoming transfers or other transaction categories. The positive residual gap is reported without assigning an unsupported cause. The buy amounts and post-buy balances remain MATCH.

The preceding Oct 11 baseline is the receipt transaction [0x82d01172ae26f1c86287643e123af1675ca5c18b984b7740c1a0c1647d2801eb](https://bscscan.com/tx/0x82d01172ae26f1c86287643e123af1675ca5c18b984b7740c1a0c1647d2801eb) at block 127067713. Baselines are balances after the entire named block, not an assumption that a source's rounded balance is exact.

## Reproduce and evidence

Download [the complete evidence package](q25-audit.zip). It contains this report, original JSON-RPC request/response records, calculations, all outgoing logs, and a dependency-free Node.js verifier. Run:

```powershell
node verify.cjs
node verify.cjs --live
```

The first command checks saved raw data, contiguous scan coverage, boundaries, token amounts, swap correspondence, two-provider historical prices and arithmetic offline. The second additionally replays successful public RPC reads; public endpoint rate limits or retention may change. It performs no signing or writes. If a live replay fails, inspect the specific provider response; do not infer that a failed read disproves the saved evidence.

Primary free RPCs used: https://bsc-dataseed.bnbchain.org (transactions and receipts), https://bsc-mainnet.public.blastapi.io (archive calls and balances), https://bsc.api.pocket.network (complete logs and independent archive calls). Request records identify the exact provider and observation time. Responses are public-node observations, not a cryptographic execution proof or independent full-node validation.

Transfer topic: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef. Pool Swap topic: 0x19b47279256b2a23a1665c810c8d55a1758940ee09377d4f8d26497a3577dc83. The latter decodes Swap(address,address,int256,int256,uint160,uint128,int24,uint128,uint128). balanceOf selector: 0x70a08231 followed by the treasury address padded to 32 bytes.

Files: [report.md](report.md), [audit-data.json](audit-data.json), [verification.json](verification.json), [treasury-history.json](treasury-history.json), [sell-scan.json](sell-scan.json), [rpc-evidence.json](rpc-evidence.json), [crosscheck-rpc.json](crosscheck-rpc.json), [verify.cjs](verify.cjs), [SHA256SUMS.txt](SHA256SUMS.txt).

## Primary source references

- [Taskmarket Q25 brief](https://taskmarket.dev/tasks/0x793a98b5c8976218c5815ebd1110ce0006a97a41a4985deb3e6303f085530e2f)
- [Buyback thread](https://www.thecolony.ai/post/28acbdea-449b-4717-9517-6619a94247c8)
- [Public comments API containing both original receipts and the later correction](https://www.thecolony.ai/api/v1/posts/28acbdea-449b-4717-9517-6619a94247c8/comments?limit=100)
- [Original Q25 specification](https://www.thecolony.ai/post/3862698e-0448-44da-9c3c-916c589bdc62)

Receipt IDs: Oct 12 9f6ccf0a-7ed3-4647-8acb-2a7d853dc8da; Oct 13 80547a29-df3e-449b-81e4-9d9cb05180f9. Read times are recorded in the JSON files. The source text was used to extract factual claims; the on-chain figures above were independently decoded from transactions, receipts, block headers and historical contract reads.
