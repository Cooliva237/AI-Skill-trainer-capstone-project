import { LandingActions } from "@/components/LandingActions";

const steps = [
  { title: "Choose a skill", text: "Start with Gym & Fitness." },
  { title: "Learn", text: "Short lessons, in order." },
  { title: "Practice", text: "Work through the bench press." },
  { title: "Progress", text: "Finish a lesson to unlock the next." },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
      <section className="rounded-[2rem] bg-navy px-6 py-10 text-raised sm:px-10 sm:py-14">
        <h1 className="max-w-xl font-display text-5xl leading-none sm:text-6xl">AI Skill Trainer</h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-raised/80">
          Learn real-world skills one lesson at a time. Finish a step, then the next one opens.
        </p>
        <LandingActions />
      </section>

      <section className="mt-10">
        <p className="text-center font-display text-2xl leading-snug text-ink sm:text-3xl">
          Choose a skill <span className="text-coral">→</span> Learn <span className="text-coral">→</span> Practice{" "}
          <span className="text-coral">→</span> Progress
        </p>
        <ol className="mt-6 grid gap-4 sm:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl border border-line bg-raised p-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-semibold text-raised">
                {index + 1}
              </span>
              <h2 className="mt-3 font-display text-xl">{step.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 rounded-3xl border border-line bg-raised px-6 py-5">
        <h2 className="font-display text-2xl">Bench Press</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Twelve short lessons take you from the rack and the safety setup through a basic press.
        </p>
      </section>
    </div>
  );
}
