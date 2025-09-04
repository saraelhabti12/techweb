<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Credentials</title>
</head>
<body>
    <h2>Hello {{ $user->name }},</h2>

    <p>Your account has been created. Here are your login credentials:</p>

    <p>
        <strong>Email:</strong> {{ $user->email }}<br>
        <strong>Password:</strong> {{ $password }}
    </p>

    <p>Please log in and change your password as soon as possible.</p>

    <p>Thanks,<br>The Team</p>
</body>
</html>
