<?php
class TransactionRepository {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function createTransaction($data) {
        try {
            $this->pdo->beginTransaction();

            $stmt = $this->pdo->prepare("INSERT INTO transactions (
                id, 
                title,
                description,
                amount, 
                type, 
                date, 
                is_scheduled, 
                scheduled_date, 
                confirmed, 
                recurrence, 
                account_id, 
                category_id, 
                client_id, 
                payment_method_id, 
                user_id
            ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->execute([
                $data['title'],
                $data['description'] ?? null,
                $data['amount'],
                $data['type'],
                $data['date'],
                $data['is_scheduled'] ?? false,
                $data['scheduled_date'] ?? null,
                $data['confirmed'] ?? null,
                $data['recurrence'] ?? 'none',
                $data['account_id'],
                $data['category_id'],
                $data['client_id'] ?? null,
                $data['payment_method_id'] ?? null,
                $data['user_id']
            ]);

            $this->updateAccountBalance($data['account_id'], $data['amount'], $data['type']);
            $this->updateHistory($data['date'], $data['amount'], $data['type']);

            $this->pdo->commit();
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    private function updateAccountBalance($accountId, $amount, $type) {
        if ($type === 'income') {
            $stmt = $this->pdo->prepare("UPDATE accounts SET balance = balance + ? WHERE id = ?");
        } else {
            $stmt = $this->pdo->prepare("UPDATE accounts SET balance = balance - ? WHERE id = ?");
        }
        $stmt->execute([$amount, $accountId]);
    }
    

    private function updateHistory($date, $amount, $type) {
        $stmt = $this->pdo->prepare("SELECT id FROM history WHERE day = ?");
        $stmt->execute([$date]);
        $history = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($history) {
            if ($type === 'income') {
                $stmt = $this->pdo->prepare("UPDATE history SET total_income = total_income + ? WHERE day = ?");
            } else {
                $stmt = $this->pdo->prepare("UPDATE history SET total_expense = total_expense + ? WHERE day = ?");
            }
            $stmt->execute([$amount, $date]);
        } else {
            if ($type === 'income') {
                $stmt = $this->pdo->prepare("INSERT INTO history (day, total_income) VALUES (?, ?)");
            } else {
                $stmt = $this->pdo->prepare("INSERT INTO history (day, total_expense) VALUES (?, ?)");
            }
            $stmt->execute([$date, $amount]);
        }
    }

    public function update($id, $data) {
        try {
            $this->pdo->beginTransaction();

            $stmt = $this->pdo->prepare("
                UPDATE transactions SET title = ?, description = ?, amount = ?, type = ?, date = ?,
                    is_scheduled = ?, scheduled_date = ?, confirmed = ?, recurrence = ?, category_id = ?,
                    client_id = ?, payment_method_id = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $data['title'],
                $data['description'] ?? null,
                $data['amount'],
                $data['type'],
                $data['date'],
                $data['is_scheduled'] ?? false,
                $data['scheduled_date'] ?? null,
                $data['confirmed'] ?? null,
                $data['recurrence'] ?? 'none',
                $data['category_id'],
                $data['client_id'] ?? null,
                $data['payment_method_id'] ?? null,
                $id
            ]);

            $this->updateHistory($data['date'], $data['amount'], $data['type']);
            $this->updateAccountBalance($data['account_id'], $data['amount'], $data['type']);


            $this->pdo->commit();
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function delete($id, $userId) {
       try {
           $this->pdo->beginTransaction();
           $transaction = $this->findById($id);
           $stmt = $this->pdo->prepare("DELETE FROM transactions WHERE id = ?");
           $stmt->execute([$id]);
        
           $this->updateAccountBalance($transaction['account_id'], $transaction['amount'], $transaction['type'] === 'income' ? 'expense' : 'income');
       } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
       }
    }

    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM transactions WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function listByUser($userId) {
        $stmt = $this->pdo->prepare("SELECT * FROM transactions WHERE user_id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listTransactionsPaginated($userId, $limit = 10, $offset = 0) {
        $stmt = $this->pdo->prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT ? OFFSET ?");
        $stmt->bindValue(1, $userId);
        $stmt->bindValue(2, (int) $limit, PDO::PARAM_INT);
        $stmt->bindValue(3, (int) $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getDailySummary($userId) {
        $stmt = $this->pdo->prepare("
            SELECT 
                date,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
            FROM transactions
            WHERE user_id = ?
            GROUP BY date
            ORDER BY date ASC
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

   
    public function getMonthlySummary($userId) {
        $stmt = $this->pdo->prepare("
            SELECT 
                YEAR(date) AS year,
                MONTH(date) AS month,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
            FROM transactions
            WHERE user_id = ?
            GROUP BY year, month
            ORDER BY year, month
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCategoryDistribution($userId, $type = 'expense') {
        $stmt = $this->pdo->prepare("
            SELECT 
                c.name AS category,
                SUM(t.amount) AS total
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ? AND t.type = ?
            GROUP BY t.category_id
        ");
        $stmt->execute([$userId, $type]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

   
    public function getGlobalSummary($userId) {
        $stmt = $this->pdo->prepare("
            SELECT
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
                SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance
            FROM transactions
            WHERE user_id = ?
        ");
        $stmt->execute([$userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getScheduledPendingTransactions($accountId) {
        $stmt = $this->pdo->prepare("
            SELECT * FROM transactions
            WHERE account_id = ? AND is_scheduled = 1 AND confirmed IS NULL
        ");
        $stmt->execute([$accountId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function confirmTransaction($transactionId) {
        $stmt = $this->pdo->prepare("
            UPDATE transactions
            SET confirmed = 1
            WHERE id = ?
        ");
        $stmt->execute([$transactionId]);
    }
    
}

