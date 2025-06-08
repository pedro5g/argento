<?php 


class CategoryRepository {

    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo =$pdo;
    }

    public function registerCategory($data) {
        $stmt = $this->pdo->prepare("INSERT INTO categories (name, type, emoji, account_id) VALUES (?, ?, ?, ?)");         

        $stmt->execute([$data['name'], $data['type'], $data['emoji'], $data['accountId']]);
    }

    public function updateCategory($categoryId, $data) {
        $stmt = $this->pdo->prepare("UPDATE categories SET name = ?, type = ?, emoji = ? WHERE id = ?");
        $stmt->execute([$data['name'], $data['type'], $data['emoji'], $categoryId]);
    }

    public function deleteCategory($categoryId) {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM transactions WHERE category_id = ?");
        $stmt->execute([$categoryId]);
        $count = $stmt->fetchColumn();

        if ($count > 0) {
            return ['error' => 'Category cannot be deleted because it is associated with transactions.'];
        }

        $stmt = $this->pdo->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$categoryId]);

        return ['success' => true];
    }

    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function listCategories($data) {
        $in  = str_repeat('?,', count($data['type']) - 1) . '?';
        $stmt = $this->pdo->prepare("SELECT id, name, type, emoji FROM categories WHERE account_id = ? AND type IN ($in)");
        $params = array_merge([$data['accountId']], $data['type']);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}


