import { mergeTypeDefs } from "@graphql-tools/merge";

import usersTypeDef from "./usersTypeDef.js";
import transactionTypeDef from "./transactionTypeDef.js";

const mergedTypeDefs = mergeTypeDefs([usersTypeDef, transactionTypeDef]);
export default mergedTypeDefs;
