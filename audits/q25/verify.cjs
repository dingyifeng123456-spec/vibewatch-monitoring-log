// Read-only audit verification. Node.js 20+; no dependencies, keys or payments.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=__dirname,read=n=>JSON.parse(fs.readFileSync(path.join(dir,n),'utf8'));
const data=read('audit-data.json'),scan=read('sell-scan.json'),history=read('treasury-history.json');
const evidence=read('rpc-evidence.json'),cross=read('crosscheck-rpc.json');
const hex=n=>'0x'+BigInt(n).toString(16),word=(s,n=0)=>BigInt('0x'+s.slice(2+64*n,2+64*(n+1)));
const address=t=>'0x'+t.slice(-40).toLowerCase();
const transfer='0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
function result(method,params){const e=evidence.find(e=>e.request.method===method&&JSON.stringify(e.request.params)===JSON.stringify(params)&&e.response.result!==undefined);assert(e,`Missing raw ${method}`);return e.response.result;}
function fixed(n,d,places=18){const neg=n<0n;n=neg?-n:n;const q=(n*10n**BigInt(places)+d/2n)/d;return (neg?'-':'')+q/10n**BigInt(places)+'.'+(q%10n**BigInt(places)).toString().padStart(places,'0');}
function main(){
 assert.equal(result('eth_chainId',[]),'0x38');assert.equal(cross[0].response.result,'0x38');
 assert.equal(address(data.poolMetadata.token0),data.token);assert.equal(address(data.poolMetadata.token1),'0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c');assert.equal(BigInt(data.poolMetadata.fee),10000n);
 const calculations=[];
 for(const b of data.buys){
  const tx=result('eth_getTransactionByHash',[b.hash]),receipt=result('eth_getTransactionReceipt',[b.hash]);
  assert.equal(tx.from.toLowerCase(),data.treasury);assert.equal(BigInt(tx.value),10n**16n);assert.equal(receipt.status,'0x1');assert.equal(Number(BigInt(receipt.blockNumber)),b.block);assert.equal(receipt.blockHash,b.blockHash);
  const logs=receipt.logs.filter(l=>l.address.toLowerCase()===data.token&&l.topics[0]===transfer&&address(l.topics[1])===data.pool&&address(l.topics[2])===data.treasury);
  assert.equal(logs.length,1);assert.equal(BigInt(logs[0].data).toString(),b.transfers[0].amountAtomic);
  const h=b.historical.filter(v=>v.slot0);assert.equal(h.length,2);const before=BigInt(h[0].sqrtPriceX96),after=BigInt(h[1].sqrtPriceX96);
  assert.equal(after.toString(),b.swap.sqrtPriceX96);assert.equal(-BigInt(b.swap.amount0),BigInt(logs[0].data));assert.equal(BigInt(b.swap.amount1),BigInt(tx.value));
  for(const v of h){assert.equal(word(result('eth_call',[{to:data.pool,data:'0x3850c7bd'},hex(v.block)])).toString(),v.sqrtPriceX96);const c=cross.find(e=>e.request.method==='eth_call'&&e.request.params[1]===hex(v.block));assert(c&&!c.response.error);assert.equal(word(c.response.result).toString(),v.sqrtPriceX96);}
  const swaps=cross.find(e=>e.request.method==='eth_getLogs'&&e.request.params[0].fromBlock===hex(b.block));assert.equal(swaps.response.result.length,1);assert.equal(swaps.response.result[0].transactionHash,b.hash);
  const a=before*before,z=after*after,q=2n**192n;
  calculations.push({date:b.date,priceBeforeWbnbPerFlapjax:fixed(a,q,24),priceAfterWbnbPerFlapjax:fixed(z,q,24),priceBeforeFlapjaxPerWbnb:fixed(q,a,9),priceAfterFlapjaxPerWbnb:fixed(q,z,9),priceImpactPercent:fixed((z-a)*100n,a,12),inversePriceChangePercent:fixed((a-z)*100n,z,12),gasBnb:fixed(BigInt(b.gasUsed)*BigInt(b.gasPriceWei),10n**18n,18),netNonBuyOutflowBnb:fixed(BigInt(history[calculations.length].balanceWei)-BigInt(history[calculations.length+1].balanceWei)-10n**16n-BigInt(b.gasUsed)*BigInt(b.gasPriceWei),10n**18n,18)});
 }
 assert.equal(scan.complete,true);let next=scan.window.startBlock;const unique=new Set();
 const scannedLogs=[];
 for(const s of scan.logScans){assert.equal(s.fromBlock,next);next=s.toBlock+1;const f={address:data.token,fromBlock:hex(s.fromBlock),toBlock:hex(s.toBlock),topics:[transfer,'0x'+data.treasury.slice(2).padStart(64,'0')]};const raw=result('eth_getLogs',[f]);assert.equal(raw.length,s.count);scannedLogs.push(...raw);}
 assert.deepEqual(scannedLogs,scan.logs);
 assert.equal(next,scan.window.endBlock+1);
 for(const l of scan.logs){assert.equal(l.address.toLowerCase(),data.token);assert.equal(address(l.topics[1]),data.treasury);assert(Number(BigInt(l.blockNumber))>=scan.window.startBlock&&Number(BigInt(l.blockNumber))<=scan.window.endBlock);assert(!unique.has(l.transactionHash+':'+l.logIndex));unique.add(l.transactionHash+':'+l.logIndex);}
 assert.equal(scan.logs.filter(l=>address(l.topics[2])===data.pool).length,0);
 for(const c of scan.positiveControls){assert.equal(c.logs.length,1);assert.equal(c.logs[0].transactionHash,c.hash);}
 const ts=scan.window.boundaryBlocks.map(b=>Number(BigInt(b.timestamp))),start=Date.parse(scan.window.start)/1000,end=Date.parse(scan.window.endExclusive)/1000;assert(ts[0]<start&&ts[1]>=start&&ts[2]<end&&ts[3]>=end);
 return {verified:true,buys:2,archiveProviders:2,scannedBlocks:scan.window.endBlock-scan.window.startBlock+1,scanChunks:scan.logScans.length,outgoingTransfers:scan.logs.length,directTreasuryToPool:0,calculations};
}
async function live(){
 const selected=evidence.filter(e=>e.response.result!==undefined&&['eth_chainId','eth_getTransactionByHash','eth_getTransactionReceipt','eth_call','eth_getBalance'].includes(e.request.method));
 const seen=new Set();let count=0;
 for(const e of selected){const key=JSON.stringify([e.request.method,e.request.params]);if(seen.has(key))continue;seen.add(key);await replay(e);count++;}
 // Replay exactly the successful contiguous log ranges, not failed large ranges.
 for(const s of scan.logScans){const params=[{address:data.token,fromBlock:hex(s.fromBlock),toBlock:hex(s.toBlock),topics:[transfer,'0x'+data.treasury.slice(2).padStart(64,'0')]}];await replay(evidence.find(e=>e.request.method==='eth_getLogs'&&JSON.stringify(e.request.params)===JSON.stringify(params)&&e.response.result!==undefined));count++;}
 console.log(JSON.stringify({liveRequestsVerified:count}));
}
async function replay(e){await new Promise(r=>setTimeout(r,500));let last;for(let attempt=0;attempt<4;attempt++){try{const response=await(await fetch(e.url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(e.request),signal:AbortSignal.timeout(30000)})).json();if(response.error)throw Error(JSON.stringify(response.error));if(e.request.method==='eth_getLogs'){const compact=a=>a.map(l=>[l.blockHash,l.transactionHash,l.logIndex,l.address.toLowerCase(),l.topics,l.data]);assert.deepEqual(compact(response.result),compact(e.response.result));}else assert.deepEqual(response.result,e.response.result);return;}catch(error){last=error;await new Promise(r=>setTimeout(r,1000*(attempt+1)));}}throw last;}
if(require.main===module){try{console.log(JSON.stringify(main(),null,2));if(process.argv.includes('--live'))live().catch(e=>{console.error(e.message);process.exitCode=1;});}catch(e){console.error(e.stack);process.exitCode=1;}}
module.exports={main,fixed};
