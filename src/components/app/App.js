import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "../pages/MainPage";
import ComicsPage from "../pages/ComicsPage";
import AppHeader from "../appHeader/AppHeader";
import Page404 from "../pages/404";
import SingleComicPage from "../pages/SingleComicPage";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/comics" element={<ComicsPage />} />
            <Route path="/comics/:id" element={<SingleComicPage />} />
            <Route path="*" element={<Page404/>}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
