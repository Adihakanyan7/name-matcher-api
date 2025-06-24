import express from 'express'; 
import matchNamesRoute from './routes/matchNamesRoute.mjs';
const app = express();

app.use(express.json());

// Define the route for matching names
app.use("/match-names", matchNamesRoute);

app.get("/", (req, res) => {
  res.send("API is alive");
});


// Server is running on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});