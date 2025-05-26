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


}


