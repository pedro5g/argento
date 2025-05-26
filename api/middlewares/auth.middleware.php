<?php
require_once './lib/jwt.php';
require_once './repositories/auth.repository.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function authMiddleware(PDO $pdo, $secret) {
    return function ($req, $res, $next) use ($pdo, $secret) {
        $authHeader = $req->headers['authorization'];
        
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return $res->status(401)->json(["error" => "Unauthorized"]);
        }

        $token = trim(str_replace('Bearer', '', $authHeader));

        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            $userRepo = new UserRepository($pdo);
            $userWithAccount = $userRepo->getUserWithCurrentAccountById($decoded->sub);

            if (!$userWithAccount) {
                return $res->status(401)->json(["error" => "Invalid token"]);
            }

            $req->user = $userWithAccount['user'];
            $req->account = $userWithAccount['account'];

            return $next($req, $res);
        } catch (Exception $e) {
            return $res->status(401)->json(["error" => "Invalid token"]);
        }
    };
}
