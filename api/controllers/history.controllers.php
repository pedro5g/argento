<?php

class HistoryControllers {
    private $historyServices;

    public function __construct(HistoryServices $services) {
        $this->historyServices = $services;
    }


    public function getHistoryForPDF($req, $res) {
        try {
            $userId = $req->user['id'];
            $accountId = $req->account['id'];
            
            $data = $this->historyServices->getHistoryForPDF($userId, $accountId);
            
            return $res->json([
                "success" => true,
                "data" => $data
            ]);
        } catch (Exception $e) {
            return $res->status(400)->json([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    }

  
    public function getHistoryForChart($req, $res) {
        try {
            $userId = $req->user['id'];
            $accountId = $req->account['id'];
            $startDate = $req->query['start_date'] ?? null;
            $endDate = $req->query['end_date'] ?? null;
            
            $data = $this->historyServices->getHistoryForChart($userId, $accountId, $startDate, $endDate);
            
            return $res->json([
                "success" => true,
                "data" => $data
            ]);
        } catch (Exception $e) {
            return $res->status(400)->json([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    }


    public function getHistorySummary($req, $res) {
        try {
            $userId = $req->user['id'];
            $accountId = $req->account['id'];
            
            $data = $this->historyServices->getHistorySummary($userId, $accountId);
            
            return $res->json([
                "success" => true,
                "data" => $data
            ]);
        } catch (Exception $e) {
            return $res->status(400)->json([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    }

  
    public function getDashboardData($req, $res) {
        try {
            $userId = $req->user['id'];
            $accountId =  $req->account['id'];
            
            $data = $this->historyServices->getDashboardData($userId, $accountId);
            
            return $res->json([
                "success" => true,
                "data" => $data
            ]);
        } catch (Exception $e) {
            return $res->status(500)->json([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    }


    public function getChartByPeriod($req, $res) {
        try {
            $userId = $req->user['id'];
            $accountId = $req->account['id'];
            $period = $req->params['period'] ?? 'current_month';
            
            $dates = $this->getPeriodDates($period);
            
            $data = $this->historyServices->getHistoryForChart(
                $userId, 
                $accountId, 
                $dates['start'], 
                $dates['end']
            );
            
            return $res->json([
                "success" => true,
                "period" => $period,
                "data" => $data
            ]);
        } catch (Exception $e) {
            return $res->status(400)->json([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    }

 
    public function exportPDF($req, $res) {
        try {
            $userId = $req->user['id'];
            $accountId = $req->query['account_id'] ?? $req->account['id'] ?? null;
            
            $data = $this->historyServices->getHistoryForPDF($userId, $accountId);
            
    
            $filename = 'financial_history_' . date('Y-m-d_H-i-s') . '.json';
            
            return $res->json([
                          "success" => true,
                          "data" => $data,
                          "export_info" => [
                              "generated_at" => date('Y-m-d H:i:s'),
                              "user_id" => $userId,
                              "account_id" => $accountId
                          ]
                      ]);
        } catch (Exception $e) {
            return $res->status(500)->json([
                "success" => false,
                "error" => $e->getMessage()
            ]);
        }
    }

    private function getPeriodDates($period) {
        switch ($period) {
            case 'today':
                return [
                    'start' => date('Y-m-d'),
                    'end' => date('Y-m-d')
                ];
            
            case 'yesterday':
                return [
                    'start' => date('Y-m-d', strtotime('-1 day')),
                    'end' => date('Y-m-d', strtotime('-1 day'))
                ];
            
            case 'last_7_days':
                return [
                    'start' => date('Y-m-d', strtotime('-7 days')),
                    'end' => date('Y-m-d')
                ];
            
            case 'last_30_days':
                return [
                    'start' => date('Y-m-d', strtotime('-30 days')),
                    'end' => date('Y-m-d')
                ];
            
            case 'current_month':
                return [
                    'start' => date('Y-m-01'),
                    'end' => date('Y-m-t')
                ];
            
            case 'last_month':
                return [
                    'start' => date('Y-m-01', strtotime('-1 month')),
                    'end' => date('Y-m-t', strtotime('-1 month'))
                ];
            
            case 'current_year':
                return [
                    'start' => date('Y-01-01'),
                    'end' => date('Y-12-31')
                ];
            
            case 'last_year':
                return [
                    'start' => date('Y-01-01', strtotime('-1 year')),
                    'end' => date('Y-12-31', strtotime('-1 year'))
                ];
            
            default:
                return [
                    'start' => date('Y-m-01'),
                    'end' => date('Y-m-t')
                ];
        }
    }
}