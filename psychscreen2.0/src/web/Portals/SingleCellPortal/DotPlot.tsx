import { gql } from "@apollo/client";
import React, { useMemo, useCallback, ReactElement } from "react";
import { YAxis } from "../GenePortal/axis";
import { linearTransform } from "../GenePortal/violin/utils";
import { linearTransform as lt } from "jubilant-carnival";
import { GENE_CELLTYPE_CARDS } from "./consts";
import {
  useTooltip,
  useTooltipInPortal,
  defaultStyles as defaultTooltipStyles,
} from "@visx/tooltip";

export const DOT_PLOT_QUERY = gql`
  query singleCellBoxPlot($disease: String!, $gene: [String]) {
    singleCellBoxPlotQuery(disease: $disease, gene: $gene) {
      expr_frac
      mean_count
      disease
      gene
      celltype
    }
  }
`;

interface TooltipData {
  percentexpressed?: number;
  meanexpression?: number;
  foldchange?: number;
  padj?: number;
  label: string;
}

export type DotPlotQueryResponse = {
  singleCellBoxPlotQuery: {
    expr_frac: number;
    mean_count: number;
    disease: string;
    gene: string;
    celltype: string;
  }[];
};

type DotPlotProps = {
  disease: string;
  showTooltipData?: boolean;
  deg?: boolean;
  yaxistitle: string;
  dotplotData?: any;
  title1?: ReactElement;
  title2?: ReactElement;
  celltype?: boolean;
};

function useGeneData(
  disease: string,
  gene: string,
  dotplotData?: any,
  celltype?: boolean
) {
  // fetch results from API
  let data: any = dotplotData;

  // data = dotplotData && dotplotData.singleCellBoxPlotQuery.length>0 ? dotplotData: data
  // map cell types to radii and color shadings
  let uniqueCellTypes = new Set(
    data?.map((c) => (celltype ? c.gene : c.celltype))
  );

  const results = useMemo(
    () =>
      new Map(
        Array.from(uniqueCellTypes).map((x) => {
          let d = data?.filter((a) =>
            celltype ? a.gene === x : a.celltype === x
          );

          return [
            x,
            d.map((c) => {
              return {
                radius: c.expr_frac,
                colorpercent: c.mean_count,
                highlighted: c.highlighted ? c.highlighted : false,
              };
            }),
          ];
        })
      ),
    [data]
  );

  // get sorted cell types as keys
  const keys = useMemo(
    () =>
      [...results.keys()].sort((a: any, b: any) =>
        a.toLowerCase().localeCompare(b.toLowerCase())
      ),
    [results]
  );

  return [data, results, keys] as [
    DotPlotQueryResponse | undefined,
    Map<
      string,
      { radius: number; colorpercent: number; highlighted: boolean }[]
    >,
    string[]
  ];
}

function split(left: number, right: number, parts: number) {
  var result: number[] = [],
    delta = (right - left) / (parts - 1);
  while (left < right) {
    result.push(left);
    left += delta;
  }
  result.push(right);
  return result;
}

const DotPlot: React.ForwardRefRenderFunction<SVGSVGElement, DotPlotProps> = (
  {
    disease,
    yaxistitle,
    dotplotData,
    title1,
    title2,
    showTooltipData,
    deg,
    celltype,
  },
  ref
) => {
  console.log(celltype, "ct");
  // SVG-related parameters
  const width = 15000;
  const height = width / 3;

  // Fetch and format expression data
  const [data, results, keys] = useGeneData(
    disease,
    yaxistitle,
    dotplotData,
    celltype
  );

  let uniqueDatasets = new Set(dotplotData?.map((c) => c.dataset));
  // Compute dimension factors
  const radiusDomain: [number, number] = useMemo(() => {
    const radii = keys.map((k) => results.get(k)!.map((e) => e.radius)).flat();
    let min = Math.min(...radii);
    let max =
      Math.max(...radii) === Math.min(...radii)
        ? Math.max(...radii) * 2
        : Math.max(...radii);
    return [min, max];
  }, [results, keys]);
  const colorDomain: [number, number] = useMemo(() => {
    const cp = keys
      .map((k) => results.get(k)!.map((e) => e.colorpercent))
      .flat();
    let min = Math.min(...cp);
    let max =
      Math.max(...cp) === Math.min(...cp)
        ? Math.max(...cp) * 2
        : Math.max(...cp);
    return [min, max];
  }, [results, keys]);

  const radiusTransform = useCallback(
    linearTransform(radiusDomain, [20, 60]),
    radiusDomain
  );
  const verticalTransform = useCallback(
    linearTransform([0, 4], [(height / 2) * 0.9, (height / 2) * 0.1]),
    [height]
  );

  // Compute radius and color scaling factors
  const length = keys.length + 20;
  const radiusRange = useMemo(() => {
    const diff = +((+radiusDomain[1] - +radiusDomain[0]) / 4);
    return [0, 1, 2, 3].map((x) => radiusDomain[0] + diff * x);
  }, [radiusDomain]);
  const colorPercent = useMemo(() => {
    return split(colorDomain[0], colorDomain[1], 4);
  }, [colorDomain]);
  const gradient = useMemo(() => {
    return lt({ start: 0, end: colorDomain[1] }, { start: 191, end: 0 });
  }, [colorDomain]);

  const posgradient = useMemo(() => {
    return lt({ start: 0, end: colorDomain[1] }, { start: 191, end: 0 });
  }, [colorDomain]);
  const neggradient = useMemo(() => {
    return lt({ start: colorDomain[0], end: 0 }, { start: 0, end: 191 });
  }, [colorDomain]);

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
  });

  // Dot plot for recognized genes
  return (
    <svg
      viewBox={`0 0 ${width} ${width / 3}`}
      style={{ width: "100%" }}
      ref={ref}
    >
      <YAxis
        title={yaxistitle}
        width={(width / length) * 2}
        height={height / 2}
        range={[0, 1]}
        fontStyle={celltype ? "normal" : "italic"}
      />
      {Array.from(uniqueDatasets).map((n, i) => {
        return (
          <text
            fontSize="140px"
            fill="#000000"
            x={
              ((keys.length - 1 + 2.1) * width) / length +
              (width / length) * 0.8 +
              40
            }
            y={
              Array.from(uniqueDatasets).length === 1
                ? verticalTransform(2)
                : verticalTransform(i / 2 + 0.25)
            }
          >
            {n as any}
          </text>
        );
      })}
      {keys
        .map((x, i) => {
          return results.get(x)!!.map((s, j) => {
            return (
              <React.Fragment key={`${x}_${i}_${j}`}>
                <g>
                  <circle
                    fill={
                      !deg
                        ? `rgb(${gradient(s.colorpercent).toFixed(
                            0
                          )},${gradient(s.colorpercent).toFixed(0)},255)`
                        : s.colorpercent === 0
                        ? "rgb(232, 223, 221)"
                        : s.colorpercent > 0
                        ? `rgb(${posgradient(s.colorpercent)},${posgradient(
                            s.colorpercent
                          )},255)`
                        : `rgb(255,${neggradient(s.colorpercent)},${neggradient(
                            s.colorpercent
                          )})`
                    }
                    cy={
                      results.get(x)!!.length === 1
                        ? verticalTransform(2)
                        : verticalTransform(j / 2 + 0.25)
                    }
                    r={radiusTransform(s.radius)}
                    cx={((i + 2.5) * width) / length}
                    stroke="#000000"
                    strokeWidth={s.highlighted ? 4 : 0}
                    strokeOpacity={4}
                    onMouseEnter={(event) => {
                      showTooltip({
                        tooltipLeft: event.clientX,
                        tooltipTop: event.clientY,
                        tooltipData: !showTooltipData
                          ? {
                              meanexpression: +s.colorpercent.toFixed(2),
                              percentexpressed: +s.radius.toFixed(2),
                              label: x,
                            }
                          : {
                              padj: +s.radius.toFixed(2),
                              foldchange: +s.colorpercent.toFixed(2),
                              label: x,
                            },
                      });
                    }}
                    onMouseLeave={(event) => {
                      hideTooltip();
                    }}
                  >
                    {/*<title>
                      {showTooltip
                        ? "p-adjusted: " +
                          s.radius.toFixed(2) +
                          "\nexpression fold change: " +
                          s.colorpercent.toFixed(2)
                        : "Percent Expressed: " +
                        s.radius.toFixed(2) +
                        "\nMean Expression: " +
                        s.colorpercent.toFixed(2) + 
                        "\nCell type: " +
                        GENE_CELLTYPE_CARDS.find(c=>c.val===x)?.cardLabel || x}
                      </title>*/}
                  </circle>
                </g>
              </React.Fragment>
            );
          });
        })
        .flat()}
      {tooltipOpen && (
        <TooltipInPortal
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultTooltipStyles,
            backgroundColor: "#283238",
            color: "white",
          }}
        >
          {!showTooltipData ? (
            <p>Percent Expressed: {tooltipData?.percentexpressed}</p>
          ) : (
            <p>
              -log<sub>10</sub>(<i>P</i>
              <sub>adj</sub>): {tooltipData?.padj}
            </p>
          )}
          {!showTooltipData ? (
            <p>Mean Expression: {tooltipData?.meanexpression}</p>
          ) : (
            <p>
              log<sub>2</sub>(fold change): {tooltipData?.foldchange}
            </p>
          )}
          {celltype ? (
            <p>
              <i>{tooltipData?.label}</i>
            </p>
          ) : (
            <p>
              {GENE_CELLTYPE_CARDS.find((c) => c.val === tooltipData?.label) ? (
                GENE_CELLTYPE_CARDS.find(
                  (c) => c.val === tooltipData?.label
                )?.cardLabel.includes("-expressing") ? (
                  <>
                    <i>
                      {
                        GENE_CELLTYPE_CARDS.find(
                          (c) => c.val === tooltipData?.label
                        )?.cardLabel.split("-expressing")[0]
                      }
                    </i>
                    <>
                      {"-expressing"}
                      {
                        GENE_CELLTYPE_CARDS.find(
                          (c) => c.val === tooltipData?.label
                        )?.cardLabel.split("-expressing")[1]
                      }
                    </>
                  </>
                ) : (
                  GENE_CELLTYPE_CARDS.find((c) => c.val === tooltipData?.label)
                    ?.cardLabel
                )
              ) : (
                tooltipData?.label
              )}
            </p>
          )}
        </TooltipInPortal>
      )}

      {keys.map((x, i) => (
        <React.Fragment key={`${x}_${i}`}>
          <g>
            <rect
              width={(width / length) * 0.8}
              x={((i + 2.1) * width) / length}
              y={height * 0.48}
              height={1}
              fill="#888888"
            />
            <text
              key={x}
              fontSize="140px"
              transform="rotate(-90)"
              textAnchor="end"
              fontStyle={!celltype ? "normal" : "italic"}
              fontWeight={
                deg ? (results!!.get(x)!![0].highlighted ? "bold" : "") : ""
              }
              y={((i + 2.5) * width) / length}
              x={-height / 2}
              height={width / (length - 1)}
              fill="#000000"
              alignmentBaseline="middle"
            >
              {x}
            </text>
          </g>
        </React.Fragment>
      ))}
      <text
        fontSize="140px"
        fill="#000000"
        x={keys.length * (keys.length <= 2 ? 1.3 : 0.8) * (width / length)}
        y={height * 0.78}
      >
        {title1 || "Percent Expressed"}
      </text>
      {radiusRange.map((r, i) => (
        <>
          <circle
            r={radiusTransform(r)}
            cx={
              (keys.length * (keys.length <= 2 ? 1.4 : 0.83) * width) / length
            }
            cy={i * 150 + height * 0.82}
            fill="#000000"
          />
          <text
            fontSize="140px"
            x={(keys.length * (keys.length <= 2 ? 1.5 : 0.85) * width) / length}
            y={i * 150 + height * 0.83}
            fill="#000000"
          >
            {r.toFixed(2)}
          </text>
        </>
      ))}
      <text
        fontSize="140px"
        fill="#000000"
        x={keys.length * 0.4 * (width / length)}
        y={height * 0.78}
      >
        {title2 || "Mean Expression"}
      </text>
      {colorPercent.map((r, i) => (
        <>
          <rect
            width={100}
            height={100}
            x={(keys.length * 0.4 * width) / length}
            y={i * 150 + height * 0.81}
            fill={
              !deg
                ? `rgb(${gradient(r).toFixed(0)},${gradient(r).toFixed(0)},255)`
                : r > 0
                ? `rgb(${posgradient(r).toFixed(0)},${posgradient(r).toFixed(
                    0
                  )},255)`
                : `rgb(255,${neggradient(r).toFixed(0)},${neggradient(
                    r
                  ).toFixed(0)})`
            }
          />
          <text
            fontSize="140px"
            x={(keys.length * 0.44 * width) / length}
            y={i * 150 + height * 0.83}
            fill="#000000"
          >
            {r.toFixed(2)}
          </text>
        </>
      ))}
    </svg>
  );
};

export default React.forwardRef(DotPlot);
