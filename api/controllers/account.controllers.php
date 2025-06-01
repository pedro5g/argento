<?php

class AccountControllers {
    private $accountServices;

    public function __construct(AccountServices $services){
        $this->accountServices = $services;
    }


    public function registerNewAccount ($req, $res){
        try {
            
            $data = [
             "userId" => $req->user['id'],
             "name" => $req->body['name'],
             "balance" => $req->body['balance'],
             "type" => $req->body['type']
            ];  

            $this->accountServices->registerAccount($data);
            return $res->json(["Message" => "New account created"]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        } 
    }
    
    public function updateAccountBalance ($req, $res){
        try {
            
            $accountId =  $req->account['id'];
            
            $accounts = $this->accountServices->updateBalance(["accountId" => $accountId, "balance" => $req->body['balance']]);
            
            return $res->json(["Message" => "Balance updated"]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        } 
    }

    public function listAllUserAccounts ($req, $res){
        try {
            $userId = $req->user['id'];  
            $accounts = $this->accountServices->listAllUserAccounts(["userId" => $userId]);
            return $res->json(["accounts" => $accounts]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        } 
    }

    public function getAccountFinancialSummary($req, $res) {
        try {
            $accountId = $req->account['id'];  
            $summary = $this->accountServices->getAccountFinancialSummary(["accountId" => $accountId]);
            return $res->json(["data" => $summary]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        }
    }


}