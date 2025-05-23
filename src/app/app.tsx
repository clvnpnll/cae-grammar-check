import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/home";
import QuizPage from "./pages/quiz";
import ResultsPage from "./pages/result";
import { useEffect } from "react";
import { useActivityStore } from "../store/useActivityStore";
import NotFound from "./pages/not-found";
import axios from "axios";
import LoadingPage from "../components/loading";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<HomePage />} />
      <Route path="home" element={<HomePage />} />
      <Route path="quiz" element={<QuizPage />} />
      <Route path="results" element={<ResultsPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  const { isLoading, setActivities, setIsLoading } = useActivityStore();

  useEffect(() => {
    const fetchActivities = async () => {
      const baseURL = import.meta.env.VITE_PROXY_API_URL;
      const activitiesApiUrl = import.meta.env.VITE_ACTIVITIES_API_URL;
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const requestBody = {
        url: activitiesApiUrl,
      };

      const res = await axios.post(baseURL, requestBody, config);

      if (res.status == axios.HttpStatusCode.Ok) {
        setActivities(res.data.activities);
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className="py-4 md:py-8">
          : <RouterProvider router={router} />
        </div>
      )}
    </>
  );
}

export default App;
