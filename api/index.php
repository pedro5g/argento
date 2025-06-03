<?php
require_once './framework/sedex.php';
require_once './db/conn.php';

require_once './repositories/auth.repository.php';
require_once './repositories/user.repository.php';
require_once './repositories/account.repository.php';
require_once './repositories/category.repository.php';
require_once './repositories/payment-method.repository.php';
require_once './repositories/client.repository.php';
require_once './repositories/transaction.repository.php';

require_once './services/auth.services.php';
require_once './services/user.services.php';
require_once './services/account.services.php';
require_once './services/category.services.php';
require_once './services/payment-method.services.php';
require_once './services/client.services.php';
require_once './services/transaction.services.php';

require_once './controllers/auth.controllers.php';
require_once './controllers/user.controllers.php';
require_once './controllers/account.controllers.php';
require_once './controllers/category.controllers.php';
require_once './controllers/payment-method.controllers.php';
require_once './controllers/client.controllers.php';
require_once './controllers/transaction.controllers.php';

require_once './middlewares/validate-body.middleware.php';
require_once './middlewares/auth.middleware.php';


header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}



$db = new DbConnect();
$conn = $db->connect();

# middleware
$auth = authMiddleware($conn, 'jwt_secret');

## Repositories
$authRepository = new AuthRepository($conn);
$userRepository = new UserRepository($conn);
$accountRepository = new AccountRepository($conn);
$categoryRepository = new CategoryRepository($conn);
$paymentMethodRepository = new PaymentMethodRepository($conn);
$clientRepository = new ClientRepository($conn);
$transactionRepository = new TransactionRepository($conn);

## Services
$authServices = new AuthServices($authRepository, 'jwt_secret');
$userServices = new UserServices($userRepository, $accountRepository);
$accountServices = new AccountServices($accountRepository);
$categoryServices = new CategoryServices($categoryRepository);
$paymentMethodServices = new PaymentMethodServices($paymentMethodRepository);
$clientServices = new ClientServices($clientRepository);
$transactionServices = new TransactionServices($transactionRepository);

## Controllers
$authControllers = new AuthControllers($authServices);
$userControllers = new UserControllers($userServices);
$accountControllers = new AccountControllers($accountServices);
$categoryControllers = new CategoryControllers($categoryServices);
$paymentMethodControllers = new PaymentMethodControllers($paymentMethodServices);
$clientControllers = new ClientControllers($clientServices);
$transactionControllers = new TransactionControllers($transactionServices);


$app = new Sedex();

## auth routes
$app->post("/auth/register", [$authControllers, 'register'], [
    validateBody([
        "name" => ["type" => "string", "min" => "3", "max" => "100"],
        "email" => ["type" => "string", "email" => true],
        "password" => ["type" => "string", "min" => "6", "max" => "100"]
    ])
]);
$app->post("/auth/login", [$authControllers, 'login']);

##  user routes
$app->get("/user/me", [$userControllers, "profile"], [$auth]);
$app->get("/user/list", [$userControllers, 'getAllUsers'], [$auth]);
$app->patch("/user/set-account/:accountId", [$userControllers, 'updatedCurrentAccount'], [$auth]);

## account routes
$app->post("/account/register", [$accountControllers, "registerNewAccount"], [
    $auth,
    validateBody([
        "name" => ["type" => "string", "min" => "3", "max" => "100"],
        "balance" => ["type" => "number"],
        "type" => ["type" => "string", "enum" => ["bank", "cash", "digital", "crypto"]]
    ])
]);
$app->get("/account/list", [$accountControllers, "listAllUserAccounts"], [$auth]);
$app->patch("/account/balance", [$accountControllers, "updateAccountBalance"], [
    $auth,
    validateBody([
        "balance" => ["type" => "number"],
    ])
]);
$app->get("/account/financial-summary", [$accountControllers, "getAccountFinancialSummary"], [$auth]);

## category routes
$app->post("/category/create", [$categoryControllers, "createNewCategory"], [
    $auth,
    validateBody([
        "name" => ["type" => "string", "min" => "3", "max" => "100"],
        "type" => ["type" => "string", "enum" => ["income", "expense"]]
    ])
]);
$app->patch("/category/:categoryId", [$categoryControllers, "updateCategory"], [
    $auth,
    validateBody([
        "name" => ["type" => "string", "min" => "3", "max" => "100"],
        "type" => ["type" => "string", "enum" => ["income", "expense"]]
    ])
]);
$app->delete("/category/:categoryId", [$categoryControllers, "deleteCategory"], [$auth]);
$app->get("/category/list", [$categoryControllers, "listAllCategories"], [$auth]);

## payment method routes
$app->post("/payment-method/create", [$paymentMethodControllers, "createPaymentMethod"], [
    $auth,
    validateBody([
        "name" => ["type" => "string", "min" => "3", "max" => "100"],
    ])
]);
$app->patch("/payment-method/:paymentId", [$paymentMethodControllers, "updatePaymentMethod"], [
    $auth,
    validateBody([
        "name" => ["type" => "string", "min" => "3", "max" => "100"],
    ])
]);
$app->delete("/payment-method/:paymentId", [$paymentMethodControllers, "deletePaymentMethod"], [$auth]);
$app->get("/payment-method/list", [$paymentMethodControllers, "listPaymentMethods"], [$auth]);

### clients routes

$app->post("/client/create", [$clientControllers, "createClient"], [$auth,  
    validateBody([
        "name" => ["type" => "string", "min" => "3", "max" => "100"],
        "email" => ["type" => "string", "email" => true, "optional" => true],
        "phone" => ["type" => "string", "optional" => true],
    ])
]);
$app->patch("/client/update/:clientId", [$clientControllers, "updateClient"], [$auth,
    validateBody([
        "name" => ["type" => "string", "min" => "3", "max" => "100"],
        "email" => ["type" => "string", "email" => true, "optional" => true],
        "phone" => ["type" => "string", "optional" => true],
    ])
]);
$app->delete("/client/delete/:clientId", [$clientControllers, "deleteClient"], [$auth]);
$app->get("/client/list", [$clientControllers, "listAllClients"], [$auth]);


## transaction routes
$app->post("/transactions/create", [$transactionControllers, "createTransaction"], [
    $auth,
    validateBody([
        "title" => ["type" => "string", "min" => "1", "max" => "255"],
        "amount" => ["type" => "number"],
        "type" => ["type" => "enum", "values" => ["income", "expense"]],
        "date" => ["type" => "string"], 
        "is_scheduled" => ["type" => "boolean", "optional" => true],
        "confirmed" => ["type" => "boolean", "optional" => true],
        "scheduled_date" => ["type" => "string", "optional" => true],
        "description" => ["type" => "string", "optional" => true],
        "recurrence" => ["type" => "enum", "values" => ["none", "daily", "weekly", "monthly", "yearly"], "optional" => true],
        "category_id" => ["type" => "number"],
        "client_id" => ["type" => "number", "optional" => true],
        "payment_method_id" => ["type" => "number", "optional" => true],
    ])
]);
$app->patch("/transactions/:transactionId", [$transactionControllers, "updateTransaction"], [$auth]);
$app->delete("/transactions/:transactionId", [$transactionControllers, "deleteTransaction"], [$auth]);
$app->get("/transactions/:transactionId", [$transactionControllers, "getTransactionById"], [$auth]);
$app->get("/transaction/list", [$transactionControllers, "listAllTransactions"], [$auth]);
$app->get("/transaction/paginated", [$transactionControllers, "listPaginatedTransactions"], [$auth]);
$app->get("/transaction/graph", [$transactionControllers, "getGraphData"], [$auth]);
$app->get('/transaction/pending', [$transactionControllers, 'listPendingTransactions'], [$auth]);
$app->get('/transaction/pending/simulate', [$transactionControllers, 'simulatePendingImpact'], [$auth]);
$app->patch('/transaction/pending/:transactionId/confirm', [$transactionControllers, 'confirmScheduledTransaction'], [$auth]);


$app->run();