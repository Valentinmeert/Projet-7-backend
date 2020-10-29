const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../helpers/users');
const Post = require('../helpers/posts');
const PostsController = require('./posts');

exports.signup = async (req, res) => {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !this.validateEmail(req.body.email) ||
    !this.validatePassword(req.body.password)
  ) {
    return res
      .status(400)
      .json({ error: 'Sent data does not match requirements' });
  }
  const existingUser = await this.findUserByEmail(req.body.email);
  if (existingUser) {
    return res
      .status(409)
      .json({ error: 'A user already exist with given email address' });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then(async (hash) => {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() =>
          res.status(201).json({
            userId: user.id,
            token: jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
              expiresIn: '24h',
            }),
          })
        )
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = async (req, res) => {
  if (
    !this.validateEmail(req.body.email) ||
    !this.validatePassword(req.body.password)
  ) {
    return res
      .status(400)
      .json({ error: 'Sent data does not match requirements' });
  }
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            token: jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
              expiresIn: '24h',
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllUsers = (req, res) => {
  User.findAll()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneUser = async (req, res) => {
  User.findOne({
    where: { id: req.params.userId },
  })
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyUser = async (req, res) => {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !this.validateEmail(req.body.email) ||
    !this.validatePassword(req.body.password)
  ) {
    return res
      .status(400)
      .json({ error: 'Sent data does not match requirements' });
  }
  const existingUser = await this.findUserByEmail(req.body.email);
  if (existingUser) {
    return res
      .status(409)
      .json({ error: 'A user already exist with given email address' });
  }
  User.findOne({ where: { id: req.params.userId } })
    .then(() => {
      User.update({ ...req.body }, { where: { id: req.params.userId } })
        .then(() => {
          res.status(201).json({ message: 'Profil modifié !' });
        })
        .catch((error) =>
          res
            .status(400)
            .json({ error: 'Sent data does not match requirements' })
        );
    })
    .catch((error) => res.status(404).json({ error: 'no user match this id' }));
};

exports.deleteUser = async (req, res) => {
  User.findOne({ where: { id: req.params.userId } }).then(async (user) => {
    if (!user) {
      return res.status(404).json({ error: 'no user match this id' });
    }
    await PostsController.deletePostsByUserId(req.params.userId);
    User.destroy({ where: { id: req.params.userId } })
      .then(() => res.status(200).json({ message: 'Utilisateur supprimé' }))
      .catch((error) => res.status(400).json({ error }));
  });
};

exports.getPostsWithUserId = (req, res) => {
  Post.findAll({ where: { userId: req.params.userId } })
    .then((post) => {
      res.status(201).send(post);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyUserPassword = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then(async (password) => {
      User.update(
        { password },
        { where: { id: req.params.userId } }
      ).catch((error) => res.status(400).json({ error }));
    })
    .then(() => {
      res.status(200).json({ message: 'Mot de Passe modifié ' });
    })
    .catch((error) => res.status(404).json({ error: 'no user match this id' }));
};

exports.findUserByEmail = (email) =>
  new Promise((resolve, reject) => {
    User.findOne({ where: { email } })
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });

exports.validateEmail = (email) => {
  if (!email) {
    return false;
  }
  const regex = new RegExp('[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z.]{2,25}');
  return regex.test(email);
};

exports.validatePassword = (password) => {
  if (!password) {
    return false;
  }
  const regex = new RegExp('.{8,}');
  return regex.test(password);
};
