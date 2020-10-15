const React = require("../helpers/reacts");
const jwt = require("jsonwebtoken");

exports.createReact = async (req, res) => {
  console.log(req.body);
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const { userId } = decodedToken;
  const react = new React({
    userId,
    type: "like",
    postId: req.params.postId,
  });
  react
    .save()
    .then(() => res.status(201).json({ id: react.id }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllReacts = (req, res) => {
  React.findAll({ where: { postId: req.params.postId } })
    .then((react) => {
      res.status(200).send(react);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneReact = (req, res) => {
  React.findOne({ where: { id: req.params.reactId } })
    .then((react) => {
      if (react) {
        res.status(200).send(react);
      } else {
        res.status(404).json({ error: "React not found" });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyReact = async (req, res) => {
  React.update({ ...req.body }, { where: { id: req.params.reactId } })
    .then(() => {
      res.status(201).json({ message: "React modifié !" });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteReact = (req, res) => {
  React.destroy({ where: { id: req.params.reactId } })
    .then(() => {
      res.status(200).json({ message: "React supprimé !" });
    })
    .catch((error) => res.status(400).json({ error }));
};
