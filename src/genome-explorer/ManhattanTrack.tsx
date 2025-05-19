import React, {
  useMemo,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { v1 as uuidv1 } from "uuid";
import { toScientificNotation } from "../web/Portals/DiseaseTraitPortal/utils";
import { ClipPath } from "../web/Portals/SingleCellPortal/Arcs";

export const svgPoint = (
  svg: SVGSVGElement,
  event: React.MouseEvent<SVGElement>
) => {
  if (svg.createSVGPoint && svg) {
    let point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    point = point.matrixTransform(svg!.getScreenCTM()!.inverse());
    return [point.x, point.y];
  }
  const rect = svg.getBoundingClientRect();
  return [
    event.clientX - rect.left - svg.clientLeft,
    event.clientY - rect.top - svg.clientTop,
  ];
};

export type TooltipProps = {
  width: number;
  height: number;
};

export type TooltipData = {
  show: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: React.ReactElement;
  setTooltip: (tooltip: {
    show: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    content?: React.ReactElement;
  }) => void;
};
const TooltipContext = React.createContext<TooltipData>({
  show: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  content: undefined,
  setTooltip: () => {},
});

export interface Domain {
  chromosome?: string;
  start: number;
  end: number;
}

export type YRange = {
  min: number;
  max: number;
};
/**
 * Creates a closure for mapping values into an X coordinate space.
 * @param domain object with the start and end coordinates of the original values.
 * @param width the maximum value of the output space.
 */
export function xtransform(
  domain: Domain,
  width: number
): (i: number) => number {
  return (i: number) =>
    ((i - domain.start) * width) / (domain.end - domain.start);
}

/**
 * Creates a linear scale for mapping values into a Y coordinate space.
 * @param range object with the max and min coordinates of the original values.
 * @param height the maximum value of the output space.
 */
export function ytransform(
  range: YRange,
  height: number
): (i: number) => number {
  return (i: number) =>
    range.max === range.min
      ? 0
      : ((range.max - i) * height) / (range.max - range.min);
}

export type SummaryStatisticSNP = {
  score: number;
  rsId: string;
  coordinates: {
    chromosome: string;
    start: number;
    end: number;
  };
};

export type ManhattanSNP = {
  x: number;
  y: number;
  data: SummaryStatisticSNP;
};

const STYLE = {
  fontSize: "12px",
  backgroundColor: "#ffffff",
  border: "1px solid",
  padding: "1em",
};
export const TooltipContent: React.FC<ManhattanSNP> = (snp) => (
  <div style={STYLE}>
    {snp.data.rsId ? `name: ${snp.data.rsId}` : ""}
    <br />
    {`p-value: ${snp.data.score}`}
    <br />
  </div>
);

/**
 * Renders summary statistic data to Manhattan plot shapes.
 * @param data input data vector.
 * @param x a transform function for mapping data coordinates to SVG coordinates.
 * @param y a transform function for mapping data scores to SVG coordinates.
 */
export function renderManhattanPlotData(
  data: SummaryStatisticSNP[],
  x: (value: number) => number,
  y: (value: number) => number
): ManhattanSNP[] {
  return data.map(
    (snp) => ({
      x: x(snp.coordinates.start),
      y: y(snp.score),
      data: snp,
    }),
    [data]
  );
}
export type ManhattanTrackProps = {
  width: number;
  height: number;
  id?: string;
  transform?: string;
  domain: Domain;
  data?: SummaryStatisticSNP[];
  svgRef?: React.RefObject<SVGSVGElement>;
  threshold?: number;
  max?: number;
  onHeightChanged?: (height: number) => void;
  tooltipContent?: React.FC<ManhattanSNP>;
  snpProps?: (
    snp: ManhattanSNP,
    props: ManhattanTrackProps
  ) => React.SVGProps<SVGCircleElement>;
  onSNPClick?: (snp: ManhattanSNP) => void;
  onSNPMousedOver?: (snp: ManhattanSNP) => void;
  onSNPMousedOut?: () => void;
  sortOrder?: (a: ManhattanSNP, b: ManhattanSNP) => number;
  className?: string;
};

export const defaultManhattanSNPProps = (
  snp: ManhattanSNP,
  props: ManhattanTrackProps
): React.SVGProps<SVGCircleElement> => ({
  fill: snp.data.score <= 5e-8 ? "#ff00000" : "#dddddd",
  r: snp.data.score <= 5e-8 ? props.height / 30 : props.height / 40,
});

export const ManhattanTrack: React.FC<ManhattanTrackProps> = (props) => {
  const tooltipContext = useContext(TooltipContext);
  const Tooltip = props.tooltipContent || TooltipContent;
  const mouseOver = useCallback(
    (event: React.MouseEvent<SVGCircleElement>, snp: ManhattanSNP) => {
      if (!props.svgRef || !props.svgRef.current) return;
      const [x, y] = svgPoint(props.svgRef.current, event);
      tooltipContext.setTooltip({
        show: true,
        x: x > props.width - 100 ? x - 90 : x + 10,
        y: y + 10,
        width: 100,
        height: 50,
        content: <Tooltip {...snp} />,
      });
    },
    [Tooltip, props]
  );
  const mouseOut = useCallback(() => {
    props.onSNPMousedOut && props.onSNPMousedOut();
    tooltipContext.setTooltip({
      show: false,
      x: 0,
      y: 0,
      content: undefined,
      width: 0,
      height: 0,
    });
  }, [tooltipContext]);

  const uuid = useRef(uuidv1());
  const max = props.max || 20;
  const x = useCallback(xtransform(props.domain, props.width), [props]);
  const y = useCallback(ytransform({ min: 0, max }, props.height), [props]);
  const id = props.id || uuid.current.toString();
  const circleProps = useCallback(
    props.snpProps
      ? (x: ManhattanSNP, props: ManhattanTrackProps) => ({
          ...defaultManhattanSNPProps(x, props),
          ...props.snpProps!(x, props),
        })
      : defaultManhattanSNPProps,
    [props]
  );

  const rendered: ManhattanSNP[] = useMemo(
    () =>
      renderManhattanPlotData(props.data!, x, (v) => y(v > max ? max : v)).sort(
        props.sortOrder || ((a, b) => a.data.score - b.data.score)
      ),
    [props.domain, props.width, props.data]
  );
  useEffect(() => {
    props.onHeightChanged && props.onHeightChanged(props.height);
  }, [props.height]);

  return (
    <g
      width={props.width}
      height={props.height}
      transform={props.transform}
      clipPath={`url(#${id})`}
      className={props.className}
    >
      <defs>
        <ClipPath id={id} width={props.width} height={props.height} />
      </defs>
      <text x={40} y={y(props.threshold || 7.3)}>
        {toScientificNotation(+"5e-8", 0)}
      </text>
      <line
        stroke="#ff0000"
        strokeDasharray="2 4"
        strokeWidth={1}
        x1={0}
        x2={props.width}
        y1={y(props.threshold || 7.3)}
        y2={y(props.threshold || 7.3)}
      />
      {rendered.map((snp, i) => (
        <circle
          {...circleProps(snp, props)}
          key={`${id}_${i}`}
          height={props.height * 0.6}
          cx={snp.x}
          cy={snp.y}
          onClick={() => props.onSNPClick && props.onSNPClick(snp)}
          onMouseOut={mouseOut}
          onMouseOver={(e: React.MouseEvent<SVGCircleElement>) => {
            e.persist();
            props.onSNPMousedOver && props.onSNPMousedOver(snp);
            mouseOver(e, snp);
          }}
        />
      ))}
    </g>
  );
};
