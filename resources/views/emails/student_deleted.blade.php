<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #dc3545; color: #ffffff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .body { padding: 30px; color: #333333; }
        .body p { font-size: 15px; line-height: 1.6; }
        .details-box { background-color: #f8f9fa; border-left: 4px solid #dc3545; border-radius: 4px; padding: 20px; margin: 20px 0; }
        .details-box table { width: 100%; border-collapse: collapse; }
        .details-box td { padding: 8px 12px; font-size: 14px; border-bottom: 1px solid #e2e8f0; }
        .details-box td:first-child { font-weight: bold; color: #555; width: 40%; }
        .footer { background-color: #003366; color: #ffffff; text-align: center; padding: 20px; font-size: 13px; }
        .badge { display: inline-block; background-color: #dc3545; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Student Record Deleted</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Student Dashboard System</p>
        </div>

        <div class="body">
            <p>Hello Admin,</p>
            <p>A student record has been <span class="badge">DELETED</span> from the system. Details are below:</p>

            <div class="details-box">
                <table>
                    <tr>
                        <td>👤 Name</td>
                        <td>{{ $student->name ?? 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td>📧 Email</td>
                        <td>{{ $student->email ?? 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td>🎂 Age</td>
                        <td>{{ $student->age ?? 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td>⚧ Gender</td>
                        <td>{{ $student->gender ?? 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td>📅 Date of Birth</td>
                        <td>{{ $student->dob ?? 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td>🏆 Score</td>
                        <td>{{ $student->score ?? 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td>🕐 Deleted At</td>
                        <td>{{ now()->format('d M Y, h:i A') }}</td>
                    </tr>
                </table>
            </div>

            <p style="color: #dc3545; font-weight: bold;">⚠️ This action cannot be undone.</p>
            <p>If this was a mistake, please contact your system administrator immediately.</p>
        </div>

        <div class="footer">
            © {{ date('Y') }} Student Dashboard System. All rights reserved.
        </div>
    </div>
</body>
</html>