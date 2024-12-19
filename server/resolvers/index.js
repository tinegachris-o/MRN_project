import { mergeResolvers } from "@graphql-tools/merge";

//,import transcationResolvers from "./transcationResolvers";
import usersResolvers from "./usersResolvers.js";
import transcationResolvers from "./transcationResolvers.js";

const mergedResolvers = mergeResolvers([usersResolvers, transcationResolvers]);
export default mergedResolvers;
