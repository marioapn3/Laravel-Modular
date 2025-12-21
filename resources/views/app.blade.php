<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    @viteReactRefresh
    @vite('resources/js/app.jsx')


    @if (str_contains(request()->pathInfo, 'dashboard'))
        @vite('resources/css/app.css')
    @else
        @vite('resources/css/dashboard.css')
    @endif
    @inertiaHead
</head>

<body>

    @inertia
</body>

</html>
