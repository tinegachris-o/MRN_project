import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TransactionPage from "./pages/TransactionPage";
import NotFoundPage from "./pages/NotFoundPage";
import TransactionFormSkeleton from "./components/skeltons/TransactionSkeleton";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";
import { Toaster } from "react-hot-toast";
import Header from "./components/ui/Header";
function App() {
  //const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);
  //if (loading) return <p>Loading...</p>; // Show loading indicator
  //if (error) return <p>Error: {error.message}</p>; // Show error message
  const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);

  if (loading) return null;
  const authuser = data?.authUser;
  console.log(authuser);

  return (
    <>
      {data?.authuser && <Header />}
      <Routes>
        <Route
          path="/"
          element={authuser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authuser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authuser ? <SignUpPage /> : <Navigate to="/" />}
        />
 
        <Route
          path="/transaction/:id"
          element={authuser ? <TransactionPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
