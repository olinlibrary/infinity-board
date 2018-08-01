const SERVER_URI = `${process.env.SERVER_URI}` || 'http://127.0.0.1';

export default `
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="index.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon" />
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <script defer src="https://use.fontawesome.com/releases/v5.0.8/js/all.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.4.3/css/foundation.min.css" type="text/css">
    <title>InfinityBoard</title>
</head>
<body>
<noscript>
    You need to enable JavaScript to run this app.
</noscript>
<div id="background">
    <div class="title-wrapper">
            <div class="title-text">InfinityBoard</div>
            <div class="loading-wrapper">
                <div class="loading-symbol" />
            </div>
    </div>
</div>
<div id="root"></div>
<script type="text/javascript">
    window.SERVER_URI = '${SERVER_URI}';
    window.AWS_IDENTITY_POOL_ID = '${process.env.AWS_IDENTITY_POOL_ID}';
</script>
<script src="bundle.js" type="text/javascript"></script>
</body>
</html>
`;
