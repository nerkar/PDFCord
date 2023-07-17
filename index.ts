import './main.css';
import { pdf } from './pdf';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorkerEntry from 'pdfjs-dist/build/pdf.worker.entry.js';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerEntry;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const load = async () => {
  // le pdf est en base64 car le site des impôts n'accepte pas les requêtes cors
  const pdfDoc = await pdfjsLib.getDocument(pdf).promise;
  const page = await pdfDoc.getPage(1);
  const viewport = page.getViewport({ scale: 1.5 });
  var renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };
  canvas.height = renderContext.viewport.height;
  canvas.width = renderContext.viewport.width;
  await page.render(renderContext).promise;

  function getMousePos(e: MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  canvas.addEventListener(
    'click',
    function (e) {
      const pos = getMousePos(e);

      /// check x and y against the grid
      const [x, y] = viewport.convertToPdfPoint(pos.x, pos.y) as any;
      const currPos = [parseInt(x, 10), parseInt(y, 10)];

      document.getElementById(
        'coord'
      )!.textContent = `${currPos[0]}, ${currPos[1]}`;
    },
    false
  );
};

load();
