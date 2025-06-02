import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';

const IncomeVsExpenses = () => {
  const { summary } = useSelector(state => state.transactions);
  
  // Prepare pie chart data from Redux store
  const pieData = [
    {
      name: 'Income',
      population: summary.totalIncome || 0,
      color: '#4CAF50',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Expenses',
      population: summary.totalExpenses || 0,
      color: '#F44336',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    formatYLabel: (value) => `₹${value}`,
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Income vs Expenses</Text>
      {pieData[0].population > 0 || pieData[1].population > 0 ? (
        <PieChart
          data={pieData}
          width={Dimensions.get('window').width - 32}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyState: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
});

export default IncomeVsExpenses;