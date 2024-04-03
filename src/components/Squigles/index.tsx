import * as d3 from "d3";
import {
  ConsLinkedList,
  LinkedList,
  Option,
  Stream,
  Tuple2,
  Vector,
} from "prelude-ts";
import { useCallback, useMemo, useState } from "react";
import * as c from "./styled";

const MIN_DIFFERENTIATION = 35;
const MAX_DIFFERENTIATION = 100;

const MIN_POINTS = 3;
const MAX_POINTS = 5;

const getRndBetween = (top: number, bottom: number) =>
  bottom + Math.round((top - bottom) * Math.random());

const getDirection = (
  totalHeight: number,
  prevHeight: number,
  delta: number,
) => {
  if (totalHeight - delta < MIN_DIFFERENTIATION) {
    return 1;
  } else if (totalHeight - MIN_DIFFERENTIATION < prevHeight + delta) {
    return -1;
  } else {
    return Math.sign(Math.random() - 0.5);
  }
};

const makeLine = d3
  .line()
  .x((d) => d[0])
  .y((d) => d[1])
  .curve(d3.curveBasis);

type Props = {
  maxHeight?: Option<number>;
  lines: number;
};

export default function Squigles({ lines, maxHeight = Option.none() }: Props) {
  const [[height, width], setHW] = useState([0, 0]);

  const measurementRef = useCallback(
    (element: SVGSVGElement | null) => {
      if (!element) return;

      const observer = new ResizeObserver(() => {
        const { height: h, width: w } = element.getBoundingClientRect();

        setHW([maxHeight.map((mh) => Math.min(h, mh)).getOrElse(h), w]);
      });

      observer.observe(element);
    },
    [maxHeight],
  );

  const linePaths = useMemo<Vector<string>>(() => {
    if (!width || !height) return Vector.empty();

    return Stream.continually(() => {
      const points = getRndBetween(MIN_POINTS, MAX_POINTS);

      return Stream.continually(() =>
        getRndBetween(MIN_DIFFERENTIATION, MAX_DIFFERENTIATION),
      )
        .take(points)
        .foldLeft(
          LinkedList.of<Tuple2<number, number>>(
            Tuple2.of(0, getRndBetween(height, 0)),
          ),
          (soFar, nextDiff) => {
            const [lastX, lastY] = soFar.head().get().toPair();
            const direction = getDirection(height, lastY, nextDiff);
            const nextY = lastY + nextDiff * direction;
            const nextX = width / points + lastX;

            return soFar.prepend(Tuple2.of(nextX, nextY)) as ConsLinkedList<
              Tuple2<number, number>
            >;
          },
        )
        .transform((x) => {
          return Math.random() < 0.5 ? x.toArray() : x.reverse().toArray();
        });
    })
      .take(lines)
      .map((x) => makeLine(x.map((t) => t.toPair()))!)
      .toVector();
  }, [lines, width, height]);

  return (
    <c.Svg height={height} width={width} ref={measurementRef}>
      <linearGradient id="transColours">
        <stop offset="0" stopColor="#61cdf6" />
        <stop offset="0.4" stopColor="#f6f6f6" />
        <stop offset="0.6" stopColor="#f6f6f6" />
        <stop offset="1" stopColor="#f5aab9" />
      </linearGradient>
      <linearGradient id="transColoursFlipped">
        <stop offset="0" stopColor="#f5aab9" />
        <stop offset="0.4" stopColor="#f6f6f6" />
        <stop offset="0.6" stopColor="#f6f6f6" />
        <stop offset="1" stopColor="#61cdf6" />
      </linearGradient>
      {linePaths.zipWithIndex().map(([d, key]) => (
        <g key={key}>
          <c.Path
            d={d}
            stroke={"url(#transColours" + (key % 2 ? "Flipped" : "") + ")"}
          />
        </g>
      ))}
    </c.Svg>
  );
}
