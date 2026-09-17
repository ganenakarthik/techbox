$files = Get-ChildItem -Path "src\app" -Filter "page.tsx" -Recurse | Where-Object { $_.FullName -notlike "*\admin\*" }
$count = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content

    # Text colors - dark to light
    $content = $content -replace '\btext-white\b', 'text-slate-900'
    $content = $content -replace '\btext-neutral-400\b', 'text-slate-500'
    $content = $content -replace '\btext-neutral-300\b', 'text-slate-600'
    $content = $content -replace '\btext-neutral-500\b', 'text-slate-500'
    $content = $content -replace '\btext-neutral-600\b', 'text-slate-500'
    $content = $content -replace '\btext-neutral-200\b', 'text-slate-700'
    $content = $content -replace '\btext-neutral-100\b', 'text-slate-800'
    $content = $content -replace '\btext-neutral-900\b', 'text-slate-900'

    # Dark card backgrounds to white/light
    $content = $content -replace 'bg-\[#080808\]', 'bg-white'
    $content = $content -replace 'bg-\[#0a0a0a\]', 'bg-white'
    $content = $content -replace 'bg-\[#0f0f0f\]', 'bg-white'
    $content = $content -replace 'bg-\[#111111\]', 'bg-white'
    $content = $content -replace 'bg-\[#111\]', 'bg-white'
    $content = $content -replace 'bg-\[#121212\]', 'bg-white'
    $content = $content -replace 'bg-\[#131313\]', 'bg-white'
    $content = $content -replace 'bg-\[#141414\]', 'bg-slate-50'
    $content = $content -replace 'bg-\[#151515\]', 'bg-slate-50'
    $content = $content -replace 'bg-\[#161616\]', 'bg-slate-50'
    $content = $content -replace 'bg-\[#181818\]', 'bg-slate-50'
    $content = $content -replace 'bg-\[#1a1a1a\]', 'bg-slate-100'
    $content = $content -replace 'bg-\[#1c1c1c\]', 'bg-slate-100'
    $content = $content -replace 'bg-\[#1e1e1e\]', 'bg-slate-50'
    $content = $content -replace 'bg-\[#1f1f1f\]', 'bg-slate-50'
    $content = $content -replace 'bg-\[#202020\]', 'bg-slate-100'
    $content = $content -replace 'bg-\[#252525\]', 'bg-slate-100'
    $content = $content -replace 'bg-\[#2a2a2a\]', 'bg-slate-200'

    # Dark borders to light
    $content = $content -replace 'border-\[#111111\]', 'border-slate-200'
    $content = $content -replace 'border-\[#121212\]', 'border-slate-200'
    $content = $content -replace 'border-\[#141414\]', 'border-slate-200'
    $content = $content -replace 'border-\[#161616\]', 'border-slate-200'
    $content = $content -replace 'border-\[#181818\]', 'border-slate-200'
    $content = $content -replace 'border-\[#1a1a1a\]', 'border-slate-200'
    $content = $content -replace 'border-\[#1c1c1c\]', 'border-slate-200'
    $content = $content -replace 'border-\[#1e1e1e\]', 'border-slate-200'
    $content = $content -replace 'border-\[#1f1f1f\]', 'border-slate-200'
    $content = $content -replace 'border-\[#222222\]', 'border-slate-200'
    $content = $content -replace 'border-\[#262626\]', 'border-slate-200'
    $content = $content -replace 'border-\[#2a2a2a\]', 'border-slate-200'
    $content = $content -replace 'border-\[#2c2c2c\]', 'border-slate-300'
    $content = $content -replace 'border-\[#2e2e2e\]', 'border-slate-200'
    $content = $content -replace 'border-\[#333333\]', 'border-slate-300'
    $content = $content -replace 'border-\[#3a3a3a\]', 'border-slate-300'

    # Dark hover states
    $content = $content -replace 'hover:bg-\[#141414\]', 'hover:bg-slate-50'
    $content = $content -replace 'hover:bg-\[#1a1a1a\]', 'hover:bg-slate-100'
    $content = $content -replace 'hover:bg-\[#1c1c1c\]', 'hover:bg-slate-100'
    $content = $content -replace 'hover:bg-\[#252525\]', 'hover:bg-slate-100'
    $content = $content -replace 'hover:bg-\[#2a2a2a\]', 'hover:bg-slate-200'
    $content = $content -replace 'hover:bg-\[#333333\]', 'hover:bg-slate-200'
    $content = $content -replace 'hover:border-\[#333333\]', 'hover:border-slate-400'
    $content = $content -replace 'hover:border-\[#3a3a3a\]', 'hover:border-slate-400'
    $content = $content -replace 'hover:text-white', 'hover:text-slate-900'

    # Dark input/form backgrounds
    $content = $content -replace 'bg-\[#0f1117\]', 'bg-slate-50'

    # Backdrop blur dark
    $content = $content -replace 'bg-black/80', 'bg-black/40'

    # Gradient dark backgrounds
    $content = $content -replace 'from-\[#111111\]', 'from-slate-50'
    $content = $content -replace 'to-\[#111111\]', 'to-slate-50'
    $content = $content -replace 'via-\[#161311\]', 'via-slate-50'

    # Ambient blurs / overlays in dark pages - remove or lighten
    $content = $content -replace 'bg-\[linear-gradient\(to_right,#141414 1px,transparent 1px\),linear-gradient\(to_bottom,#141414 1px,transparent 1px\)\]', 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]'

    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $count++
        Write-Host "Fixed: $($file.Directory.Name)/$($file.Name)"
    }
}

Write-Host ""
Write-Host "Total files fixed: $count"
