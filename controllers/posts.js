const jwt = require('jsonwebtoken');
const fs = require('fs');
const { rejects } = require('assert');
const Post = require('../helpers/posts');
const User = require('../helpers/users');
const { sequelize } = require('../models');
const ReactsController = require('./reacts');

exports.createPost = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const { userId } = decodedToken;
  if (req.file) {
    const post = new Post({
      userId,
      title: req.body.title,
      content: req.body.content,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
    });
    post
      .save()
      .then(() => res.status(201).json({ message: 'Post enregistrée' }))
      .catch((error) => {
        res.status(400).json({ error });
      });
  } else {
    const post = new Post({
      userId,
      title: req.body.title,
      content: req.body.content,
    });
    post
      .save()
      .then(() => res.status(201).json({ message: 'Post enregistrée' }))
      .catch((error) => {
        res.status(400).json({ error });
      });
  }
};

exports.getAllPosts = (req, res) => {
  Post.findAll({ order: [['createdAt', 'DESC']] })
    .then((post) => {
      res.status(200).send(post);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getOnePost = (req, res) => {
  Post.findOne({ where: { id: req.params.postId } })
    .then((post) => {
      if (post) {
        res.status(200).send(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyPost = async (req, res) => {
  Post.update({ ...req.body }, { where: { id: req.params.id } })
    .then(() => {
      res.status(201).json({ message: 'Post modifié !' });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deletePost = (req, res) => {
  this.deletePostById(req.params.id)
    .then(() => res.status(200).json({ message: 'Post supprimé !' }))
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deletePostById = (id) =>
  new Promise((resolve, reject) => {
    Post.findOne({ where: { id } }).then((post) => {
      if (post.imageUrl == null) {
        Post.destroy({ where: { id } })
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, async () => {
          await ReactsController.deleteReactByPostId(id);
          Post.destroy({ where: { id } })
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
    });
  });

exports.deletePostsByUserId = (userId) =>
  new Promise((resolve) => {
    Post.findAll({ where: { userId } }).then(async (posts) => {
      for (let i = 0; i < posts.length; i += 1) {
        const post = posts[i];
        await this.deletePostById(post.id);
      }
      resolve();
    });
  });

exports.getUserIdWithPost = (req, res) => {
  Post.findOne({ where: { id: req.params.postId } }).then((post) => {
    if (post) {
      console.log(post.userId);
      userId = post.userId;
      User.findOne({ where: { id: userId } }).then((user) => {
        res.status(200).send(user);
      });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  });
};
