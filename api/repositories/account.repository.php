<?php 
require_once './lib/uuidv4.php';
class AccountRepository {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo =$pdo;
    }

    public function registerAccount($data) {
        $stmt = $this->pdo->prepare("INSERT INTO accounts (id, user_id, name, balance, type) VALUES (?, ?, ?, ?, ?)");    
        $accountId = guidv4(); 
        $stmt->execute([$accountId, $data['userId'], $data['name'], $data['balance'], $data['type']]);
    }

    public function findAccountWithUserIdAndName($data) {
        $stmt = $this->pdo->prepare("SELECT * FROM accounts WHERE user_id = ? AND name = ?");
        $stmt->execute([$data['userId'], $data['name']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM accounts WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function listUserAccounts($userId) {
        $stmt = $this->pdo->prepare("SELECT * FROM accounts WHERE user_id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateBalance($accountId, $balance) {
        $stmt = $this->pdo->prepare("UPDATE accounts SET balance = ? WHERE id = ?");
        $stmt->execute([$balance, $accountId]);
    }

    public function getAccountFinancialSummary($accountId) {
        $query = "
            SELECT 
                a.id as account_id,
                a.name as account_name,
                a.type as account_type,
                a.balance as current_balance,
                
                COALESCE(SUM(CASE WHEN t.type = 'income' AND t.confirmed = 1 THEN t.amount END), 0) as confirmed_income,
                COALESCE(SUM(CASE WHEN t.type = 'expense' AND t.confirmed = 1 THEN t.amount END), 0) as confirmed_expenses,
                COALESCE(SUM(CASE WHEN t.type = 'income' AND (t.confirmed = 0 OR t.confirmed IS NULL) THEN t.amount END), 0) as pending_income,
                COALESCE(SUM(CASE WHEN t.type = 'expense' AND (t.confirmed = 0 OR t.confirmed IS NULL) THEN t.amount END), 0) as pending_expenses,
                COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount END), 0) as total_income,
                COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount END), 0) as total_expenses,
                COUNT(CASE WHEN t.type = 'income' AND t.confirmed = 1 THEN 1 END) as confirmed_income_count,
                COUNT(CASE WHEN t.type = 'expense' AND t.confirmed = 1 THEN 1 END) as confirmed_expenses_count,
                COUNT(CASE WHEN t.type = 'income' AND (t.confirmed = 0 OR t.confirmed IS NULL) THEN 1 END) as pending_income_count,
                COUNT(CASE WHEN t.type = 'expense' AND (t.confirmed = 0 OR t.confirmed IS NULL) THEN 1 END) as pending_expenses_count,
                (COALESCE(SUM(CASE WHEN t.type = 'income' AND t.confirmed = 1 THEN t.amount END), 0) - 
                 COALESCE(SUM(CASE WHEN t.type = 'expense' AND t.confirmed = 1 THEN t.amount END), 0)) as confirmed_net_balance,
                (COALESCE(SUM(CASE WHEN t.type = 'income' AND (t.confirmed = 0 OR t.confirmed IS NULL) THEN t.amount END), 0) - 
                 COALESCE(SUM(CASE WHEN t.type = 'expense' AND (t.confirmed = 0 OR t.confirmed IS NULL) THEN t.amount END), 0)) as pending_net_balance,
                (COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount END), 0) - 
                 COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount END), 0)) as total_net_balance
                
            FROM accounts a
            LEFT JOIN transactions t ON a.id = t.account_id
            WHERE a.id = ?
            GROUP BY a.id, a.name, a.type, a.balance
        ";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([$accountId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            
            $result['projectedBalance'] = $result['current_balance'] + $result['pending_net_balance'];
            $result['totalTransactions'] = $result['confirmed_income_count'] + $result['confirmed_expenses_count'] + 
                                           $result['pending_income_count'] + $result['pending_expenses_count'];
            $result['totalConfirmedTransactions'] = $result['confirmed_income_count'] + $result['confirmed_expenses_count'];
            $result['totalPendingTransactions'] = $result['pending_income_count'] + $result['pending_expenses_count'];
        }
        
        return $result;
    }
    
    public function getAccountSummaryByPeriod($accountId, $startDate = null, $endDate = null) {
        $whereClause = "WHERE a.id = ?";
        $params = [$accountId];
        
        if ($startDate && $endDate) {
            $whereClause .= " AND t.date BETWEEN ? AND ?";
            $params[] = $startDate;
            $params[] = $endDate;
        }
        
        $query = "
            SELECT 
                a.id as account_id,
                a.name as account_name,
                a.type as account_type,
                a.balance as current_balance,
                COALESCE(SUM(CASE WHEN t.type = 'income' AND t.confirmed = 1 THEN t.amount END), 0) as period_confirmed_income,
                COALESCE(SUM(CASE WHEN t.type = 'expense' AND t.confirmed = 1 THEN t.amount END), 0) as period_confirmed_expenses,
                COALESCE(SUM(CASE WHEN t.type = 'income' AND (t.confirmed = 0 OR t.confirmed IS NULL) THEN t.amount END), 0) as period_pending_income,
                COALESCE(SUM(CASE WHEN t.type = 'expense' AND (t.confirmed = 0 OR t.confirmed IS NULL) THEN t.amount END), 0) as period_pending_expenses,
                COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount END), 0) as period_total_income,
                COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount END), 0) as period_total_expenses,
                COUNT(CASE WHEN t.type = 'income' THEN 1 END) as period_income_count,
                COUNT(CASE WHEN t.type = 'expense' THEN 1 END) as period_expense_count,
                COUNT(CASE WHEN t.confirmed = 1 THEN 1 END) as period_confirmed_count,
                COUNT(CASE WHEN t.confirmed = 0 OR t.confirmed IS NULL THEN 1 END) as period_pending_count
                
            FROM accounts a
            LEFT JOIN transactions t ON a.id = t.account_id
            $whereClause
            GROUP BY a.id, a.name, a.type, a.balance
        ";
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            $result['periodConfirmedNet'] = $result['period_confirmed_income'] - $result['period_confirmed_expenses'];
            $result['periodPendingNet'] = $result['period_pending_income'] - $result['period_pending_expenses'];
            $result['periodTotalNet'] = $result['period_total_income'] - $result['period_total_expenses'];
            $result['periodTotalTransactions'] = $result['period_income_count'] + $result['period_expense_count'];
        }
        
        return $result;
    }


}


