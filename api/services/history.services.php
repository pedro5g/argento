<?php

class historyServices {

    
    private $historyRepository;

    public function __construct(HistoryRepository $historyRepo){
        $this->historyRepository = $historyRepo;
    }

    public function getHistoryForPDF($userId, $accountId = null) {
        try {
            $data = $this->historyRepository->getHistoryForPDF($userId, $accountId);
            
            if (empty($data['data'])) {
                throw new Exception("No history data found for the specified period");
            }
            
            return $data;
        } catch (Exception $e) {
            throw new Exception("Error retrieving history for PDF: " . $e->getMessage());
        }

    }

    public function getHistoryForChart($userId, $accountId = null, $startDate = null, $endDate = null) {
        try {
            if ($startDate && !$this->isValidDate($startDate)) {
                throw new Exception("Invalid start date format. Use YYYY-MM-DD");
            }
            
            if ($endDate && !$this->isValidDate($endDate)) {
                throw new Exception("Invalid end date format. Use YYYY-MM-DD");
            }
            
            if ($startDate && $endDate && $startDate > $endDate) {
                throw new Exception("Start date cannot be later than end date");
            }
            
            $data = $this->historyRepository->getHistoryForChart($userId, $accountId, $startDate, $endDate);
            
            return $data;
        } catch (Exception $e) {
            throw new Exception("Error retrieving history for chart: " . $e->getMessage());
        }
    }
    
    public function getHistorySummary($userId, $accountId = null) {
        try {
            $currentMonth = $this->historyRepository->getHistoryForChart($userId, $accountId);
            $lastMonth = $this->historyRepository->getHistoryForChart(
                $userId, 
                $accountId, 
                date('Y-m-01', strtotime('-1 month')), 
                date('Y-m-t', strtotime('-1 month'))
            );
            
            $summary = [
                'current_month' => [
                    'total_income' => $currentMonth['summary']['total_income'],
                    'total_expense' => $currentMonth['summary']['total_expense'],
                    'net_balance' => $currentMonth['summary']['net_balance'],
                    'period' => $currentMonth['summary']['period']
                ],
                'last_month' => [
                    'total_income' => $lastMonth['summary']['total_income'],
                    'total_expense' => $lastMonth['summary']['total_expense'],
                    'net_balance' => $lastMonth['summary']['net_balance'],
                    'period' => $lastMonth['summary']['period']
                ],
                'comparison' => [
                    'income_change' => $this->calculatePercentageChange(
                        $lastMonth['summary']['total_income'], 
                        $currentMonth['summary']['total_income']
                    ),
                    'expense_change' => $this->calculatePercentageChange(
                        $lastMonth['summary']['total_expense'], 
                        $currentMonth['summary']['total_expense']
                    ),
                    'balance_change' => $this->calculatePercentageChange(
                        $lastMonth['summary']['net_balance'], 
                        $currentMonth['summary']['net_balance']
                    )
                ]
            ];
            
            return $summary;
        } catch (Exception $e) {
            throw new Exception("Error retrieving history summary: " . $e->getMessage());
        }
    }
    public function getDashboardData($userId, $accountId = null) {
        try {
            $data = [
                'current_month' => $this->historyRepository->getHistoryForChart($userId, $accountId),
                'last_3_months' => $this->historyRepository->getHistoryForChart(
                    $userId, 
                    $accountId, 
                    date('Y-m-01', strtotime('-3 months')), 
                    date('Y-m-t')
                ),
                'current_year' => $this->historyRepository->getHistoryForChart(
                    $userId, 
                    $accountId, 
                    date('Y-01-01'), 
                    date('Y-12-31')
                )
            ];
            
            return $data;
        } catch (Exception $e) {
            throw new Exception("Error retrieving dashboard data: " . $e->getMessage());
        }
    }
    private function isValidDate($date) {
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }
    
    private function calculatePercentageChange($oldValue, $newValue) {
        if ($oldValue == 0) {
            return $newValue > 0 ? 100 : 0;
        }
        
        return round((($newValue - $oldValue) / abs($oldValue)) * 100, 2);
    }

}

