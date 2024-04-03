const directionArr = ["N", "E", "S", "W"] as const;

type Props = {
  direction: (typeof directionArr)[number];
};

export default function Arrow({ direction }: Props) {
  const directionIndex = directionArr.findIndex((x) => x === direction);
  const rotation = 17 + (directionIndex + 1) * 90;
  return (
    <img
      src="/arrow.svg"
      style={{
        maxHeight: "1.5em",
        transform: "rotate(" + rotation + "deg)",
      }}
      aria-hidden
    />
  );
}
