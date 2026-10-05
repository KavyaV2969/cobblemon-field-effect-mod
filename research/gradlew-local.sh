#!/bin/sh
# Runs the cached Gradle 8.13 offline against rejuvenation/mod from the profile root (developer helper).
G=$(find ~/.gradle/wrapper/dists/gradle-8.13-bin -name gradle.bat | head -1)
cd "$(dirname "$0")/../.." && cmd.exe //c "$(cygpath -w "$G")" -p rejuvenation/mod --gradle-user-home rejuvenation/mod/.gradle-home --offline --console=plain "$@"
