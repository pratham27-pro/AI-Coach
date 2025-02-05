import axios from "axios";

export const diet = async (req, res) => {
    const { dietType, fitnessGoal, medicalConditions } = req.body;

  try {
    // Call Spoonacular API to generate meal plan
    const response = await axios.get(
      `https://api.spoonacular.com/mealplanner/generate`,
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,
          diet: dietType.toLowerCase(),
          targetCalories: fitnessGoal === "Weight Loss" ? 1500 : 2000, // Adjust based on fitness goal
          exclude: medicalConditions.join(","), // Exclude ingredients based on medical conditions
          timeFrame: "day", // Generate a daily meal plan
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    res.status(500).json({ error: "Failed to generate meal plan" });
  }
};