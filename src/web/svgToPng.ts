import { Canvg } from "canvg";
import html2canvas from "html2canvas";

export function downloadSVGAsPNG(svgElement: SVGElement, filename: string) {
  // Create a canvas element
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Get the SVG element's dimensions
  const svgBounds = svgElement.getBoundingClientRect();
  canvas.width = svgBounds.width * 5;
  canvas.height = svgBounds.height * 5;

  // Convert the SVG element to a canvas element
  Canvg.from(ctx, svgElement.outerHTML)
    .then((v) => {
      v.start();
      return v.ready();
    })
    .then(() => {
      // Use html2canvas to create a PNG image from the canvas element
      document.body.appendChild(canvas);
      html2canvas(canvas).then((ccanvas) => {
        // Convert the canvas element to a data URL and download it
        const downloadLink = document.createElement("a");
        downloadLink.href = ccanvas.toDataURL("image/png");
        downloadLink.download = filename;
        downloadLink.click();
        document.body.removeChild(canvas);
      });
    });
}
