import { LandingActions } from "@/components/LandingActions";
import { TrainingBuddy } from "@/components/TrainingBuddy";
import { TrainingIcon } from "@/components/TrainingIcon";

export default function HomePage() {
  return <div className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
    <section className="grid items-center gap-10 sm:grid-cols-2">
      <div className="flex justify-center sm:order-2"><TrainingBuddy hero /></div>
      <div><p className="text-sm font-bold uppercase tracking-widest text-sage">Bench press, broken down.</p><h1 className="mt-5 text-5xl leading-tight sm:text-6xl">Get to know<br /><span className="text-coral">the lift.</span></h1><p className="mt-6 max-w-md text-lg leading-8 text-muted">Eight lessons, from your first setup to a full practice check. Learn a little, try it out, and come back to anything that didn’t click.</p><LandingActions /></div>
    </section>
    <section className="mt-16 grid gap-7 border-t-2 border-line pt-10 sm:grid-cols-3" aria-label="How it works">
      {[{icon:"book" as const,title:"Learn the why",text:"Short, focused lessons that make the movement easier to understand."},{icon:"path" as const,title:"Follow your path",text:"Finish a lesson, unlock the next, and revisit anything you need."},{icon:"practice" as const,title:"Give it a try",text:"An optional camera practice lab. Your video stays on your device."}].map(item => <div key={item.title}><span className="inline-flex rounded-2xl bg-sage-soft p-3 text-sage"><TrainingIcon name={item.icon} /></span><h2 className="mt-4 text-xl">{item.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{item.text}</p></div>)}
    </section>
    <p className="mt-14 text-center text-xs text-muted">Built for learning. Camera estimates are not a safety assessment or form certification.</p>
  </div>;
}
