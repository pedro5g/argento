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
            $this->updateHistory($data['date'], $data['amount'], $data['type'], $data['account_id']);

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
    

    private function updateHistory($date, $amount, $type, $accountId) {
        $stmt = $this->pdo->prepare("SELECT id FROM history WHERE day = ? AND account_id = ?");
        $stmt->execute([$date, $accountId]);
        $history = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($history) {
            if ($type === 'income') {
                $stmt = $this->pdo->prepare("UPDATE history SET total_income = total_income + ? WHERE day = ? AND account_id = ?");
            } else {
                $stmt = $this->pdo->prepare("UPDATE history SET total_expense = total_expense + ? WHERE day = ? AND account_id = ?");
            }
            $stmt->execute([$amount, $date, $accountId]);
        } else {
            if ($type === 'income') {
                $stmt = $this->pdo->prepare("INSERT INTO history (day, total_income, account_id) VALUES (?, ?, ?)");
            } else {
                $stmt = $this->pdo->prepare("INSERT INTO history (day, total_expense, account_id) VALUES (?, ?, ?)");
            }
            $stmt->execute([$date, $amount, $accountId]);
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

    public function delete($id) {
       try {
           $this->pdo->beginTransaction();
           $transaction = $this->findById($id);
           $stmt = $this->pdo->prepare("DELETE FROM transactions WHERE id = ?");
           $stmt->execute([$id]);

           $this->updateAccountBalance($transaction['account_id'], $transaction['amount'], $transaction['type'] === 'income' ? 'expense' : 'income');
           $this->pdo->commit();

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
    

    public function listTransactionsPaginated($userId, $options = []) {
        $limit = (int)($options['limit'] ?? 10);
        $offset = (int)($options['offset'] ?? 0);
        
        $limit = max(1, min(1000, $limit)); 
        $offset = max(0, $offset);
        
        $filters = [];
        $params = [$userId];
        
        $sql = "
            SELECT 
                t.*,
                a.name as account_name,
                c.name as category_name,
                c.emoji as category_emoji,
                cl.name as client_name,
                pm.name as payment_method_name,
                pm.emoji as payment_method_emoji
            FROM transactions t
            LEFT JOIN accounts a ON t.account_id = a.id
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN clients cl ON t.client_id = cl.id
            LEFT JOIN payment_methods pm ON t.payment_method_id = pm.id
            WHERE t.user_id = ?
        ";
        
        if (!empty($options['type'])) {
            $filters[] = "t.type = ?";
            $params[] = $options['type'];
        }
        
        if (!empty($options['category_id'])) {
            if (is_array($options['category_id'])) {
                $placeholders = str_repeat('?,', count($options['category_id']) - 1) . '?';
                $filters[] = "t.category_id IN ($placeholders)";
                $params = array_merge($params, $options['category_id']);
            } else {
                $filters[] = "t.category_id = ?";
                $params[] = $options['category_id'];
            }
        }
        
        if (!empty($options['account_id'])) {
            if (is_array($options['account_id'])) {
                $placeholders = str_repeat('?,', count($options['account_id']) - 1) . '?';
                $filters[] = "t.account_id IN ($placeholders)";
                $params = array_merge($params, $options['account_id']);
            } else {
                $filters[] = "t.account_id = ?";
                $params[] = $options['account_id'];
            }
        }
        
        if (!empty($options['client_id'])) {
            $filters[] = "t.client_id = ?";
            $params[] = $options['client_id'];
        }
        
        if (!empty($options['payment_method_id'])) {
            $filters[] = "t.payment_method_id = ?";
            $params[] = $options['payment_method_id'];
        }
        
        if (!empty($options['date_from'])) {
            $filters[] = "t.date >= ?";
            $params[] = $options['date_from'];
        }
        
        if (!empty($options['date_to'])) {
            $filters[] = "t.date <= ?";
            $params[] = $options['date_to'];
        }
        
        if (!empty($options['month']) && !empty($options['year'])) {
            $filters[] = "MONTH(t.date) = ? AND YEAR(t.date) = ?";
            $params[] = $options['month'];
            $params[] = $options['year'];
        }
        
        if (!empty($options['amount_min'])) {
            $filters[] = "t.amount >= ?";
            $params[] = $options['amount_min'];
        }
        
        if (!empty($options['amount_max'])) {
            $filters[] = "t.amount <= ?";
            $params[] = $options['amount_max'];
        }
        
        if (isset($options['confirmed'])) {
            if ($options['confirmed'] === 'pending') {
                $filters[] = "t.confirmed IS NULL";
            } else {
                $filters[] = "t.confirmed = ?";
                $params[] = $options['confirmed'] ? 1 : 0;
            }
        }
        
        if (isset($options['is_scheduled'])) {
            $filters[] = "t.is_scheduled = ?";
            $params[] = $options['is_scheduled'] ? 1 : 0;
        }
        
        if (!empty($options['recurrence'])) {
            if (is_array($options['recurrence'])) {
                $placeholders = str_repeat('?,', count($options['recurrence']) - 1) . '?';
                $filters[] = "t.recurrence IN ($placeholders)";
                $params = array_merge($params, $options['recurrence']);
            } else {
                $filters[] = "t.recurrence = ?";
                $params[] = $options['recurrence'];
            }
        }
        
        if (!empty($options['search'])) {
            $filters[] = "(t.title LIKE ? OR t.description LIKE ?)";
            $searchTerm = '%' . $options['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        if (!empty($filters)) {
            $sql .= " AND " . implode(" AND ", $filters);
        }
        
        $orderBy = $options['order_by'] ?? 'date';
        $orderDirection = strtoupper($options['order_direction'] ?? 'DESC');
        
        $allowedOrderBy = ['date', 'amount', 'title', 'created_at', 'type'];
        if (!in_array($orderBy, $allowedOrderBy)) {
            $orderBy = 'date';
        }
        
        if (!in_array($orderDirection, ['ASC', 'DESC'])) {
            $orderDirection = 'DESC';
        }
       
        $sql .= " ORDER BY t.$orderBy $orderDirection";
        $sql .= " LIMIT $limit OFFSET $offset";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
   

    public function getDailySummary($accountId) {
        $stmt = $this->pdo->prepare("
            SELECT 
                date,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
            FROM transactions
            WHERE account_id = ?
            GROUP BY date
            ORDER BY date ASC
        ");
        $stmt->execute([$accountId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

   
    public function getMonthlySummary($accountId) {
        $stmt = $this->pdo->prepare("
            SELECT 
                YEAR(date) AS year,
                MONTH(date) AS month,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
            FROM transactions
            WHERE account_id = ?
            GROUP BY year, month
            ORDER BY year, month
        ");
        $stmt->execute([$accountId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCategoryDistribution($accountId, $type = 'expense') {
        $stmt = $this->pdo->prepare("
            SELECT 
                c.name AS category,
                c.emoji AS category_emoji,
                SUM(t.amount) AS total
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.account_id = ? AND t.type = ?
            GROUP BY t.category_id
        ");
        $stmt->execute([$accountId, $type]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

   
    public function getGlobalSummary($accountId) {
        $stmt = $this->pdo->prepare("
            SELECT
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
                SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance
            FROM transactions
            WHERE account_id = ?
        ");
        $stmt->execute([$accountId]);
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
            WHERE id = ? AND confirmed = 0
        ");
        $stmt->execute([$transactionId]);
    }

    public function countTransactions($userId, $options = []) {
        $filters = [];
        $params = [$options['account_id']];
        
        $sql = "
            SELECT COUNT(*) as total
            FROM transactions t
            WHERE t.account_id = ?
        ";
        
        if (!empty($options['type'])) {
            $filters[] = "t.type = ?";
            $params[] = $options['type'];
        }
        
        if (!empty($options['category_id'])) {
            if (is_array($options['category_id'])) {
                $placeholders = str_repeat('?,', count($options['category_id']) - 1) . '?';
                $filters[] = "t.category_id IN ($placeholders)";
                $params = array_merge($params, $options['category_id']);
            } else {
                $filters[] = "t.category_id = ?";
                $params[] = $options['category_id'];
            }
        }
        
        
        if (!empty($filters)) {
            $sql .= " AND " . implode(" AND ", $filters);
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    }   


    public function getTransactionsSummary($userId, $options = []) {
        $filters = [];
        
        $sql = "
            SELECT 
                COUNT(*) as total_transactions,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense,
                SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance,
                COUNT(CASE WHEN confirmed = 1 THEN 1 END) as confirmed_count,
                COUNT(CASE WHEN confirmed IS NULL THEN 1 END) as pending_count,
                COUNT(CASE WHEN is_scheduled = 1 THEN 1 END) as scheduled_count
            FROM transactions t
            WHERE t.account_id = ?
        ";
        
        if (!empty($filters)) {
            $sql .= " AND " . implode(" AND ", $filters);
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$options['account_id']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    
}

