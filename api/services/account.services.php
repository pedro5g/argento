<?php

class AccountServices {

    private $accountRepository;

    public function __construct(AccountRepository $accountRepo){
        $this->accountRepository = $accountRepo;
    }


    public function registerAccount($data){
        if($this->accountRepository->findAccountWithUserIdAndName([
            "userId" => $data['userId'],
            "name" => $data['name']
        ])){
            throw new Exception("You already has an account with this name");
        }
        
        $this->accountRepository->registerAccount([
            "userId" => $data['userId'],
            "name" => $data['name'],
            "balance" => (float)$data['balance'],
            "type" => $data['type']
        ]);
        return;
    }

    public function updateBalance($data) {
        if(!$this->accountRepository->findById($data['accountId'])){
            throw new Exception("Account not found");
        }
        $this->accountRepository->updateBalance($data['accountId'], $data['balance']);
    }

    public function listAllUserAccounts($data) {
        return $this->accountRepository->listUserAccounts($data['userId']);
    }

    public function getAccountFinancialSummary($data) {
        return $this->accountRepository->getAccountFinancialSummary($data['accountId']);
    }

}

