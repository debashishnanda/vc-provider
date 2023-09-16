import { createUserDAL, getUserDAL } from "../dal/user.js";

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
  const id = req.params.id;
  const piiType = req.query.piiType;
  const reason = req.query.reason;
  
  return getUserDAL(id, piiType, reason).then((response) => {
    res.status(response.statusCode).send(response);
  })
  .catch((response) => {
    res.status(response.statusCode).send(response);
  });
}
