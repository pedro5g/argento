<?php

class UserControllers {
    private $userServices;

    public function __construct(UserServices $services){
        $this->userServices = $services;
    }

    public function profile($req, $res) {
        try {
            $usersAccount = $this->userServices->profile(["id" => $req->user['id']]);
            return $res->json(["userAccount" => $usersAccount]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        } 

    }

    public function updatedCurrentAccount($req, $res) {
        try {
            $accountId = $req->params['accountId'];
           
            $userId = $req->user['id'];
            $this->userServices->updatedCurrentAccount(['accountId' => $accountId, 'userId' => $userId]);
            return $res->json(["Message" => "account changed"]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        } 

    }
    
    public function getAllUsers($req, $res) {
        try {
            $users = $this->userServices->listAllUsers();
            return $res->json(["users" => $users]);
        } catch (Exception $e) {
            return $res->status(400)->json(["error" => $e->getMessage()]);
        } 
    }


}