<?php

class PaymentMethodControllers {
    private $paymentMethodServices;

    public function __construct(paymentMethodServices $services){
        $this->paymentMethodServices = $services;
    }

    public function createPaymentMethod($req, $res){
        try {
            
            $data = [
             "userId" => $req->user['id'],
             "name" => $req->body['name'],
            ];  

            $this->paymentMethodServices->createPaymentMethod($data);
            return $res->json(["Message" => "Payment method created"]);
        } catch (Exception $e) {
            return $res->status(400)->json(["error" => $e->getMessage()]);
        } 
    }
    
    public function updatePaymentMethod($req, $res){
        try {
            $data = [
              "paymentMethodId" => $req->params['paymentId'],
              "name" => $req->body['name'],
            ]; 
            $this->paymentMethodServices->updatePaymentMethod($data);
            return $res->json(["Message" => "Payment method updated"]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        } 
    }

    public function deletePaymentMethod($req, $res) {
        try {

            $this->paymentMethodServices->deletePaymentMethod([
                "paymentMethodId" => $req->params['paymentId']
            ]);
            
            return $res->json(["Message" => "Payment method  deleted"]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        }
    }

    public function listPaymentMethods($req, $res){
        try {
            $userId = $req->user['id'];  
            $paymentMethods = $this->paymentMethodServices->listPaymentMethod([
                "userId" => $userId
            ]);
            return $res->json(["paymentMethods" => $paymentMethods]);
        } catch (Exception $e) {
            return $res->status(404)->json(["error" => $e->getMessage()]);
        } 
    }




}