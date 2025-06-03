<?php

class ClientControllers {
    private $clientServices;

    public function __construct(clientServices $services){
        $this->clientServices = $services;
    }

    public function createClient($req, $res){
        try {
            
            $data = [
             "accountId" => $req->account['id'],
             "name" => $req->body['name'],
             "email" => $req->body['email'],
             "phone" =>  $req->body['phone']
            ];  

            $this->clientServices->registerClient($data);
            return $res->json(["Message" => "client created"]);
        } catch (Exception $e) {
            return $res->status(400)->json(["error" => $e->getMessage()]);
        } 
    }
    
    public function updateClient($req, $res){
        try {
            $data = [
              "clientId" => $req->params['clientId'],
              "name" => $req->body['name'],
              "email" => $req->body['email'],
              "phone" => $req->body['phone'],
            ]; 
            $this->clientServices->updateClient($data);
            return $res->json(["Message" => "client updated"]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        } 
    }


    public function deleteClient($req, $res) {
        try {

            $this->clientServices->deleteClient(["clientId" => $req->params['clientId']]);
            
            return $res->json(["Message" => "client deleted"]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        }
    }

    public function listAllClients($req, $res){
        try {
            $accountId = $req->account['id'];  
            $clients = $this->clientServices->listClients([
                "accountId" => $accountId,
            ]);
            return $res->json(["clients" => $clients]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        } 
    }

}