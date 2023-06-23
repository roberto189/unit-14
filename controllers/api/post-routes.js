const router = require("express").Router();
const { Post, Comment, User } = require("../../models/");
const withAuth = require("../../utils/auth");

router.get ("/", (req, res)=> {
  Post.findAll({
  })
  .then(dbpostdata=>{
    res.json(dbpostdata)
  })
})
router.post("/", withAuth, (req, res) => {
  const body = req.body;
  console.log("hello",req.session.userId); 
  // Post.create({ ...body })
  Post.create({ ...body, userId: req.session.userId })
    .then(newPost => {
    return  res.json(newPost);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.put("/:id", withAuth, (req, res) => {
  console.log(req.body, req.params.id)
  Post.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(affectedRows => {
      if (affectedRows > 0) {
        res.status(200).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete("/:id", withAuth, (req, res) => {
  console.log(req.body, req.params.id)
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(affectedRows => {
      if (affectedRows > 0) {
        res.status(200).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;