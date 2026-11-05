type Question = { prompt: string; options: string[]; answer: number; why: string };
type Quiz = { note: string; questions: Question[] };
export const lessonQuizzes: Record<string, Quiz | undefined> = {
  "bench-02": {
    "note": "Check the station before you decide what to load.",
    "questions": [
      {
        "prompt": "The bench wobbles when you sit down. Your friend has already picked out the plates. What comes first?",
        "options": [
          "Load a lighter pair",
          "Get the bench checked or move to a stable station",
          "Ask your friend to hold the bench still"
        ],
        "answer": 1,
        "why": "The bench needs to be stable before any weight goes on."
      },
      {
        "prompt": "Your friend leaves their working weight on the bar for you. What’s a better first step than trying it?",
        "options": [
          "Try it for one rep instead of a full set",
          "Keep it and have your friend help on each rep",
          "Check the load and start with a rehearsal you can control"
        ],
        "answer": 2,
        "why": "Their working weight tells you about their set, not what you can manage today."
      }
    ]
  },
  "bench-04": {
    "note": "Rehearse your position while the bar is still supported.",
    "questions": [
      {
        "prompt": "You lie down and have to reach way behind your head for the bar. What needs adjusting?",
        "options": [
          "Your position on the bench",
          "Your grip width",
          "The speed of the lift-off"
        ],
        "answer": 0,
        "why": "Sit up and reset your position while the bar is still in the hooks."
      },
      {
        "prompt": "Your feet keep sliding during your empty-handed rehearsal. When would you fix that?",
        "options": [
          "Once the bar is over your chest",
          "Before the bar comes out of the hooks",
          "After the first rep shows which foot slips"
        ],
        "answer": 1,
        "why": "The rehearsal is your chance to find steady footing without supporting the bar."
      }
    ]
  },
  "bench-05": {
    "note": "Use the bar markings to check both hands. Notice where the bar sits in each palm.",
    "questions": [
      {
        "prompt": "Your left index finger is on a ring. Your right is two fingers farther out. Before you unrack, what do you change?",
        "options": [
          "Move the bench toward the wider hand",
          "Hold tighter on the narrower side",
          "Match your hand positions using the rings"
        ],
        "answer": 2,
        "why": "Matching reference points lets you check grip symmetry while the bar is supported."
      },
      {
        "prompt": "The bar is still racked. Your wrists bend back and your thumbs sit alongside your fingers. Which reset matches this lesson?",
        "options": [
          "Set the bar over your forearms and wrap your thumbs",
          "Keep the same grip and squeeze harder",
          "Move both hands wider without changing your wrists"
        ],
        "answer": 0,
        "why": "Width isn’t the only grip check. Look for supported wrists and thumbs wrapped around the bar."
      }
    ]
  },
  "bench-06": {
    "note": "Agree on the lift-off, clear the hooks, then establish a steady start position.",
    "questions": [
      {
        "prompt": "Your spotter asks, “Do you want me to help lift it out?” You haven’t agreed on a cue. What do you do?",
        "options": [
          "Start lifting so they can follow",
          "Agree on the handoff before either of you lifts",
          "Wait until the bar clears the hooks to answer"
        ],
        "answer": 1,
        "why": "Both people should know what to do before the bar moves."
      },
      {
        "prompt": "The bar has cleared the hooks but is still drifting into position. Is it time to start lowering?",
        "options": [
          "Yes, clearing the hooks starts the descent",
          "Yes, if the first rep is light",
          "Not yet. Start the descent from a steady position"
        ],
        "answer": 2,
        "why": "Clearing the hooks and being ready for the first rep are two different things."
      }
    ]
  },
  "bench-07": {
    "note": "Look for control on the way down, not just a completed rep.",
    "questions": [
      {
        "prompt": "In your replay, the bar drops quickly and bounces before it goes up. Which part would you work on first?",
        "options": [
          "Lowering under control",
          "Pressing faster after the bounce",
          "Adding weight to slow the drop"
        ],
        "answer": 0,
        "why": "The issue starts before the press: the descent is no longer controlled."
      },
      {
        "prompt": "You hit your rep target, but from halfway down the last two reps felt like a drop. What do you take from that?",
        "options": [
          "Hitting the target means the load was manageable",
          "Reassess the load before repeating that descent",
          "Keep the weight and aim for a quicker turnaround"
        ],
        "answer": 1,
        "why": "The rep total doesn’t capture the loss of control on the way down."
      }
    ]
  },
  "bench-08": {
    "note": "Check how the press finishes, not just whether the bar went up.",
    "questions": [
      {
        "prompt": "You’re reviewing a side-view clip. Where should the bar finish at the top of the press in this lesson?",
        "options": [
          "Over your eyes",
          "Over the lower chest where the descent ended",
          "Over your shoulders with your arms straight"
        ],
        "answer": 2,
        "why": "The press returns toward its starting position over the shoulders."
      },
      {
        "prompt": "Your hips lifted to finish the last press. Now that the bar is racked, how would you judge that set?",
        "options": [
          "Note the loss of position and reassess before adding weight",
          "Count it as a reason to increase because the bar went up",
          "Plan to lift your hips earlier on the next set"
        ],
        "answer": 0,
        "why": "Getting the bar up and finishing a controlled press aren’t the same thing."
      }
    ]
  },
  "bench-10": {
    "note": "Use the last set to choose one thing to improve before changing the load.",
    "questions": [
      {
        "prompt": "You planned to add weight, but the last set was uneven. What goes in your plan for the next one?",
        "options": [
          "Add weight but cut one rep",
          "Pick one issue to review before deciding on the load",
          "Copy your partner’s next set"
        ],
        "answer": 1,
        "why": "An uneven set gives you something to review, not an automatic reason to go heavier."
      },
      {
        "prompt": "The current load feels manageable, but the next plates available make a much bigger jump than you intended. What’s your call?",
        "options": [
          "Make the jump and rely on your spotter",
          "Increase anyway but leave the extra weight out of your log",
          "Stay at the manageable load today"
        ],
        "answer": 2,
        "why": "Progress doesn’t have to mean adding weight every session."
      }
    ]
  },
  "bench-12": {
    "note": "Use practice to check your setup and the camera’s view. A tracker is not a spotter.",
    "questions": [
      {
        "prompt": "In your side-view clip, your elbow disappears just as the counter misses a rep. What would you change for the next recording?",
        "options": [
          "Frame the selected shoulder, elbow, wrist and hip together",
          "Lower farther so the camera sees a bigger movement",
          "Increase the load so the rep takes longer"
        ],
        "answer": 0,
        "why": "Change the view, not your movement, to troubleshoot a tracking miss."
      },
      {
        "prompt": "The app counted eight. On replay, you see your spotter helped with the last two. What would you write in your practice notes?",
        "options": [
          "Eight independent reps; the counter confirmed them",
          "Eight detected, last two assisted; don’t use the count alone to choose the next load",
          "Six detected; the assisted movements never happened"
        ],
        "answer": 1,
        "why": "Record what the camera saw and what it couldn’t tell: who supplied the force."
      }
    ]
  }
};
export function passedQuiz(id: string, answers: readonly (number | undefined)[]) {
  const quiz = lessonQuizzes[id];
  return !!quiz && quiz.questions.length > 0 && quiz.questions.length === answers.length && quiz.questions.every((q,i)=>answers[i] === q.answer);
}

