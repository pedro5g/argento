<?php 


class ClientRepository {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo =$pdo;
    }

    public function registerClient($data) {
        $stmt = $this->pdo->prepare("INSERT INTO clients (id, name, email, phone, account_id) VALUES (UUID(), ?, ?, ?, ?)");         
        $stmt->execute([$data['name'], $data['email'], $data['phone'], $data['accountId']]);
    }

    public function updateClient($data) {
        $stmt = $this->pdo->prepare("UPDATE clients SET name = ?, email = ?, phone = ? WHERE id = ?");
        $stmt->execute([$data['name'], $data['email'], $data['phone'], $data['clientId']]);
    }

    public function deleteClient($clientId) {
        $stmt = $this->pdo->prepare("DELETE FROM clients WHERE id = ?");
        $stmt->execute([$clientId]);
    }

    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM clients WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function listClients($data) {
        $stmt = $this->pdo->prepare("SELECT id, name, email, phone FROM clients WHERE account_id = ?");
        $stmt->execute([$data['accountId']]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}


