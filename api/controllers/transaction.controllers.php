<?php

class TransactionControllers {
    private $transactionServices;

    public function __construct(TransactionServices $services){
        $this->transactionServices = $services;
    }

    public function createTransaction($req, $res) {
        try {
            $data = $req->body;
            $data['user_id'] = $req->user['id'];
            $data['account_id'] = $req->account['id'];
            $this->transactionServices->createTransaction($data);
            return $res->json(["message" => "Transaction created"]);
        } catch (Exception $e) {
            return $res->status(400)->json(["error" => $e->getMessage()]);
        }
    }

    public function updateTransaction($req, $res) {
        try {
            $data = $req->body;
            $data['id'] = $req->params['transactionId'];
            $this->transactionServices->updateTransaction($data);
            return $res->json(["message" => "Transaction updated"]);
        } catch (Exception $e) {
            return $res->status(400)->json(["error" => $e->getMessage()]);
        }
    }

    public function deleteTransaction($req, $res) {
        try {
            $data = [
                'id' => $req->params['transactionId'],
            ];
            $this->transactionServices->deleteTransaction($data);
            return $res->json(["message" => "Transaction deleted"]);
        } catch (Exception $e) {
            return $res->status(400)->json(["error" => $e->getMessage()]);
        }
    }

    public function getTransactionById($req, $res) {
        try {
            $transaction = $this->transactionServices->getTransactionById($req->params['transactionId']);
            return $res->json(["transaction" => $transaction]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        }
    }

    public function listAllTransactions($req, $res) {
        try {
            $userId = $req->user['id'];
           
            $transactions = $this->transactionServices->listUserTransactions($userId);
            return $res->json(["transactions" => $transactions]);
        } catch (Exception $e) {
            return $res->status(400)->json(["error" => $e->getMessage()]);
        }
    }

    public function listPaginatedTransactions($req, $res) {
        try {
            $userId = $req->user['id'];
            
            $options = [
                'account_id' => $req->account['id'],
                'limit' => $req->query['limit'] ?? 10,
                'offset' => $req->query['offset'] ?? 0,
                'type' => $req->query['type'] ?? null,
                'is_scheduled' => isset($req->query['is_scheduled']) ? $req->query['is_scheduled'] : null,
                'confirmed' => isset($req->query['confirmed']) ? $req->query['confirmed'] : null,
                'recurrence' => $req->query['recurrence'] ?? null,
                'date_from' => $req->query['date_from'] ?? null,
                'date_to' => $req->query['date_to'] ?? null,
                'amount_min' => $req->query['amount_min'] ?? null,
                'amount_max' => $req->query['amount_max'] ?? null,
                'category_id' => $req->query['category_id'] ?? null,
                'client_id' => $req->query['client_id'] ?? null,
                'payment_method_id' => $req->query['payment_method_id'] ?? null,
                'search' => $req->query['search'] ?? null,
                'order_by' => $req->query['order_by'] ?? null,
                'order_direction' => $req->query['order_direction'] ?? null,
            ];
            
           
            $options = array_filter($options, function($value) {
                return $value !== null && $value !== '';
            });
            
            $result = $this->transactionServices->listPaginatedTransactions($userId, $options);
            
            return $res->json($result);
            
        } catch (Exception $e) {
            return $res->status(400)->json(["error" => $e->getMessage()]);
        }
    }

    public function getTransactionsByPeriod($req, $res) {
        try {
            $userId = $req->user['id'];
            $period = $req->params['period'] ?? 'this_month';
            
            
            $options = array_filter([
                'limit' => $req->query['limit'] ?? null,
                'offset' => $req->query['offset'] ?? null,
                'type' => $req->query['type'] ?? null,
                'order_by' => $req->query['order_by'] ?? null,
                'order_direction' => $req->query['order_direction'] ?? null,
            ], function($value) {
                return $value !== null && $value !== '';
            });
            
            $result = $this->transactionServices->getTransactionsByPeriod($userId, $period, $options);
            
            return $res->json($result);
            
        } catch (Exception $e) {
            return $res->status(400)->json(["error" => $e->getMessage()]);
        }
    }
    
    public function searchTransactions($req, $res) {
        try {
            $userId = $req->user['id'];
            $searchTerm = $req->query['search'] ?? '';
            
            if (empty(trim($searchTerm))) {
                return $res->status(400)->json(["error" => "Search term is required"]);
            }
            
            $options = array_filter([
                'limit' => $req->query['limit'] ?? null,
                'offset' => $req->query['offset'] ?? null,
                'type' => $req->query['type'] ?? null,
                'category_id' => $req->query['category_id'] ?? null,
                'date_from' => $req->query['date_from'] ?? null,
                'date_to' => $req->query['date_to'] ?? null,
            ], function($value) {
                return $value !== null && $value !== '';
            });
            
            $result = $this->transactionServices->searchTransactions($userId, $searchTerm, $options);
            
            return $res->json($result);
            
        } catch (Exception $e) {
            return $res->status(400)->json(["error" => $e->getMessage()]);
        }
    }
    
    public function getRecentTransactions($req, $res) {
        try {
            $userId = $req->user['id'];
            $limit = $req->query['limit'] ?? 5;
            
            $transactions = $this->transactionServices->getRecentTransactions($userId, $limit);
            
            return $res->json(["transactions" => $transactions]);
            
        } catch (Exception $e) {
            return $res->status(400)->json(["error" => $e->getMessage()]);
        }
    }



    public function getGraphData($req, $res) {
        try {
            $userId = $req->user['id'];
            $graphData = $this->transactionServices->getGraphData($userId);
            return $res->json(["graphData" => $graphData]);
        } catch (Exception $e) {
            return $res->status(500)->json(["error" => $e->getMessage()]);
        }
    }

    public function listPendingTransactions($req, $res) {
        try {
            $accountId = $req->account['id'];
            $transactions = $this->transactionServices->getPendingTransactions($accountId);
            return $res->json(['pendingTransactions' => $transactions]);
        } catch (Exception $e) {
            return $res->status(500)->json(['error' => $e->getMessage()]);
        }
    }

    public function simulatePendingImpact($req, $res) {
        try {
            $accountId = $req->account['id'];
            $impact = $this->transactionServices->simulatePendingImpact($accountId);
            return $res->json(['simulation' => $impact]);
        } catch (Exception $e) {
            return $res->status(500)->json(['error' => $e->getMessage()]);
        }
    }

    public function confirmScheduledTransaction($req, $res) {
        try {
            $accountId = $req->account['id'];
            $transactionId = $req->params['transactionId'];
            $this->transactionServices->confirmScheduledTransaction($transactionId, $accountId);
            return $res->json(['message' => 'Transaction confirmed']);
        } catch (Exception $e) {
            return $res->status(400)->json(['error' => $e->getMessage()]);
        }
    }
}
