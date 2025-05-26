<?php

class Request {
    public $body;
    public $params = [];
    public $query = [];
    public $headers = [];

    public function __construct() {
        $this->body = json_decode(file_get_contents("php://input"), true) ?? [];
        parse_str($_SERVER['QUERY_STRING'] ?? '', $this->query);
        $this->headers = $this->parseHeaders();
    }

    private function parseHeaders() {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $header = str_replace('_', '-', strtolower(substr($key, 5)));
                $headers[$header] = $value;
            }
        }
        return $headers;
    }
}

class Response {
    public function json($data) {
        
        header("Content-Type: application/json");
    
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public function status($code = 200) {
        http_response_code($code);
        return $this;
    }
}


class Sedex {
    private $routes = [];
    private $globalMiddlewares = [];

    public function use($middleware) {
        $this->globalMiddlewares[] = $middleware;
    }

    public function add($method, $route, $callback, $middlewares = []) {
        $pattern = preg_replace('#:([\w]+)#', '([^/]+)', $route);
        $pattern = "#^" . rtrim($pattern, '/') . "$#";

        $this->routes[$method][] = [
            'pattern' => $pattern,
            'callback' => $callback,
            'route' => $route,
            'middlewares' => $middlewares
        ];
    }

    public function get($route, $callback, $middlewares = []) {
        $this->add('GET', $route, $callback, $middlewares);
    }

    public function post($route, $callback, $middlewares = []) {
        $this->add('POST', $route, $callback, $middlewares);
    }

    public function delete($route, $callback, $middlewares = []) {
        $this->add('DELETE', $route, $callback, $middlewares);
    }

    public function patch($route, $callback, $middlewares = []) {
        $this->add('PATCH', $route, $callback, $middlewares);
    }

    public function run() {

        $method = $_SERVER['REQUEST_METHOD'];
        $uri = $_SERVER['PATH_INFO'] ?? '/';
        $uri = rtrim(str_replace('/api', '', $uri), '/');

        foreach ($this->routes[$method] ?? [] as $route) {
            if (preg_match($route['pattern'], $uri, $matches)) {
                array_shift($matches); 
                preg_match_all('/:([\w]+)/', $route['route'], $paramNames);
                $params = array_combine($paramNames[1], $matches);

                $req = new Request();
                $req->params = $params;
                $res = new Response();

                $allMiddlewares = array_merge($this->globalMiddlewares, $route['middlewares']);

                $this->executeMiddlewares($allMiddlewares, $req, $res, function () use ($route, $req, $res) {
                    $route['callback']($req, $res);
                });

                return;
            }
        }


        http_response_code(404);
        echo json_encode(["error" => "Route not found"]);
    }

    private function executeMiddlewares($middlewares, $req, $res, $finalCallback, $index = 0) {
        if (!isset($middlewares[$index])) {
            return $finalCallback();
        }

        $middleware = $middlewares[$index];

        $middleware($req, $res, function () use ($middlewares, $req, $res, $finalCallback, $index) {
            $this->executeMiddlewares($middlewares, $req, $res, $finalCallback, $index + 1);
        });
    }
}
