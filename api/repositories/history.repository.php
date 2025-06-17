<?php
class HistoryRepository {
    private $pdo;
    
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    

    public function getHistoryForPDF($userId, $accountId) {
        $sql = "
        SELECT
            h.id,
            h.day,
            h.month,
            h.year,
            h.total_income,
            h.total_expense,
            h.net_balance,
            a.name AS account_name,
            a.type AS account_type,
            u.name AS user_name,
            u.email AS user_email
        FROM history h
        INNER JOIN accounts a ON h.account_id = a.id
        INNER JOIN users u ON a.user_id = u.id
        WHERE h.account_id = :account_id 
        AND a.user_id = :user_id
        ";
    
        $params = [
            'account_id' => $accountId,
            'user_id' => $userId
        ];
       
        $sql .= " ORDER BY h.year DESC, h.month DESC, h.day DESC";
       
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
       
       
        if (empty($results)) {
           
            $checkSql = "SELECT COUNT(*) as count FROM accounts WHERE id = :account_id AND user_id = :user_id";
            $checkStmt = $this->pdo->prepare($checkSql);
            $checkStmt->execute($params);
            $accountExists = $checkStmt->fetch(PDO::FETCH_ASSOC)['count'] > 0;
            
            if (!$accountExists) {
                throw new Exception("Conta não encontrada ou não pertence ao usuário.");
            }
        }
       
        $organized = [];
        $totals = [
            'total_income' => 0,
            'total_expense' => 0,
            'net_balance' => 0
        ];
       
        foreach ($results as $row) {
            $year = $row['year'];
            $month = $row['month'];
           
            if (!isset($organized[$year])) {
                $organized[$year] = [
                    'year' => $year,
                    'months' => [],
                    'year_totals' => [
                        'income' => 0,
                        'expense' => 0,
                        'balance' => 0
                    ]
                ];
            }
           
            if (!isset($organized[$year]['months'][$month])) {
               
                $monthNames = [
                    1 => 'January', 2 => 'February', 3 => 'March', 4 => 'April',
                    5 => 'May', 6 => 'June', 7 => 'July', 8 => 'August',
                    9 => 'September', 10 => 'October', 11 => 'November', 12 => 'December'
                ];
                
                $organized[$year]['months'][$month] = [
                    'month' => $month,
                    'month_name' => $monthNames[$month] ?? $month,
                    'days' => [],
                    'month_totals' => [
                        'income' => 0,
                        'expense' => 0,
                        'balance' => 0
                    ]
                ];
            }
           
            $organized[$year]['months'][$month]['days'][] = [
                'id' => $row['id'],
                'day' => $row['day'],
                'day_formatted' => date('d/m/Y', strtotime($row['day'])),
                'total_income' => (float) $row['total_income'],
                'total_expense' => (float) $row['total_expense'],
                'net_balance' => (float) $row['net_balance'],
                'account_name' => $row['account_name'],
                'account_type' => $row['account_type']
            ];
    
           
            $organized[$year]['months'][$month]['month_totals']['income'] += (float) $row['total_income'];
            $organized[$year]['months'][$month]['month_totals']['expense'] += (float) $row['total_expense'];
            $organized[$year]['months'][$month]['month_totals']['balance'] += (float) $row['net_balance'];
            
           
            $organized[$year]['year_totals']['income'] += (float) $row['total_income'];
            $organized[$year]['year_totals']['expense'] += (float) $row['total_expense'];
            $organized[$year]['year_totals']['balance'] += (float) $row['net_balance'];
    
           
            $totals['total_income'] += (float) $row['total_income'];
            $totals['total_expense'] += (float) $row['total_expense'];
            $totals['net_balance'] += (float) $row['net_balance'];
        }
       
        return [
            'user_info' => !empty($results) ? [
                'name' => $results[0]['user_name'],
                'email' => $results[0]['user_email']
            ] : null,
            'account_info' => !empty($results) ? [
                'name' => $results[0]['account_name'],
                'type' => $results[0]['account_type']
            ] : null,
            'period' => [
                'start' => !empty($results) ? end($results)['day'] : null,
                'end' => !empty($results) ? $results[0]['day'] : null,
                'start_formatted' => !empty($results) ? date('d/m/Y', strtotime(end($results)['day'])) : null,
                'end_formatted' => !empty($results) ? date('d/m/Y', strtotime($results[0]['day'])) : null
            ],
            'totals' => $totals,
            'data' => array_values($organized),
            'generated_at' => date('Y-m-d H:i:s'),
            'generated_at_formatted' => date('d/m/Y H:i:s')
        ];
    }

    public function getHistoryForChart($userId, $accountId = null, $startDate = null, $endDate = null) {

        if (!$startDate) {
            $startDate = date('Y-m-01'); 
        }
        if (!$endDate) {
            $endDate = date('Y-m-t'); 
        }
        
        $sql = "
            SELECT 
                h.day,
                h.month,
                h.year,
                h.total_income,
                h.total_expense,
                h.net_balance,
                DAYNAME(h.day) as day_name,
                DAY(h.day) as day_number
            FROM history h
            INNER JOIN accounts a ON h.account_id = a.id
            INNER JOIN users u ON a.user_id = u.id
            WHERE u.id = :user_id
            AND h.day BETWEEN :start_date AND :end_date
        ";
        
        $params = [
            'user_id' => $userId,
            'start_date' => $startDate,
            'end_date' => $endDate
        ];
        
        if ($accountId) {
            $sql .= " AND h.account_id = :account_id";
            $params['account_id'] = $accountId;
        }
        
        $sql .= " ORDER BY h.day ASC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
     
        $chartData = [];
        $summary = [
            'total_income' => 0,
            'total_expense' => 0,
            'net_balance' => 0,
            'period' => [
                'start' => $startDate,
                'end' => $endDate
            ]
        ];
        
        foreach ($results as $row) {
            $chartData[] = [
                'date' => $row['day'],
                'day' => (int) $row['day_number'],
                'day_name' => $row['day_name'],
                'month' => (int) $row['month'],
                'year' => (int) $row['year'],
                'income' => (float) $row['total_income'],
                'expense' => (float) $row['total_expense'],
                'balance' => (float) $row['net_balance'],
                'income_positive' => (float) $row['total_income'],
                'expense_negative' => -(float) $row['total_expense'] 
            ];
            
            $summary['total_income'] += (float) $row['total_income'];
            $summary['total_expense'] += (float) $row['total_expense'];
            $summary['net_balance'] += (float) $row['net_balance'];
        }
        
        $totalDays = count($chartData);
        $summary['averages'] = [
            'daily_income' => $totalDays > 0 ? $summary['total_income'] / $totalDays : 0,
            'daily_expense' => $totalDays > 0 ? $summary['total_expense'] / $totalDays : 0,
            'daily_balance' => $totalDays > 0 ? $summary['net_balance'] / $totalDays : 0
        ];
        
        return [
            'data' => $chartData,
            'summary' => $summary,
            'chart_config' => [
                'x_axis' => 'date',
                'y_axes' => ['income', 'expense', 'balance'],
                'colors' => [
                    'income' => '#10B981',     
                    'expense' => '#EF4444',    
                    'balance' => '#3B82F6' 
                ]
            ]
        ];
    }
    
    
}