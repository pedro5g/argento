<?php 


class PaymentMethodRepository {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo =$pdo;
    }

    public function registerPaymentMethod($data) {
        $stmt = $this->pdo->prepare("INSERT INTO payment_methods (name, emoji, user_id) VALUES (?, ?, ?)");         
        $stmt->execute([$data['name'], $data['emoji'], $data['userId']]);
    }

    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM payment_methods WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function updatePaymentMethod($paymentMethodId, $data) {
        $stmt = $this->pdo->prepare("UPDATE payment_methods SET name = ? WHERE id = ?");
        $stmt->execute([$data['name'], $paymentMethodId]);
    }

    public function deletePaymentMethod($paymentMethodId) {
        $stmt = $this->pdo->prepare("DELETE FROM payment_methods WHERE id = ?");
        $stmt->execute([$paymentMethodId]);
    }

    public function getAllPaymentMethods($userId) {
        $stmt = $this->pdo->prepare("SELECT id, name, emoji FROM payment_methods WHERE user_id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}


