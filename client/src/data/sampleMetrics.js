// Generate sample data for the last 30 days
const generateChartData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      bursts: Math.floor(Math.random() * 200) + 300, // 300-500
      wins: Math.floor(Math.random() * 150) + 200,   // 200-350
      purchases: Math.floor(Math.random() * 50) + 30, // 30-80
      redemptions: Math.floor(Math.random() * 40) + 20, // 20-60
      referrals: Math.floor(Math.random() * 30) + 10,   // 10-40
    });
  }
  
  return data;
};

export const sampleMetrics = {
  bursts: 1247,
  wins: 892,
  purchases: 156,
  redemptions: 89,
  referrals: 67,
  chartData: generateChartData()
};

// Filter metrics by date
export const filterMetricsByDate = (metrics, sinceDate) => {
  if (!sinceDate) return metrics;
  
  const filteredData = metrics.chartData.filter(item => {
    const itemDate = new Date(item);
    const filterDate = new Date(sinceDate);
    return itemDate >= filterDate;
  });
  
  // Calculate totals from filtered data
  const totals = filteredData.reduce((acc, item) => {
    acc.bursts += item.bursts;
    acc.wins += item.wins;
    acc.purchases += item.purchases;
    acc.redemptions += item.redemptions;
    acc.referrals += item.referrals;
    return acc;
  }, { bursts: 0, wins: 0, purchases: 0, redemptions: 0, referrals: 0 });
  
  return {
    ...totals,
    chartData: filteredData
  };
}; 