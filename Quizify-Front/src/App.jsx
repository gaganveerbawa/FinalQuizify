import "./App.css";
import { Routes, Route } from "react-router-dom";

// import Register from "./components/Register/Register";
import { Toaster } from "react-hot-toast";
// import Login from "./components/Login/Login";
// import Home from "./components/Home/Home";
// import DashBoard from "./components/DashBoard/DashBoard";
// import GetQuestions from "./components/GetQuestions/GetQuestions";
// import GetPollQuestions from "./components/GetPollQuestions/GetPollQuestions";
// import ShareModal from "./components/DashBoard/CreateQuiz/QuizModal/QuizModal";
import Home2 from "./components/Home/Home2";
import Login2 from "./components/Login/Login2";
import Register2 from "./components/Register/Register2";
// import DashBoard2 from "./components/DashBoard/DashBoard2";
import UserProvider from "../context/UserContext";
// import PrivateRoute from "../context/PrivateRote";
import GetQuestions from "./components/GetQuestions/GetQuestions"; // Make sure this is correct
// // import PublicRoute from "../context/PublicRoute";
import NavBar from "./NavBar";
import 'flowbite';
import Quizzes from "./Quizzes";
// import CreateQuiz from "./components/DashBoard/CreateQuiz/CreateQuiz";
import Quiz from "./Quiz";
import Polls from "./Polls";
import CreateQuiz from "./CreateQuiz";



function App() {

  return (
    <>
      <UserProvider>
      <NavBar/>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          success: {
            duration: 4000,
            className: "custom-toast",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home2 />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/:quizId" element={<Quiz />} />
        {/* <Route path="/register" element={<PublicRoute element={Register2}/>} /> */}
        <Route path="/register" element={<Register2 />} />
        <Route path="/polls" element={<Polls/>} /> 
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/login" element={<Login2/>} /> */}
        <Route path="/login" element={<Login2/>}/>
        <Route path="/create-quiz" element={<CreateQuiz/>}/>
        {/* <Route path="/dashboard" element={<PrivateRoute element={DashBoard2} />} /> */}
        {/* <Route path="/dashboard" element={<PrivateRoute element={StickyNavbar} />} /> */}
        {/* <Route path="/quiz/:quizId/questions/view" element={<GetQuestions />} />
        <Route
          path="/quiz/:quizId/questions/poll"
          element={<GetPollQuestions />}
        />
        <Route path="/quiz/:quizId/share" element={<ShareModal />} /> */}
      </Routes>
      </UserProvider>
    </>
  );
}

export default App;
