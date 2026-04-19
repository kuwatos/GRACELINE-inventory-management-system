import { UserManagementManager } from '@/components/features/users/user-management-manager'
import { readUsers, validateSessionUser } from '@/src/entity/user/user.repository'

export default async function page() {
  const user = await validateSessionUser()
  const dbUsers = await readUsers(user.id);
  return (
    <UserManagementManager data={dbUsers}/>
  )
}

