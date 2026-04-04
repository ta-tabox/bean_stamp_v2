import { signOutAction } from "@/server/auth/actions"

export function SignOutButton() {
  return (
    <form
      action={signOutAction}
      className="flex justify-center"
    >
      <button
        type="submit"
        className="group relative inline-flex h-8 w-8 items-center justify-center text-gray-500 transition duration-200 hover:-translate-x-4 hover:text-gray-800"
      >
        <svg className="h-8 w-8">
          <use href="#logout" />
        </svg>
        <span className="pointer-events-none absolute left-full top-1/2 ml-1 -translate-y-1/2 font-serif text-sm italic opacity-0 transition group-hover:opacity-100">
          SignOut
        </span>
      </button>
    </form>
  )
}
