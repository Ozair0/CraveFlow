param(
  [Parameter(Mandatory = $true)]
  [string]$Serial,

  [Parameter(Mandatory = $true)]
  [string]$Route,

  [Parameter(Mandatory = $true)]
  [string]$Output,

  [int]$DelaySeconds = 5,

  [int]$SwipeCount = 0,

  [int]$SwipeStartX = 540,

  [int]$SwipeStartY = 1900,

  [int]$SwipeEndX = 540,

  [int]$SwipeEndY = 700,

  [int]$SwipeDurationMs = 450,

  [int]$DelayAfterSwipeMs = 900,

  [int]$TapX = 0,

  [int]$TapY = 0,

  [string]$TextInput = '',

  [switch]$DismissKeyboard
)

$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$projectRoot = Split-Path -Parent $PSScriptRoot
$outputPath = Join-Path $projectRoot $Output
$outputDirectory = Split-Path -Parent $outputPath

if (!(Test-Path $outputDirectory)) {
  New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$normalizedRoute = $Route.TrimStart('/')
$deepLink = "exp://127.0.0.1:8081/--/$normalizedRoute"

& $adb -s $Serial shell "am start -a android.intent.action.VIEW -d '$deepLink' host.exp.exponent" | Out-Null
Start-Sleep -Seconds $DelaySeconds

if ($TapX -gt 0 -and $TapY -gt 0) {
  & $adb -s $Serial shell input tap $TapX $TapY | Out-Null
  Start-Sleep -Milliseconds 500
}

if ($TextInput) {
  & $adb -s $Serial shell input text $TextInput | Out-Null
  Start-Sleep -Milliseconds 700
}

if ($DismissKeyboard.IsPresent) {
  & $adb -s $Serial shell input keyevent 4 | Out-Null
  Start-Sleep -Milliseconds 700
}

for ($index = 0; $index -lt $SwipeCount; $index++) {
  & $adb -s $Serial shell input swipe $SwipeStartX $SwipeStartY $SwipeEndX $SwipeEndY $SwipeDurationMs | Out-Null
  Start-Sleep -Milliseconds $DelayAfterSwipeMs
}

cmd /c """$adb"" -s $Serial exec-out screencap -p > ""$outputPath"""

Write-Output $outputPath
