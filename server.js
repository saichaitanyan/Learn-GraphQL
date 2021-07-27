const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')
const app = express()
// data
const fakeData = require('./data.json');
const posts = fakeData.posts;
const comments = fakeData.comments;
const users = fakeData.users;

// Types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'All about User',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        gender: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) }
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'All about Post',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
        body: { type: GraphQLNonNull(GraphQLString) },
        userId: { type: GraphQLNonNull(GraphQLInt) },
        user: {
            type: UserType,
            resolve: (post) => { return users.find(user => user.id === post.userId) }
        }
    })
})

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    description: 'All about Comment',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        body: { type: GraphQLNonNull(GraphQLString) },
        postId: { type: GraphQLNonNull(GraphQLInt) },
        post: {
            type: PostType,
            resolve: (comment) => { return posts.find(post => post.id === comment.postId) }
        }
    })
})

// RootQueryType
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        post: {
            type: PostType,
            description: 'Get a that particular post by id',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => posts.find(post => post.id === args.id)
        },
        posts: {
            type: new GraphQLList(PostType),
            description: 'List of posts',
            resolve: () => posts
        },
        user: {
            type: UserType,
            description: 'Get that particular user by id',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => users.find(user => user.id === args.id)
        },
        users: {
            type: new GraphQLList(UserType),
            description: 'List of users',
            resolve: () => users
        },
        comment: {
            type: CommentType,
            description: 'Get that particular comment by id',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => comments.find(comment => comment.id === args.id)
        },
        comments: {
            type: new GraphQLList(CommentType),
            description: 'List of comments',
            resolve: () => comments
        }
    })
});

// Schema
const schema = new GraphQLSchema({
    query: RootQueryType
})

// endpoint
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
})
)
// Start server and listens at 3000 port
app.listen(3000, () => console.log('Server Running 🚀'))