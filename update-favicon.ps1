param(
    [string]$Source = ''
)

$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$PublicDir = Join-Path $ScriptRoot 'public'

if (-not (Test-Path $PublicDir)) {
    New-Item -ItemType Directory -Path $PublicDir | Out-Null
}

function Write-DefaultFavicon {
    $pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII='
    $bytes = [System.Convert]::FromBase64String($pngBase64)
    $dest = Join-Path $PublicDir 'Robo Icon.ico'
    [System.IO.File]::WriteAllBytes($dest, $bytes)
    return $dest
}

if ($Source -ne '' -and (Test-Path $Source)) {
    $ext = [System.IO.Path]::GetExtension($Source)
    if ($ext -eq '') { $ext = '.ico' }
    $destFilename = 'favicon' + $ext
    $dest = Join-Path $PublicDir $destFilename
    Copy-Item -Path $Source -Destination $dest -Force
    Write-Host "Copied favicon to $dest"
} else {
    $dest = Write-DefaultFavicon
    Write-Host "No valid source provided - wrote default favicon to $dest"
}

# Update root index.html to reference the favicon (insert before </head>)
$indexPath = Join-Path $ScriptRoot 'index.html'
if (Test-Path $indexPath) {
    $indexContent = Get-Content -Raw -Path $indexPath
    if ($indexContent -notmatch '<link\s+rel="icon"') {
        $backup = "$indexPath.bak.$(Get-Date -Format yyyyMMddHHmmss)"
        Copy-Item -Path $indexPath -Destination $backup -Force
        $faviconHref = '/' + ([System.IO.Path]::GetFileName($dest))
        $linkTag = '    ' + '<link rel="icon" href="' + $faviconHref + '" />' + "`n"
        $replacement = $linkTag + '</head>'
        $newContent = $indexContent -replace '(?i)</head>', $replacement
        Set-Content -Path $indexPath -Value $newContent -Encoding UTF8
        Write-Host "Updated index.html and backed up original to $backup"
    } else {
        Write-Host "index.html already contains a favicon link; no changes made."
    }
} else {
    Write-Host "index.html not found at $indexPath - skipped HTML update."
}

$cmd = "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; & '" + $MyInvocation.MyCommand.Path + "' -Source '<path-to-your-favicon>'"
Write-Host ("Done. To run: " + $cmd)
