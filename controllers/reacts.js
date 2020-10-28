const jwt = require('jsonwebtoken');
const React = require('../helpers/reacts');

exports.createReact = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const { userId } = decodedToken;
  const react = new React({
    userId,
    type: 'like',
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
        res.status(404).json({ error: 'React not found' });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyReact = async (req, res) => {
  React.update({ ...req.body }, { where: { id: req.params.reactId } })
    .then(() => {
      res.status(201).json({ message: 'React modifié !' });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteReact = (req, res) => {
  React.destroy({ where: { id: req.params.reactId } })
    .then(() => {
      res.status(200).json({ message: 'React supprimé !' });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteReactById = (id) =>
  new Promise((resolve, reject) => {
    React.findOne({ where: { id } }).then((react) => {
      React.destroy({ where: { id } })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

exports.deleteReactByPostId = (postId) =>
  new Promise((resolve) => {
    React.findAll({ where: { postId } }).then(async (reacts) => {
      for (let i = 0; i < reacts.length; i += 1) {
        const react = reacts[i];
        await this.deleteReactById(react.id);
      }
      resolve();
    });
  });
