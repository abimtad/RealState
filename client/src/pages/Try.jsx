import { useRef, useState } from "react";

export default function Try() {
  const [count, setCount] = useState(0);
  const paragraphRef = useRef(null);

  console.log(
    "RENDER:",
    "Ref object:",
    paragraphRef,
    "Current value:",
    paragraphRef.current
  );

  return (
    <div>
      <p ref={paragraphRef}>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>
        Re-render (count: {count})
      </button>
    </div>
  );
}

// import { useState, useRef, useEffect } from "react";

// export default function Try() {
//   const [score, setScore] = useState(0);
//   const prevScoreRef = useRef(null); // { current: null }

//   // Update ref AFTER each render
//   useEffect(() => {
//     console.log("--- EFFECT RUNS ---");
//     console.log(
//       "Before update:",
//       `Prev: ${prevScoreRef.current}`,
//       `Current: ${score}`
//     );
//     prevScoreRef.current = score;
//     console.log(
//       "After update:",
//       `Prev: ${prevScoreRef.current}`,
//       `Current: ${score}`
//     );
//   }, [score]);

//   console.log("--- RENDER ---");
//   console.log(
//     "During render:",
//     `Prev: ${prevScoreRef.current}`,
//     `Current: ${score}`
//   );

//   return (
//     <div>
//       <p>Current Score: {score}</p>
//       <p>Previous Score: {prevScoreRef.current ?? "None"}</p>
//       <button onClick={() => setScore((s) => s + 10)}>
//         Increase Score (+10)
//       </button>
//     </div>
//   );
// }
