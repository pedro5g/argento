<?php
require_once  './lib/jwt.php';


use Firebase\JWT\JWT;
use Firebase\JWT\Key;


class AuthServices {

    private $authRepository;
    private $secret;

    public function __construct(AuthRepository $repo, $secret){
        $this->authRepository = $repo;
        $this->secret = $secret;
    }

    public function register($data) {
        if($this->authRepository->findByEmail($data['email'])){
            throw new Exception("Email already in use");
        }

        $hashPassword = password_hash($data['password'], PASSWORD_BCRYPT);

        $userId = $this->authRepository->registerUser([
            "name" => $data['name'],
            "email" => $data['email'],
            "password" => $hashPassword
        ]);


        return ["id" => $userId];
    }


    public function login($data) {
        $user_account = $this->authRepository->getUserWithCurrentAccountByEmail($data['email']);
        if(!$user_account || !password_verify($data['password'], $user_account['user']['password'])) {
     
            throw new Exception("Invalid credentials");
        }
        $payload = [
            "sub" => $user_account['user']['id'],
            "iat" => time(),
            "exp" => time() + 3600
        ];

        unset($user_account['user']['password']);
        $jwt = JWT::encode($payload, $this->secret, 'HS256');

        return [
            'token' => $jwt,
            'userAccount' => $user_account
        ];
    }



}

