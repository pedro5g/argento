<?php 
require_once './lib/uuidv4.php';
class AuthRepository {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo =$pdo;
    }


    public function findByEmail($email){
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getUserWithCurrentAccountByEmail($email) {
        $stmt = $this->pdo->prepare("
            SELECT 
                u.id as user_id, u.name as user_name, u.password, u.email, u.current_account_id,
                a.id as account_id, a.name as account_name, a.balance, a.type
            FROM users u
            LEFT JOIN accounts a ON u.current_account_id = a.id
            WHERE u.email = ?
            LIMIT 1
            ");
        $stmt->execute([$email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) return null;

        return [
            'user' => [
                'id' => $row['user_id'],
                'name' => $row['user_name'],
                'email' => $row['email'],
                'password' => $row['password'],
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

    public function registerUser($userData) {
        try {
            $this->pdo->beginTransaction();
    
            $userId = guidv4();

            $stmt = $this->pdo->prepare("INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)");
            $stmt->execute([$userId, $userData['name'], $userData['email'], $userData['password']]);

            $stmt = $this->pdo->prepare("INSERT INTO accounts (id, user_id, name, balance) VALUES (?, ?, ?, ?)");
            
            $accountId =guidv4(); 
            $stmt->execute([$accountId, $userId, 'Conta Padrão', 0]);

            $stmt = $this->pdo->prepare("UPDATE users SET current_account_id = ? WHERE id = ?");
            $stmt->execute([$accountId, $userId]);

            $this->pdo->commit();

            return $userId;

        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

}
