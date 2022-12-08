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
  const { entity, reportUrl, id } = req.query;
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
    const page = await browser.newPage();
    await page.goto(
      `http://localhost:3000/${entity}/${reportUrl}?idEvento=${id}`,
      {
        waitUntil: "networkidle0",
      }
    );

    const pdf = await page.pdf({
      printBackground: true,
      format: "A4",
      displayHeaderFooter: false,
      landscape: false,
      // headerTemplate: `<div id="header-template" style="font-size:10px !important; color:#666999; padding-left:10px; padding-right:10px; width: 100%; display:flex; justify-content: space-between;">
      //   <div>
      //   <span class="title"></span>
      //   <span> - </span>
      //   <span class="date"></span>
      //   </div>
      //   <div>
      //   <span class="pageNumber"></span>
      //   <span> of </span>
      //   <span class="totalPages"></span>
      //   </div>
      //   </div>`,
      // footerTemplate: `<div id="header-template" style="font-size:10px !important; color:#666999; padding-left:10px; padding-right:10px; width: 100%; display:flex; justify-content: space-between;">
      // <div>
      // <span class="title"></span>
      // <span> - </span>
      // <span class="date"></span>
      // </div>
      // <div>
      // <span class="pageNumber"></span>
      // <span> of </span>
      // <span class="totalPages"></span>
      // </div>
      // </div>`,
      margin: {
        top: "20px",
        bottom: "40px",
        right: "30px",
        left: "30px",
      },
    });

    await browser.close();

    // res.headers["Content-Type"] = "application/pdf";

    return res.send(pdf);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
