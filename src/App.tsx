import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreateGame } from "./components/pages/CreateGame";
import { GameView } from "./components/pages/GameView";
import "./theme.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create" element={<CreateGame />} />
        <Route path="/game/:gameId" element={<GameView />} />
        <Route path="/" element={<CreateGame />} />
      </Routes>
    </BrowserRouter>
  );
}
