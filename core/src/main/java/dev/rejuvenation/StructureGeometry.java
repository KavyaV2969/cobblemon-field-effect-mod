package dev.rejuvenation;

import java.util.*;

/**
 * Structure containment geometry, independent of Minecraft classes.
 *
 * <p>A generated structure is a list of piece bounding boxes. Which positions count as "inside" it is a per-row policy:
 * <ul>
 * <li>{@code pieces}: only blocks inside one piece's box (the original behaviour; right for compact buildings such as mansions
 * and for the Nether and Ancient City structures, whose pieces tile their interiors);</li>
 * <li>{@code footprint}: a piece's box widened horizontally by {@code horizontal} blocks, extended {@code above} blocks over its
 * top and {@code below} blocks under its floor. A generated village is a loose scatter of building and street pieces with open
 * ground between them; players and wild Pokémon stand on that ground, so exact boxes would classify most of a village as its
 * biome. The margin is anchored to real pieces, not to the structure's centre, so the footprint cannot reach arbitrary
 * surrounding chunks, and the vertical limits keep caves below the village and open sky above it out.</li>
 * </ul>
 */
public final class StructureGeometry {
    private StructureGeometry() {}

    public record Box(int minX, int minY, int minZ, int maxX, int maxY, int maxZ) {
        public Box {
            if (maxX < minX || maxY < minY || maxZ < minZ) throw new IllegalArgumentException("Empty structure piece box");
        }
        public boolean contains(int x, int y, int z) { return x >= minX && x <= maxX && y >= minY && y <= maxY && z >= minZ && z <= maxZ; }
        @Override public String toString() { return minX + "," + minY + "," + minZ + ".." + maxX + "," + maxY + "," + maxZ; }
    }

    public enum Mode { PIECES, FOOTPRINT }

    /** Limits are generous but bounded: a footprint can never be an unbounded radius. */
    public static final int MAX_HORIZONTAL = 32, MAX_ABOVE = 64, MAX_BELOW = 32;

    public record Policy(Mode mode, int horizontal, int above, int below) {
        public static final Policy PIECES = new Policy(Mode.PIECES, 0, 0, 0);
        public Policy {
            Objects.requireNonNull(mode);
            if (mode == Mode.PIECES && (horizontal != 0 || above != 0 || below != 0)) throw new IllegalArgumentException("A pieces policy has no margins");
            if (horizontal < 0 || horizontal > MAX_HORIZONTAL || above < 0 || above > MAX_ABOVE || below < 0 || below > MAX_BELOW)
                throw new IllegalArgumentException("Structure containment margin out of range");
        }
        public static Policy footprint(int horizontal, int above, int below) { return new Policy(Mode.FOOTPRINT, horizontal, above, below); }
        public boolean contains(Box piece, int x, int y, int z) {
            return x >= piece.minX() - horizontal && x <= piece.maxX() + horizontal
                && z >= piece.minZ() - horizontal && z <= piece.maxZ() + horizontal
                && y >= piece.minY() - below && y <= piece.maxY() + above;
        }
        @Override public String toString() { return mode == Mode.PIECES ? "pieces" : "footprint(" + horizontal + "/" + above + "/" + below + ")"; }
    }

    /** Index of the first piece containing the position under the policy, or -1. Pieces are scanned in list order. */
    public static int containing(List<Box> pieces, int x, int y, int z, Policy policy) {
        for (int i = 0; i < pieces.size(); i++) if (policy.contains(pieces.get(i), x, y, z)) return i;
        return -1;
    }
}
