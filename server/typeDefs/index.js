import { mergeTypeDefs } from "@graphql-tools/merge";

import usersTypeDef from "./usersTypeDef.js";
import transcationTypeDef from "./transcationTypeDef.js";

const mergedTypeDefs = mergeTypeDefs([usersTypeDef, transcationTypeDef]);
export default mergedTypeDefs;
