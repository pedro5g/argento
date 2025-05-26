<?php
function isValidNumber($value) {
    return is_int($value) || is_float($value) || is_numeric($value);
}

function validateBody(array $rules) {
    return function ($req, $res, $next) use ($rules) {
        $body = $req->body;

        foreach ($rules as $field => $options) {
            $isOptional = $options['optional'] ?? false;

            if (!isset($body[$field])) {
                if ($isOptional) continue;
                return $res->status(400)->json(["error" => "Missing field: $field"]);
            }

            $value = $body[$field];

           
            if (($options['type'] ?? '') === 'number') {
                if (!isValidNumber($value)) {
                    return $res->status(400)->json(["error" => "$field must be a valid number"]);
                }
            } elseif (($options['type'] ?? '') === 'string') {
                if (!is_string($value)) {
                    return $res->status(400)->json(["error" => "$field must be a string"]);
                }
            } elseif (($options['type'] ?? '') === 'boolean') {
                if (!is_bool($value)) {
                    return $res->status(400)->json(["error" => "$field must be a boolean"]);
                }
            }

           
            if (isset($options['min']) && is_string($value) && strlen($value) < $options['min']) {
                return $res->status(400)->json(["error" => "$field must be at least {$options['min']} characters"]);
            }

            if (isset($options['max']) && is_string($value) && strlen($value) > $options['max']) {
                return $res->status(400)->json(["error" => "$field must be at most {$options['max']} characters"]);
            }

           
            if (!empty($options['email']) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                return $res->status(400)->json(["error" => "$field must be a valid email"]);
            }

   
            if (!empty($options['enum']) && !in_array($value, $options['enum'])) {
                return $res->status(400)->json(["error" => "$field must be one of: " . implode(', ', $options['enum'])]);
            }
        }

        return $next($req, $res);
    };
}
