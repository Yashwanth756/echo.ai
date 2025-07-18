

import {getWeeklyData, getRadarData, updateDailyData} from "./utils";

let data;
const backend_url = import.meta.env.VITE_backend_url
const getUserData = async () => {
  const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
  let email;
  email = userSession.email || "student1@gmail.com";
  const response = await fetch(backend_url + "getUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
  data = await response.json();
  await checkandUpdateData();
  return data;
}
data = {
    id: '1',
    fullName: 'Yashwanth',
    email: 'yashwanth71208@gmail.com',
    role: 'student',
    classes: [ 'Class 6' ],
    sections: [ 'A' ],
    password: 'jkl',
    speakingCompletion: 370,
    pronunciationCompletion: 958,
    vocabularyCompletion: 390,
    grammarCompletion: 380,
    storyCompletion: 0,
    reflexCompletion: 0,
    dailyData: [
      {
        date: '2025-07-17',
        day: 'Thu',
        fullDate: 'Jul 17',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-16',
        day: 'Wed',
        fullDate: 'Jul 16',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 428,
        pronunciation: 1012,
        vocabulary: 440,
        grammar: 423,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-15',
        day: 'Tue',
        fullDate: 'Jul 15',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 47,
        pronunciation: 45,
        vocabulary: 40,
        grammar: 37,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-14',
        day: 'Mon',
        fullDate: 'Jul 14',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-13',
        day: 'Sun',
        fullDate: 'Jul 13',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-12',
        day: 'Sat',
        fullDate: 'Jul 12',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-11',
        day: 'Fri',
        fullDate: 'Jul 11',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-10',
        day: 'Thu',
        fullDate: 'Jul 10',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-09',
        day: 'Wed',
        fullDate: 'Jul 09',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-08',
        day: 'Tue',
        fullDate: 'Jul 08',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-07',
        day: 'Mon',
        fullDate: 'Jul 07',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-06',
        day: 'Sun',
        fullDate: 'Jul 06',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-05',
        day: 'Sat',
        fullDate: 'Jul 05',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-04',
        day: 'Fri',
        fullDate: 'Jul 04',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-03',
        day: 'Thu',
        fullDate: 'Jul 03',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-02',
        day: 'Wed',
        fullDate: 'Jul 02',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-07-01',
        day: 'Tue',
        fullDate: 'Jul 01',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-30',
        day: 'Mon',
        fullDate: 'Jun 30',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-29',
        day: 'Sun',
        fullDate: 'Jun 29',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-28',
        day: 'Sat',
        fullDate: 'Jun 28',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-27',
        day: 'Fri',
        fullDate: 'Jun 27',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-26',
        day: 'Thu',
        fullDate: 'Jun 26',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-25',
        day: 'Wed',
        fullDate: 'Jun 25',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-24',
        day: 'Tue',
        fullDate: 'Jun 24',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-23',
        day: 'Mon',
        fullDate: 'Jun 23',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-22',
        day: 'Sun',
        fullDate: 'Jun 22',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-21',
        day: 'Sat',
        fullDate: 'Jun 21',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-20',
        day: 'Fri',
        fullDate: 'Jun 20',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-19',
        day: 'Thu',
        fullDate: 'Jun 19',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      },
      {
        date: '2025-06-18',
        day: 'Wed',
        fullDate: 'Jun 18',
        totalTime: 0,
        sessionsCompleted: 0,
        speaking: 0,
        pronunciation: 0,
        vocabulary: 0,
        grammar: 0,
        story: 0,
        reflex: 0
      }
    ],
    activityLog: [],
    wordscramble: {
      easyscore: { score: 1, isCompleted: false, currWordIndex: 0 },
      mediumscore: { score: 1, isCompleted: false, currWordIndex: 0 },
      hardscore: { score: 0, isCompleted: false, currWordIndex: 0 },
      easy: [ [ 'happy', 0, true ] ],
      medium: [ [ 'planet', 0, true ] ],
      hard: [ [ 'information', 0, false ] ]
    },
    vocabularyArchade: {
      intermediate: {
        wordDetails: [
          {
            word: 'reluctant',
            definition: 'Unwilling and hesitant',
            incorrectDefinitions: [
              'Very excited',
              'Completely certain',
              'Happily accepting'
            ],
            partOfSpeech: 'adjective',
            example: 'She was reluctant to try the new dish.',
            hint: 'How you feel before doing something risky',
            isSolved: false
          }
        ],
        score: 0,
        badge: '',
        currentWordIndex: 0
      },
      advanced: {
        score: 0,
        badge: '',
        currentWordIndex: 0,
        wordDetails: [
          {
            word: 'ephemeral',
            definition: 'Lasting for a very short time',
            incorrectDefinitions: [
              'Very loud and noisy',
              'Permanent and unchanging',
              'Difficult to understand'
            ],
            partOfSpeech: 'adjective',
            example: 'The beauty of a sunset is often ephemeral.',
            hint: 'Opposite of permanent',
            isSolved: false
          }
        ]
      },
      beginner: {
        score: 0,
        badge: 'Vocab Master',
        currentWordIndex: 0,
        wordDetails: [
          {
            word: 'happy',
            definition: 'Feeling or showing pleasure or contentment',
            incorrectDefinitions: [
              'Feeling sad or upset',
              'Moving very quickly',
              'Being very loud'
            ],
            partOfSpeech: 'adjective',
            example: 'The children were happy playing in the park.',
            hint: 'How you feel on your birthday',
            isSolved: false
          }
        ]
      }
    },
    wordsearch: {
      beginner: {
        noOfWordsSolved: 0,
        words: [
          {
            word: 'HEART',
            hint: 'This organ pumps blood through your body',
            solved: false
          }
        ],
        gridSize: 0,
        score: 0
      },
      intermediate: {
        noOfWordsSolved: 0,
        words: [
          {
            word: 'PHOTOSYNTHESIS',
            hint: 'The process by which plants make their food using sunlight',
            solved: false
          }
        ],
        gridSize: 0,
        score: 0
      },
      advanced: {
        noOfWordsSolved: 0,
        words: [
          {
            word: 'MITOCHONDRIA',
            hint: 'The powerhouse of the cell that produces energy',
            solved: false
          }
        ],
        gridSize: 0,
        score: 0
      }
    },
    overall: 0,
    timeSpent: 0
  };
export const getData = async () => {
  data = await getUserData();
  return data
}

export const overallProgress = {
  speaking: data['speakingCompletion'],
  pronunciation: ['pronunciationCompletion'],
  vocabulary: ['vocabularyCompletion'],
  grammar: ['grammarCompletion'],
  story: ['storyCompletion'],
  reflex: ['reflexCompletion'],
};

export const generateDailyData = async() => {
  data = await getUserData();
  // console.log('Daily data fetched:', data['dailyData']);
  return data['dailyData'];
};

export const wordscrambleData = () => {
  return data['wordscramble'] || [];
}

export const vocabularyArchadeData = () =>{
  return data['vocabularyArchade']
}

export const wordsearchData = () =>{
  return data['wordsearch']
}
// (async () => {
//   await generateDailyData();
// })();

// export const dailyData =await generateDailyData();
export const loadDailyData = ()=>{
  return data['dailyData'] || [];
}
export const weeklyData = () => {
  return getWeeklyData(data['dailyData'] || []);  
}

export let radarData =()=>( getRadarData(data['dailyData']));

export let moduleCompletionData =()=> ([
  { name: "Speaking", completion: data.speakingCompletion, color: "#9b87f5" },
  { name: "Pronunciation", completion: data.pronunciationCompletion, color: "#33C3F0" },
  { name: "Vocabulary", completion: data.vocabularyCompletion, color: "#F06292" },
  { name: "Grammar", completion: data.grammarCompletion, color: "#AED581" },
  { name: "Story", completion: data.storyCompletion, color: "#FFD54F" },
  { name: "Reflex", completion: data.reflexCompletion, color: "#FF7043" },
]);

export let activityLog =()=> (data['activityLog'])


// Performance analytics
export const getPerformanceAnalytics = () => {
  const recent7Days = data['dailyData'].slice(-7);
  const previous7Days = data['dailyData'].slice(-14, -7);
  
  const modules = ['speaking', 'pronunciation', 'vocabulary', 'grammar', 'story', 'reflex'];
  
  const analytics = modules.map(module => {
    const recentAvg = recent7Days.reduce((sum, day) => sum + day[module], 0) / 7;
    const previousAvg = previous7Days.reduce((sum, day) => sum + day[module], 0) / 7;
    const improvement = recentAvg - previousAvg;
    const trend = improvement > 2 ? 'improving' : improvement < -2 ? 'declining' : 'stable';
    
    return {
      module: module.charAt(0).toUpperCase() + module.slice(1),
      current: Math.round(recentAvg),
      previous: Math.round(previousAvg),
      improvement: Math.round(improvement * 10) / 10,
      trend,
      color: moduleCompletionData().find(m => m.name.toLowerCase() === module)?.color || '#gray'
    };
  });
  
  return analytics;
};

// Intelligent feedback system
export const generateIntelligentFeedback = () => {
  const analytics = getPerformanceAnalytics();
  const recentData = data['dailyData'].slice(-7);
  const totalStudyTime = recentData.reduce((sum, day) => sum + day.totalTime, 0);
  const avgDailyTime = totalStudyTime / 7;
  
  const strongestModule = analytics.reduce((max, module) => 
    module.current > max.current ? module : max
  );
  
  const weakestModule = analytics.reduce((min, module) => 
    module.current < min.current ? module : min
  );
  
  const improvingModules = analytics.filter(m => m.trend === 'improving');
  const decliningModules = analytics.filter(m => m.trend === 'declining');
  
  const feedback = {
    overall: {
      grade: calculateOverallGrade(analytics),
      message: generateOverallMessage(analytics, avgDailyTime),
      studyTime: Math.round(avgDailyTime),
      consistency: calculateConsistency(recentData)
    },
    strengths: [
      `Excellent progress in ${strongestModule.module} (${strongestModule.current}%)`,
      ...(improvingModules.length > 0 ? [`Improving trend in ${improvingModules.map(m => m.module).join(', ')}`] : [])
    ],
    improvements: [
      `Focus more on ${weakestModule.module} (${weakestModule.current}%)`,
      ...(decliningModules.length > 0 ? [`Address declining performance in ${decliningModules.map(m => m.module).join(', ')}`] : []),
      ...(avgDailyTime < 30 ? ['Increase daily study time for better results'] : [])
    ],
    recommendations: generateRecommendations(analytics, avgDailyTime)
  };
  
  return feedback;
};

const calculateOverallGrade = (analytics) => {
  const average = analytics.reduce((sum, m) => sum + m.current, 0) / analytics.length;
  if (average >= 85) return 'A';
  if (average >= 75) return 'B+';
  if (average >= 65) return 'B';
  if (average >= 55) return 'C+';
  if (average >= 45) return 'C';
  return 'D';
};

const generateOverallMessage = (analytics, avgDailyTime) => {
  const average = analytics.reduce((sum, m) => sum + m.current, 0) / analytics.length;
  
  if (average >= 80) {
    return "Outstanding performance! You're excelling across all modules.";
  } else if (average >= 70) {
    return "Great job! You're showing strong progress in your English learning journey.";
  } else if (average >= 60) {
    return "Good progress! Keep up the consistent practice to see even better results.";
  } else {
    return "You're on the right track! Focus on consistent practice to improve your skills.";
  }
};

const calculateConsistency = (recentData) => {
  const dailyTotals = recentData.map(day => 
    (day.speaking + day.pronunciation + day.vocabulary + day.grammar + day.story + day.reflex) / 6
  );
  
  const average = dailyTotals.reduce((sum, total) => sum + total, 0) / dailyTotals.length;
  const variance = dailyTotals.reduce((sum, total) => sum + Math.pow(total - average, 2), 0) / dailyTotals.length;
  const consistency = Math.max(0, 100 - Math.sqrt(variance));
  
  return Math.round(consistency);
};

const generateRecommendations = (analytics, avgDailyTime) => {
  const recommendations = [];
  
  // Time-based recommendations
  if (avgDailyTime < 20) {
    recommendations.push("Aim for at least 20-30 minutes of daily practice");
  } else if (avgDailyTime > 90) {
    recommendations.push("Great dedication! Consider shorter, more focused sessions");
  }
  
  // Module-specific recommendations
  const weakModules = analytics.filter(m => m.current < 60);
  if (weakModules.length > 0) {
    recommendations.push(`Prioritize practice in: ${weakModules.map(m => m.module).join(', ')}`);
  }
  
  // Trend-based recommendations
  const decliningModules = analytics.filter(m => m.trend === 'declining');
  if (decliningModules.length > 0) {
    recommendations.push("Review fundamentals in modules showing decline");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Maintain your excellent practice routine!");
  }
  
  return recommendations;
};
 const getdailydata = () => {
  const days = 30;
  const today = new Date();
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      speaking: Math.max(0, Math.min(100, 45 + Math.random() * 30 + i * 0.5)),
      pronunciation: Math.max(0, Math.min(100, 60 + Math.random() * 25 + i * 0.6)),
      vocabulary: Math.max(0, Math.min(100, 35 + Math.random() * 35 + i * 0.4)),
      grammar: Math.max(0, Math.min(100, 40 + Math.random() * 40 + i * 0.5)),
      story: Math.max(0, Math.min(100, 30 + Math.random() * 35 + i * 0.4)),
      reflex: Math.max(0, Math.min(100, 25 + Math.random() * 25 + i * 0.3)),
      totalTime: Math.floor(Math.random() * 60) + 30, // minutes spent
      sessionsCompleted: Math.floor(Math.random() * 8) + 2,
    });
  }
  
  return data;
};
export async function checkandUpdateData() {
  const currdate = new Date().toISOString().split('T')[0]
  const lastDate = new Date(data['dailyData'][0]?.date).toISOString().split('T')[0];
  // console.log(currdate,'\n', lastDate)
  if (currdate !== lastDate) {
    const currDayObj = {
      date: currdate,
      day: new Date(currdate).toLocaleDateString("en-US", { weekday: "short" }),
      fullDate: new Date(currdate).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
      totalTime: 0,
      sessionsCompleted: 0,
      speaking: 0,
      pronunciation: 0,
      vocabulary: 0,
      grammar: 0,
      story: 0,
      reflex: 0
    };
    await handleDailyData(currDayObj);
  }
}


export async function handleDailyData( currDayObj) {

  const fields = ["speaking", "pronunciation", "vocabulary", "grammar", "story", "reflex"];
  const currDate = new Date(currDayObj.date);
  const lastDate = new Date(data['dailyData'][0]?.date);

  const getDateDiff = (d1, d2) => Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));

  // CASE 1
  if (currDayObj.date === data['dailyData'][0]?.date) {
    const existing = data['dailyData'][0];

    const averagedDay = { ...existing };
    fields.forEach(field => {
      averagedDay[field] = Math.floor((existing[field] + currDayObj[field]));
    });
    averagedDay.totalTime = existing.totalTime + currDayObj.totalTime;
    averagedDay.sessionsCompleted = existing.sessionsCompleted + currDayObj.sessionsCompleted;

    data['dailyData'][0] = averagedDay;
    data['dailyData'] = data['dailyData'].slice(0, 30);
    console.log(currDayObj, averagedDay)

    console.log(currDayObj, data['dailyData'][0]);
    let response = await updateDailyData(data['dailyData'], currDayObj);
    console.log("Updated daily data:", response);
    return;
  }

    // CASE 2
  const diffDays = getDateDiff(currDate, lastDate);
  const maxFillDays = Math.min(diffDays - 1, 29);  

  for (let i = maxFillDays; i >= 1; i--) {
    const missingDate = new Date(currDate);
    missingDate.setDate(currDate.getDate() - i);

    const isoDate = missingDate.toISOString().split("T")[0];
    const dayName = missingDate.toLocaleDateString("en-US", { weekday: "short" });
    const fullDate = missingDate.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

    const zeroObj = {
      date: isoDate,
      day: dayName,
      fullDate: fullDate,
      totalTime: 0,
      sessionsCompleted: 0
    };
    fields.forEach(f => zeroObj[f] = 0);
    data['dailyData'].unshift(zeroObj);
    // console.log('in loop')
  }

  data['dailyData'].unshift(currDayObj);
  data['dailyData'] = data['dailyData'].slice(0, 30);


  let response = await updateDailyData(data['dailyData'], currDayObj);
  console.log("Updated daily data:", response);
}

