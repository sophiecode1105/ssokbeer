import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Alcol from "../pages/Alcol";
import Login from "../pages/Login";
import Community from "../pages/Community";
import GlobalStyles from "./GlobalStyles";
import Signup from "../pages/Signup";
import Writing from "../pages/Writing";
import DetailPage from "../pages/Detailpage";

const Routers = () => (
  <BrowserRouter>
    <GlobalStyles />
    <Navbar />
    <Routes>
      <Route path="/drink" element={<Alcol />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/community" element={<Community />} />
      <Route path="/writing" element={<Writing />} />
      <Route path="/community/detailpage" element={<DetailPage />} />
    </Routes>
  </BrowserRouter>
);

export default Routers;
