<?php

class CategoryServices {

    
    private $categoryRepository;

    public function __construct(CategoryRepository $categoryRepo){
        $this->categoryRepository = $categoryRepo;
    }


    public function registerCategory($data){
        $this->categoryRepository->registerCategory([
            "name" => $data['name'],
            "type" => $data['type'],
            "accountId" => $data['accountId']
        ]);
        return;
    }

    public function updateCategory($data) {
        
        if(!$this->categoryRepository->findById($data['categoryId'])){
            throw new Exception("Category not found");
        }
        $this->categoryRepository->updateCategory($data['categoryId'], [
            "name" => $data['name'],
            "type" => $data['type']
        ]);
    }

    public function deleteCategory($data) {
        if(!$this->categoryRepository->findById($data['categoryId'])){
            throw new Exception("Category not found");
        }
        $this->categoryRepository->deleteCategory($data['categoryId']);
    }


    public function listCategories($data) {
        return $this->categoryRepository->listCategories($data['accountId']);
    }


}

