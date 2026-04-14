import { LogoutIcon } from "@/components/icon/Icon"
import { signOutAction } from "@/server/auth/actions"

export function SignOutButton() {
  return (
    <form
      action={signOutAction}
      className="flex justify-center"
    >
      <button
        type="submit"
        className="group relative flex h-12 w-20 items-center justify-center rounded-xl text-gray-500 transition duration-200 hover:bg-gray-100 hover:text-gray-800"
      >
        <LogoutIcon className="h-8 w-8" />
        <span className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 font-serif text-sm italic text-gray-700 opacity-0 shadow-sm ring-1 ring-gray-200 transition group-hover:opacity-100">
          SignOut
        </span>
      </button>
    </form>
  )
}
