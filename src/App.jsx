import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Generator from "./components/Generator";
import Redirect from "./components/Redirect";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Generator />} />
        <Route path="/r/:id" element={<Redirect />} />
      </Routes>
    </HashRouter>
  );
}
