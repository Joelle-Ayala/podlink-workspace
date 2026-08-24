<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name') }} - Authorize Access</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
    >

    <style>
        :root {
            --podlink-bg: #0f0f12;
            --podlink-card: #17171b;
            --podlink-border: #2a2a2f;
            --podlink-text: #f0ede6;
            --podlink-muted: #9c9a95;
            --podlink-primary: #FF8C00;
            --podlink-primary-hover: #e67e00;
        }

        * {
            box-sizing: border-box;
        }

        body.passport-authorize {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--podlink-bg);
            color: var(--podlink-text);
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 24px;
        }

        .passport-authorize .card {
            width: 100%;
            max-width: 420px;
            background: var(--podlink-card);
            border: 1px solid var(--podlink-border);
            border-radius: 16px;
            padding: 40px 32px;
            text-align: center;
        }

        .passport-authorize .logo {
            display: block;
            height: 32px;
            margin: 0 auto 28px;
        }

        .passport-authorize h1 {
            font-size: 19px;
            font-weight: 600;
            line-height: 1.4;
            margin: 0 0 12px;
            color: var(--podlink-text);
        }

        .passport-authorize h1 .client-name {
            color: var(--podlink-primary);
        }

        .passport-authorize .permissions {
            text-align: left;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--podlink-border);
            border-radius: 10px;
            padding: 16px 18px;
            margin: 20px 0 28px;
        }

        .passport-authorize .permissions p {
            margin: 0 0 8px;
            font-size: 13px;
            font-weight: 600;
            color: var(--podlink-muted);
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }

        .passport-authorize .permissions ul {
            margin: 0;
            padding-left: 18px;
            font-size: 14px;
            line-height: 1.6;
            color: var(--podlink-text);
        }

        .passport-authorize .buttons {
            display: flex;
            gap: 12px;
        }

        .passport-authorize form {
            display: inline;
            flex: 1;
        }

        .passport-authorize .btn {
            width: 100%;
            padding: 12px 16px;
            font-family: inherit;
            font-size: 15px;
            font-weight: 600;
            border-radius: 8px;
            border: 1px solid transparent;
            cursor: pointer;
            transition: background-color 0.15s ease, border-color 0.15s ease;
        }

        .passport-authorize .btn-approve {
            background: var(--podlink-primary);
            color: #0f0f12;
        }

        .passport-authorize .btn-approve:hover {
            background: var(--podlink-primary-hover);
        }

        .passport-authorize .btn-deny {
            background: transparent;
            border-color: var(--podlink-border);
            color: var(--podlink-text);
        }

        .passport-authorize .btn-deny:hover {
            border-color: var(--podlink-muted);
        }

        .passport-authorize .fine-print {
            margin-top: 24px;
            font-size: 12px;
            color: var(--podlink-muted);
        }
    </style>
</head>
<body class="passport-authorize">
    <div class="card">
        <img
            class="logo"
            src="{{ asset('upload/images/logo/ITEp-dashboard-dark-podlink-logo.svg') }}"
            alt="Podlink"
        >

        <h1><span class="client-name">{{ $client->name }}</span> wants to access your Podlink account</h1>

        <div class="permissions">
            @if (count($scopes) > 0)
                <p>This will allow it to:</p>
                <ul>
                    @foreach ($scopes as $scope)
                        <li>{{ $scope->description }}</li>
                    @endforeach
                </ul>
            @else
                <p>This will allow it to:</p>
                <ul>
                    <li>Read your show's analytics and page info</li>
                </ul>
            @endif
        </div>

        <div class="buttons">
            <!-- Authorize Button -->
            <form method="post" action="{{ route('passport.authorizations.approve') }}">
                @csrf

                <input type="hidden" name="state" value="{{ $request->state }}">
                <input type="hidden" name="client_id" value="{{ $client->getKey() }}">
                <input type="hidden" name="auth_token" value="{{ $authToken }}">
                <button type="submit" class="btn btn-approve">Authorize</button>
            </form>

            <!-- Cancel Button -->
            <form method="post" action="{{ route('passport.authorizations.deny') }}">
                @csrf
                @method('DELETE')

                <input type="hidden" name="state" value="{{ $request->state }}">
                <input type="hidden" name="client_id" value="{{ $client->getKey() }}">
                <input type="hidden" name="auth_token" value="{{ $authToken }}">
                <button type="submit" class="btn btn-deny">Deny</button>
            </form>
        </div>

        <p class="fine-print">You can revoke this access at any time from your Podlink dashboard.</p>
    </div>
</body>
</html>
