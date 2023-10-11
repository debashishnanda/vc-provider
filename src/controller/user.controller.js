import { createUserDAL, getUserDAL, getDidDAL, getPiiListDAL } from "../dal/user.js";

export const createUser = (req, res) => {
  const tenantId = req.params.tenantId;
  const did = req.query.did;
  const data = req.body;

  return createUserDAL(tenantId, did, data)
    .then((response) => {
      res.status(response.statusCode).send(response);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response);
    });
};


export const getUser = (req, res) => {
  const tenantId = req.params.tenantId;
  const did = req.query.did;
  const role = req.query.role;
  const vcType = req.query.vcType;
  const reason = req.query.reason;
  
  return getUserDAL(tenantId, did, role, vcType, reason).then((response) => {
    res.status(response.statusCode).send(response);
  })
  .catch((response) => {
    res.status(response.statusCode).send(response);
  });
}


export const getDid = (req, res) => {
  const tenantId = req.params.tenantId;
  const phone = req.query.phone;
  const email = req.query.email;
  
  return getDidDAL(tenantId, phone, email).then((response) => {
    res.status(response.statusCode).send(response);
  })
  .catch((response) => {
    res.status(response.statusCode).send(response);
  });
}

export const getPiiList = (req, res) => {
  const tenantId = req.params.tenantId;
  const did = req.query.did;
  
  return getPiiListDAL(tenantId, did).then((response) => {
    res.status(response.statusCode).send(response);
  })
  .catch((response) => {
    res.status(response.statusCode).send(response);
  });
}


