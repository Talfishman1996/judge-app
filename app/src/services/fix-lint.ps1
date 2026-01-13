$content = Get-Content gemini.ts -Raw
$content = $content -replace 'const requestBody: any =', 'const requestBody ='
$content = $content -replace '\} catch \(e\) \{', '} catch {'
Set-Content gemini.ts -Value $content -NoNewline
