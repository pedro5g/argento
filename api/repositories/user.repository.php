<?php 

class UserRepository {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo =$pdo;
    }

    public function findByEmail($email){
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT id, name, email FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateCurrentAccount($userId, $accountId) {
        $stmt = $this->pdo->prepare("UPDATE users SET current_account_id = ? WHERE id = ?");
        $stmt->execute([$accountId, $userId]);
    }

    public function listAllUsers() {
        $stmt = $this->pdo->prepare("SELECT id, name, email FROM users");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getUserWithCurrentAccountById($id) {
        $stmt = $this->pdo->prepare("
            SELECT 
                u.id as user_id, u.name as user_name, u.email, u.current_account_id,
                a.id as account_id, a.name as account_name, a.balance, a.type
            FROM users u
            LEFT JOIN accounts a ON u.current_account_id = a.id
            WHERE u.id = ?
            LIMIT 1
            ");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) return null;

        return [
            'user' => [
                'id' => $row['user_id'],
                'name' => $row['user_name'],
                'email' => $row['email'],
                'currentAccountId' => $row['current_account_id'],
            ],
            'account' => [
                'id' => $row['account_id'],
                'name' => $row['account_name'],
                'balance' => $row['balance'],
                'type' => $row['type'],
            ]
        ];
    }


}


