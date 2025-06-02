import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../redux/slices/transactionSlice.js';
import { useNavigation } from '@react-navigation/native';

const RecentTransactions = ({ navigations }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Select data from Redux store
  const { transactions, status, error } = useSelector(state => state.transactions);
  
  useEffect(() => {
    dispatch(fetchTransactions({ month: currentMonth, year: currentYear }));
  }, [dispatch]);

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => navigation.navigate('AllTransactions', { transactionId: item._id })}
    >
      <View style={styles.transactionLeft}>
        <View style={[
          styles.transactionIcon,
          item.type === 'income' ? styles.incomeBg : styles.expenseBg
        ]}>
          <Icon
            name={item.type === 'income' ? 'arrow-down' : 'arrow-up'}
            size={16}
            color={item.type === 'income' ? '#4CAF50' : '#F44336'}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </Text>
          {item.description && (
            <Text style={styles.transactionDescription} numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
      <Text style={[
        styles.transactionAmount,
        item.type === 'income' ? styles.incomeText : styles.expenseText
      ]}>
        {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  if (status === 'loading' && transactions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => dispatch(fetchTransactions({ month: currentMonth, year: currentYear }))}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Only show the most recent 5 transactions sorted by date (newest first)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AllTransactions')}
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <Icon name="chevron-right" size={12} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {recentTransactions.length > 0 ? (
        <FlatList
          data={recentTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item._id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="file-text-o" size={40} color="#9CA3AF" />
          <Text style={styles.emptyText}>No transactions yet</Text>
          <Text style={styles.emptySubText}>Add your first transaction to get started</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#3B82F6',
    fontSize: 14,
    marginRight: 4,
    fontWeight: '500',
  },
  transactionItem: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomeBg: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  expenseBg: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  transactionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  transactionCategory: {
    fontWeight: '500',
    color: '#111827',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionAmount: {
    fontWeight: '600',
    fontSize: 16,
  },
  incomeText: {
    color: '#4CAF50',
  },
  expenseText: {
    color: '#F44336',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: 'white',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 8,
    color: '#111827',
    fontWeight: '500',
  },
  emptySubText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 8,
  },
});

export default RecentTransactions;