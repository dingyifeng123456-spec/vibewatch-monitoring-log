const { createRequire } = require('node:module');
const { join } = require('node:path');
const fromCheckout = createRequire(join(process.cwd(), 'package.json'));
const { Cl, cvToString, deserializeCV, serializeCV } = fromCheckout('@stacks/transactions');
const host = 'https://api.hiro.so';
const dao = 'SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH';
const mia1 = 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27.miamicoin-token';
const mia2 = 'SP1H1733V5MZ3SZ9XRW9FKYGEZT0JDGEB8Y634C7R.miamicoin-token-v2';
const mining = dao + '.ccd002-treasury-mia-mining-v3';
const staking = 'SPN4Y5QPGQA8882ZXW90ADC2DHYXMSTN8VAR8C3X.ccd014-pox5-staking-mia';
const sbtc = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token';
async function query(path, body) {
 const r = await fetch(host+path,{method:body===undefined?'GET':'POST',headers:body===undefined?{}:{'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
 const v = await r.json();
 if (!r.ok || v.okay===false) throw Error(path+' '+r.status+' '+JSON.stringify(v).slice(0,250));
 return v;
}
function uint(text) {
 const m = text.match(/^\(ok u([0-9]+)\)$/);
 if (!m) throw Error('Unexpected supply response '+text);
 return BigInt(m[1]);
}
(async () => {
 const b = {height:9424116,burn_block_height:974763,block_time:1793943033,index_block_hash:'0xb5f33ac5b45eeeb8cf9771dd78b3a20173152ebaa40e5de4d743868cf00b5651'};
 const tip = b.index_block_hash;
 const at = '?tip='+encodeURIComponent(tip);
 async function call(contract, fn, args=[]) {
   const [owner, name] = contract.split('.');
   const result=await query('/v2/contracts/call-read/'+owner+'/'+name+'/'+fn+at,{sender:dao,arguments:args.map(v=>'0x'+serializeCV(v).replace(/^0x/,''))});
   return cvToString(deserializeCV(result.result));
 }
 const account = p=>query('/v2/accounts/'+p+at+'&proof=0');
 const [mine, pool, v1, v2, active, required, allowed, sunset] = await Promise.all([
  account(mining), account(staking), call(mia1,'get-total-supply'),call(mia2,'get-total-supply'),
  call(dao+'.base-dao','is-extension',[Cl.principal(dao+'.ccd001-direct-execute')]),call(dao+'.ccd001-direct-execute','get-signals-required'),
  call(dao+'.ccd002-treasury-mia-rewards-v3','is-allowed',[Cl.principal(sbtc)]),
  query('/v2/data_var/'+dao+'/ccd001-direct-execute/sunsetBlock'+at+'&proof=0'),
 ]);
 const balance = a=>({unlockedMicroStx:BigInt(a.balance).toString(),lockedMicroStx:BigInt(a.locked).toString()});
 const backing = BigInt(mine.balance)+BigInt(mine.locked)+BigInt(pool.balance)+BigInt(pool.locked);
 const supply = uint(v1)*1000000n+uint(v2);
 const par = backing*100000000n/supply;
 const output={provider:host,height:b.height,burnHeight:b.burn_block_height,indexBlockHash:tip,time:new Date(b.block_time*1000).toISOString(),
 mining:{principal:mining,...balance(mine)},staking:{principal:staking,...balance(pool)},miaV1Whole:uint(v1).toString(),miaV2Micro:uint(v2).toString(),
 totalBackingMicroStx:backing.toString(),totalSupplyMicroMia:supply.toString(),parScaled:par.toString(),microStxPerMillionMia:(10000n*par).toString(),
 directExecuteEnabled:active,signalsRequired:required,sbtcAllowedBeforeActivation:allowed,sunsetRaw:cvToString(deserializeCV(sunset.data))};
 console.log(JSON.stringify(output, null, 2));
})().catch(e=>{console.error(e.message);process.exitCode=1});
