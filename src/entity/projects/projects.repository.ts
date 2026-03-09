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
  return db.select().from(projectsTable);
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
  return db
    .delete(projectsTable)
    .where(eq(projectsTable.projectId, id))
    .returning();
}
