<?php
require_once  './lib/jwt.php';


class UserServices {

    private $userRepository;
    private $accountRepository;

    public function __construct(UserRepository $userRepo, AccountRepository $accountRepo){
        $this->userRepository = $userRepo;
        $this->accountRepository = $accountRepo;
    }

    public function profile($data) {
        $user_account = $this->userRepository->getUserWithCurrentAccountById($data['id']);
        if(!$user_account){
            throw new Exception("Invalid id user not fount");
        }
        return  $user_account;
    }

    public function updatedCurrentAccount($data) {
        if(!$this->accountRepository->findById($data['accountId'])) {
            throw new Exception("Account not found");
        }

        $this->userRepository->updateCurrentAccount($data['userId'], $data['accountId']);
    }

    public function listAllUsers() {
        return $this->userRepository->listAllUsers();
    }


}

