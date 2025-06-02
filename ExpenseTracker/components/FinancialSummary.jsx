import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../redux/slices/transactionSlice.js';

const FinancialSummary = () => {
  const dispatch = useDispatch();
  const { summary, status, error } = useSelector(state => state.transactions);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2023', '2024', '2025', '2026'];

  useEffect(() => {
    dispatch(fetchTransactions({ month: selectedMonth, year: selectedYear }));
  }, [selectedMonth, selectedYear, dispatch]);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setShowYearPicker(false);
  };

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Month/Year Filter */}
      <View style={styles.filterContainer}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Month:</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowMonthPicker(true)}
          >
            <Text style={styles.dropdownText}>{selectedMonth}</Text>
            <Icon name="chevron-down" size={12} color="#4b5563" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Year:</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowYearPicker(true)}
          >
            <Text style={styles.dropdownText}>{selectedYear}</Text>
            <Icon name="chevron-down" size={12} color="#4b5563" />
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

      {/* Summary Cards */}
      <View style={styles.cardsContainer}>
        {/* Income Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="arrow-up" size={14} color="#4CAF50" />
            <Text style={[styles.cardPercentage, { color: '#4CAF50' }]}>+12%</Text>
          </View>
          <Text style={styles.cardLabel}>Income</Text>
          <Text style={styles.cardValue}>₹{summary.totalIncome?.toLocaleString() || '0'}</Text>
        </View>

        {/* Expenses Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="arrow-down" size={14} color="#F44336" />
            <Text style={[styles.cardPercentage, { color: '#F44336' }]}>+8%</Text>
          </View>
          <Text style={styles.cardLabel}>Expenses</Text>
          <Text style={styles.cardValue}>₹{summary.totalExpenses?.toLocaleString() || '0'}</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="wallet" size={14} color="#2196F3" />
            <Text style={[styles.cardPercentage, { color: '#2196F3' }]}>+15%</Text>
          </View>
          <Text style={styles.cardLabel}>Balance</Text>
          <Text style={styles.cardValue}>₹{summary.balance?.toLocaleString() || '0'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    marginRight: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dropdownText: {
    marginRight: 8,
    fontSize: 14,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardPercentage: {
    fontSize: 12,
  },
  cardLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
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
});

export default FinancialSummary;