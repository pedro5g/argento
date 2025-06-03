<?php

class ClientServices {

    
    private $clientRepository;

    public function __construct(ClientRepository $clientRepo){
        $this->clientRepository = $clientRepo;
    }


    public function registerClient($data){
        $this->clientRepository->registerClient([
            "name" => $data['name'],
            "email" => $data['email'],
            "phone" => $data['phone'],
            "accountId" => $data['accountId']
        ]);
        return;
    }

    public function updateClient($data) {
        
        if(!$this->clientRepository->findById($data['clientId'])){
            throw new Exception("Client not found");
        }
        $this->clientRepository->updateClient([
            "name" => $data['name'],
            "email" => $data['email'],
            "phone" => $data['phone'],
            "clientId" => $data['clientId'],
        ]);
    }

    public function deleteClient($data) {
        if(!$this->clientRepository->findById($data['clientId'])){
            throw new Exception("Client not found");
        }
        $this->clientRepository->deleteClient($data['clientId']);
    }


    public function listClients($data) {
        return $this->clientRepository->listClients([
            "accountId" =>  $data['accountId']
        ]);
    }


}

