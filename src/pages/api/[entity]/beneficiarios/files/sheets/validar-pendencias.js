import axios from "axios";
//import { benefValidateTeste } from "controllers";

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
    case "PATCH":
      await patchValidarPendencias(req, res);
      break;

    default:
      res.status(405).send({ message: "Only PATCH requests allowed" });
      break;
  }
};

export default allowCors(handler);

const patchValidarPendencias = async (req, res) => {
  const { entity } = req.query;

  const data = {
    Plan1: req.body.map((raw) => {
      Object.keys(raw).forEach((key) => {
        if (typeof raw[key] === "string") raw[key] = raw[key].replace("*", "");
        if (raw[key] === "") raw[key] = null;
      });
      return raw;
    }),
  };

  try {
    //const output1 = await benefLookupTeste(entity, {Plan1: req.body});
    const lookup = await axios.post(`${process.env.NEXT_PUBLIC_URL_PORTAL_PPE_BACKEND}/${entity}/beneficiarios/upload`, {Plan1: req.body})
    const output2 = await benefValidateTeste(entity, lookup);
    res.status(200).json(output2);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
