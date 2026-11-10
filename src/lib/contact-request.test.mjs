import assert from "node:assert/strict";
import test from "node:test";
import { handleContactRequest } from "./contact-request.ts";
import { parseContactInput } from "./contact.ts";

const envKeys=["BROKBUDDY_API_BASE_URL","BROKBUDDY_BROKER_PROFILE_SLUG","BROKBUDDY_BROKER_CODE"];
const previousEnv=Object.fromEntries(envKeys.map(key=>[key,process.env[key]]));
const previousFetch=globalThis.fetch;
const syntheticCode="a".repeat(32);
const key="11111111-2222-4333-8444-555555555555";
const input={name:"Example Visitor",email:"visitor@example.test",phone:"+971500000000",message:"Please help me find an apartment in Ajman."};
const profile={agent:{slug:"test-broker",name:"Test Broker"},activeListings:[]};
const request=(body=input,headers={})=>new Request("https://website.test/api/contact",{method:"POST",headers:{origin:"https://website.test","content-type":"application/json","idempotency-key":key,...headers},body:typeof body==="string"?body:JSON.stringify(body)});

test.beforeEach(()=>{process.env.BROKBUDDY_API_BASE_URL="https://api.example.test";process.env.BROKBUDDY_BROKER_PROFILE_SLUG="test-broker";process.env.BROKBUDDY_BROKER_CODE=syntheticCode;});
test.afterEach(()=>{globalThis.fetch=previousFetch;});
test.after(()=>{for(const[name,value]of Object.entries(previousEnv)){if(value===undefined)delete process.env[name];else process.env[name]=value;}});

test("a contact enquiry verifies the broker code then submits only to the configured broker",async()=>{
 const calls=[];
 globalThis.fetch=async(url,options)=>{
  calls.push({url:new URL(url),options});
  return calls.length===1?Response.json(profile):Response.json({inquiry:{id:"inquiry-fixture"},intake:{outcome:"created"},message:"Inquiry submitted successfully."},{status:201});
 };
 const response=await handleContactRequest(request({...input,listingId:"listing-1",brokerProfileSlug:"attacker"},{referer:"https://website.test/listings/listing-1"}));
 assert.equal(response.status,201);assert.deepEqual(await response.json(),{success:true});assert.equal(calls.length,2);
 assert.equal(calls[0].url.pathname,"/api/public/broker-template/test-broker");
 assert.equal(calls[0].options.headers["X-BrokBuddy-Broker-Code"]===syntheticCode,true);
 assert.equal(calls[1].url.pathname,"/api/public/broker/test-broker/inquiry");assert.equal(calls[1].url.search,"");assert.equal(calls[1].options.method,"POST");
 assert.equal(calls[1].options.headers["idempotency-key"],key);assert.equal(calls[1].options.headers["X-BrokBuddy-Broker-Code"],undefined);
 assert.equal(calls[1].options.headers.referer,"https://website.test/listings/listing-1");
 assert.deepEqual(JSON.parse(calls[1].options.body),{...input,listingId:"listing-1"});assert.equal(calls[1].options.redirect,"error");
});

test("invalid or revoked feed codes block contact submission without a POST fallback",async()=>{
 let calls=0;globalThis.fetch=async()=>{calls++;return new Response("secret upstream error",{status:404});};
 const response=await handleContactRequest(request());assert.equal(response.status,503);assert.equal(calls,1);assert.doesNotMatch(await response.text(),/secret upstream|inquiry-fixture/);
});

test("validation rejects invalid contact data before any upstream request",async()=>{
 globalThis.fetch=async()=>assert.fail("Unexpected upstream request");
 for(const body of [{...input,name:"A"},{...input,email:"invalid"},{...input,message:"short"},{...input,phone:"<script>"},{...input,listingId:"../other"}]){
  const response=await handleContactRequest(request(body));assert.equal(response.status,400);
 }
 assert.throws(()=>parseContactInput(null));
});

test("contact requests enforce origin, JSON, request size and idempotency keys",async()=>{
 globalThis.fetch=async()=>assert.fail("Unexpected upstream request");
 assert.equal((await handleContactRequest(request(input,{origin:"https://unrelated.test"}))).status,403);
 assert.equal((await handleContactRequest(request(input,{"content-type":"text/plain"}))).status,415);
 assert.equal((await handleContactRequest(request(input,{"idempotency-key":"invalid"}))).status,400);
 assert.equal((await handleContactRequest(request("not JSON"))).status,400);
 assert.equal((await handleContactRequest(request("x".repeat(20001)))).status,413);
});

test("upstream rate limits and errors never become a successful enquiry or expose response bodies",async()=>{
 for(const status of [429,400,403,404,500]){
  let calls=0;globalThis.fetch=async()=>++calls===1?Response.json(profile):new Response(`untrusted ${syntheticCode}`,{status});
  const response=await handleContactRequest(request());assert.ok(response.status>=400);assert.equal((await response.text()).includes(syntheticCode),false);
 }
});

test("network and malformed confirmation errors retain a failure status without echoing secrets",async()=>{
 for(const failure of ["network","bad-json","missing-confirmation"]){
  let calls=0;globalThis.fetch=async()=>{
   if(++calls===1)return Response.json(profile);
   if(failure==="network")throw new Error(`Headers ${syntheticCode}`);
   return failure==="bad-json"?new Response("bad JSON"):Response.json({message:"OK"});
  };
  const response=await handleContactRequest(request());assert.equal(response.status,502);assert.equal((await response.text()).includes(syntheticCode),false);
 }
});

test("retries forward the same idempotency key and never return upstream inquiry data",async()=>{
 const keys=[];globalThis.fetch=async(_url,options)=>{
  if(options.method!=="POST")return Response.json(profile);
  keys.push(options.headers["idempotency-key"]);return Response.json({inquiry:{id:"private-fixture",email:input.email},intake:{outcome:"idempotent"}},{status:200});
 };
 for(let i=0;i<2;i++){const response=await handleContactRequest(request());assert.deepEqual(await response.json(),{success:true});}
 assert.deepEqual(keys,[key,key]);
});

test("accepts the website origin when Next uses an internal URL behind its proxy",async()=>{
 globalThis.fetch=async(_url,options)=>options.method==='POST'?Response.json({inquiry:{id:'fixture'}},{status:201}):Response.json(profile);
 const proxyRequest=new Request('http://localhost:3071/api/contact',{method:'POST',headers:{host:'website.test',origin:'https://website.test','x-forwarded-proto':'https','content-type':'application/json','idempotency-key':key},body:JSON.stringify(input)});
 assert.equal((await handleContactRequest(proxyRequest)).status,201);
 const crossSite=new Request('http://localhost:3071/api/contact',{method:'POST',headers:{host:'website.test',origin:'https://other.test','x-forwarded-proto':'https','content-type':'application/json','idempotency-key':key},body:JSON.stringify(input)});
 assert.equal((await handleContactRequest(crossSite)).status,403);
});
