import { createUserDAL, getUserDAL, getDidDAL, getPiiListDAL } from "../dal/user.js";

export const createUser = (req, res) => {
  const did = req.query.did;
  const data = req.body;

  return createUserDAL(did, data)
    .then((response) => {
      res.status(response.statusCode).send(response);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response);
    });
};


export const getUser = (req, res) => {
  const did = req.query.did;
  const role = req.query.role;
  const vcType = req.query.vcType;
  const reason = req.query.reason;
  
  return getUserDAL(did, role, vcType, reason).then((response) => {
    res.status(response.statusCode).send(response);
  })
  .catch((response) => {
    res.status(response.statusCode).send(response);
  });
}


export const getDid = (req, res) => {
  const phone = req.query.phone;
  const email = req.query.email;
  
  return getDidDAL(phone, email).then((response) => {
    res.status(response.statusCode).send(response);
  })
  .catch((response) => {
    res.status(response.statusCode).send(response);
  });
}

export const getPiiList = (req, res) => {
  const did = req.query.did;
  
  return getPiiListDAL(did).then((response) => {
    res.status(response.statusCode).send(response);
  })
  .catch((response) => {
    res.status(response.statusCode).send(response);
  });
}


