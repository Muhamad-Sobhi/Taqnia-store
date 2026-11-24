import { randomUUID } from "node:crypto";

import { config } from "dotenv";
import { sql } from "drizzle-orm";

import {
  getLocalDatabaseEnvironment,
  LocalDatabaseConfigurationError,
} from "../src/config/local-database";
import { categories as categoryCopy } from "../src/content/categories";
import { categories, permissions, rolePermissions, roles } from "../src/server/db/schema";
import { closeDatabaseConnection, getDatabase } from "../src/server/db/connection";

config({ path: ".env.local" });
config();

const roleSeed = [
  { slug: "customer", label: "Customer" },
  { slug: "admin", label: "Administrator" },
] as const;

const permissionSeed = [
  { slug: "catalog.read", description: "Read published catalog content." },
  { slug: "catalog.manage", description: "Create and edit catalog content." },
  { slug: "inventory.manage", description: "Manage inventory and inventory movements." },
  { slug: "customers.manage", description: "Manage customer accounts." },
  { slug: "orders.manage", description: "Read and update customer orders." },
  { slug: "payments.verify", description: "Verify and update manual payments." },
  { slug: "shipping.manage", description: "Manage shipping details and statuses." },
  { slug: "content.manage", description: "Manage store content and legal drafts." },
] as const;

async function seed() {
  getLocalDatabaseEnvironment();

  try {
    await getDatabase().transaction(async (transaction) => {
      for (const role of roleSeed) {
        await transaction
          .insert(roles)
          .values({ id: randomUUID(), ...role })
          .onDuplicateKeyUpdate({ set: { label: role.label } });
      }

      for (const permission of permissionSeed) {
        await transaction
          .insert(permissions)
          .values({ id: randomUUID(), ...permission })
          .onDuplicateKeyUpdate({ set: { description: permission.description } });
      }

      const savedRoles = await transaction.select().from(roles);
      const savedPermissions = await transaction.select().from(permissions);
      const roleIds = new Map(savedRoles.map((role) => [role.slug, role.id]));
      const permissionIds = new Map(
        savedPermissions.map((permission) => [permission.slug, permission.id]),
      );

      const customerRoleId = roleIds.get("customer");
      const adminRoleId = roleIds.get("admin");
      if (!customerRoleId || !adminRoleId) {
        throw new Error("Required customer/admin role seed was not persisted.");
      }

      const customerReadPermissionId = permissionIds.get("catalog.read");
      if (!customerReadPermissionId) {
        throw new Error("Required catalog permission seed was not persisted.");
      }

      const assignments = [
        { roleId: customerRoleId, permissionId: customerReadPermissionId },
        ...Array.from(permissionIds.values(), (permissionId) => ({
          roleId: adminRoleId,
          permissionId,
        })),
      ];

      for (const assignment of assignments) {
        await transaction
          .insert(rolePermissions)
          .values(assignment)
          .onDuplicateKeyUpdate({ set: { permissionId: sql`permission_id` } });
      }

      for (const [sortOrder, category] of categoryCopy.entries()) {
        await transaction
          .insert(categories)
          .values({
            id: randomUUID(),
            slug: category.slug,
            nameEn: category.name.en,
            nameAr: category.name.ar,
            sortOrder,
            isActive: true,
          })
          .onDuplicateKeyUpdate({
            set: {
              nameEn: category.name.en,
              nameAr: category.name.ar,
              sortOrder,
              isActive: true,
            },
          });
      }
    });

    console.info("Database seed completed with roles, permissions, and approved category labels.");
  } finally {
    await closeDatabaseConnection();
  }
}

seed().catch((error: unknown) => {
  if (error instanceof LocalDatabaseConfigurationError) {
    console.error(`Database seed refused: ${error.message}`);
  } else {
    const message = error instanceof Error ? error.message : "Unknown runtime error.";
    const password = process.env.DATABASE_PASSWORD;
    console.error(
      `Database seed failed: ${password ? message.replaceAll(password, "[redacted]") : message}`,
    );
  }
  process.exitCode = 1;
});
