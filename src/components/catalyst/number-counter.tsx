import { motion, MotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

export function NumberCounter({
  value,
  height,
}: {
  value: number;
  height: number;
}) {
  let valueRoundedToPlace = value;
  let animatedValue = useSpring(valueRoundedToPlace, {
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
        className="flex flex-col items-center relative w-[1ch] tabular-nums"
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
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;

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
