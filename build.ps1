# Rebuilds, tests and packages everything. See docs/BUILDING.md.
#
#   ./build.ps1 [-Profile <game profile>] [-GradlePath <gradle 8.13>] [-RefreshSource] [-AffinityMask 0xFFF]
#
# -Profile       the Minecraft instance with Cobblemon 1.7.3, Fabric API and the optional integration jars in mods/ and the installed Showdown in
#                showdown/ (default: $env:REJUVENATION_PROFILE, else this repository's parent directory).
# -Meta          the launcher's library cache (default: $env:REJUVENATION_META, else <profile>/../../meta).
# -GradlePath    a Gradle 8.13 launcher; by default the cached 8.13 distribution from the Gradle wrapper is run directly with Java 21.
# -RefreshSource additionally re-extracts the field specification from the original Rejuvenation scripts (needs Ruby and REJUVENATION_REFERENCE).
# -AffinityMask  pins this script and every child (Gradle, test JVMs) to the given cores, e.g. 0xFFF for the performance cores of a hybrid CPU, so
#                the decision-latency receipt is not taken on efficiency cores.
param([string]$Profile, [string]$Meta, [string]$GradlePath, [switch]$RefreshSource, [long]$AffinityMask = 0)
$ErrorActionPreference = 'Stop'
$repo = $PSScriptRoot
function Check-Exit { if ($LASTEXITCODE -ne 0) { throw "Command failed with exit code $LASTEXITCODE" } }
if ($Profile) { $env:REJUVENATION_PROFILE = (Resolve-Path -LiteralPath $Profile).Path }
if ($Meta) { $env:REJUVENATION_META = (Resolve-Path -LiteralPath $Meta).Path }
Push-Location -LiteralPath $repo
if ($AffinityMask -gt 0) {
    $self = [System.Diagnostics.Process]::GetCurrentProcess()
    $self.ProcessorAffinity = [IntPtr]$AffinityMask
    $self.PriorityClass = 'High'
    $env:REJUVENATION_AFFINITY = ('0x{0:X}' -f $AffinityMask)
}
try {
    if ($RefreshSource) {
        if (-not $env:REJUVENATION_REFERENCE) { throw 'Set REJUVENATION_REFERENCE to the Rejuvenation 14 installation to refresh the source extraction.' }
        $scripts = Join-Path $env:REJUVENATION_REFERENCE 'Scripts'
        ruby research/extract_fields.rb $scripts (Join-Path $repo 'research/field-specification.json'); Check-Exit
        ruby research/audit_source.rb $scripts (Join-Path $repo 'research'); Check-Exit
    }
    python research/prepare_build.py; Check-Exit
    $haveReference = $env:REJUVENATION_REFERENCE -and (Test-Path -LiteralPath (Join-Path $env:REJUVENATION_REFERENCE 'Scripts/Battle_Field.rb'))
    if ($haveReference) {
        # Regeneration needs the original scripts; the generated datapack/ and assets are committed, so a build without them still works.
        python scripts/generate_ai_affinity.py; Check-Exit
        python scripts/generate_ai_disruption.py; Check-Exit
        python research/generate.py; Check-Exit
    } else { Write-Host 'REJUVENATION_REFERENCE not set: skipping regeneration from source (committed generated content is used).' }
    python research/validate.py; Check-Exit
    python research/validate.py --packs base --catalog-out build/catalog-base.json --receipt research/test-results/datapack-validation-base.json; Check-Exit
    python research/compare.py; Check-Exit
    python research/compare_split.py; Check-Exit
    python research/test_custom_fields.py; Check-Exit
    $gradleArgs = @('--gradle-user-home', '.gradle-home', '--offline', '--no-daemon', 'build', 'check', 'strategyBenchmark', 'integrationFixtureJar', '--console=plain')
    $log = Join-Path $repo 'research/test-results/build.log'
    if ($GradlePath) {
        & $GradlePath @gradleArgs 2>&1 | Tee-Object -LiteralPath $log
    } else {
        # The cached Gradle 8.13 launcher, run directly with Java 21 (the gradle.bat wrapper can hang in some shells).
        $cache = Join-Path $env:USERPROFILE '.gradle/wrapper/dists/gradle-8.13-bin'
        $launcher = Get-ChildItem -LiteralPath $cache -Filter gradle-launcher-8.13.jar -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if (!$launcher) { throw 'Supply -GradlePath to Gradle 8.13 or download it once through gradlew.bat.' }
        & java -cp $launcher.FullName org.gradle.launcher.GradleMain @gradleArgs 2>&1 | Tee-Object -LiteralPath $log
    }
    Check-Exit
    python research/write_custom_traceability.py; Check-Exit
    python research/write_docs.py; Check-Exit
    python research/package.py; Check-Exit
} finally { Pop-Location }
