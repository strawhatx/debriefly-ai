import { Role, User } from "./data-types"
import { Permissions, RolesWithPermissions } from "./permissions"

const ROLES = {
    admin: {
        broker: { view: true, create: true, update: true, delete: true },
        broker_connection_field:  { view: true, create: true, update: true, delete: true },
        trading_account: { view: true, create: true, update: true, delete: true },
        position: { view: true, create: true, update: true, delete: true },
        emotional_tag: { view: true, create: true, update: true, delete: true },
        futures_multiplier: { view: true, create: true, update: true, delete: true },
        import: { view: true, create: true, delete: true },
        insight: { view: true, create: true, update: true, delete: true },
        journal_entry: { view: true, create: true, update: true, delete: true },
        limits: {
            trading_account: Infinity, // Admins have no limit
            storage: Infinity, // Admins have no storage limits
          },
    },
    professional: {
        comments: {
            view: true,
            create: true,
            update: true,
        },
        todos: {
            view: true,
            create: true,
            update: true,
            delete: (user, todo) => todo.completed,
        },
        limits: {
            trading_account: 5, // Admins have no limit
            storage: 5 * 1024 ** 3, // 5GB in bytes
          },
    },
    trader: {
        broker: { view: true },
        broker_connection_field: { view: true },
        trading_account: { view: true },
        position: { view: true },
        emotional_tag: { view: true },
        futures_multiplier: { view: true },
        import: { view: true },
        insight: { view: true },
        journal_entry: { view: true },
        limits: {
            trading_account: 1, // Admins have no limit
            storage: 5 * 1024 ** 3, // 5GB in bytes
          },
    },
    viewer: {
        broker: { view: true },
        broker_connection_field: { view: true },
        trading_account: { view: true },
        position: { view: true },
        emotional_tag: { view: true },
        futures_multiplier: { view: true },
        import: { view: true },
        insight: { view: true },
        journal_entry: { view: true },
        limits: {
            trading_account: 1, // Admins have no limit
            storage: 1 * 1024 ** 3, // 1GB in bytes
          },
    },
} as const satisfies RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions>(
    user: User,
    resource: Resource,
    action: Permissions[Resource]["action"],
    data?: Permissions[Resource]["dataType"]
) {
    return user.roles.some(role => {
        const permission = (ROLES as RolesWithPermissions)[role][resource]?.[action]
        if (permission == null) return false

        if (typeof permission === "boolean") return permission
        return data != null && permission(user, data)
    })
}

// USAGE:
//const user: User = { id: "1", roles: ["user"] }
//const todo: Todo = {completed: false, id: "3", invitedUsers: [], title: "Test Todo", userId: "1" }

// Can create a comment
//hasPermission(user, "comments", "create")

// Can view the `todo` Todo
//(user, "todos", "view", todo)

// Can view all todos
//hasPermission(user, "todos", "view")