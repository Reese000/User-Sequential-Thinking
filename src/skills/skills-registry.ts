// src/skills/skills-registry.ts

/**
 * Registry for dynamic skill management.
 * Allows registering, unregistering, and querying skills at runtime.
 */

/** A registered skill entry */
export interface SkillEntry {
  name: string;
  description: string;
  version: string;
  handler: (input: string) => string;
  tags: string[];
  registeredAt: Date;
}

/**
 * SkillsRegistry manages runtime skill registration and lookup.
 */
export class SkillsRegistry {
  private skills = new Map<string, SkillEntry>();

  /**
   * Register a new skill. Overwrites if name already exists.
   */
  register(entry: Omit<SkillEntry, 'registeredAt'>): void {
    this.skills.set(entry.name, {
      ...entry,
      registeredAt: new Date(),
    });
  }

  /**
   * Unregister a skill by name. Returns true if it existed.
   */
  unregister(name: string): boolean {
    return this.skills.delete(name);
  }

  /**
   * Get a skill by name.
   */
  get(name: string): SkillEntry | undefined {
    return this.skills.get(name);
  }

  /**
   * Check if a skill is registered.
   */
  has(name: string): boolean {
    return this.skills.has(name);
  }

  /**
   * List all registered skill names.
   */
  listNames(): string[] {
    return Array.from(this.skills.keys());
  }

  /**
   * List all registered skills with details.
   */
  listAll(): SkillEntry[] {
    return Array.from(this.skills.values());
  }

  /**
   * Find skills by tag.
   */
  findByTag(tag: string): SkillEntry[] {
    return this.listAll().filter(skill => skill.tags.includes(tag));
  }

  /**
   * Search skills by name or description.
   */
  search(query: string): SkillEntry[] {
    const lower = query.toLowerCase();
    return this.listAll().filter(
      skill =>
        skill.name.toLowerCase().includes(lower) ||
        skill.description.toLowerCase().includes(lower),
    );
  }

  /**
   * Get the total number of registered skills.
   */
  size(): number {
    return this.skills.size;
  }

  /**
   * Clear all registered skills.
   */
  clear(): void {
    this.skills.clear();
  }
}
