import {
  motion,
  type MotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect } from "react";

export function NumberCounter({
  value,
  height,
}: {
  value: number;
  height: number;
}) {
  const valueRoundedToPlace = value;
  const animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 200,
    mass: 0.1,
    damping: 10,
  });

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <span className="overflow-hidden">
      <div
        style={{ height }}
        className="relative flex w-[1ch] flex-col items-center font-mono tabular-nums"
      >
        {[...Array(10).keys()].map((i) => (
          <NumberPlace key={i} mv={animatedValue} number={i} height={height} />
        ))}
      </div>
    </span>
  );
}

function NumberPlace({
  mv,
  number,
  height,
}: {
  mv: MotionValue<number>;
  number: number;
  height: number;
}) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;

    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center"
      suppressHydrationWarning
    >
      {number}
    </motion.span>
  );
}
