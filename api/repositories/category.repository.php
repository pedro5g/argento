<?php 


class CategoryRepository {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo =$pdo;
    }

    public function registerCategory($data) {
        $stmt = $this->pdo->prepare("INSERT INTO categories (name, type, account_id) VALUES (?, ?, ?)");         

        $stmt->execute([$data['name'], $data['type'], $data['accountId']]);
    }

    public function updateCategory($categoryId, $data) {
        $stmt = $this->pdo->prepare("UPDATE categories SET name = ?, type = ? WHERE id = ?");
        $stmt->execute([$data['name'], $data['type'], $categoryId]);
    }

    public function deleteCategory($categoryId) {
        $stmt = $this->pdo->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$categoryId]);
    }

    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function listCategories($accountId) {
        $stmt = $this->pdo->prepare("SELECT id, name, type FROM categories WHERE account_id = ?");
        $stmt->execute([$accountId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}


