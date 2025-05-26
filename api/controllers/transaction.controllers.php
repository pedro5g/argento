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
                'user_id' => $req->user['id']
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
            $limit = $req->query['limit'] ?? 10;
            $offset = $req->query['offset'] ?? 0;

            $transactions = $this->transactionServices->listPaginatedTransactions($userId, $limit, $offset);
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
