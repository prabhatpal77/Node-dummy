// Sub queries
//Consider you have two models, Post and Reaction, with a One-to-Many relationship set up, so that one post has many reactions:
/**
 const Post = sequelize.define('post', {
    content: DataTypes.STRING
}, { timestamps: false });

const Reaction = sequelize.define('reaction', {
    type: DataTypes.STRING
}, { timestamps: false });

Post.hasMany(Reaction);
Reaction.belongsTo(Post);

//Let's fill our tables with some data:
async function makePostWithReactions(content, reactionTypes) {
    const post = await Post.create({ content });
    await Reaction.bulkCreate(
        reactionTypes.map(type => ({ type, postId: post.id }))
    );
    return post;
}

await makePostWithReactions('Hello World', [
    'Like', 'Angry', 'Laugh', 'Like', 'Like', 'Angry', 'Sad', 'Like'
]);
await makePostWithReactions('My Second Post', [
    'Laugh', 'Laugh', 'Like', 'Laugh'
]);

// Let's say we wanted to compute via SQL a laughReactionsCount for each post. 
We can achieve that with a sub-query, such as the following:
SELECT
    *,
    (
        SELECT COUNT(*)
        FROM reactions AS reaction
        WHERE
            reaction.postId = post.id
            AND
            reaction.type = "Laugh"
    ) AS laughReactionsCount
FROM posts AS post

//If we run the above raw SQL query through Sequelize, we get:
[
  {
    "id": 1,
    "content": "Hello World",
    "laughReactionsCount": 1
  },
  {
    "id": 2,
    "content": "My Second Post",
    "laughReactionsCount": 3
  }
]

// you will still have to write that sub-query by yourself:
Post.findAll({
    attributes: {
        include: [
            [
                // Note the wrapping parentheses in the call below!
                sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM reactions AS reaction
                    WHERE
                        reaction.postId = post.id
                        AND
                        reaction.type = "Laugh"
                )`),
                'laughReactionsCount'
            ]
        ]
    }
});

//The above gives the following outpu
[
  {
    "id": 1,
    "content": "Hello World",
    "laughReactionsCount": 1
  },
  {
    "id": 2,
    "content": "My Second Post",
    "laughReactionsCount": 3
  }
]

 */

//Using sub-queries for complex ordering
// This idea can be used to enable complex ordering, such as ordering posts by the number of laugh reactions they have:
/**
 Post.findAll({
    attributes: {
        include: [
            [
                sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM reactions AS reaction
                    WHERE
                        reaction.postId = post.id
                        AND
                        reaction.type = "Laugh"
                )`),
                'laughReactionsCount'
            ]
        ]
    },
    order: [
        [sequelize.literal('laughReactionsCount'), 'DESC']
    ]
});

//Output
[
  {
    "id": 2,
    "content": "My Second Post",
    "laughReactionsCount": 3
  },
  {
    "id": 1,
    "content": "Hello World",
    "laughReactionsCount": 1
  }
]
 */