import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBenchSessions, saveBenchSession, type BenchSession } from '../lib/pose/sessions';
const data = new Map<string,string>();
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
 getItem: (key: string) => data.get(key) ?? null,
 setItem: (key: string, value: string) => { data.set(key, value); },
} });
const session: BenchSession = { id:'session-1',exercise:'bench-press',date:'2026-10-22T12:00:00Z',reps:5,seconds:20,side:'left',source:'camera' };
test('saved summaries reload, deduplicate and stay separate by account',()=>{
 data.clear();saveBenchSession('a@example.com',session);saveBenchSession('a@example.com',session);
 assert.equal(loadBenchSessions('a@example.com').length,1);
 assert.equal(loadBenchSessions('a@example.com')[0].reps,5);
 assert.deepEqual(loadBenchSessions('b@example.com'),[]);
});
test('history is bounded at 20 summaries',()=>{
 data.clear();for(let i=0;i<25;i++)saveBenchSession('a@example.com',{...session,id:`s-${i}`});
 assert.equal(loadBenchSessions('a@example.com').length,20);
 assert.equal(loadBenchSessions('a@example.com')[0].id,'s-24');
});
test('corrupt history is reported rather than silently overwritten',()=>{
 data.clear();data.set('ast-bench-sessions:a@example.com','not-json');
 assert.throws(()=>saveBenchSession('a@example.com',session));
 assert.equal(data.get('ast-bench-sessions:a@example.com'),'not-json');
});
test('storage write failure is propagated so UI cannot claim success',()=>{
 const old=localStorage.setItem;
 localStorage.setItem=()=>{throw new Error('Quota exceeded');};
 assert.throws(()=>saveBenchSession('b@example.com',session),/Quota/);
 localStorage.setItem=old;
});
