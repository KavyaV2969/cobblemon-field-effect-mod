package dev.rejuvenation;

import java.nio.file.Path;

/** Where the repository and the game profile are, for the verification programs (no machine-specific defaults). */
final class Layout {
    private Layout() {}
    /** The repository root: -Drejuvenation.repo, else the working directory. */
    static Path repo() { return Path.of(System.getProperty("rejuvenation.repo", System.getProperty("user.dir"))).toAbsolutePath().normalize(); }
    /**
     * The game profile that holds the installed Showdown (showdown/index.js): REJUVENATION_PROFILE, else the repository's parent directory
     * (the layout this project was developed in).
     */
    static Path profile() {
        String configured = System.getenv("REJUVENATION_PROFILE");
        return configured != null && !configured.isBlank() ? Path.of(configured).toAbsolutePath().normalize() : repo().getParent();
    }
}
