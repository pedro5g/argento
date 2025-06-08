<?php

class PaymentMethodServices {

    
    private $paymentMethodRepository;

    public function __construct(PaymentMethodRepository $paymentMethodRepo){
        $this->paymentMethodRepository = $paymentMethodRepo;
    }


    public function createPaymentMethod($data){
        $this->paymentMethodRepository->registerPaymentMethod([
            "name" => $data['name'],
            "emoji" => $data['emoji'],
            "userId" => $data['userId']
        ]);
        return;
    }

    public function updatePaymentMethod($data) {
        if(!$this->paymentMethodRepository->findById($data['paymentMethodId'])){
            throw new Exception("Payment Method not found");
        }
        $this->paymentMethodRepository->updatePaymentMethod($data['paymentMethodId'], [
            "name" => $data['name'],
            "emoji" => $data['emoji'],
        ]);
    }

    public function deletePaymentMethod($data) {
        if(!$this->paymentMethodRepository->findById($data['paymentMethodId'])){
            throw new Exception("Payment Method not found");
        }
        $result = $this->paymentMethodRepository->deletePaymentMethod($data['paymentMethodId']);
        
        if(isset($result['error'])) {
            throw new Exception($result['error']);
        }
    }


    public function listPaymentMethod($data) {
        return $this->paymentMethodRepository->getAllPaymentMethods($data['userId']);
    }


}

