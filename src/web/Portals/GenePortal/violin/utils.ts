import { RefObject } from 'react';

/**
 * Smooths the input data with a normal kernel density estimator.
 * @param input: the input vector to smooth.
 * @param sampleDomain: the domain over which to smooth; defaults to the domain of the input data.
 * @param bandWidth: the standard deviation of the kernel; defaults to 1/20 of the domain width.
 * @param sampleRate: the rate at which to sample the density; defaults to 1/100 of the domain width.
 */
export function standardNormalKernel(
    input: number[],
    sampleDomain: number[] = [],
    bandWidth: number = -1.0,
    sampleRate: number = -1.0
): number[] {
    const minimum = 2 === sampleDomain.length ? sampleDomain[0] : Math.min(...input);
    const maximum = 2 === sampleDomain.length ? sampleDomain[1] : Math.max(...input);
    if (-1.0 === bandWidth) bandWidth = (maximum - minimum) / 30.0;
    if (-1.0 === sampleRate) sampleRate = (maximum - minimum) / 100.0;
    const samplePositions: number[] = [];
    for (let i = minimum + sampleRate; i <= maximum; i += sampleRate) samplePositions.push(i);
    const retval = samplePositions.map(x => 0.0);
    input.forEach(x => {
        let values = gaussian(Math.sqrt(2.0 * Math.PI) * bandWidth, x, bandWidth, samplePositions);
        values.forEach((x, i) => {
            retval[i] += x;
        });
    });
    return retval;
}

/**
 * Samples a normal distribution at the given positions.
 * @param amplitude the amplitude of the distribution.
 * @param mean the mean of the distribution.
 * @param stdev the standard deviation of the distribution.
 * @param positions the positions at which to sample the distribution.
 */
export function gaussian(amplitude: number, mean: number, stdev: number, positions: number[]): number[] {
    const a = amplitude / (Math.sqrt(2.0 * Math.PI) * stdev);
    const d = 2.0 * stdev * stdev;
    return positions.map(x => a * Math.exp((-(x - mean) * (x - mean)) / d));
}

export function groupByThenBy<T, U>(
    data: T[],
    keyA: (v: T) => string,
    keyB: (v: T) => string,
    val: (v: T) => U
): Map<string, Map<string, U[]>> {
    const results: Map<string, Map<string, U[]>> = new Map();
    data.forEach(d => {
        const kA = keyA(d),
            kB = keyB(d);
        if (results.get(kA) === undefined) results.set(kA, new Map<string, U[]>());
        const mA = results.get(kA)!;
        if (mA.get(kB) === undefined) mA.set(kB, []);
        mA.get(kB)!.push(val(d));
    });
    return results;
}

export function median(values: number[]): number {
    if (values.length === 0) return 0;
    values = [...values].sort();
    const half = Math.floor(values.length / 2);
    if (values.length % 2) return values[half];
    return (values[half - 1] + values[half]) / 2.0;
}

export function linearTransform(d: [number, number], r: [number, number]): (v: number) => number {
    return v => r[0] + (r[1] - r[0]) * ((v - d[0]) / (d[1] - d[0]));
}

function hslToRgb(h: number, s: number, l: number): [ number, number, number ] {
    let r: number, g: number, b: number;
    if (s === 0)
        r = g = b = l; // achromatic
    else {
        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
}

export function spacedColors(n: number, s: number = 50, l: number = 50): (i: number) => string {
    return i => {
        const [ r, g, b ] = hslToRgb(((i * (360 / (n || 1))) % 360) / 360, s / 100, l / 100);
        return `rgb(${r},${g},${b})`
    };
}

export function assignColors(items: Set<string>): { [key: string]: string } {
    const colors = spacedColors(items.size);
    const r: { [key: string]: string } = {};
    [...items].forEach((item, i) => {
        r[item] = colors(i);
    });
    return r;
}

export const FRIENDLY: Map<string, string> = new Map([]);

export const COLORS = {};

export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

export function svgData(svgNode: RefObject<SVGSVGElement>): string {
    if (!svgNode.current) return '';
    const svg = svgNode.current.cloneNode(true) as SVGSVGElement;
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const preface = '<?xml version="1.0" standalone="no"?>';
    return preface + svg.outerHTML.replace(/\n/g, '').replace(/[ ]{8}/g, '');
}

export function svgDataE(svgNode: SVGSVGElement[], translations: ([ number, number ] | undefined)[]): string {
    const svgs = svgNode.map(x => x.cloneNode(true) as SVGSVGElement);
    svgs[0].setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgs.slice(1).forEach( (x, i) => {
        Array.from(x.children).forEach(c => {
            const cc = c.cloneNode(true) as SVGGElement;
            if (translations[i]) {
                const s = svgs[0].createSVGTransform();
                s.setTranslate(...(translations[i] as [ number, number ]));
                cc.transform.baseVal.appendItem(s);
            }
            svgs[0].getRootNode().appendChild(cc);
        });
    });
    const preface = '<?xml version="1.0" standalone="no"?>';
    return preface + svgs[0].outerHTML.replace(/\n/g, '').replace(/[ ]{8}/g, '');
}

export function downloadSVG(svg: RefObject<SVGSVGElement>, filename: string) {
    downloadBlob(new Blob([svgData(svg)], { type: 'image/svg+xml;charset=utf-8' }), filename);
}

export function downloadTSV(text: string, filename: string) {
    downloadBlob(new Blob([text], { type: 'text/plain' }), filename);
}
