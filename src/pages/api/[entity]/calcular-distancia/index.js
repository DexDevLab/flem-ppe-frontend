import { Client } from "@googlemaps/google-maps-services-js";
import { allowCors } from "services";

const maps = new Client({});

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getDistanceMatrix(req, res);
      break;

    default:
      res.status(405).send({ message: "Only GET requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getDistanceMatrix = async (req, res) => {
  const { entity, origem, destino } = req.query;
  try {

    if (!origem || !destino)
      return res.status(400).json({ error: "required params is missing!" });

    const { data: query } = await maps.distancematrix({
      params: {
        key: process.env.NEXT_GOOGLE_API_MAPS_KEY,
        origins: [origem],
        destinations: [destino],
      },
    });

    return res.status(200).json(query.rows[0].elements[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
