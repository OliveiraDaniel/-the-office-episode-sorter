import { useEffect, useRef, useState } from "react";
import "./SlotMachine.css";

const TOTAL_TICKS = 17;
const MIN_DELAY = 45;
const MAX_DELAY = 145;

export default function SlotMachine({ pool, onResult }) {
  const [displayed, setDisplayed] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function randomEpisode() {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function spin() {
    if (spinning || pool.length === 0) return;

    setSpinning(true);
    const finalEpisode = randomEpisode();
    let tick = 0;

    function nextTick() {
      tick += 1;
      if (tick >= TOTAL_TICKS) {
        setDisplayed(finalEpisode);
        setSpinning(false);
        onResult(finalEpisode);
        return;
      }
      setDisplayed(randomEpisode());
      const progress = tick / TOTAL_TICKS;
      const delay = MIN_DELAY + progress * progress * (MAX_DELAY - MIN_DELAY);
      timeoutRef.current = setTimeout(nextTick, delay);
    }

    timeoutRef.current = setTimeout(nextTick, MIN_DELAY);
  }

  const empty = pool.length === 0;

  return (
    <div className="slot-machine">
      <div className={spinning ? "slot-reel slot-reel--spinning" : "slot-reel"}>
        {displayed ? (
          <>
            <span className="slot-reel__tag">
              T{displayed.seasonId} · Ep {displayed.episode}
            </span>
            <span className="slot-reel__title">{displayed.title}</span>
          </>
        ) : (
          <span className="slot-reel__placeholder">
            {empty ? "Sem episódios para este filtro" : "Clique em Girar para sortear"}
          </span>
        )}
      </div>

      <button
        type="button"
        className="spin-btn"
        onClick={spin}
        disabled={spinning || empty}
      >
        {spinning ? "Girando..." : "Girar"}
      </button>
    </div>
  );
}
