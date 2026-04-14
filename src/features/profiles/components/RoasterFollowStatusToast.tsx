"use client"

import { useEffect, useRef } from "react"

import { useToast } from "@/components/ui/ToastProvider"

type RoasterFollowStatusToastProps = {
  followed?: boolean
  unfollowed?: boolean
}

export function RoasterFollowStatusToast({
  followed = false,
  unfollowed = false,
}: RoasterFollowStatusToastProps) {
  const { showToast } = useToast()
  const shownFollowedRef = useRef(false)
  const shownUnfollowedRef = useRef(false)

  useEffect(() => {
    if (!followed || shownFollowedRef.current) {
      return
    }

    shownFollowedRef.current = true
    showToast("ロースターをフォローしました。", "success")
  }, [followed, showToast])

  useEffect(() => {
    if (!unfollowed || shownUnfollowedRef.current) {
      return
    }

    shownUnfollowedRef.current = true
    showToast("ロースターのフォローを解除しました。", "success")
  }, [showToast, unfollowed])

  return null
}
