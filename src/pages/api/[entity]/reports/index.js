import PDFMerger from "pdf-merger-js";
import puppeteer from "puppeteer";

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getSituacoesVaga(req, res);
      break;
    case "POST":
      await addEvento(req, res);
      break;
    case "PUT":
      await modifyEvento(req, res);
      break;
    case "DELETE":
      await deleteEvento(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET, POST, PUT or DELETE requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getSituacoesVaga = async (req, res) => {
  const {
    entity,
    reportUrl,
    landscape = false,
    anexosId = null,
    ...params
  } = req.query;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        process.env.NODE_ENV === "production"
          ? "/usr/bin/chromium-browser"
          : null,
      args: [
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--lang=pt-BR",
      ],
    });

    const query = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    const page = await browser.newPage();

    await page.goto(`http://localhost:3000/${entity}/${reportUrl}?${query}`, {
      waitUntil: "networkidle0",
    });
    const title = await page.title();
    res.setHeader("Content-Disposition", "attachment;filename=" + title);

    if (landscape === "custom") {
      const pagesWithOrientation = await page.$$eval(".page", (pagesToPrint) =>
        pagesToPrint.map((pageToPrint, idx) => ({
          pageId: pageToPrint.id,
          pageNumber: idx + 1,
        }))
      );

      const pagesPrinted = [];

      for await (const pageToPrint of pagesWithOrientation) {
        const print = await page.pdf({
          printBackground: true,
          format: "A4",
          displayHeaderFooter: false,
          landscape: pageToPrint.pageId === "landscape",
          pageRanges: `${pageToPrint.pageNumber}`,
          margin: {
            top: "20px",
            bottom: "40px",
            right: "30px",
            left: "30px",
          },
        });
        pagesPrinted.push(print);
      }

      const merger = new PDFMerger();

      for (const file of pagesPrinted) {
        await merger.add(file);
      }
      const mergedPdf = await merger.saveAsBuffer();
      await browser.close();
      return res.send(mergedPdf);
    } else {
      const pdf = await page.pdf({
        printBackground: true,
        format: "A4",
        displayHeaderFooter: false,
        landscape: JSON.parse(landscape),
        margin: {
          top: "20px",
          bottom: "40px",
          right: "30px",
          left: "30px",
        },
      });

      await browser.close();
      return res.send(pdf);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
