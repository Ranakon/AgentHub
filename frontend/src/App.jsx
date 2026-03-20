import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import { AnimatePresence, motion } from "framer-motion";

import Home from "./pages/Home";
import AddAgent from "./pages/AddAgent";
import AgentDetail from "./pages/AgentDetail";
import Dashboard from "./pages/Dashboard"; // check path!

const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.03 }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Page><Login /></Page>} />
        <Route path="/register" element={<Page><Register /></Page>} />
        <Route path="/home" element={<Page><Home /></Page>} />
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/add" element={<Page><AddAgent /></Page>} />
        <Route path="/agent/:id" element={<Page><AgentDetail /></Page>} />
        <Route path="/agentdetails/:id" element={<Page><AgentDetail /></Page>} />
        <Route path="/dashboard" element={<Page><Dashboard /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;