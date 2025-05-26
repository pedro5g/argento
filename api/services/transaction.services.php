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

        return $this->transactionRepository->delete($data['id'], $data['user_id']);
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

    public function listPaginatedTransactions($userId, $limit = 10, $offset = 0) {
        return $this->transactionRepository->listTransactionsPaginated($userId, $limit, $offset);
    }

    public function getGraphData($userId) {
        return [
            'dailySummary' => $this->transactionRepository->getDailySummary($userId),
            'monthlySummary' => $this->transactionRepository->getMonthlySummary($userId),
            'categoryDistribution' => [
                'income' => $this->transactionRepository->getCategoryDistribution($userId, 'income'),
                'expense' => $this->transactionRepository->getCategoryDistribution($userId, 'expense')
            ],
            'globalSummary' => $this->transactionRepository->getGlobalSummary($userId)
        ];
    }

    public function getPendingTransactions($accountId) {
        return $this->transactionRepository->getScheduledPendingTransactions($accountId);
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
    
        if (!$transaction['is_scheduled'] || $transaction['confirmed']) {
            throw new Exception("Transaction is not pending confirmation");
        }
    
        $now = date('Y-m-d');
        if ($now < $transaction['scheduled_date']) {
            throw new Exception("Scheduled date not reached");
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
            $transaction['type']
        );
    }
    
}