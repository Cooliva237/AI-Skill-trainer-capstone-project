import { GYM_SKILL_ID } from "@/data/skills";
import type { Lesson } from "@/types/lesson";
import { benchGroups } from "@/data/benchCurriculum";

type LessonDraft = Omit<Lesson, "skillId" | "order" | "prerequisiteId">;

const drafts: LessonDraft[] = [
  {
    id: "bench-01",
    title: "Gym & Bench Press Basics",
    description: "What the bench press is, and how this path is organized.",
    objective: "Name the muscles the bench press trains and why the lessons stay in order.",
    content: [
      "The bench press is a horizontal push. You lie on a flat bench and lower a bar to your chest, then press it back up.",
      "It mainly trains your chest, the front of your shoulders, and your triceps. Your upper back and legs help you stay stable, even though they are not the muscles lifting the bar.",
      "This path teaches the setup before any heavy weight. Lesson 1 is open now. Each lesson you finish unlocks the next one.",
    ],
    tips: [
      "Stay with the lesson order. Later steps assume you already know the earlier ones.",
      "You do not need a max-out on day one. Smooth reps with a light bar count.",
    ],
    commonMistakes: [
      "Loading plates before the setup feels familiar.",
      "Skipping ahead because one step looks obvious.",
    ],
  },
  {
    id: "bench-02",
    title: "Equipment and Safety",
    description: "The gear you need, and the rules before you touch the bar.",
    objective: "Set up a bench station you can fail safely.",
    content: [
      "You need a flat bench, a barbell, and a rack or stands with hooks. Most gym bars weigh 45 lb (20 kg). Some gyms also have a lighter technique bar.",
      "Use collars, also called clips, so plates cannot slide off. Set the safety pins or spotter arms just below the line of your chest. If you miss a rep, the bar should stop on the safeties instead of on you.",
      "A spotter is useful once you add weight. Until then, the empty bar plus safeties is enough. This is practice instruction, not personal medical advice. Stop if something hurts, and ask a coach if you are unsure.",
    ],
    tips: [
      "Check that the bench will not slide before you lie down.",
      "Ask where the lightest plates are. Small jumps matter later.",
      "If you train alone, do not bench a weight you cannot return to the rack.",
    ],
    commonMistakes: [
      "No collars on a loaded bar.",
      "Safety pins set so high that the bar hits them before your chest, or so low that they do not help.",
      "Training heavy with no spotter and no safeties.",
    ],
  },
  {
    id: "bench-03",
    title: "Bench Setup",
    description: "Where to put the bench and your eyes before the unrack.",
    objective: "Place yourself so the unrack is a short, stable lift.",
    content: [
      "Lie down and look up. Your eyes should be roughly under the bar. If the bar is far behind your head, you will have to press it out from an awkward position.",
      "Feet stay flat on the floor. The bench should be close enough that unracking is a short arm extension, not a long reach.",
      "Sit up and move the bench if the position is off. Fixing it before the set is easier than adjusting under the bar.",
    ],
    tips: [
      "Do one rehearsal with empty hands: lie down, reach, and see where the bar would be.",
      "If you have to shrug hard just to get the bar out, the bench is in the wrong place.",
    ],
    commonMistakes: [
      "Eyes too far in front of the bar, so the unrack starts behind you.",
      "A bench that rolls once you plant your feet.",
    ],
  },
  {
    id: "bench-04",
    title: "Proper Body Position",
    description: "How to get tight on the bench before the bar moves.",
    objective: "Hold a stable position: feet down, upper back set, hips on the bench.",
    content: [
      "Plant both feet. They should feel like you could gently push the floor away without your hips lifting.",
      "Pinch your shoulder blades together and keep them on the bench. That creates a stable shelf for the press. Your head stays on the bench.",
      "A small natural arch in the lower back is normal. Your hips still stay down. Think of five points of contact: head, both shoulders, hips, and both feet.",
    ],
    tips: [
      "Get tight first, then unrack. Loose shoulders make every later step harder.",
      "If your hips pop up during a light rep, move your feet or slow down.",
    ],
    commonMistakes: [
      "Hips leaving the bench to force the bar up.",
      "Feet tucked under the bench so you cannot drive through them.",
      "A huge lower-back arch that lifts the hips off the pad.",
    ],
  },
  {
    id: "bench-05",
    title: "Grip and Hand Placement",
    description: "Where your hands go, and how to hold the bar.",
    objective: "Take an even grip with stacked wrists and wrapped thumbs.",
    content: [
      "Set your hands just outside shoulder width. A useful check comes later in the lowering lesson: when the bar is on your chest, your forearms should be close to vertical.",
      "Squeeze the bar. It rests in the heel of your palm so the wrist stays stacked over the forearm, not bent backward.",
      "Wrap your thumbs around the bar. Keep the same hand placement on every set. The smooth rings on the bar are an easy left-right marker.",
    ],
    tips: [
      "If one hand is wider than the other, the bar will tilt. Match the rings.",
      "A narrower grip uses more triceps. A very wide grip stresses the shoulders. Start near shoulder width.",
    ],
    commonMistakes: [
      "A thumbless grip while you are still learning.",
      "Wrists bent so far back that the bar sits on the palm instead of over the forearm.",
    ],
  },
  {
    id: "bench-06",
    title: "Unracking the Bar",
    description: "How to take the bar out of the hooks without losing tightness.",
    objective: "Unrack to a steady start position over your shoulders.",
    content: [
      "Set your body and grip first. Then straighten your arms and lift the bar up and out of the hooks.",
      "Move it to a position over your shoulders. That is the start of the rep. Pause there for a moment so the bar is still before you lower it.",
      "A partner can help with the lift-off once the bar is loaded. With the empty bar, you should be able to unrack it yourself.",
    ],
    tips: [
      "If the unrack feels like a hard press already, sit up and move the bench.",
      "Keep your shoulder blades set while the bar comes out. Do not let them roll forward.",
    ],
    commonMistakes: [
      "Starting the descent while the bar is still in the hooks.",
      "Unracking with loose shoulders, then trying to get tight on the way down.",
    ],
  },
  {
    id: "bench-07",
    title: "Lowering the Bar",
    description: "The controlled path from the start position to your chest.",
    objective: "Lower the bar to the lower chest without bouncing or flaring the elbows.",
    content: [
      "From the shoulder position, lower the bar with control to the lower chest, around the bottom of the sternum. The path slants slightly; it is not a straight drop toward your neck.",
      "Elbows stay somewhat tucked, often around 45 to 70 degrees from your sides. Straight out to the sides, near 90 degrees, puts extra stress on the shoulders.",
      "Touch the chest lightly. The bar does not bounce. You should be able to pause for a brief moment if you wanted to.",
    ],
    tips: [
      "A slower lower makes the press easier to organize.",
      "If the bar drifts toward your belly or your neck, reset and aim for the lower chest again.",
    ],
    commonMistakes: [
      "Dropping the bar and bouncing it off the chest.",
      "Flaring the elbows straight out from the body.",
    ],
  },
  {
    id: "bench-08",
    title: "Pressing Technique",
    description: "How to press the bar back to the finish position.",
    objective: "Press up and slightly back until the bar is locked out over your shoulders.",
    content: [
      "After the bar touches your chest, press it up and slightly back so it finishes over your shoulders, near where the rep started.",
      "Push your feet into the floor while you press. Your hips stay on the bench. Breathe in before you lower the bar, and breathe out as you press.",
      "Straighten the elbows at the top without shrugging the shoulders toward your ears. Then lower again for the next rep, or rack the bar if the set is done.",
    ],
    tips: [
      "One cue is enough. 'Up and back' is a good first cue.",
      "If the last rep is messy, rack the bar. The set is over.",
    ],
    commonMistakes: [
      "Pressing straight toward the face so the bar finishes over the eyes.",
      "Holding one breath for the entire set.",
      "Lifting the hips to grind out a rep.",
    ],
  },
  {
    id: "bench-09",
    title: "Common Bench Press Mistakes",
    description: "The errors that show up most often for beginners.",
    objective: "Recognize a few common faults and what to do instead.",
    content: [
      "Most early problems are setup problems: uneven hands, loose shoulders, elbows flared, or the bar bouncing off the chest.",
      "Another pattern is adding weight after a set that already looked uneven. A heavier bar will not clean that up.",
      "Use the earlier lessons as the fix. If the lower looks rushed, repeat Lowering the Bar. If the bar starts in the wrong place, repeat Bench Setup and Unracking the Bar.",
    ],
    tips: [
      "Watch one thing per set. Trying to fix five cues at once usually fixes none of them.",
      "Ask a spotter to watch the part you are trying to fix.",
    ],
    commonMistakes: [
      "Bouncing the bar off the chest.",
      "One arm pressing faster than the other.",
      "Skipping the empty-bar warm-up.",
    ],
  },
  {
    id: "bench-10",
    title: "Weight and Progression Basics",
    description: "How to choose a starting weight and when to add more.",
    objective: "Add weight only after the current load looks controlled.",
    content: [
      "Start with the empty bar, or a lighter technique bar if the gym has one, until the setup and the press are smooth.",
      "A simple first target is 3 sets of 5 to 8 reps. Rest a couple of minutes between work sets. When every rep in those sets is controlled, add the smallest plates available.",
      "If form breaks, stay at that weight or take some off. Write the weight and reps down so the next session has a starting point.",
    ],
    tips: [
      "Warm up with the bar even on days when you plan to add a little weight.",
      "Small jumps are the point. A 5 lb or 2.5 kg change is enough.",
    ],
    commonMistakes: [
      "Jumping to a heavy bar because the empty bar felt easy.",
      "Copying someone else's weight.",
      "Adding load on a set that was already uneven.",
    ],
  },
  {
    id: "bench-11",
    title: "Practice Check",
    description: "A short checklist to run before a work set.",
    objective: "Walk through the full setup once, in order, with a light bar.",
    content: [
      "Before the first work set, check the station: safeties set, collars on if the bar is loaded, bench stable.",
      "Then check yourself: feet planted, shoulder blades set, hips down, even grip, thumbs wrapped, bar unracked over the shoulders.",
      "Lower to the lower chest, touch without bouncing, and press up and slightly back. Stop the set if the bar tilts or your hips leave the bench.",
    ],
    tips: [
      "Say the checks quietly once. After a few sessions they become the start of every set.",
      "Use a weight you could stop at any moment. This lesson is a rehearsal, not a test of strength.",
    ],
    commonMistakes: [
      "Skipping the checklist because the last session felt fine.",
      "Treating a sloppy rehearsal as a reason to add weight.",
    ],
  },
  {
    id: "bench-12",
    title: "Bench Press Completion",
    description: "A review of the sequence, and how to keep practicing.",
    objective: "Review the sequence and know how to keep practicing.",
    content: [
      "You now have the beginner sequence: safety, bench placement, body position, grip, unrack, lower, press, and how to add weight.",
      "The next practice is repeating that sequence with the empty bar, then small increases when the reps stay clean. Completed lessons stay open, so you can revisit any step.",
    ],
    tips: [
      "Keep the first weeks boring and repeatable. That is how the setup sticks.",
      "If a later session feels off, go back one lesson instead of adding weight.",
    ],
    commonMistakes: [
      "Treating the last checkmark as the end of practice.",
      "Stopping the safeties and collars once the motion feels familiar.",
    ],
  },
];

const condensed: LessonDraft[] = [
  {
    id: 'bench-02', title: 'Before You Lift',
    description: 'Meet the bench press. Get the station ready before the bar moves.',
    objective: 'Understand the movement and review the equipment and safety checks.',
    content: [
      'The bench press is a horizontal push. Your chest, front shoulders and triceps move the bar; your back and legs help you stay steady.',
      'Check that the bench and rack are stable. Review the safety arms, collars and spotter setup before loading the bar. If the station is unfamiliar, ask a qualified gym staff member to help you set it up.',
      'This eight-lesson path starts with setup, then follows the movement. Camera practice is optional. A lesson checkmark or a counted rep does not certify safe technique.',
    ],
    tips: ['Start with an unloaded rehearsal. There is no weight target to unlock a lesson.', 'Ask for help when you are unsure; stop if something hurts.'],
    commonMistakes: ['Loading the bar before checking the station.', 'Treating the camera tracker as a replacement for a coach or spotter.'],
  },
  {
    id: 'bench-04', title: 'The Setup',
    description: 'Bench position, planted feet and a steady upper back.',
    objective: 'Rehearse your starting position before touching the bar.',
    content: [
      'Lie down with your eyes roughly under the bar. The unrack should be a short movement, not a reach behind your head. Sit up and adjust the bench if the position feels off.',
      'Plant your feet and keep your head, shoulders and hips supported by the bench. Set your shoulder blades before the unrack so your upper back provides a steady base.',
      'Rehearse with empty hands first. If you need to shift around, do it now rather than while supporting the bar.',
    ],
    tips: ['Take a moment to set up the same way each time.', 'You can revisit this lesson whenever the starting position feels unfamiliar.'],
    commonMistakes: ['Reaching too far back to unrack.', 'Letting the bench move or lifting the hips to force a repetition.'],
  },
  { ...drafts[4], title: 'Find Your Grip' },
  { ...drafts[5], title: 'The Unrack' },
  { ...drafts[6], title: 'The Descent' },
  { ...drafts[7], title: 'Press & Lockout' },
  {
    id: 'bench-10', title: 'Make the Next Set Better',
    description: 'Spot a problem, revisit the right step, and keep progression gradual.',
    objective: 'Choose one thing to review before changing the load.',
    content: [
      'An uneven grip, loose shoulders or a rushed descent can make a set feel different. Pick one issue to review instead of trying to change every part of the movement at once.',
      'If the lower feels rushed, revisit The Descent. If the bar starts in an awkward position, return to The Setup and The Unrack. A coach or spotter can help you check what the camera cannot judge.',
      'Do not add weight to fix an uneven set. Keep practice repeatable and record what you used. Increase gradually only when you are comfortable with the movement; the app does not prescribe a load.',
    ],
    tips: ['One clear note is more useful than five new cues.', 'Progress can mean a more consistent setup, not more weight.'],
    commonMistakes: ['Copying someone else’s load.', 'Ignoring a messy repetition because the rep counter increased.'],
  },
  {
    id: 'bench-12', title: 'Your Practice Check',
    description: 'Put the sequence together and decide what to revisit.',
    objective: 'Review the setup-to-rack sequence and understand the practice tools.',
    content: [
      'Review the station first, then your position and grip. Rehearse the unrack, controlled descent, press and return to the rack. This is a review, not a strength test.',
      'In the practice lab, you can test your camera, track a live side view, or choose a recorded video from your device. Keep the selected shoulder, elbow, wrist and hip in view. Videos are analyzed on your device, not uploaded to Firebase.',
      'The tracker estimates repetitions; it does not assess every part of your form. If tracking drops out or counts incorrectly, do not change your movement just to earn a rep. You can stop, check the camera, and try again without weight.',
      'Completing this lesson finishes the learning path. Every lesson stays open for review, and practice remains available. Your saved session summaries are separate from lesson completion.',
    ],
    tips: ['Use the camera test before starting tracking.', 'Write down one thing you want to remember next time.'],
    commonMistakes: ['Treating completion as proof of safe lifting.', 'Rushing a practice set to satisfy the counter.'],
  },
];

export const gymLessons: Lesson[] = condensed.map((draft, index) => ({
  ...draft,
  skillId: GYM_SKILL_ID,
  order: index + 1,
  prerequisiteId: index === 0 ? null : benchGroups[index - 1].id,
}));
