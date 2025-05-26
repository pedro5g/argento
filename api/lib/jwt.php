<?php
require_once __DIR__ . '/php-jwt/src/JWTExceptionWithPayloadInterface.php';
require_once __DIR__ . '/php-jwt/src/BeforeValidException.php';
require_once __DIR__ . '/php-jwt/src/ExpiredException.php';
require_once __DIR__ . '/php-jwt/src/SignatureInvalidException.php';
require_once __DIR__ . '/php-jwt/src/Key.php';
require_once __DIR__ . '/php-jwt/src/JWT.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;