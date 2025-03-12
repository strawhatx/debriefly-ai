import { Role, User } from "./data-types"
import { Permissions, RolesWithPermissions } from "./permissions"

const ROLES = {
    admin: {
        comments: {
            view: true,
            create: true,
            update: true,
        },
        todos: {
            view: true,
            create: true,
            update: true,
            delete: true,
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
    },
    trader: {
        comments: {
            view: (user, comment) => !user.blockedBy.includes(comment.authorId),
            create: true,
            update: (user, comment) => comment.authorId === user.id,
        },
        todos: {
            view: (user, todo) => !user.blockedBy.includes(todo.userId),
            create: true,
            update: (user, todo) =>
                todo.userId === user.id || todo.invitedUsers.includes(user.id),
            delete: (user, todo) =>
                (todo.userId === user.id || todo.invitedUsers.includes(user.id)) &&
                todo.completed,
        },
    },
    viewer: {
        broker: { view: true },
        broker_connection_field: { view: true },
        trading_account: { view: true },
        position: { view: true },
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