const backend_url = import.meta.env.VITE_backend_url

export function getWeeklyData(dailyData) {
  // Initialize map for each day of week
  
  return dailyData.slice(0, 7).reverse();
}

export const handleSessionUpdate = async (module, score) => {
  try {
    const userSession = JSON.parse(localStorage.getItem('userSession'))
    console.log(userSession.email, module)
    const res = await fetch(backend_url+"increment-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email:userSession.email, module, score }),
    });

    const data = await res.json();
    console.log("Response:", data);
    // alert(data.message || data.error);
  } catch (err) {
    console.error(err);
    // alert("Something went wrong");
  }
};
export function getRadarData(dailyData) {
  const skillKeys = ["speaking", "pronunciation", "vocabulary", "grammar", "story", "reflex"];
  const radarData = [];

  skillKeys.forEach(skill => {
    const total = dailyData.reduce((sum, day) => sum + (day[skill] || 0), 0);
    const average = total / dailyData.length;
    radarData.push({
      skill: skill.charAt(0).toUpperCase() + skill.slice(1), // Capitalize
      value: Math.round(average),
      fullMark: 100
    });
  });

  return radarData;
}

export const updateDailyData = async(data, currDayObj) => {
  console.log("Updating daily data:", data);
  const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
  const username = userSession.email || "Guest";
  // console.log(username)
  const response = await fetch(backend_url + "updateDailyData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, data, currDayObj })
      });
 
  const output = await response.json();
  return output;
}