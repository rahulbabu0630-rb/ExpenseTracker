import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { addNewTransaction } from '../../redux/slices/transactionSlice.js';
import Header from "../../components/Header.jsx"
const AddTransaction = () => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.transactions);
  
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const categories = {
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'],
    income: ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other']
  };

  const handleSubmit = async () => {
    console.log("Submit button pressed");
    if (!amount || !category) return;
    
    try {
      const newTransaction = {
        amount: parseFloat(amount),
        type: transactionType,
        category,
        date: new Date(date),
        notes
      };

      console.log("Dispatching transaction:", newTransaction);
      const result = await dispatch(addNewTransaction(newTransaction)).unwrap();
      
      if (result) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          resetForm();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setNotes('');
    setTransactionType('expense');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header/>
      <View style={styles.formContainer}>
        
        <View style={styles.typeToggleContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              transactionType === 'expense' && styles.expenseActive
            ]}
            onPress={() => setTransactionType('expense')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.typeButtonText,
              transactionType === 'expense' && styles.typeButtonTextActive
            ]}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              transactionType === 'income' && styles.incomeActive
            ]}
            onPress={() => setTransactionType('income')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.typeButtonText,
              transactionType === 'income' && styles.typeButtonTextActive
            ]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>

            <TextInput
              style={styles.amountInput}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={text => setAmount(text.replace(/[^0-9.]/g, ''))}
              placeholder="0.00"
            />
          </View>
        </View>

        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Category</Text>
          <TouchableOpacity 
            style={styles.categorySelector}
            onPress={() => setShowCategoryModal(true)}
            activeOpacity={0.7}
          >
            <Text style={category ? styles.categorySelected : styles.categoryPlaceholder}>
              {category || 'Select Category'}
            </Text>
            <Icon name="chevron-down" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Date</Text>
          <View style={styles.dateInputContainer}>
            <Icon name="calendar" size={16} color="#6B7280" style={styles.dateIcon} />
            <TextInput
              style={styles.dateInput}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
            />
          </View>
        </View>

        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add some notes"
            multiline
          />
        </View>

        
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!amount || !category || status === 'loading') && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!amount || !category || status === 'loading'}
          activeOpacity={0.7}
        >
          {status === 'loading' ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Add Transaction</Text>
          )}
        </TouchableOpacity>
      </View>

      
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {categories[transactionType].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.categoryItem}
                onPress={() => {
                  setCategory(cat);
                  setShowCategoryModal(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryItemText}>{cat}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowCategoryModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeModalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <View style={styles.successIcon}>
              <Icon name="check" size={32} color="#10B981" />
            </View>
            <Text style={styles.successTitle}>Transaction Added!</Text>
            <Text style={styles.successMessage}>
              Your {transactionType} of {amount} has been recorded.
            </Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  formContainer: {
    padding: 20,
  },
  typeToggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#E5E7EB',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  expenseActive: {
    backgroundColor: '#FEE2E2',
  },
  incomeActive: {
    backgroundColor: '#D1FAE5',
  },
  typeButtonText: {
    fontWeight: '500',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#1F2937',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    color: '#374151',
    fontWeight: '500',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currencySymbol: {
    fontSize: 20,
    color: '#6B7280',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    paddingVertical: 12,
    color: '#1F2937',
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categorySelected: {
    color: '#1F2937',
  },
  categoryPlaceholder: {
    color: '#9CA3AF',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateIcon: {
    marginRight: 8,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#1F2937',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1F2937',
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
  closeModalButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#3B82F6',
    fontWeight: '500',
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  successModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '80%',
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1F2937',
  },
  successMessage: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 16,
  },
});

export default AddTransaction;