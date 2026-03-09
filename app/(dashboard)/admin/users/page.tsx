import { UserManagementManager } from '@/components/features/users/user-management-manager'
import { readUsers } from '@/src/entity/user/user.repository'

export default async function page() {
  const dbUsers = await readUsers();
  return (
    <UserManagementManager data={dbUsers}/>
  )
}

