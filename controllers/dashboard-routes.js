const router = require('express').Router();
const { Post, User, Comment } = require('../models/');
const withAuth = require('../utils/auth');


router.get('/', withAuth, async (req, res) => {
    try {
        const dbpostdata= await Post.findAll({  
            where: {
            userId: req.session.userId
        },
})
        console.log(dbpostdata)
            const posts = dbpostdata.map(post => post.get({ plain: true }));

            // attributes: [
            //     'id',
            //     'title',
            //     'content',
            //     'created_at'
            // ],
            // include: [{
            //         model: Comment,
            //         attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            //         include: {
            //             model: User,
            //             attributes: ['username']
            //         }
            //     },
            //     {
            //         model: User,
            //         attributes: ['username']
            //     }
            // ]
        
        
            res.render('dashboard', { posts });
    }
        catch(err) {
            console.log(err);
            res.status(500).json(err);
        };
});
router.get('/dashboard/edit/:id', withAuth, (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id',
                'title',
                'content',
                'created_at'
            ],
            include: [{
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ]
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            const post = dbPostData.get({ plain: true });
            res.render('edit-post', { post, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})
router.get('/dashboard/new', (req, res) => {
    res.render('new-post');
});



module.exports = router;