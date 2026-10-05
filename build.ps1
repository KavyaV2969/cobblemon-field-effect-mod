# -AffinityMask pins this script and every child (Gradle, forked test JVMs) to the given cores, e.g. 0xFFF for the
# performance cores of a 6P+8E hybrid CPU, so the decision-latency receipt is not taken on efficiency cores.
param([string]$GradlePath, [switch]$RefreshSource, [long]$AffinityMask = 0)
$ErrorActionPreference = 'Stop'
$taskRoot = $PSScriptRoot
$taskWorkspace = Split-Path -Parent $taskRoot
function Check-Exit { if ($LASTEXITCODE -ne 0) { throw "Verification command failed with exit code $LASTEXITCODE" } }
Push-Location -LiteralPath $taskWorkspace
if ($AffinityMask -gt 0) {
    $taskProcess = [System.Diagnostics.Process]::GetCurrentProcess()
    $taskProcess.ProcessorAffinity = [IntPtr]$AffinityMask
    $taskProcess.PriorityClass = 'High'
    $env:REJUVENATION_AFFINITY = ('0x{0:X}' -f $AffinityMask)
}
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
    python rejuvenation/scripts/generate_ai_affinity.py
    Check-Exit
    python rejuvenation/scripts/generate_ai_disruption.py
    Check-Exit
    python rejuvenation/research/generate.py
    Check-Exit
    python rejuvenation/research/validate.py
    Check-Exit
    python rejuvenation/research/compare.py
    Check-Exit
    python rejuvenation/research/runtime_oracle.py
    Check-Exit
    $taskGradleArgs = @('-p', 'rejuvenation/mod', '--gradle-user-home', 'rejuvenation/mod/.gradle-home', '--offline', '--no-daemon', 'build', 'strategyBenchmark', 'integrationFixtureJar', '--console=plain')
    $taskLog = Join-Path $taskRoot 'research/test-results/build.log'
    if ($GradlePath) {
        & $GradlePath @taskGradleArgs 2>&1 | Tee-Object -LiteralPath $taskLog
    } else {
        # The cached Gradle 8.13 launcher, run directly with Java 21 (the gradle.bat wrapper can hang in this shell).
        $taskCache = Join-Path $env:USERPROFILE '.gradle/wrapper/dists/gradle-8.13-bin'
        $taskLauncher = Get-ChildItem -LiteralPath $taskCache -Filter gradle-launcher-8.13.jar -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if (!$taskLauncher) { throw 'Supply -GradlePath to Gradle 8.13 or download it through mod/gradlew.bat.' }
        & java -cp $taskLauncher.FullName org.gradle.launcher.GradleMain @taskGradleArgs 2>&1 | Tee-Object -LiteralPath $taskLog
    }
    Check-Exit
    python rejuvenation/research/write_docs.py
    Check-Exit
    python rejuvenation/research/write_integration_report.py
    Check-Exit
    python rejuvenation/research/package.py
    Check-Exit
} finally { Pop-Location }
