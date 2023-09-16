import { getPIIRequestCountDAL, getTrafficSourceDal } from "../dal/stats.js";

export const getPIIRequestCount = (req, res) => {
  const id = req.params.id;

  return getPIIRequestCountDAL(id)
    .then((response) => {
      res.status(response.statusCode).send(response);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response);
    });
};

export const getTrafficSource = (req, res) => {
  const id = req.params.id;

  return getTrafficSourceDal(id)
    .then((response) => {
      res.status(response.statusCode).send(response);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response);
    });
};
