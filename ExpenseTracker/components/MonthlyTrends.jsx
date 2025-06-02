import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, FlatList } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../redux/slices/transactionSlice';

const MonthlyTrends = () => {
  const dispatch = useDispatch();
  const { transactions, status } = useSelector(state => state.transactions);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'short' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
    const years = ['2023', '2024', '2025'];

  // Process transaction data for the chart
  const processChartData = () => {
    // Group transactions by category
    const categories = {
      Food: Array(12).fill(0),
      Entertainment: Array(12).fill(0),
      Grocery: Array(12).fill(0),
      Medical: Array(12).fill(0),
      Other: Array(12).fill(0)
    };

    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        const monthIndex = new Date(transaction.date).getMonth();
        const category = transaction.category || 'Other';
        if (categories[category]) {
          categories[category][monthIndex] += transaction.amount;
        }
      }
    });

    return {
      labels: months,
      datasets: [
        {
          data: categories.Food,
          color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`, // Orange
          strokeWidth: 2
        },
        {
          data: categories.Entertainment,
          color: (opacity = 1) => `rgba(233, 30, 99, ${opacity})`, // Pink
          strokeWidth: 2
        },
        {
          data: categories.Grocery,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green
          strokeWidth: 2
        },
        {
          data: categories.Medical,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // Blue
          strokeWidth: 2
        },
      ],
      legend: ['Food', 'Entertainment', 'Grocery', 'Medical']
    };
  };

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

  useEffect(() => {
    dispatch(fetchTransactions({ month: 'All', year: selectedYear }));
  }, [selectedYear, dispatch]);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setShowMonthPicker(false);
    // Filter transactions for the selected month
    dispatch(fetchTransactions({ month, year: selectedYear }));
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setShowYearPicker(false);
    dispatch(fetchTransactions({ month: 'All', year }));
  };

  if (status === 'loading') {
    return (
      <View style={styles.chartCard}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const lineData = processChartData();

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Monthly Trends</Text>
        <View style={styles.dateSelectors}>
          <TouchableOpacity 
            style={styles.dateSelector}
            onPress={() => setShowMonthPicker(true)}
          >
            <Text style={styles.dateText}>{selectedMonth}</Text>
            <Icon name="chevron-down" size={12} color="#4b5563" style={styles.dropdownIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dateSelector}
            onPress={() => setShowYearPicker(true)}
          >
            <Text style={styles.dateText}>{selectedYear}</Text>
            <Icon name="chevron-down" size={12} color="#4b5563" style={styles.dropdownIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={months}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleMonthSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={years}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleYearSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      
      {transactions.length > 0 ? (
        <LineChart
          data={lineData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.lineChart}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No transaction data available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateSelectors: {
    flexDirection: 'row',
    gap: 8,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateText: {
    fontSize: 14,
    marginRight: 4,
  },
  dropdownIcon: {
    marginLeft: 4,
  },
  lineChart: {
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxHeight: '60%',
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyState: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
});

export default MonthlyTrends;