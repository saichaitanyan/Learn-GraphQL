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
        name: { type: GraphQLNonNull(GraphQLString) }
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
    description: 'All about comments',
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
        posts: {
            type: new GraphQLList(PostType),
            description: 'List of posts',
            resolve: () => posts
        },
        users: {
            type: new GraphQLList(UserType),
            description: 'List of users',
            resolve: () => users
        },
        comments: {
            type: new GraphQLList(CommentType),
            description: 'List of comments',
            resolve: () => comments
        }
    })
});

// schema
const schema = new GraphQLSchema({
    query: RootQueryType
})
// server listens at 3000 port
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
})
)

app.listen(3000, () => console.log('Server Running 🚀'))