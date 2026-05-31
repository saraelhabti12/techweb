<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Notification' }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700;800&display=swap');
        
        body {
            font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .header {
            padding: 40px;
            text-align: center;
            background: linear-gradient(135deg, #1F2BF3 0%, #00D8C0 100%);
        }
        
        .logo {
            margin: 0;
            color: #ffffff;
            font-size: 32px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        
        .logo span {
            color: rgba(255, 255, 255, 0.7);
        }
        
        .subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin-top: 8px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .content {
            padding: 40px;
        }
        
        .section-title {
            color: #64748b;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
            display: block;
        }
        
        .info-card {
            background-color: #f8fafc;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 30px;
            border-left: 4px solid #1F2BF3;
        }
        
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .info-table td {
            padding: 12px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .info-table tr:last-child td {
            border-bottom: none;
        }
        
        .label {
            color: #64748b;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            width: 35%;
        }
        
        .value {
            color: #0f172a;
            font-size: 15px;
            font-weight: 700;
        }
        
        .message-box {
            background-color: #f1f5f9;
            border-radius: 16px;
            padding: 24px;
            color: #334155;
            font-size: 15px;
            line-height: 1.6;
            font-style: italic;
            margin-bottom: 30px;
            position: relative;
        }
        
        .button-wrapper {
            text-align: center;
            margin: 40px 0;
        }
        
        .button {
            display: inline-block;
            padding: 18px 40px;
            background: linear-gradient(135deg, #1F2BF3 0%, #00D8C0 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 16px;
            font-weight: 800;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 10px 20px rgba(31, 43, 243, 0.25);
            transition: transform 0.2s ease;
        }
        
        .footer {
            padding: 30px 40px;
            background-color: #f8fafc;
            text-align: center;
            border-top: 1px solid #f1f5f9;
        }
        
        .footer p {
            margin: 0;
            color: #94a3b8;
            font-size: 12px;
            line-height: 1.5;
        }
        
        @media only screen and (max-width: 600px) {
            .container {
                margin: 0;
                width: 100% !important;
                border-radius: 0;
            }
            .content {
                padding: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">TECH<span>WEB</span></h1>
            <p class="subtitle">{{ $subtitle ?? 'Notification Système' }}</p>
        </div>
        
        <div class="content">
            @yield('content')
            
            @isset($actionUrl)
            <div class="button-wrapper">
                <a href="{{ $actionUrl }}" class="button">
                    {{ $actionText ?? 'Voir les détails' }}
                </a>
            </div>
            @endisset
        </div>
        
        <div class="footer">
            <p>
                Ceci est une notification automatique de <strong>{{ config('app.name') }}</strong>.<br>
                Propulsé par l'innovation numérique.
            </p>
            <p style="margin-top: 10px;">
                &copy; {{ date('Y') }} TechWeb. Tous droits réservés.
            </p>
        </div>
    </div>
</body>
</html>
