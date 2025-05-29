<?php

class AuthControllers {
    private $authServices;

    public function __construct(AuthServices $services){
        $this->authServices = $services;
    }


    public function register($req, $res) {
        try {
            $this->authServices->register($req->body);
            return $res->json(["message" => "User created"]);
        } catch (Exception $e) {
            return $res->status(400)->json(["error" => $e->getMessage()]);
        } 
    }


    public function login($req, $res) {
        try {
            $token = $this->authServices->login($req->body);
            return $res->json(["token" => $token['token']]);
        } catch (Exception $e) {
            return $res->status(401)->json(["error" => $e->getMessage()]);
        }  
    }

}