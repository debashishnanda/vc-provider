import {
  getPIIRequestCountDAL,
  getTrafficSourceDal,
  getLatestPIIRequestsDal,
  getMonthlyYearlyPiiReqCountsDal,
  getTotalSecuredPIIDal
} from "../dal/stats.js";

export const getPIIRequestCount = (req, res) => {
  const tenantId = req.params.tenantId;
  const did = req.query.did;

  return getPIIRequestCountDAL(tenantId, did)
    .then((response) => {
      res.status(response.statusCode).send(response);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response);
    });
};

export const getTrafficSource = (req, res) => {
  const tenantId = req.params.tenantId;
  const did = req.query.did;

  return getTrafficSourceDal(tenantId, did)
    .then((response) => {
      res.status(response.statusCode).send(response);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response);
    });
};

export const getLatestPIIRequests = (req, res) => {
  const tenantId = req.params.tenantId;
  const did = req.query.did;

  return getLatestPIIRequestsDal(tenantId, did)
    .then((response) => {
      res.status(response.statusCode).send(response);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response);
    });
};

export const getMonthlyYearlyPiiReqCounts = (req, res) => {
  const tenantId = req.params.tenantId;
  const did = req.query.did;
  const startDateTime = req.query.startDateTime;
  const endDateTime = req.query.endDateTime;

  return getMonthlyYearlyPiiReqCountsDal(tenantId, did, startDateTime, endDateTime)
    .then((response) => {
      res.status(response.statusCode).send(response);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response);
    });
};

export const getTotalSecuredPII = (req, res) => {
  return getTotalSecuredPIIDal()
    .then((response) => {
      res.status(response.statusCode).send(response);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response);
    });
};
