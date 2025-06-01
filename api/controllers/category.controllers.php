<?php

class CategoryControllers {
    private $categoryServices;

    public function __construct(categoryServices $services){
        $this->categoryServices = $services;
    }

    public function createNewCategory ($req, $res){
        try {
            
            $data = [
             "accountId" => $req->account['id'],
             "name" => $req->body['name'],
             "type" => $req->body['type'],
             "emoji" =>  $req->body['emoji']
            ];  

            $this->categoryServices->registerCategory($data);
            return $res->json(["Message" => "Category created"]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        } 
    }
    
    public function updateCategory($req, $res){
        try {
            $data = [
              "categoryId" => $req->params['categoryId'],
              "name" => $req->body['name'],
              "type" => $req->body['type']
            ]; 
            $this->categoryServices->updateCategory($data);
            return $res->json(["Message" => "Category updated"]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        } 
    }


    public function deleteCategory($req, $res) {
        try {

            $this->categoryServices->deleteCategory(["categoryId" => $req->params['categoryId']]);
            
            return $res->json(["Message" => "Category deleted"]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        }
    }

    public function listAllCategories($req, $res){
        try {
            $accountId = $req->account['id'];  
            $categories = $this->categoryServices->listCategories(["accountId" => $accountId]);
            return $res->json(["categories" => $categories]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        } 
    }




}