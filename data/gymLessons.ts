
import { GYM_SKILL_ID } from "@/data/skills";
import type { Lesson } from "@/types/lesson";

type LessonDraft = Omit<
  Lesson,
  "skillId" | "order" | "prerequisiteId"
>;

const drafts: LessonDraft[] = [
  {
    id: "bench-01",
    title: "Basics and Getting Set Up",
    description: "Learn the fundamentals of the bench press.",
    objective:
      "Understand the purpose of bench, the muscles it targets, the equipment needed, and body position needed before lifting.",

    content: [
      {
        heading: "What Is the Bench Press?",
        text: "The bench press is an upper-body strength exercise where you lie on a flat bench, lower a barbell toward your chest, and press it back upward. It is commonly used to build upper-body strength and muscle.",
      },
      {
        text: "The bench press primarily targets three muscle groups: your chest (pectorals), which provides most of the pushing force; your front shoulders (anterior deltoids), which assist with pressing; and your triceps, which help straighten your arms. Your upper back and legs also help stabilize your body.",
      },
      {
        heading: "Equipment Needed",
        text: "Before starting, you will need a flat bench, a barbell, and a bench press rack. Weight plates can be added as you progress, but beginners should start with an empty barbell or a lighter alternative to learn proper technique.",
      },
      {
        text: "For safety, use a spotter or properly positioned safety bars. If you are using weight plates, secure them with barbell collars.",
      },
      {
        heading: "Proper Body Positioning",
      },
      {
        heading: "Step 1: Position Yourself on the Bench",
        text: "Lie on your back with your eyes approximately underneath the barbell. Keep your head, upper back, and glutes in contact with the bench.",
      },
      {
        heading: "Step 2: Plant Your Feet",
        text: "Place your feet firmly on the floor, approximately shoulder-width apart or wherever you feel most stable. Your feet should remain planted throughout the exercise.",
      },
      {
        heading: "Step 3: Set Your Shoulders",
        text: "Pull your shoulder blades together and slightly downward. Keep your upper back tight against the bench to create a stable foundation for pressing.",
      },
      {
        heading: "Step 4: Find Your Grip",
        text: "Grip the bar slightly wider than shoulder-width with your thumbs wrapped securely around it. Make sure your hands are evenly spaced and keep your wrists relatively straight.",
      },
      {
        heading: "Preparing to Lift",
        text: "Before unracking the bar, check your positioning. Your feet should be planted, your upper back should feel stable, and your grip should be secure. Take a breath and brace your core before lifting.",
      },
      {
        text: "Make sure your spotter is ready or your safety bars are correctly positioned. Practice your setup with light weight until you can consistently maintain proper positioning.",
      },
    ],

    tips: [
      "Start with an empty barbell or light weight to practice proper positioning.",
      "Keep your feet planted firmly on the floor throughout the exercise.",
      "Pull your shoulder blades together and maintain a tight upper back.",
      "Place your hands evenly on the bar and keep your wrists aligned.",
      "Use a spotter or properly positioned safety bars when bench pressing.",
      "Practice the same setup before every set to build consistency.",
    ],

    commonMistakes: [
      "Moving your feet or failing to keep them firmly planted.",
      "Relaxing your shoulders and losing upper-back stability.",
      "Gripping the bar excessively wide or narrow.",
      "Allowing your wrists to bend too far backward.",
      "Attempting heavy weights before learning proper technique.",
      "Bench pressing without a spotter or properly positioned safety equipment.",
    ],
  },

  {
    id: "bench-02",
    title: "Proper Form and Execution",
    description:
      "Learn how to safely perform the bench press with proper technique, control, and breathing.",
    objective:
      "Perform a complete bench press repetition using correct bar movement, body positioning, and breathing techniques.",

    content: [
      {
        heading: "Understanding the Movement",
        text: "The bench press consists of three main phases: unracking the bar, lowering it toward your chest, and pressing it back upward. Each phase should be performed with control while maintaining the stable body position learned in Lesson 1.",
      },
      {
        heading: "Step 1: Unracking the Bar",
        text: "Begin with your feet firmly planted, shoulder blades pulled back, and hands gripping the bar evenly. Straighten your arms to lift the bar off the rack, then move it horizontally until it is positioned above your shoulders. Keep your elbows extended and your wrists aligned with your forearms.",
      },
      {
        text: "Avoid losing your shoulder position while unracking. If the bar is difficult to remove from the rack, ask a spotter for assistance or adjust the rack height before beginning.",
      },
      {
        heading: "Step 2: Lowering the Bar",
        text: "Take a breath and brace your core before lowering the bar. Slowly bend your elbows and bring the bar down toward your mid-to-lower chest. Keep your forearms approximately vertical when viewed from the front, and allow your elbows to move at a comfortable angle rather than flaring them directly outward.",
      },
      {
        text: "The lowering phase should be smooth and controlled. Avoid dropping the bar quickly or allowing it to bounce off your chest. Your feet, upper back, and glutes should remain stable throughout the movement.",
      },
      {
        heading: "Step 3: Pressing the Bar Upward",
        text: "Once the bar lightly touches your chest, press it upward by extending your elbows. The bar will generally travel slightly backward toward your shoulders as you push, rather than moving in a perfectly straight vertical line.",
      },
      {
        text: "Keep your wrists aligned, maintain tension in your upper back, and drive your feet firmly into the floor without lifting your hips off the bench. Continue pressing until your arms are extended and the bar is stable above your shoulders.",
      },
      {
        heading: "Step 4: Breathing and Bracing",
        text: "Before lowering the bar, take a breath and tighten your core to stabilize your body. Maintain that tension during the repetition, then exhale as you finish pressing or once the bar is stable at the top.",
      },
      {
        text: "Avoid completely relaxing your core between the lowering and pressing phases. Controlled breathing helps maintain stability and consistency throughout your set.",
      },
      {
        heading: "Step 5: Completing Repetitions",
        text: "A complete repetition begins with the bar above your shoulders, continues as you lower it under control to your chest, and finishes when you press it back to the starting position.",
      },
      {
        text: "Repeat the movement while maintaining the same technique. Focus on smooth repetitions rather than rushing or attempting to lift as much weight as possible.",
      },
      {
        heading: "Step 6: Racking the Bar",
        text: "After your final repetition, keep your arms extended and move the bar backward toward the rack hooks. Once the bar is above the hooks, lower it carefully into place. Confirm that both ends of the bar are securely resting on the hooks before releasing your grip.",
      },
      {
        text: "If you become fatigued or cannot complete a repetition, ask your spotter for assistance or use the properly positioned safety bars. Never attempt to force a failed repetition without a safe way to stop the lift.",
      },
      {
        heading: "Improving Your Technique",
        text: "Beginners should practice with an empty barbell or manageable weight until they can consistently control the bar, maintain proper positioning, and complete repetitions without discomfort.",
      },
      {
        text: "As your technique improves, gradually increase the weight in small increments. Proper form, consistency, and safety are more important than lifting heavier weights too quickly.",
      },
    ],

    tips: [
      "Keep your feet planted, upper back tight, and glutes on the bench throughout every repetition.",
      "Lower the bar slowly and with control rather than letting it drop toward your chest.",
      "Aim to touch your mid-to-lower chest lightly without bouncing the bar.",
      "Keep your wrists aligned with your forearms to maintain control of the bar.",
      "Maintain a comfortable elbow angle instead of flaring your arms directly outward.",
      "Press the bar slightly backward toward your shoulders as you extend your arms.",
      "Take a breath and brace your core before lowering the bar.",
      "Use a spotter or properly positioned safety bars, especially when increasing weight.",
      "Focus on consistent technique before increasing the amount of weight you lift.",
      "Stop the set if you experience pain, lose control, or can no longer maintain proper form.",
    ],

    commonMistakes: [
      "Bouncing the bar off your chest instead of lowering it with control.",
      "Lowering the bar too quickly and losing control of the movement.",
      "Flaring your elbows excessively outward, which can place unnecessary stress on your shoulders.",
      "Allowing your wrists to bend too far backward while pressing.",
      "Lifting your hips off the bench to push heavier weight.",
      "Letting your feet move or losing stability during repetitions.",
      "Pressing the bar unevenly or allowing one side to rise faster than the other.",
      "Forgetting to brace your core and maintain controlled breathing.",
      "Attempting to lift weights that are too heavy to control safely.",
      "Failing to fully secure the bar on both rack hooks before releasing it.",
    ],
  },
];

export const gymLessons: Lesson[] = drafts.map((draft, index) => ({
  ...draft,
  skillId: GYM_SKILL_ID,
  order: index + 1,
  prerequisiteId: index === 0 ? null : drafts[index - 1].id,
}));
