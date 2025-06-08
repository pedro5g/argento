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
            "emoji" => $data['emoji'],
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
            "type" => $data['type'],
            "emoji" => $data['emoji']
        ]);
    }

    public function deleteCategory($data) {
        if(!$this->categoryRepository->findById($data['categoryId'])){
            throw new Exception("Category not found");
        }
       $result = $this->categoryRepository->deleteCategory($data['categoryId']);

       if(isset($result['error'])) {
        throw new Exception($result['error']);
       }
    }


    public function listCategories($data) {
        return $this->categoryRepository->listCategories([
            "accountId" =>  $data['accountId'],
            "type" => $data['type']
        ]);
    }


}

