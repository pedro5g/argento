<?php

class TransactionServices {

    private $transactionRepository;

    public function __construct(TransactionRepository $transactionRepository) {
        $this->transactionRepository = $transactionRepository;
    }

    public function createTransaction($data) {
        return $this->transactionRepository->createTransaction($data);
    }

    public function updateTransaction($data) {
        if (!$this->transactionRepository->findById($data['id'])) {
            throw new Exception("Transaction not found");
        }

        return $this->transactionRepository->update($data['id'], $data);
    }

    public function deleteTransaction($data) {
        if (!$this->transactionRepository->findById($data['id'])) {
            throw new Exception("Transaction not found");
        }

        return $this->transactionRepository->delete($data['id']);
    }

    public function getTransactionById($id) {
        $transaction = $this->transactionRepository->findById($id);
        if (!$transaction) {
            throw new Exception("Transaction not found");
        }
        return $transaction;
    }

    public function listUserTransactions($userId) {
       
        return $this->transactionRepository->listByUser($userId);
    }

    public function listPaginatedTransactions($userId, $options = []) {
        $options['limit'] = $options['limit'] ?? 10;
        $options['offset'] = $options['offset'] ?? 0;
        
        $options = $this->validateAndSanitizeFilters($options);
        
        $transactions = $this->transactionRepository->listTransactionsPaginated($userId, $options);
        
        $total = $this->transactionRepository->countTransactions($userId, $options);
        
        $summary = $this->transactionRepository->getTransactionsSummary($userId, $options);
        
        return [
            'data' => $transactions,
            'pagination' => [
                'total' => $total,
                'limit' => $options['limit'],
                'offset' => $options['offset'],
                'current_page' => floor($options['offset'] / $options['limit']) + 1,
                'total_pages' => ceil($total / $options['limit']),
                'has_next' => ($options['offset'] + $options['limit']) < $total,
                'has_previous' => $options['offset'] > 0
            ],
            'summary' => $summary
        ];
    }
    
    public function getTransactionsByPeriod($userId, $period, $options = []) {
        $dateFilters = $this->getPeriodDateFilters($period);
        $options = array_merge($options, $dateFilters);
        
        return $this->listPaginatedTransactions($userId, $options);
    }
    

    public function getTransactionsByCategory($userId, $categoryIds, $options = []) {
        $options['category_id'] = is_array($categoryIds) ? $categoryIds : [$categoryIds];
        
        return $this->listPaginatedTransactions($userId, $options);
    }
    

    public function getPendingTransactions($userId, $options = []) {
        $options['is_scheduled'] = true;
        $options['confirmed'] = false;
        
        return $this->listPaginatedTransactions($userId, $options);
    }
    
    public function getScheduledTransactions($userId, $options = []) {
        $options['is_scheduled'] = true;
        
        return $this->listPaginatedTransactions($userId, $options);
    }
    

    public function searchTransactions($userId, $searchTerm, $options = []) {
        $options['search'] = $searchTerm;
        
        return $this->listPaginatedTransactions($userId, $options);
    }

    public function getRecentTransactions($userId, $limit = 5) {
        $options = [
            'limit' => $limit,
            'offset' => 0,
            'order_by' => 'created_at',
            'order_direction' => 'DESC'
        ];
        
        $result = $this->listPaginatedTransactions($userId, $options);
        return $result['data']; 
    }
    
    public function getTransactionsReport($userId, $options = []) {
        $options['limit'] = $options['limit'] ?? 1000; 
        $options['offset'] = 0;
        
        $result = $this->listPaginatedTransactions($userId, $options);
        $result['analytics'] = $this->generateAnalytics($result['data']);
        
        return $result;
    }

    private function validateAndSanitizeFilters($options) {
        $sanitized = [];
        
        if (isset($options['limit'])) {
            $sanitized['limit'] = max(1, min(100, (int) $options['limit']));
        }
        

        if (isset($options['offset'])) {
            $sanitized['offset'] = max(0, (int) $options['offset']);
        }

        if (isset($options['type']) && in_array($options['type'], ['income', 'expense'])) {
            $sanitized['type'] = $options['type'];
        }
        
    
        if (isset($options['date_from']) && $this->isValidDate($options['date_from'])) {
            $sanitized['date_from'] = $options['date_from'];
        }
        
        if (isset($options['date_to']) && $this->isValidDate($options['date_to'])) {
            $sanitized['date_to'] = $options['date_to'];
        }
        
    
        if (isset($options['amount_min']) && is_numeric($options['amount_min'])) {
            $sanitized['amount_min'] = (float) $options['amount_min'];
        }
        
        if (isset($options['amount_max']) && is_numeric($options['amount_max'])) {
            $sanitized['amount_max'] = (float) $options['amount_max'];
        }
        
        $idFields = ['category_id', 'account_id', 'client_id', 'payment_method_id'];
        foreach ($idFields as $field) {
            if (isset($options[$field])) {
                if (is_array($options[$field])) {
                    $sanitized[$field] = array_filter($options[$field], function($id) {
                        return is_numeric($id) || $this->isValidUuid($id);
                    });
                } elseif (is_numeric($options[$field]) || $this->isValidUuid($options[$field])) {
                    $sanitized[$field] = $options[$field];
                }
            }
        }
        
    
        $booleanFields = ['is_scheduled'];
       
        foreach ($booleanFields as $field) {
            if (isset($options[$field])) {
                
                $sanitized[$field] = $options[$field] === 'true' ? 1 : 0;
                
            }
        }
        
     
        if (isset($options['confirmed'])) {
            if ($options['confirmed'] === null || $options['confirmed'] === 'null') {
                $sanitized['confirmed'] = null;
            } else {
                $sanitized['confirmed'] = filter_var($options['confirmed'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            }
        }
        
        if (isset($options['recurrence'])) {
            $validRecurrence = ['none', 'daily', 'weekly', 'monthly', 'yearly'];
            if (is_array($options['recurrence'])) {
                $sanitized['recurrence'] = array_intersect($options['recurrence'], $validRecurrence);
            } elseif (in_array($options['recurrence'], $validRecurrence)) {
                $sanitized['recurrence'] = $options['recurrence'];
            }
        }
        
        if (isset($options['search'])) {
            $sanitized['search'] = trim(strip_tags($options['search']));
        }
        
        $allowedOrderBy = ['date', 'amount', 'title', 'created_at', 'type'];
        if (isset($options['order_by']) && in_array($options['order_by'], $allowedOrderBy)) {
            $sanitized['order_by'] = $options['order_by'];
        }
        
        if (isset($options['order_direction']) && in_array(strtoupper($options['order_direction']), ['ASC', 'DESC'])) {
            $sanitized['order_direction'] = strtoupper($options['order_direction']);
        }
        
        return $sanitized;
    }
    
    private function getPeriodDateFilters($period) {
        $now = new DateTime();
        
        switch ($period) {
            case 'today':
                return [
                    'date_from' => $now->format('Y-m-d'),
                    'date_to' => $now->format('Y-m-d')
                ];
                
            case 'yesterday':
                $yesterday = $now->modify('-1 day');
                return [
                    'date_from' => $yesterday->format('Y-m-d'),
                    'date_to' => $yesterday->format('Y-m-d')
                ];
                
            case 'this_week':
                $startOfWeek = clone $now;
                $startOfWeek->modify('monday this week');
                return [
                    'date_from' => $startOfWeek->format('Y-m-d'),
                    'date_to' => $now->format('Y-m-d')
                ];
                
            case 'this_month':
                return [
                    'date_from' => $now->format('Y-m-01'),
                    'date_to' => $now->format('Y-m-t')
                ];
                
            case 'last_month':
                $lastMonth = $now->modify('-1 month');
                return [
                    'date_from' => $lastMonth->format('Y-m-01'),
                    'date_to' => $lastMonth->format('Y-m-t')
                ];
                
            case 'this_year':
                return [
                    'date_from' => $now->format('Y-01-01'),
                    'date_to' => $now->format('Y-12-31')
                ];
                
            default:
                return [];
        }
    }
    

    private function generateAnalytics($transactions) {
        if (empty($transactions)) {
            return [];
        }
        
        $analytics = [
            'total_transactions' => count($transactions),
            'average_amount' => 0,
            'most_used_category' => null,
            'most_used_account' => null,
            'transactions_by_type' => ['income' => 0, 'expense' => 0],
            'monthly_trend' => []
        ];
        
    
        $totalAmount = 0;
        $categories = [];
        $accounts = [];
        $monthlyData = [];
        
        foreach ($transactions as $transaction) {
            $totalAmount += $transaction['amount'];
            $analytics['transactions_by_type'][$transaction['type']]++;
            
            if ($transaction['category_name']) {
                $categories[$transaction['category_name']] = ($categories[$transaction['category_name']] ?? 0) + 1;
            }
            
            
            if ($transaction['account_name']) {
                $accounts[$transaction['account_name']] = ($accounts[$transaction['account_name']] ?? 0) + 1;
            }
            
            
            $month = date('Y-m', strtotime($transaction['date']));
            if (!isset($monthlyData[$month])) {
                $monthlyData[$month] = ['income' => 0, 'expense' => 0];
            }
            $monthlyData[$month][$transaction['type']] += $transaction['amount'];
        }
        
        $analytics['average_amount'] = $totalAmount / count($transactions);
        $analytics['most_used_category'] = $categories ? array_keys($categories, max($categories))[0] : null;
        $analytics['most_used_account'] = $accounts ? array_keys($accounts, max($accounts))[0] : null;
        $analytics['monthly_trend'] = $monthlyData;
        
        return $analytics;
    }

    public function getGraphData($accountId) {
        return [
            'dailySummary' => $this->transactionRepository->getDailySummary($accountId),
            'monthlySummary' => $this->transactionRepository->getMonthlySummary($accountId),
            'categoryDistribution' => [
                'income' => $this->transactionRepository->getCategoryDistribution($accountId, 'income'),
                'expense' => $this->transactionRepository->getCategoryDistribution($accountId, 'expense')
            ],
            'globalSummary' => $this->transactionRepository->getGlobalSummary($accountId)
        ];
    }

    private function isValidDate($date) {
        return (bool) strtotime($date);
    }
    
    private function isValidUuid($uuid) {
        return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $uuid);
    }

    
    public function simulatePendingImpact($accountId) {
        $transactions = $this->transactionRepository->getScheduledPendingTransactions($accountId);
        
        $impact = [
            'total_income' => 0,
            'total_expense' => 0,
            'net' => 0
        ];
    
        foreach ($transactions as $tx) {
            if ($tx['type'] === 'income') {
                $impact['total_income'] += $tx['amount'];
                $impact['net'] += $tx['amount'];
            } else {
                $impact['total_expense'] += $tx['amount'];
                $impact['net'] -= $tx['amount'];
            }
        }
    
        return $impact;
    }
    
    public function confirmScheduledTransaction($transactionId, $accountId) {
        $transaction = $this->transactionRepository->findById($transactionId);
    
        if (!$transaction || $transaction['account_id'] !== $accountId) {
            throw new Exception("Transaction not found or unauthorized");
        }
    

        $this->transactionRepository->confirmTransaction($transactionId);
    
        
        $this->transactionRepository->updateAccountBalance(
            $transaction['account_id'], 
            $transaction['amount'], 
            $transaction['type']
        );
        $this->transactionRepository->updateHistory(
            $transaction['date'], 
            $transaction['amount'], 
            $transaction['type'],
            $transaction['account_id']
        );
    }
    
}