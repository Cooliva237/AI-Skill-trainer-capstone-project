import test from 'node:test';
import assert from 'node:assert/strict';
import { angleAt, newCounter, stepCounter, readBenchPose, type Landmark } from '../lib/pose/bench-press';

function driver() {
  let state = newCounter(), time = 0;
  return {
    get state() { return state; },
    hold(angle: number, ms = 500) { for (let i = 0; i < ms; i += 50) { time += 50; state = stepCounter(state, { angle, valid: true, message: '' }, time); } },
    invalid() { time += 50; state = stepCounter(state, { angle: null, valid: false, message: 'Lost tracking' }, time); },
    gap(ms: number) { time += ms; },
    cycle() { this.hold(170); this.hold(125, 400); this.hold(85); this.hold(125, 400); this.hold(170); },
  };
}
test('angle calculation handles right, straight and degenerate joints', () => {
  assert.equal(angleAt({x:0,y:0},{x:1,y:0},{x:1,y:1}),90);
  assert.equal(angleAt({x:0,y:0},{x:1,y:0},{x:2,y:0}),180);
  assert.equal(angleAt({x:1,y:0},{x:1,y:0},{x:2,y:0}),null);
});
test('full cycles count once and holding top never duplicates', () => {
  const d=driver(); d.cycle(); assert.equal(d.state.reps,1);
  d.hold(170,3000); assert.equal(d.state.reps,1);
  d.cycle(); assert.equal(d.state.reps,2);
});
test('starting at bottom does not count', () => {const d=driver();d.hold(85);d.hold(170);assert.equal(d.state.reps,0);});
test('partial descent does not count', () => {const d=driver();d.hold(170);d.hold(120,700);d.hold(170);assert.equal(d.state.reps,0);});
test('missing landmarks invalidate the in-progress cycle', () => {const d=driver();d.hold(170);d.hold(85,700);d.invalid();d.hold(170);assert.equal(d.state.reps,0);d.cycle();assert.equal(d.state.reps,1);});
test('tracking loss preserves completed repetitions', () => {const d=driver();d.cycle();d.invalid();assert.equal(d.state.reps,1);assert.equal(d.state.phase,'setup');});
test('large timestamp gaps cannot finish stale repetitions', () => {const d=driver();d.hold(170);d.hold(85,700);d.gap(1000);d.hold(170);assert.equal(d.state.reps,0);});
test('jitter near upper threshold does not count', () => {const d=driver();for(let i=0;i<30;i++){d.hold(152,50);d.hold(158,50);}assert.equal(d.state.reps,0);});
test('long interrupted movement times out', () => {const d=driver();d.hold(170);d.hold(85,16000);d.hold(170);assert.equal(d.state.reps,0);});
test('fast full endpoint changes are rejected', () => {const d=driver();d.hold(170);d.hold(85,400);d.hold(170,400);assert.equal(d.state.reps,0);});
function pose(): Landmark[] {
  const p = Array.from({length:33},()=>({x:0,y:0,visibility:0}));
  p[11]={x:.3,y:.6,visibility:1};p[13]={x:.3,y:.4,visibility:1};p[15]={x:.3,y:.2,visibility:1};p[23]={x:.7,y:.6,visibility:1};return p;
}
test('side-view extended arm is valid',()=>{const r=readBenchPose(pose(),'left',640,480);assert.equal(r.valid,true);assert.equal(r.angle,180);});
test('standing torso is rejected',()=>{const p=pose();p[23]={x:.3,y:.95,visibility:1};assert.equal(readBenchPose(p,'left',640,480).valid,false);});
test('low confidence, out-of-frame and wrong side are rejected',()=>{const p=pose();p[13].visibility=.1;assert.equal(readBenchPose(p,'left',640,480).valid,false);assert.equal(readBenchPose(pose(),'right',640,480).valid,false);p[13].visibility=1;p[15].x=2;assert.equal(readBenchPose(p,'left',640,480).valid,false);});
test('angles account for non-square video dimensions',()=>{const p=pose();p[11]={x:.3,y:.6,visibility:1};p[13]={x:.45,y:.4,visibility:1};p[15]={x:.6,y:.6,visibility:1};const r=readBenchPose(p,'left',640,480);assert.ok(Math.abs(r.angle!-90)<1e-8);});
test('NaN cannot enter the state machine',()=>{const result=stepCounter(newCounter(),{valid:true,angle:NaN,message:'Bad input'},100);assert.equal(result.angle,null);assert.equal(result.reps,0);});
