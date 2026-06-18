import React, { useState, useEffect, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const DAYS = [
  {
    id: "monday", label: "MON", title: "Rest + APT Stretch", type: "rest", color: "#c084fc", icon: "🧘",
    stretches: [
      { name: "Kneeling Hip Flexor Stretch", reps: "60s each side", note: "Half-kneeling lunge, back knee on the floor. Squeeze the glute of the back leg and gently push your hips forward. The psoas — your deepest hip flexor — is the primary driver of APT. Prolonged sitting shortens it chronically. Do this one even if you skip everything else." },
      { name: "Couch Stretch", reps: "45s each side", note: "Kneel facing away from a wall. Place the top of your back foot on the surface behind you, front foot forward in a lunge. Slowly bring your torso upright. You will feel an intense stretch through the quad and deep hip flexor. Breathe through it and hold." },
      { name: "Child's Pose", reps: "60s", note: "Kneel and sit back toward your heels, arms stretched forward on the floor. Let your lower back completely decompress. Breathe deeply into your lower back on each inhale." },
      { name: "Lying Hamstring Stretch", reps: "45s each side", note: "Lie on your back. Loop a towel or strap around the arch of one foot. Slowly straighten the leg toward the ceiling until you feel a firm pull in the back of the thigh. Tight hamstrings contribute to APT by pulling the pelvis out of neutral." },
      { name: "Pigeon Pose / Figure-4", reps: "60s each side", note: "Figure-4: lie on your back, cross one ankle over the opposite knee and pull the uncrossed leg toward your chest. Both target the glute and piriformis — a tight piriformis limits glute activation, worsening APT." },
    ]
  },
  {
    id: "tuesday", label: "TUE", title: "Push Day", type: "training", color: "#34d399", icon: "💪",
    warmup: [
      { name: "Band Wrist Extensor Stretch", sets: 2, reps: "30s each", note: "Extend one arm straight, palm down. Use your other hand to gently pull your fingers downward. Directly stretches the extensor tendons involved in tennis elbow. Never skip before any push session." },
      { name: "Cable Face Pull (light)", sets: 2, reps: 15, note: "Set the cable at face height, light weight. Pull toward forehead with elbows high. Warms up the rotator cuff and rear delts before pressing. More important than any other warm-up set." },
      { name: "Incline DB Fly (light warm-up)", sets: 1, reps: 15, note: "Very light — just opening the chest and shoulder capsule. 50% of your working weight, slow and controlled. Do not skip this; cold pec tissue under a loaded barbell is a tear waiting to happen." },
    ],
    exercises: [
      {
        name: "Incline Dumbbell Press",
        sets: 4, reps: "10-12", rest: 90,
        muscles: "Upper Chest · Front Delts · Triceps",
        equipment: "Adjustable bench · Dumbbells",
        desc: "Set bench to 30–45°. Lower DBs slowly to chest level with elbows at ~75° from torso — not flared to 90°, which stresses the shoulder joint. Press to full extension without locking out. The incline hits the upper pec clavicular head, which is typically underdeveloped.",
        tip: "Elbow angle is the most important cue here. 75° from torso = safe pressing. 90° = shoulder impingement over time. Keep wrists stacked over elbows throughout. Use a neutral grip if tennis elbow flares on pronated grip.",
        search: "incline dumbbell press form",
        gym: true
      },
      {
        name: "Cable Chest Press",
        sets: 3, reps: "12-15", rest: 75,
        muscles: "Chest · Triceps · Front Delts",
        equipment: "Cable machine · D-handles",
        desc: "Set pulleys to chest height. Stand in a staggered stance, one foot forward. Press both handles forward and slightly inward, meeting at the midline. Cable maintains constant tension throughout the entire range — unlike dumbbells, there is no 'easy zone' at the top.",
        tip: "The constant tension is the whole point of cables for chest. Don't rush the return — a 3-second eccentric here is worth 3 reps of fast reps. Keep wrists completely neutral; any downward flexion loads the lateral epicondyle.",
        search: "cable chest press standing",
        gym: true
      },
      {
        name: "Overhead Press",
        sets: 3, reps: "10-12", rest: 90,
        muscles: "Front & Side Delts · Triceps · Upper Traps",
        equipment: "Dumbbells or Smith machine",
        desc: "Seated DB press: back supported, start with DBs at shoulder height, palms forward. Press straight overhead without flaring elbows excessively wide. The Smith machine is a solid alternative — the fixed bar path allows you to focus entirely on the shoulder without worrying about balance.",
        tip: "Use an open hand / loose grip to protect your elbows. Do not press with a wide grip — keep elbows tracking forward slightly. Engage core throughout; do not hyperextend your lower back as you press.",
        search: "seated dumbbell overhead press form",
        gym: true
      },
      {
        name: "Cable Lateral Raise",
        sets: 3, reps: "15-20", rest: 60,
        muscles: "Side Deltoids",
        equipment: "Cable machine · D-handle",
        desc: "Single-arm cable lateral raise with the pulley set at the lowest point. Hold the cable handle in the hand furthest from the machine. Raise the arm out to shoulder height with a slight elbow bend, keeping torso completely still. The cable provides better tension at the bottom than dumbbells.",
        tip: "Lead with your elbow, not your hand. Imagine pouring water out of a pitcher as you raise. Stop at shoulder height — going higher just recruits the trap. Do all reps on one side before switching.",
        search: "cable lateral raise form technique",
        gym: true
      },
      {
        name: "Tricep Pushdown",
        sets: 3, reps: "12-15", rest: 60,
        muscles: "Triceps — all 3 heads",
        equipment: "Cable machine · Rope or bar attachment",
        desc: "Set cable to high position. Rope attachment preferred — it allows a natural supination at the bottom which fully contracts the lateral head. Keep upper arms pinned to your sides throughout. Push down until arms are fully extended, flaring the rope ends out at the bottom.",
        tip: "UPPER ARMS DO NOT MOVE. If your elbows drift forward, you've lost the tricep stimulus. Wrist stays neutral — critical for tennis elbow management. The rope allows a more wrist-friendly position than the straight bar.",
        search: "cable tricep pushdown rope",
        gym: true
      },
    ],
    core: [
      { name: "Ab Wheel Rollout", sets: 3, reps: "8-12", note: "From kneeling. Roll out slowly until hips want to sag, then pull back. Press your lower back flat before you begin each rep — this is an APT correction drill disguised as a core exercise. Never let the lumbar arch as you roll." },
      { name: "Plank Hold", sets: 3, reps: "40s", note: "Forearm plank. Squeeze glutes aggressively — the most important cue. Brace abs as if bracing for impact. Body forms a perfectly straight line. The glute squeeze directly counters the anterior tilt." },
      { name: "Posterior Pelvic Tilt Hold", sets: 3, reps: "20s", note: "Lie on your back, knees bent. Flatten your entire lower back into the floor by contracting abs and glutes simultaneously. Hold and breathe. This is the fundamental drill that directly opposes anterior pelvic tilt." },
    ]
  },
  {
    id: "wednesday", label: "WED", title: "Run 5km", type: "cardio", color: "#38bdf8", icon: "🏃",
    note: "Easy-moderate pace, ~25 min. You should be able to hold a conversation — this is aerobic base building, not a race. Keep hands and fists completely relaxed throughout; chronic fist-clenching while running transmits tension up the forearm chain and aggravates tennis elbow over time.",
    preRun: [
      { name: "Kneeling Hip Flexor Stretch", reps: "60s each side", note: "Half-kneeling lunge, squeeze the glute of the back leg and push hips forward. Running with tight hip flexors causes your pelvis to tilt forward (APT) and overloads your lower back. This 2-minute investment before every run significantly reduces injury risk." },
      { name: "Leg Swings", reps: "15 each leg", note: "Stand holding a wall for balance. Swing one leg forward and backward like a pendulum, gradually increasing the range over the reps. Then swing side to side. Lubricates the hip joint and activates the glutes before they are loaded in the run." },
    ]
  },
  {
    id: "thursday", label: "THU", title: "Pull Day", type: "training", color: "#fb7185", icon: "🔴",
    warmup: [
      { name: "Band Wrist Extensor Stretch", sets: 2, reps: "30s each", note: "Non-negotiable before pulling. Extend arm straight, palm down, pull fingers toward you. Pulling movements require grip and wrist stability — warming up the extensor tendons reduces aggravation risk." },
      { name: "Band Pull-Apart", sets: 2, reps: 20, note: "Hold a light band at shoulder width, arms straight in front. Pull apart until the band touches your chest, squeezing shoulder blades together. Activates the rear delts and rotator cuff before heavy pulling. Your shoulders will thank you." },
      { name: "Lat Pulldown (warm-up weight)", sets: 2, reps: 15, note: "50% of your working weight. Focus on feeling the lats engage — not just pulling with biceps. This primes the lat-mind connection before loaded sets." },
    ],
    exercises: [
      {
        name: "Lat Pulldown",
        sets: 4, reps: "10-12", rest: 90,
        muscles: "Lats · Biceps · Rear Delts · Rhomboids",
        equipment: "Cable machine · Wide bar",
        desc: "Grip the bar slightly wider than shoulder width, palms facing forward. Lean back slightly (10–15°) and pull the bar to your upper chest, driving elbows down and back. Squeeze the lats at the bottom for a full second. Control the return over 3 seconds — this eccentric phase builds back thickness.",
        tip: "OPEN PALM GRIP whenever possible — loosely hold the bar rather than white-knuckling it. A tight grip combined with elbow flexion is the mechanism that aggravates tennis elbow. Elbows lead the pull, not the hands.",
        search: "lat pulldown proper form technique",
        gym: true
      },
      {
        name: "Seated Cable Row",
        sets: 3, reps: "12-15", rest: 75,
        muscles: "Lats · Rhomboids · Biceps · Rear Delts",
        equipment: "Cable machine · V-bar or D-handles",
        desc: "Sit tall, feet on the platform, slight bend in knees. Start with arms extended and a mild forward lean. Row the handle toward your navel while simultaneously driving elbows back past your torso. Squeeze shoulder blades together at the end. Slowly return over 3 seconds.",
        tip: "OPEN PALM GRIP is essential — do not white-knuckle. Take 3 full seconds to return. The seated cable row has constant tension throughout the entire ROM, unlike dumbbell rows — use that advantage.",
        search: "seated cable row form",
        gym: true
      },
      {
        name: "Dumbbell Row (single arm)",
        sets: 3, reps: "12 each", rest: 75,
        muscles: "Lats · Rhomboids · Rear Delts",
        equipment: "Flat bench · Dumbbell",
        desc: "Brace one knee and hand on the bench. Hold DB with the working arm hanging straight down, palm facing the bench. Row the DB toward your hip — not your armpit — driving the elbow back and up. At the top, feel the shoulder blade fully retract. Lower with control.",
        tip: "The DB should travel toward your hip, not your shoulder. Think 'elbow to ceiling' rather than 'hand to ribs.' A loose, relaxed grip protects your elbow. Allow a slight rotation of the torso at the top for full lat stretch.",
        search: "single arm dumbbell row form",
        gym: true
      },
      {
        name: "Cable Face Pull",
        sets: 3, reps: "15-20", rest: 60,
        muscles: "Rear Delts · Rotator Cuff · Upper Back",
        equipment: "Cable machine · Rope attachment",
        desc: "Set rope attachment at face height. Pull the rope toward your forehead while flaring elbows high and wide — hands should end up beside your ears at the finish. This builds the rear deltoids and external rotators, which are chronically weak and the muscles most responsible for long-term shoulder health.",
        tip: "Elbows must travel high — if they drop, you lose the rear delt stimulus. Wrists stay neutral throughout. This is possibly the single most important exercise for shoulder longevity. Treat it seriously, not as a finisher filler.",
        search: "cable face pull technique",
        gym: true
      },
      {
        name: "Hammer Curl",
        sets: 3, reps: "12 each arm", rest: 60,
        muscles: "Biceps · Brachialis · Brachioradialis",
        equipment: "Dumbbells",
        desc: "Stand or sit with a DB in each hand, thumbs pointing up. Curl both hands toward your shoulders keeping elbows pinned at your sides, then lower with control over 3 seconds. The neutral grip shifts emphasis to the brachialis and dramatically reduces rotational stress on the elbow joint.",
        tip: "Neutral wrist throughout the entire movement — this is what makes it safe for tennis elbow. Do not swing elbows forward at the top. Alternate arms or do both simultaneously. A 3-second descent is where the muscle-building stimulus lives.",
        search: "dumbbell hammer curl form",
        gym: true
      },
    ],
    core: [
      { name: "Dead Bug", sets: 3, reps: "10 each side", note: "Lie on your back, arms pointing at the ceiling, knees bent 90° in the air. Slowly lower your right arm overhead while simultaneously extending your left leg. Your lower back must remain completely flat throughout. The opposite limb pattern is the whole point — it trains anti-rotation." },
      { name: "Hanging Knee Raise (if available)", sets: 3, reps: "12-15", note: "Hang from a pull-up bar, arms straight. Brace abs and bring knees to chest in a controlled arc. Lower slowly — no swinging. The gym environment makes this possible; the dead hang also decompresses the spine after pulling." },
      { name: "Posterior Pelvic Tilt Hold", sets: 3, reps: "20s", note: "Lie on your back, knees bent. Flatten your entire lower back into the floor by contracting abs and glutes simultaneously. This is the fundamental drill that directly opposes anterior pelvic tilt." },
    ]
  },
  {
    id: "friday", label: "FRI", title: "Lower Body", type: "training", color: "#fb923c", icon: "🦵",
    warmup: [
      { name: "Glute Bridge (activation)", sets: 2, reps: 15, note: "Lie on your back, knees bent, feet flat. Drive through heels to lift hips, squeezing glutes hard at the top. The purpose here is activation, not fatigue — firing the neuromuscular signal to wake the glutes up before loading them." },
      { name: "Clamshells", sets: 2, reps: "15 each", note: "Lie on your side with hips stacked, knees bent. Keeping feet together, rotate your top knee upward. This activates the glute medius — responsible for hip stability during single-leg movements and squats." },
      { name: "Goblet Squat (light)", sets: 2, reps: 10, note: "Hold a light DB at your chest. Slow 3-second descent, drive knees out over toes. At the bottom, perform a slight posterior pelvic tilt. This rewires your squat pattern to avoid excessive anterior tilt under load." },
    ],
    exercises: [
      {
        name: "Leg Press",
        sets: 4, reps: "12-15", rest: 90,
        muscles: "Quads · Glutes · Hamstrings",
        equipment: "Leg press machine",
        desc: "Feet shoulder-width apart, mid-height on the platform. Lower the platform until knees are at ~90°, then press back to near-full extension (don't lock out). Keep lower back pressed firmly into the pad throughout — if it peels away, you've gone too deep for your current hip mobility.",
        tip: "High foot placement emphasises glutes and hamstrings. Mid placement is balanced. Low placement is quad-dominant. Given your APT goals, a mid-to-high stance is ideal — it forces more glute recruitment. Never let knees cave inward on the press.",
        search: "leg press proper form technique",
        gym: true
      },
      {
        name: "Romanian Deadlift",
        sets: 3, reps: "10-12", rest: 90,
        muscles: "Hamstrings · Glutes · Erectors",
        equipment: "Barbell or Dumbbells",
        desc: "Stand with bar at hip height (or hold DBs). Maintain a soft bend in the knees — this is a hinge, not a squat. Push hips back as far as possible while keeping your back flat, lowering the weight down your thighs. You should feel a deep stretch in your hamstrings. Drive hips forward to return.",
        tip: "Hips go back, not down — imagine pushing a door shut behind you with your hips. Keep the bar close to your body throughout. If your lower back rounds, you've gone too far. The RDL trains the posterior chain without APT-aggravating spinal compression.",
        search: "romanian deadlift form barbell",
        gym: true
      },
      {
        name: "Cable Kickback",
        sets: 3, reps: "15 each leg", rest: 60,
        muscles: "Glutes — max contraction",
        equipment: "Cable machine · Ankle strap",
        desc: "Attach ankle strap to low cable. Stand facing the machine, slight forward lean with hands on the frame. With a soft bend in the working knee, drive the leg back and up, squeezing the glute hard at full extension. This is the only exercise with direct cable resistance on the glute at the contracted position.",
        tip: "The squeeze at full extension is everything — hold it for a full second. Keep your torso from swinging; if you're rocking, reduce weight. This is a glute isolation exercise — the hip flexor should feel nothing.",
        search: "cable glute kickback form",
        gym: true
      },
      {
        name: "Leg Curl",
        sets: 3, reps: "12-15", rest: 75,
        muscles: "Hamstrings · Glutes",
        equipment: "Lying or seated leg curl machine",
        desc: "Seated or lying: position so the roller pad sits just above the Achilles, not on the calf. Curl the weight by driving heels toward your glutes. Squeeze at the peak. Lower with control over 3 seconds. The leg curl is the primary hamstring isolation movement — essential for APT correction since weak hamstrings allow the pelvis to tilt forward.",
        tip: "Point toes slightly upward (dorsiflex) to fully engage the hamstring across the knee joint. The 3-second eccentric is where hamstring hypertrophy happens. Don't slam the weight stack down.",
        search: "lying leg curl machine form",
        gym: true
      },
      {
        name: "Hip Abduction Machine",
        sets: 3, reps: "15-20", rest: 60,
        muscles: "Glute Medius · Hip Abductors",
        equipment: "Hip abduction machine",
        desc: "Sit in the machine with pads on the outside of your knees. Sit tall, slight forward lean to shift emphasis from the TFL to the glute medius. Push knees outward against resistance, pause at full abduction, and slowly return. This machine directly isolates the glute medius — one of the weakest links in APT and knee stability.",
        tip: "The slight forward lean is the key cue most people miss. Sitting fully upright recruits more TFL (hip flexor) and less glute medius. Lean forward 10–15° and feel the target shift to the side of your glute.",
        search: "hip abduction machine form",
        gym: true
      },
    ],
    apt: [
      { name: "Kneeling Hip Flexor Stretch", reps: "60s each side", note: "Half-kneeling, back knee down. Squeeze the glute of the back leg — this reciprocally relaxes the hip flexor and makes the stretch far more effective. Push hips forward until you feel the stretch at the front of the hip. Do this after every lower body session." },
      { name: "Couch Stretch", reps: "45s each side", note: "Facing away from a wall, place the top of one foot elevated on the surface. Front leg in a lunge, torso upright. Particularly effective after leg press when the quad is already warm and more receptive to lengthening." },
    ]
  },
  {
    id: "saturday", label: "SAT", title: "Run or Rest", type: "cardio", color: "#94a3b8", icon: "😴",
    note: "Intentional buffer day before Sunday soccer. If you feel good, a light 5km run flushes metabolic waste from Friday's leg session and keeps your aerobic base sharp. If your legs feel heavy or sore, take full rest. Showing up to soccer fatigued limits performance and increases injury risk.",
    preRun: [
      { name: "Hip Flexor Stretch", reps: "60s each side", note: "After Friday's lower body session your hip flexors may still be carrying residual tension. Running with tight hip flexors shortens your stride and stresses your lower back." },
      { name: "Leg Swings", reps: "15 each leg", note: "Dynamic swing forward-back then side-to-side, increasing range gradually. Lubricates the hip joint and fires up the glutes before the run demands them." },
    ]
  },
  {
    id: "sunday", label: "SUN", title: "Soccer", type: "sport", color: "#fbbf24", icon: "⚽",
    note: "Soccer is full-body conditioning — sprinting, lateral cutting, jumping, and sustained aerobic effort all in one session. It counts as both cardio and active recovery. Be mindful of throw-ins: use a controlled wrist motion rather than snapping aggressively.",
    preRun: [
      { name: "Glute Bridge", reps: "2 × 15", note: "15 controlled glute bridges before stepping on the pitch. Fires the glute-brain connection so your glutes contribute to your first sprint rather than waiting to wake up." },
      { name: "Clamshells", reps: "2 × 15 each", note: "Activates the glute medius — your primary hip stabiliser during single-leg landing, cutting, and kicking. A warm glute medius means more stable knees when you plant and cut." },
      { name: "Leg Swings", reps: "15 each leg", note: "Forward-back and side-to-side. Mobilises the hip joint before explosive movement. Soccer demands instant full-range hip movement — cold hip flexors are the most commonly strained muscles in field sport." },
    ]
  }
];

const PROGRESS_KEY = "workout_tracker_gym_v1";
function loadProgress() { try { const r = localStorage.getItem(PROGRESS_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; } }
function saveProgress(d) { try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(d)); } catch {} }

const TYPE_META = {
  training: { label: "STRENGTH" },
  cardio:   { label: "CARDIO" },
  rest:     { label: "RECOVERY" },
  sport:    { label: "SPORT" },
};

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function WorkoutApp() {
  const [activeDay, setActiveDay] = useState(() => {
    const map = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    return map[new Date().getDay()] || "tuesday";
  });
  const [activeTab, setActiveTab] = useState("plan");
  const [expandedEx, setExpandedEx] = useState(null);
  const [progress, setProgress] = useState(loadProgress);
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeSection, setActiveSection] = useState("workout");
  const scrollRef = useRef(null);

  const day = DAYS.find(d => d.id === activeDay) || DAYS[1];

  const getWeekKey = () => {
    const now = new Date(); now.setDate(now.getDate() + weekOffset * 7);
    const jan1 = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week}`;
  };
  const weekKey = getWeekKey();

  const getLog = (dayId, exName, set) => progress?.[weekKey]?.[dayId]?.[exName]?.[set] || { reps: "", weight: "" };
  const updateLog = (dayId, exName, set, field, value) => {
    const updated = JSON.parse(JSON.stringify(progress));
    if (!updated[weekKey]) updated[weekKey] = {};
    if (!updated[weekKey][dayId]) updated[weekKey][dayId] = {};
    if (!updated[weekKey][dayId][exName]) updated[weekKey][dayId][exName] = {};
    if (!updated[weekKey][dayId][exName][set]) updated[weekKey][dayId][exName][set] = { reps: "", weight: "" };
    updated[weekKey][dayId][exName][set][field] = value;
    setProgress(updated); saveProgress(updated);
  };

  const isDayComplete = (dayId) => {
    const d = DAYS.find(x => x.id === dayId);
    if (!d?.exercises?.length) return false;
    return d.exercises.every(ex => Array.from({ length: ex.sets }).every((_, i) => getLog(dayId, ex.name, i).reps !== ""));
  };

  const completedDays = DAYS.filter(d => isDayComplete(d.id)).length;
  const trainingDays = DAYS.filter(d => d.exercises?.length).length;

  const switchDay = (id) => {
    setActiveDay(id); setActiveTab("plan"); setExpandedEx(null);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "#07080f", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Space+Grotesk:wght@500;600;700&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        input[type=number]::-webkit-inner-spin-button { display: none; }
        input { -webkit-appearance: none; }
        .ripple { position: relative; overflow: hidden; }
        .ripple::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.06); opacity: 0; transition: opacity 0.15s; border-radius: inherit; }
        .ripple:active::after { opacity: 1; }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .slide-up { animation: slideUp 0.25s ease forwards; }
        .ex-expand { animation: fadeIn 0.2s ease forwards; }
        .inp:focus { outline: none; border-color: rgba(52,211,153,0.5) !important; background: rgba(52,211,153,0.04) !important; }
        .gym-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 800; letter-spacing: 1px; background: linear-gradient(135deg, #f59e0b, #ef4444); color: #000; border-radius: 5px; padding: 2px 6px; }
      `}</style>

      <div style={{ height: "env(safe-area-inset-top, 0px)", background: "#07080f" }} />

      {/* TOP HEADER */}
      <div style={{ background: "#07080f", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "12px 16px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px", color: "#fff" }}>
                Recomp Protocol
              </div>
              <span className="gym-badge">🏋️ GYM</span>
            </div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 1, letterSpacing: "0.3px" }}>
              42M · 144 lbs · 17.7% → 14%
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button onClick={() => setWeekOffset(w => w - 1)} className="ripple" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            <div style={{ fontSize: 11, color: "#64748b", minWidth: 54, textAlign: "center" }}>
              {weekOffset === 0 ? "This week" : weekOffset > 0 ? `+${weekOffset}w` : `${weekOffset}w`}
            </div>
            <button onClick={() => setWeekOffset(w => w + 1)} className="ripple" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          </div>
        </div>

        {/* DAY STRIP */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12, msOverflowStyle: "none", scrollbarWidth: "none" }}>
          {DAYS.map(d => {
            const complete = isDayComplete(d.id);
            const isActive = activeDay === d.id;
            return (
              <button key={d.id} onClick={() => switchDay(d.id)} className="ripple" style={{
                flexShrink: 0, padding: "8px 14px", borderRadius: 20, border: "none",
                background: isActive ? d.color : "rgba(255,255,255,0.05)",
                color: isActive ? "#000" : "#64748b",
                cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.8px",
                display: "flex", alignItems: "center", gap: 5,
                transition: "all 0.2s",
                boxShadow: isActive ? `0 0 16px ${d.color}55` : "none",
              }}>
                <span style={{ fontSize: 13 }}>{complete ? "✓" : d.icon}</span>
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {activeSection === "workout" ? (
          <div style={{ padding: "12px 14px 24px" }}>

            {/* DAY HERO */}
            <div className="slide-up" style={{
              borderRadius: 20, padding: "18px 20px", marginBottom: 14,
              background: `linear-gradient(135deg, ${day.color}18 0%, ${day.color}08 100%)`,
              border: `1px solid ${day.color}30`,
              position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: -20, right: -10, fontSize: 80, opacity: 0.08, lineHeight: 1 }}>{day.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `${day.color}22`, border: `1.5px solid ${day.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{day.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 17, color: "#fff" }}>{day.title}</div>
                    <span style={{ fontSize: 10, background: `${day.color}25`, color: day.color, borderRadius: 6, padding: "2px 7px", fontWeight: 700, letterSpacing: "0.5px" }}>{TYPE_META[day.type].label}</span>
                    {day.type === "training" && <span className="gym-badge">🏋️ GYM</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {day.type === "training" ? `${day.exercises?.length || 0} exercises · free weights & cables · ~35 min` :
                      day.type === "cardio" ? "~25 min · 5km aerobic base" :
                      day.type === "sport" ? "60–90 min · full body" : "Active recovery · 10 min"}
                  </div>
                </div>
              </div>
              {day.note && <div style={{ marginTop: 12, fontSize: 12.5, color: "#94a3b8", lineHeight: 1.65, borderTop: `1px solid ${day.color}20`, paddingTop: 12 }}>{day.note}</div>}
            </div>

            {/* TABS */}
            {day.type === "training" && (
              <div style={{ display: "flex", gap: 4, marginBottom: 14, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 4 }}>
                {[{ id: "plan", label: "Exercises", icon: "📋" }, { id: "track", label: "Log Sets", icon: "📊" }].map(tab => (
                  <button key={tab.id} className="ripple" onClick={() => setActiveTab(tab.id)} style={{
                    flex: 1, padding: "10px", border: "none", borderRadius: 11,
                    background: activeTab === tab.id ? "rgba(255,255,255,0.1)" : "transparent",
                    color: activeTab === tab.id ? "#fff" : "#64748b",
                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                    boxShadow: activeTab === tab.id ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
                    transition: "all 0.2s"
                  }}>{tab.icon} {tab.label}</button>
                ))}
              </div>
            )}

            {/* WARM-UP */}
            {day.warmup && <SectionBlock title="Warm-Up" icon="🔥" color="#fbbf24">
              {day.warmup.map((w, i) => <MiniCard key={i} item={w} color="#fbbf24" />)}
            </SectionBlock>}

            {day.preRun && <SectionBlock title="Pre-Activity" icon="🔥" color="#38bdf8">
              {day.preRun.map((w, i) => <MiniCard key={i} item={w} color="#38bdf8" />)}
            </SectionBlock>}

            {/* PLAN VIEW */}
            {(activeTab === "plan" || day.type !== "training") && day.exercises && (
              <SectionBlock title="Main Lifts" icon="💪" color={day.color}>
                {day.exercises.map((ex, i) => (
                  <ExCard key={i} ex={ex} expanded={expandedEx === ex.name}
                    onToggle={() => setExpandedEx(expandedEx === ex.name ? null : ex.name)}
                    color={day.color} index={i} />
                ))}
              </SectionBlock>
            )}

            {/* TRACK VIEW */}
            {activeTab === "track" && day.type === "training" && day.exercises && (
              <SectionBlock title="Log Sets" icon="📊" color={day.color}>
                {day.exercises.map((ex, i) => (
                  <TrackCard key={i} ex={ex} dayId={day.id} getLog={getLog} updateLog={updateLog} color={day.color} />
                ))}
              </SectionBlock>
            )}

            {/* CORE */}
            {day.core && <SectionBlock title="Core + APT" icon="🔲" color="#c084fc">
              {day.core.map((c, i) => <MiniCard key={i} item={c} color="#c084fc" />)}
            </SectionBlock>}

            {/* APT */}
            {day.apt && <SectionBlock title="APT Stretches" icon="🧘" color="#c084fc">
              {day.apt.map((s, i) => <MiniCard key={i} item={s} color="#c084fc" />)}
            </SectionBlock>}

            {/* REST STRETCHES */}
            {day.stretches && <SectionBlock title="APT Stretch Routine" icon="🧘" color="#c084fc" badge="10 min">
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, padding: "8px 12px", background: "rgba(192,132,252,0.07)", borderRadius: 10 }}>
                Most important session of the week for fixing anterior pelvic tilt. The hip flexor stretch alone is worth doing daily.
              </div>
              {day.stretches.map((s, i) => <MiniCard key={i} item={s} color="#c084fc" />)}
            </SectionBlock>}

          </div>
        ) : (
          <StatsView completedDays={completedDays} trainingDays={trainingDays} />
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ background: "#0a0b14", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", paddingBottom: "env(safe-area-inset-bottom, 0px)", flexShrink: 0 }}>
        {[
          { id: "workout", icon: "⚡", label: "Workout" },
          { id: "stats", icon: "📈", label: "Progress" },
        ].map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} className="ripple" style={{
            flex: 1, padding: "12px 0 10px", border: "none", background: "transparent",
            color: activeSection === s.id ? "#34d399" : "#475569",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            transition: "color 0.2s"
          }}>
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.5px" }}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function SectionBlock({ title, icon, color, badge, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", color, textTransform: "uppercase" }}>{title}</span>
        {badge && <span style={{ fontSize: 10, background: `${color}20`, color, borderRadius: 6, padding: "1px 7px", fontWeight: 700 }}>{badge}</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

// Parse seconds from strings like "40s", "60s each side", "30s each", "45s each side"
function parseDuration(repsStr) {
  if (!repsStr) return null;
  const match = String(repsStr).match(/(\d+)s/);
  return match ? parseInt(match[1], 10) : null;
}
function isEachSide(repsStr) {
  return /each\s*(side)?/i.test(String(repsStr));
}

function MiniCard({ item, color }) {
  const [open, setOpen] = useState(false);
  const duration = parseDuration(item.reps);
  const eachSide = isEachSide(item.reps);

  return (
    <div style={{
      background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: "12px 14px",
    }}>
      <div onClick={() => item.note && setOpen(o => !o)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", cursor: item.note ? "pointer" : "default" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#e2e8f0" }}>{item.name}</div>
          {item.sets && <div style={{ fontSize: 11, color, marginTop: 3 }}>{item.sets} sets × {item.reps}</div>}
          {!item.sets && item.reps && <div style={{ fontSize: 11, color, marginTop: 3 }}>{item.reps}</div>}
        </div>
        {item.note && <span style={{ color: "#475569", fontSize: 14, marginLeft: 8, flexShrink: 0, transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(180deg)" : "none" }}>⌄</span>}
      </div>

      {/* Inline hold timer for timed exercises */}
      {duration && (
        <HoldTimer seconds={duration} eachSide={eachSide} color={color} />
      )}

      {open && item.note && (
        <div className="ex-expand" style={{ marginTop: 10, fontSize: 12.5, color: "#94a3b8", lineHeight: 1.65, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
          {item.note}
        </div>
      )}
    </div>
  );
}

function HoldTimer({ seconds, eachSide, color }) {
  // side: 0 = left/first, 1 = right/second
  const [side, setSide] = useState(0);
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState([false, false]); // track completion per side
  const intervalRef = useRef(null);

  const totalSides = eachSide ? 2 : 1;
  const sideLabel = eachSide ? (side === 0 ? "Left" : "Right") : null;
  const allDone = eachSide ? done[0] && done[1] : done[0];

  const start = () => {
    if (running) return;
    setRunning(true);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(seconds);
    setSide(0);
    setDone([false, false]);
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            // mark current side done
            setDone(prev => {
              const next = [...prev];
              next[side] = true;
              return next;
            });
            // auto-advance to next side if eachSide
            if (eachSide && side === 0) {
              setSide(1);
              setRemaining(seconds);
            }
            return seconds;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, side, eachSide, seconds]);

  const progress = (seconds - remaining) / seconds;
  const r = 14;
  const circ = 2 * Math.PI * r;

  return (
    <div style={{ marginTop: 10, padding: "9px 10px", background: "rgba(0,0,0,0.2)", borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
      {/* Arc ring */}
      <svg width="36" height="36" viewBox="0 0 36 36" style={{ flexShrink: 0 }}>
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" />
        <circle cx="18" cy="18" r={r} fill="none"
          stroke={allDone ? "#34d399" : running ? color : "#475569"}
          strokeWidth="2.5"
          strokeDasharray={circ}
          strokeDashoffset={running ? circ * (1 - progress) : circ}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }} />
        <text x="18" y="22" textAnchor="middle" fontSize="9" fontWeight="700"
          fill={allDone ? "#34d399" : running ? color : "#64748b"}
          fontFamily="DM Sans">
          {allDone ? "✓" : running ? `${remaining}` : seconds}
        </text>
      </svg>

      {/* Label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {eachSide ? (
          <div style={{ display: "flex", gap: 6 }}>
            {["L", "R"].map((lbl, i) => (
              <div key={i} style={{
                fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                background: done[i] ? "rgba(52,211,153,0.15)" : (side === i && running) ? `${color}20` : "rgba(255,255,255,0.05)",
                color: done[i] ? "#34d399" : (side === i && running) ? color : "#475569",
                border: `1px solid ${done[i] ? "rgba(52,211,153,0.3)" : (side === i && running) ? `${color}40` : "rgba(255,255,255,0.08)"}`,
                transition: "all 0.3s"
              }}>
                {done[i] ? `${lbl} ✓` : (side === i && running) ? `${lbl} ${remaining}s` : `${lbl} ${seconds}s`}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 11, color: allDone ? "#34d399" : running ? color : "#64748b", fontWeight: 600 }}>
            {allDone ? "Complete ✓" : running ? `${remaining}s remaining` : `${seconds}s hold`}
          </div>
        )}
      </div>

      {/* Button */}
      {allDone ? (
        <button onClick={reset}
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
          ↺
        </button>
      ) : (
        <button
          onClick={() => {
            if (running) {
              clearInterval(intervalRef.current);
              setRunning(false);
              setRemaining(seconds);
            } else {
              setRunning(true);
            }
          }}
          style={{
            background: running ? "rgba(239,68,68,0.12)" : `${color}18`,
            border: `1px solid ${running ? "rgba(239,68,68,0.25)" : color + "35"}`,
            color: running ? "#ef4444" : color,
            borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, flexShrink: 0
          }}>
          {running ? "✕" : "▶ Go"}
        </button>
      )}
    </div>
  );
}

function ExCard({ ex, expanded, onToggle, color, index }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.035)", border: `1px solid ${expanded ? color + "40" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s",
    }}>
      <button onClick={onToggle} className="ripple" style={{
        width: "100%", padding: "14px 16px", background: "transparent",
        border: "none", cursor: "pointer", textAlign: "left",
        display: "flex", alignItems: "center", gap: 12
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 13, color }}>{index + 1}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{ex.name}</div>
            {ex.gym && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.5px", background: "rgba(245,158,11,0.15)", color: "#f59e0b", borderRadius: 4, padding: "1px 5px" }}>GYM</span>}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{ex.muscles}</div>
        </div>
        <div style={{ flexShrink: 0, textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color }}>{ex.sets}×{ex.reps}</div>
          {ex.rest && <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>{ex.rest}s rest</div>}
          <span style={{ fontSize: 18, color: "#475569", display: "block", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}>⌄</span>
        </div>
      </button>

      {expanded && (
        <div className="ex-expand" style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>

          {/* Equipment badge */}
          {ex.equipment && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 11 }}>🏋️</span>
              <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>{ex.equipment}</span>
            </div>
          )}

          {/* YouTube */}
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.search)}`} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "10px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, color: "#fca5a5", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
            <span style={{ fontSize: 18 }}>▶</span>
            <div>
              <div>Watch on YouTube</div>
              <div style={{ fontSize: 11, color: "#ef4444", marginTop: 1, fontWeight: 400 }}>{ex.search}</div>
            </div>
          </a>

          {/* About */}
          {ex.desc && <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: "1px", marginBottom: 4, fontWeight: 700 }}>ABOUT</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65 }}>{ex.desc}</div>
          </div>}

          {/* Tip */}
          <div style={{ background: `${color}0d`, border: `1px solid ${color}30`, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, color, letterSpacing: "1px", marginBottom: 4, fontWeight: 700 }}>💡 COACHING TIP</div>
            <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.65 }}>{ex.tip}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrackCard({ ex, dayId, getLog, updateLog, color }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#e2e8f0" }}>{ex.name}</div>
        {ex.gym && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.5px", background: "rgba(245,158,11,0.15)", color: "#f59e0b", borderRadius: 4, padding: "1px 5px" }}>GYM</span>}
      </div>
      {ex.equipment && (
        <div style={{ fontSize: 11, color: "#f59e0b", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
          <span>🏋️</span> {ex.equipment}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr", gap: 6, marginBottom: 6 }}>
        <div />
        <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.8px", fontWeight: 700 }}>REPS</div>
        <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.8px", fontWeight: 700 }}>WEIGHT (kg)</div>
      </div>
      {Array.from({ length: ex.sets }).map((_, si) => {
        const log = getLog(dayId, ex.name, si);
        const done = log.reps !== "";
        return (
          <div key={si} style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr", gap: 6, marginBottom: 7, alignItems: "center" }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: done ? `${color}25` : "rgba(255,255,255,0.05)", border: `1.5px solid ${done ? color : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: done ? color : "#475569" }}>{si + 1}</div>
            <input className="inp" type="number" placeholder={ex.reps.toString().split("-")[0]}
              value={log.reps}
              onChange={e => updateLog(dayId, ex.name, si, "reps", e.target.value)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 10px", color: "#e2e8f0", fontSize: 14, width: "100%", fontFamily: "'DM Sans'" }} />
            <input className="inp" type="number" placeholder="0"
              value={log.weight}
              onChange={e => updateLog(dayId, ex.name, si, "weight", e.target.value)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 10px", color: "#e2e8f0", fontSize: 14, width: "100%", fontFamily: "'DM Sans'" }} />
          </div>
        );
      })}
      {ex.rest && (
        <RestTimer seconds={ex.rest} color={color} />
      )}
    </div>
  );
}

function RestTimer({ seconds, color }) {
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) { clearInterval(intervalRef.current); setRunning(false); return seconds; }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  const progress = (seconds - remaining) / seconds;
  const r = 16;
  const circ = 2 * Math.PI * r;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle cx="20" cy="20" r={r} fill="none" stroke={running ? color : "#475569"} strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.2s" }} />
        <text x="20" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill={running ? color : "#64748b"} fontFamily="DM Sans">
          {remaining}s
        </text>
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "#64748b" }}>Rest timer · {seconds}s</div>
        <div style={{ fontSize: 11, color: running ? color : "#475569", fontWeight: 600 }}>
          {running ? `${remaining}s remaining` : remaining === seconds ? "Ready" : "Done"}
        </div>
      </div>
      <button onClick={() => { if (running) { clearInterval(intervalRef.current); setRunning(false); setRemaining(seconds); } else { setRemaining(seconds); setRunning(true); } }}
        style={{ background: running ? "rgba(239,68,68,0.15)" : `${color}20`, border: `1px solid ${running ? "rgba(239,68,68,0.3)" : color + "40"}`, color: running ? "#ef4444" : color, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
        {running ? "✕" : "▶ Start"}
      </button>
    </div>
  );
}

function StatsView({ completedDays, trainingDays }) {
  const stats = [
    { label: "Current Weight", val: "144 lbs", sub: "starting point", color: "#38bdf8" },
    { label: "Target Weight", val: "145 lbs", sub: "net +1 lb", color: "#34d399" },
    { label: "Current Body Fat", val: "17.7%", sub: "~25.5 lbs fat", color: "#fb923c" },
    { label: "Target Body Fat", val: "≤14%", sub: "lose ~5–6 lbs fat", color: "#34d399" },
    { label: "Lean Mass Now", val: "118.5 lbs", sub: "baseline", color: "#38bdf8" },
    { label: "Lean Mass Target", val: "~124.7 lbs", sub: "gain ~6 lbs", color: "#34d399" },
    { label: "Daily Calories", val: "~2,100", sub: "near maintenance", color: "#fbbf24" },
    { label: "Daily Protein", val: "185–200g", sub: "non-negotiable", color: "#fb7185" },
  ];

  return (
    <div style={{ padding: "16px 14px 32px" }}>
      <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, color: "#fff", marginBottom: 4 }}>Recomp Targets</div>
      <div style={{ fontSize: 12, color: "#475569", marginBottom: 18 }}>5–8 month timeline · Scale barely moves</div>

      <div style={{ background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 20, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#34d399", letterSpacing: "1px", marginBottom: 12 }}>WEEKLY COMPLETION</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(52,211,153,0.15)" strokeWidth="5" />
              <circle cx="36" cy="36" r="28" fill="none" stroke="#34d399" strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - completedDays / Math.max(trainingDays, 1))}`}
                strokeLinecap="round" transform="rotate(-90 36 36)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#34d399", fontFamily: "'Space Grotesk'" }}>{completedDays}</span>
              <span style={{ fontSize: 9, color: "#64748b" }}>/ {trainingDays}</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>{completedDays === trainingDays ? "Week complete! 🎉" : `${trainingDays - completedDays} session${trainingDays - completedDays !== 1 ? "s" : ""} left`}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Training days logged this week</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6, fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'Space Grotesk'" }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 16px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "1px", marginBottom: 8 }}>REMEMBER</div>
        <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65 }}>
          The scale will barely move — that's the point of recomp. Track your waist measurement and how clothes fit. Muscle gain and fat loss happening simultaneously shows up in the mirror, not on the scale.
        </div>
      </div>
    </div>
  );
}
