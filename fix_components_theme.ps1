$files = Get-ChildItem -Path "src\components" -Filter "*.tsx" -Recurse
$count = 0

foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    $content = $lines -join "`n"
    $original = $content

    # Text colors
    $content = $content -replace '\btext-white\b', 'text-slate-900'
    $content = $content -replace '\btext-neutral-400\b', 'text-slate-500'
    $content = $content -replace '\btext-neutral-300\b', 'text-slate-600'
    $content = $content -replace '\btext-neutral-500\b', 'text-slate-500'
    $content = $content -replace '\btext-neutral-200\b', 'text-slate-700'
    $content = $content -replace '\btext-neutral-100\b', 'text-slate-800'
    $content = $content -replace 'hover:text-white', 'hover:text-slate-900'

    # Dark backgrounds
    $content = $content -replace 'bg-\[#080808\]', 'bg-white'
    $content = $content -replace 'bg-\[#0a0a0a\]', 'bg-white'
    $content = $content -replace 'bg-\[#111111\]', 'bg-white'
    $content = $content -replace 'bg-\[#121212\]', 'bg-white'
    $content = $content -replace 'bg-\[#131313\]', 'bg-white'
    $content = $content -replace 'bg-\[#141414\]', 'bg-slate-50'
    $content = $content -replace 'bg-\[#151515\]', 'bg-slate-50'
    $content = $content -replace 'bg-\[#161616\]', 'bg-slate-50'
    $content = $content -replace 'bg-\[#181818\]', 'bg-slate-50'
    $content = $content -replace 'bg-\[#1a1a1a\]', 'bg-slate-100'
    $content = $content -replace 'bg-\[#1c1c1c\]', 'bg-slate-100'
    $content = $content -replace 'bg-\[#1e1e1e\]', 'bg-slate-50'
    $content = $content -replace 'bg-\[#202020\]', 'bg-slate-100'
    $content = $content -replace 'bg-\[#252525\]', 'bg-slate-100'

    # Dark borders
    $content = $content -replace 'border-\[#111111\]', 'border-slate-200'
    $content = $content -replace 'border-\[#141414\]', 'border-slate-200'
    $content = $content -replace 'border-\[#161616\]', 'border-slate-200'
    $content = $content -replace 'border-\[#1a1a1a\]', 'border-slate-200'
    $content = $content -replace 'border-\[#1c1c1c\]', 'border-slate-200'
    $content = $content -replace 'border-\[#1e1e1e\]', 'border-slate-200'
    $content = $content -replace 'border-\[#222222\]', 'border-slate-200'
    $content = $content -replace 'border-\[#262626\]', 'border-slate-200'
    $content = $content -replace 'border-\[#2a2a2a\]', 'border-slate-200'
    $content = $content -replace 'border-\[#2c2c2c\]', 'border-slate-200'
    $content = $content -replace 'border-\[#333333\]', 'border-slate-300'

    # Dark hover
    $content = $content -replace 'hover:bg-\[#141414\]', 'hover:bg-slate-50'
    $content = $content -replace 'hover:bg-\[#1a1a1a\]', 'hover:bg-slate-100'
    $content = $content -replace 'hover:bg-\[#1c1c1c\]', 'hover:bg-slate-100'
    $content = $content -replace 'hover:bg-\[#252525\]', 'hover:bg-slate-100'
    $content = $content -replace 'hover:border-\[#333333\]', 'hover:border-slate-400'

    if ($content -ne $original) {
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
        $count++
        Write-Host "Fixed component: $($file.Directory.Name)/$($file.Name)"
    }
}

Write-Host ""
Write-Host "Total component files fixed: $count"
