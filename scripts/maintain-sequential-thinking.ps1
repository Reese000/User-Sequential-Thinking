param(
  [ValidateSet('check','repair')]
  [string]$Mode = 'check',
  [string]$NodePath = '',
  [string]$Entrypoint = '',
  [int]$ProbeTimeoutMs = 12000
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$dryRun = $Mode -eq 'check'

function Resolve-ExistingPath {
  param([string[]]$Candidates)
  foreach ($candidate in $Candidates) {
    if ([string]::IsNullOrWhiteSpace($candidate)) {
      continue
    }
    if (Test-Path $candidate) {
      return (Resolve-Path $candidate).Path -replace '\\', '/'
    }
  }
  return $null
}

$nodeCandidates = @(
  'C:/Progra~1/nodejs/node.exe',
  'C:/Program Files/nodejs/node.exe',
  'C:/Program Files/nodejs/node'
)

$entryCandidates = @(
  'C:/mcp-tools/server-sequential-thinking/dist/index.js',
  (Join-Path $env:APPDATA 'npm/node_modules/@modelcontextprotocol/server-sequential-thinking/dist/index.js').Replace('\\', '/'),
  (Join-Path $env:LOCALAPPDATA 'Programs/ms-playwright/node_modules/@modelcontextprotocol/server-sequential-thinking/dist/index.js').Replace('\\', '/'),
  (Join-Path $env:PROGRAMFILES 'nodejs/node_modules/@modelcontextprotocol/server-sequential-thinking/dist/index.js').Replace('\\', '/'),
  (Join-Path $env:USERPROFILE 'AppData/Roaming/npm/node_modules/@modelcontextprotocol/server-sequential-thinking/dist/index.js').Replace('\\', '/')
)

$serverIdentifier = 'user-user-sequential-thinking'
$serverConfig = @{
  command = Resolve-ExistingPath -Candidates @($NodePath) 
  args = @()
  env = @{ 'DISABLE_THOUGHT_LOGGING' = 'true' }
}

$nodeExe = if ($NodePath) { Resolve-ExistingPath -Candidates @($NodePath.Replace('\\','/')) } else { Resolve-ExistingPath -Candidates $nodeCandidates }
$entry = if ($Entrypoint) { Resolve-ExistingPath -Candidates @($Entrypoint.Replace('\\','/')) } else { Resolve-ExistingPath -Candidates $entryCandidates }

$serverConfig.command = $nodeExe
$serverConfig.args = @($entry)

$health = [ordered]@{
  Mode = $Mode
  NodeExecutable = $nodeExe
  Entrypoint = $entry
  NodeFound = [bool]$nodeExe
  EntrypointFound = [bool]$entry
  Repository = $repoRoot
}

if (-not $nodeExe -or -not $entry) {
  Write-Output '[STATUS] BLOCKED'
  Write-Output '[CRITIQUE] Required runtime binary or entrypoint is missing.'
  Write-Output ($health | ConvertTo-Json -Depth 10)
  exit 1
}

$configFiles = @(
  (Join-Path $env:USERPROFILE '.cursor/mcp.json'),
  (Join-Path $env:USERPROFILE 'Desktop/Cursor/.cursor/mcp.json'),
  (Join-Path $env:APPDATA 'Cursor/User/globalStorage/mcp.json')
) | Where-Object { $_ }

function Ensure-McpConfig {
  param([string]$ConfigPath)

  if (-not (Test-Path $ConfigPath)) {
    return [pscustomobject]@{ Path = $ConfigPath; Missing = $true; Updated = $false; }
  }

  $jsonRaw = Get-Content -Raw -Path $ConfigPath
  if (-not $jsonRaw) {
    return [pscustomobject]@{ Path = $ConfigPath; Missing = $false; Updated = $false; Error = 'Empty file' }
  }

  try {
    $json = $jsonRaw | ConvertFrom-Json -ErrorAction Stop
  } catch {
    return [pscustomobject]@{ Path = $ConfigPath; Missing = $false; Updated = $false; Error = $_.Exception.Message }
  }

  if (-not $json.PSObject.Properties['mcpServers']) {
    return [pscustomobject]@{ Path = $ConfigPath; Missing = $false; Updated = $false; Error = 'No mcpServers object present' }
  }

  $servers = $json.mcpServers
  $existing = $servers.PSObject.Properties[$serverIdentifier]

  if ($existing) {
    $existing.Value = $serverConfig
  } else {
    $servers | Add-Member -MemberType NoteProperty -Name $serverIdentifier -Value $serverConfig -Force
  }

  $current = Get-Content -Raw -Path $ConfigPath
  $updated = ConvertTo-Json $json -Depth 64

  if (-not $dryRun) {
    Set-Content -Path $ConfigPath -Value ($updated + "`r`n") -Encoding UTF8
  }

  return [pscustomobject]@{ Path = $ConfigPath; Missing = $false; Updated = ($current -ne $updated) }
}

$cacheSummary = @()
$workspaceRoots = Get-ChildItem -Path (Join-Path $env:USERPROFILE '.cursor/projects') -Directory -ErrorAction SilentlyContinue
$cacheTargets = @()
foreach ($workspace in $workspaceRoots) {
  $mcps = Join-Path $workspace.FullName 'mcps'
  if (Test-Path $mcps) {
    $cacheTargets += Join-Path $mcps $serverIdentifier
  }
}
$cacheTargets = $cacheTargets | Select-Object -Unique

$toolContractSource = Join-Path $repoRoot 'docs/TOOL_CONTRACT.json'
$toolContract = Get-Content -Raw -Path $toolContractSource

foreach ($cachePath in $cacheTargets) {
  $cacheSummary += [pscustomobject]@{
    CachePath = $cachePath
    MissingMetadata = -not (Test-Path (Join-Path $cachePath 'SERVER_METADATA.json'))
    MissingTools = -not (Test-Path (Join-Path $cachePath 'tools/sequentialthinking.json'))
  }

  if (-not $dryRun) {
    New-Item -ItemType Directory -Path $cachePath -Force | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $cachePath 'tools') -Force | Out-Null

    $metadata = @{ serverIdentifier = $serverIdentifier; serverName = $serverIdentifier } | ConvertTo-Json -Depth 8
    Set-Content -Path (Join-Path $cachePath 'SERVER_METADATA.json') -Value ($metadata + "`r`n") -Encoding UTF8
    Set-Content -Path (Join-Path $cachePath 'tools/sequentialthinking.json') -Value ($toolContract + "`r`n") -Encoding UTF8
  }
}

$results = @()
foreach ($config in $configFiles) {
  $results += Ensure-McpConfig -ConfigPath $config
}

$wrapperPath = 'C:/mcp-tools/mcp-server-sequential-thinking.cmd'
if (-not (Test-Path $wrapperPath) -and -not $dryRun) {
  New-Item -ItemType Directory -Path (Split-Path $wrapperPath) -Force | Out-Null
  $wrapper = @"
@echo off
"$nodeExe" "$entry" %*
"@
  Set-Content -Path $wrapperPath -Value ($wrapper.TrimEnd() + "`r`n") -Encoding ASCII
}

$probeCommand = @("$repoRoot\scripts\mcp-probe.mjs", $entry, $nodeExe, $ProbeTimeoutMs)
$probeResult = $null
if (-not $dryRun) {
  try {
    $probeResult = & node $probeCommand 2>$null
    $probeCode = $LASTEXITCODE
  } catch {
    $probeCode = 1
    $probeResult = $_.Exception.Message
  }
}

$statusLine = if ($dryRun) { 'CHECK' } else { 'REPAIR' }
Write-Output ('[STATUS] ' + $statusLine)
Write-Output '[CRITIQUE]'
Write-Output ($results | ConvertTo-Json -Depth 20)
Write-Output ($cacheSummary | ConvertTo-Json -Depth 20)
Write-Output '[AGENT]'
Write-Output "DryRun=$dryRun"
if ($dryRun) {
  Write-Output 'Next step: run with -Mode repair to apply changes.'
} else {
  Write-Output ("ProbeExit=$probeCode")
  if ($probeCode -ne 0) {
    Write-Output 'Probe did not return expected sequentialthinking tool. Review NODE+entry configuration before use.'
    exit 2
  }
}
