"use client"

function HeaderTitlesPerfil({ title, bio }: { title: string, bio: string }) {
    return (
        <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-white">{ title }</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light">{ bio }</p>
        </div>
    )
}

export default HeaderTitlesPerfil;