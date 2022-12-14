import { allowCors } from "services/apiAllowCors";
import { timeNtpService } from "services/timeNtpService";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getNetworkTime(req, res);
      break;

    default:
      res
        .status(405)
        .send({ message: "Only GET requests allowed" });
      break;
  }
};

export default allowCors(handler);

const getNetworkTime = async (req, res) => {
  try {
    const date = await timeNtpService();
    res.status(200).json(date);
  } catch (error) {
    res.status(500).json(error);
  }
};
