import { ProjectManager} from "@/components/features/projects/project-manager";
import { readProjects } from '@/src/entity/projects/projects.repository'

async function page() {
  const projects = await readProjects();
  return (
    <ProjectManager data={projects}/>  )
}

export default page
