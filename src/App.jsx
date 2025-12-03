import { useEffect } from "react";
import api from "./api/apiClient";

function App() {
  useEffect(() => {
    api
      .get("/WeatherForecast") // або інший твій endpoint
      .then((res) => console.log("API Response:", res.data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  return (
    <div>
      <h1>React + .NET API Connected</h1>
    </div>
  );
}

export default App;
