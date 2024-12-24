import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import { GET_AUTHENTICATED_USER, GET_USER_AND_TRANSACTIONS } from "../graphql/queries/user.query";
import { useMutation, useQuery } from "@apollo/client";

const Cards = () => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS);
  const {data:authUser}=useQuery(GET_AUTHENTICATED_USER)
  const { data: userAndTransactions } = useQuery(GET_USER_AND_TRANSACTIONS,{
    variables:{
      userId:authUser?.authUser?._id
    }
  });
  console.log("UserAndTransactions",userAndTransactions)
  // Optional: Log for debugging purposes
  if (error) {
    console.error("Error fetching transactions:", error);
  }
  console.log(data);
  return (
    <div className="w-full px-10 min-h-[40vh]">
      <p className="text-5xl font-bold text-center my-10">History</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20">
        {!loading &&
          data?.transactions?.map((transaction) => (
            < Card key={transaction._id} transaction={transaction} authUser={authUser.authUser} />
          ))}
      </div>
      {!loading && data?.transactions?.length === 0 && (
        <p className="text-2x1 front-bold text-center w-full ">
          No History of transaction found
          <span className="block mt-2 text-blue-600 underline hover:text-blue-800">
            <a href="/login">Login</a>
          </span>
        </p>
      )}
    </div>
  );
};
export default Cards;
