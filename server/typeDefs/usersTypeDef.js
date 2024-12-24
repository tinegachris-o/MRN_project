const usersTypeDef = `#graphql
type User {
  _id: ID!
  username: String!
  name: String!
  password: String!
  profilePicture: String!
  gender: String!
  transactions:[Transaction!]
}

type Query {
  
  authUser: User!  # Corrected the casing here
  user(userId: ID!): User
}

type Mutation {
  signUp(input: SignUpInput!): User  # Use 'input' instead of 'Input'
  login(input: LoginInput!): User
  logout: LogoutResponse
}

input SignUpInput {
  username: String!
  name: String!
  password: String!
  gender: String!
}

input LoginInput {
  username: String!
  password: String!
}

type LogoutResponse {
  message: String!
}
`;

export default usersTypeDef;
