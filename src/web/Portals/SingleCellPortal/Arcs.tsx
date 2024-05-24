import React, { useRef, useMemo } from "react";
import { useTooltip, useTooltipInPortal, defaultStyles as defaultTooltipStyles } from '@visx/tooltip';

export interface Domain {
  chromosome?: string;
  start: number;
  end: number;
}

export type Link = {
  regionA: Domain;
  regionB: Domain;
  score: number;
  targetTF?: string;
  targetGene: string;
};

export type ClickedLink = {
  link: Link;
  anchor: Domain;
};

export type ArcProps = {
  data: Link[];
  width: number;
  height: number;
  id?: string;
  transform?: string;
  arcOpacity?: number;
  domain: Domain;
  scoreThreshold?: number;
  colorMax?: number;
  onAnchorClick?: (link: ClickedLink) => void;
  onAnchorMouseOver?: (link: ClickedLink) => void;
  onAnchorMouseOut?: (link: ClickedLink) => void;
  onLinkClick?: (link: Link) => void;
  onLinkMouseOver?: (link: Link) => void;
  onLinkMouseOut?: (link: Link) => void;
  svgRef?: React.RefObject<SVGSVGElement>;
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
export type ClipPathProps = {
  height: number;
  width: number;
  id: string;
};

export const ClipPath: React.FC<ClipPathProps> = ({ width, height, id }) => (
  <clipPath id={id}>
    <rect x={0} y={0} width={width} height={height} />
  </clipPath>
);
function validHex(color: string): string {
  /* validate color is a hex color */
  color = color.replace(/[^0-9a-f]/gi, "");
  if (color.length === 3)
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  if (color.length === 8) color = color.substring(0, 6);
  if (color.length !== 6) throw new Error(color + " is not a valid hex color");

  /* return the first 6 hex digits */
  return color;
}
/**
 * Creates a linear scale for mapping values from one coordinate space to another.
 * @param indomain the original domain.
 * @param outdomain the output domain.
 */
export function linearTransform(
  inDomain: Domain,
  outDomain: Domain
): (value: number) => number {
  const iwidth = inDomain.end - inDomain.start;
  const owidth = outDomain.end - outDomain.start;
  return (i) => ((i - inDomain.start) * owidth) / iwidth + outDomain.start;
}

export type Rectangle = {
  start: number;
  end: number;
  fill: string;
  trueCoordinates: Domain;
  targetTF?: string;
  targetGene: string;
};

/**
 * Validates a hex color and parses it to an integer.
 * @param color the color as a hex string (e.g. #fff or ABCDEF)
 */
export function parseHex(color: string): number {
  return parseInt(validHex(color), 16);
}
export type Path = {
  d: string;
  stroke: string;
};

export function renderSimpleLinks(
  links: Link[],
  x: (value: number) => number,
  height: number,
  threshold: number,
  colorMax: number
): Path[] {
  const crange = {
    start: threshold,
    end: Math.max(...links.map((x) => x.score), colorMax),
  };
  const p = (h: number): string =>
    h < 0 ? "00" : h < 15 ? "0" + h.toString(16) : h.toString(16);
  const r = linearTransform(crange, {
    start: parseHex("0000CC"),
    end: parseHex("0000FF"),
  });
  const g = linearTransform(crange, {
    start: parseHex("0000CC"),
    end: parseHex("000000"),
  });
  const b = linearTransform(crange, {
    start: parseHex("0000CC"),
    end: parseHex("000000"),
  });
  return links
    .filter((x) => x.score > threshold)
    .sort((a, b) => a.score - b.score)
    .map((link) => {
      const first =
        link.regionA.start < link.regionB.start ? link.regionA : link.regionB;
      const last =
        link.regionA.start < link.regionB.start ? link.regionB : link.regionA;
      const firstC = x((first.start + first.end) / 2),
        lastC = x((last.start + last.end) / 2);
      const score = link.score > colorMax ? colorMax : link.score;
      const rr = Math.floor(r(score));
      const gg = Math.floor(g(score));
      const bb = Math.floor(b(score));
      return {
        d: `M ${firstC} ${(height * 7) / 8} Q ${(firstC + lastC) / 2
          } 0 ${lastC} ${(height * 7) / 8}`,
        stroke: "#" + p(rr) + p(gg) + p(bb),
      };
    });
}

export function renderRegions(
  links: Link[],
  x: (value: number) => number,
): Rectangle[] {
  return links.reduce<Rectangle[]>(
    (clist, link) => [
      //This takes each link and extracts two points from it
      ...clist,
      //First is Enhancer
      {
        start: x(link.regionA.start),
        end: x(link.regionA.end),
        fill: '#FFCD00',
        trueCoordinates: {
          start: link.regionA.start,
          end:link.regionA.end
        },
        targetTF: link.targetTF,
        targetGene: link.targetGene
      },
      //Second is Promoter
      {
        start: x(link.regionB.start),
        end: x(link.regionB.end),
        fill: '#FF0000',
        trueCoordinates: {
          start: link.regionB.start,
          end:link.regionB.end
        },
        targetTF: link.targetTF,
        targetGene: link.targetGene
      },
    ],
    []
  );
}

const deepEqual = function (x, y) {
  if (x === y) {
    return true;
  } else if (
    typeof x == "object" &&
    x != null &&
    typeof y == "object" &&
    y != null
  ) {
    if (Object.keys(x).length !== Object.keys(y).length) return false;

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else return false;
    }

    return true;
  } else return false;
};

export const Arcs: React.FC<ArcProps> = (props) => {
  const uuid = useRef("nsdcheuvcbudruecvubv");
  const x = xtransform(props.domain, props.width);
  const scoreThreshold = props.scoreThreshold || 0;
  const colorMax = props.colorMax || 0;
  const renderedRegions = useMemo(
    () => renderRegions(props.data, x),
    [props.data, props.domain, props.width]
  );
  const linksData = props.data.filter((d) => !deepEqual(d.regionA, d.regionB));

  const renderedLinks = useMemo(
    () =>
      renderSimpleLinks(linksData, x, props.height, scoreThreshold, colorMax),
    [
      props.width,
      props.domain,
      props.height,
      linksData,
      props.scoreThreshold,
      props.colorMax,
    ]
  );

  interface TooltipData {
    coordinates: Domain,
    targetTF?: string,
    targetGene: string,
  }

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<TooltipData>();

  const { TooltipInPortal } = useTooltipInPortal({
    // use TooltipWithBounds
    detectBounds: true,
    // when tooltip containers are scrolled, this will correctly update the Tooltip position
    scroll: true,
  })

  return (
    <>
      <g
        width={props.width}
        height={props.height}
        transform={props.transform}
        clipPath={`url(#${uuid.current})`}
      >
        <defs>
          <ClipPath id={uuid.current} width={props.width} height={props.height} />
        </defs>
        {renderedLinks.map((path, i) => (
          <path
            d={path.d}
            stroke="black"
            strokeOpacity={props.arcOpacity || 0.7}
            key={`${props.id}_path_${i}`}
            fill="none"
          />
        ))}
        {renderedRegions.map((rect, i) => (
          <rect
            key={`${props.id}_${i}`}
            id={'rect' + i}
            height={props.height / 4}
            width={rect.end - rect.start < 2 ? 2 : rect.end - rect.start}
            x={rect.start}
            y={(props.height * 3) / 4}
            fill={rect.fill}
            onMouseEnter={(event) => {
              showTooltip({
                tooltipLeft: event.clientX, 
                tooltipTop: event.clientY,
                tooltipData: {
                  coordinates: rect.trueCoordinates,
                  targetGene: rect.targetGene,
                  targetTF: rect.targetTF
                }
              });
            }}
            onMouseLeave={(event) => {
              hideTooltip()
            }}
          />
        ))}
      </g>
      {tooltipOpen && (
        <TooltipInPortal
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
        >
          <p><strong>{props.domain.chromosome}</strong></p>
          <p>Start: <strong>{tooltipData?.coordinates.start.toLocaleString()}</strong></p>
          <p>End: <strong>{tooltipData?.coordinates.end.toLocaleString()}</strong></p>
          <p>Target Gene: <strong>{tooltipData?.targetGene}</strong></p>
          {tooltipData?.targetTF && <p>Target TF: <strong>{tooltipData?.targetTF}</strong></p>}
        </TooltipInPortal>
      )}
    </>
  );
};
