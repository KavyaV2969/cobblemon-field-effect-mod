param([string]$GradlePath, [switch]$RefreshSource)
$ErrorActionPreference = 'Stop'
$taskRoot = $PSScriptRoot
$taskWorkspace = Split-Path -Parent $taskRoot
function Check-Exit { if ($LASTEXITCODE -ne 0) { throw "Verification command failed with exit code $LASTEXITCODE" } }
Push-Location -LiteralPath $taskWorkspace
try {
    if ($RefreshSource) {
        $taskSource = (Get-Content -LiteralPath (Join-Path $taskRoot 'research/source-location.json') -Raw | ConvertFrom-Json).scripts
        ruby rejuvenation/research/extract_fields.rb $taskSource (Join-Path $taskRoot 'research/field-specification.json')
        Check-Exit
        ruby rejuvenation/research/audit_source.rb $taskSource (Join-Path $taskRoot 'research')
        Check-Exit
    }
    python rejuvenation/research/prepare_build.py
    Check-Exit
    python rejuvenation/research/generate.py
    Check-Exit
    python rejuvenation/research/validate.py
    Check-Exit
    python rejuvenation/research/compare.py
    Check-Exit
    python rejuvenation/research/runtime_oracle.py
    Check-Exit
    python rejuvenation/research/write_docs.py
    Check-Exit
    if (!$GradlePath) {
        $taskGradle = Get-Command gradle -ErrorAction SilentlyContinue
        if ($taskGradle) { $GradlePath = $taskGradle.Source }
        else {
            $taskCache = Join-Path $env:USERPROFILE '.gradle/wrapper/dists/gradle-8.13-bin'
            $taskCachedGradle = Get-ChildItem -LiteralPath $taskCache -Filter gradle.bat -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
            if (!$taskCachedGradle) { throw 'Supply -GradlePath to Gradle 8.13 or download it through mod/gradlew.bat.' }
            $GradlePath = $taskCachedGradle.FullName
        }
    }
    & $GradlePath -p rejuvenation/mod --gradle-user-home rejuvenation/mod/.gradle-home --offline build --console=plain 2>&1 | Tee-Object -FilePath (Join-Path $taskRoot 'research/test-results/build.log')
    Check-Exit
    python rejuvenation/research/package.py
    Check-Exit
} finally { Pop-Location }
