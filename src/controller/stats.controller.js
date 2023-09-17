import {
  getPIIRequestCountDAL,
  getTrafficSourceDal,
  getLatestPIIRequestsDal,
  getMonthlyYearlyPiiReqCountsDal
} from "../dal/stats.js";

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

export const getLatestPIIRequests = (req, res) => {
  const id = req.params.id;

  return getLatestPIIRequestsDal(id)
    .then((response) => {
      res.status(response.statusCode).send(response);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response);
    });
};

export const getMonthlyYearlyPiiReqCounts = (req, res) => {
  const id = req.params.id;
  const startDateTime = req.query.startDateTime;
  const endDateTime = req.query.endDateTime;

  return getMonthlyYearlyPiiReqCountsDal(id, startDateTime, endDateTime)
    .then((response) => {
      res.status(response.statusCode).send(response);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response);
    });
};
