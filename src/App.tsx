import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./theme.css";

function CreateGame() {
  return <div>Create Game (TODO)</div>;
}

function GameView() {
  return <div>Game View (TODO)</div>;
}

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
