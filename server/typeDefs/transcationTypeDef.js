const transcationTypeDef = `#graphql
type Transcation {
  _id: ID!
  userId: ID!
  description: String!
  paymentType: String!
  category: String!
  amount: Float!
  location: String
  date: String!
}

type Query {
  transcations: [Transcation!]
  transcation(Id: ID!): Transcation
}

type Mutation {
  createTranscation(input: CreateTranscationInput!): Transcation!
  updateTranscation(input: UpdateTranscationInput!): Transcation!
  deleteTranscation(transcationId: ID!): Transcation!
}

input CreateTranscationInput {
  description: String!
  paymentType: String!
  category: String!
  amount: Float!
  location: String
  date: String!
}

input UpdateTranscationInput {
  transcationId: ID!
  description: String
  paymentType: String
  category: String
  amount: Float
  location: String
  date: String
}
`;

export default transcationTypeDef;
