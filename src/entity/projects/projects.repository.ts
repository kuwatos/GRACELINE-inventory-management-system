// CRUD lives here
import { db } from "../../index";
import { projectsTable } from "../../db/schema";
import { eq, ilike, or, and } from "drizzle-orm";

//CREATE
export async function createProject(data: { projectName: string }) {
  return db.insert(projectsTable).values(data).returning();
}

//READ
export async function readProjects() {
  return db.select().from(projectsTable).where(eq(projectsTable.archived, false));
}

export async function readProjecstNameAndId() {
  return db
    .select({
      projectId: projectsTable.projectId,
      projectName: projectsTable.projectName,
    })
    .from(projectsTable)
    .where(eq(projectsTable.archived, false));
}

//SEARCH
export async function searchProjects(filters: { keyword: string }) {
  return db
    .select()
    .from(projectsTable)
    .where(ilike(projectsTable.projectName, `%${filters.keyword}%`));
}
//UPDATE
export async function updateProject(id: number, name: string) {
  return db
    .update(projectsTable)
    .set({ projectName: name })
    .where(eq(projectsTable.projectId, id))
    .returning();
}

//DELETE
export async function deleteProject(id: number) {
  await db
    .update(projectsTable)
    .set({ archived: true })
    .where(eq(projectsTable.projectId, id))
    .returning();
  return { success: true }
}

export async function findExistingProject(name:string) {
  return db.select().from(projectsTable).where(ilike(projectsTable.projectName, name)).limit(1);
}

export async function restoreProject(
  id:number,
  data: {
    projectName: string;
  }) {
  return await db.transaction(async (tx) => {
    // Restore the project
    const [restoredProject] = await tx.update(projectsTable)
      .set({ ...data, archived: false })
      .where(eq(projectsTable.projectId, id))
      .returning();

    return restoredProject;
  })}