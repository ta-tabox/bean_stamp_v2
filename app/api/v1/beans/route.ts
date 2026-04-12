import { NextResponse } from "next/server"

import { getSessionPrincipal } from "@/server/auth/guards"
import { toApiErrorResponse } from "@/server/api/error-response"
import { revalidateBeanPaths } from "@/server/beans/revalidation"
import { createBean, listBeansForRoaster, parseBeanMutationInput } from "@/server/beans"
import { AppError } from "@/server/errors"

export async function GET() {
  try {
    const session = await requireApiRoasterSession()
    const beans = await listBeansForRoaster(session.roasterId)

    return NextResponse.json(beans)
  } catch (error) {
    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

export async function POST(request: Request) {
  const isHtmlFormRequest = isFormNavigationRequest(request)

  try {
    const session = await requireApiRoasterSession()
    const bean = await createBean(session.roasterId, parseBeanMutationInput(await readBeanPayload(request)))

    if (isHtmlFormRequest) {
      const beanId = String(bean.id)
      revalidateBeanPaths(beanId)

      return redirectFromRequest(request, `/beans/${beanId}?created=1`)
    }

    return NextResponse.json(bean)
  } catch (error) {
    if (isHtmlFormRequest) {
      return redirectForFormError(request, error, "/beans/new")
    }

    const response = toApiErrorResponse(error)

    return NextResponse.json(response.payload, { status: response.status })
  }
}

async function requireApiRoasterSession() {
  const session = await getSessionPrincipal()

  if (!session) {
    throw new AppError("Authentication required", {
      code: "UNAUTHORIZED",
      status: 401,
      userMessage: "認証が必要です",
    })
  }

  if (!session.roasterId) {
    throw new AppError("Roaster membership required", {
      code: "FORBIDDEN",
      status: 403,
      userMessage: "ロースター登録が必要です",
    })
  }

  return {
    ...session,
    roasterId: session.roasterId,
  }
}

async function readBeanPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? ""

  if (contentType.includes("application/json")) {
    const payload = (await request.json()) as Record<string, unknown>
    const beanPayload = readRecord(payload.bean)
    const tasteTagPayload = readRecord(payload.tasteTag)

    return {
      acidity: beanPayload.acidity ?? payload.acidity,
      bitterness: beanPayload.bitterness ?? payload.bitterness,
      body: beanPayload.body ?? payload.body,
      countryId: beanPayload.countryId ?? beanPayload.country_id ?? payload.countryId,
      croppedAt: beanPayload.croppedAt ?? beanPayload.cropped_at ?? payload.croppedAt,
      describe: beanPayload.describe ?? payload.describe,
      elevation: beanPayload.elevation ?? payload.elevation,
      farm: beanPayload.farm ?? payload.farm,
      flavor: beanPayload.flavor ?? payload.flavor,
      images: payload.images ?? [],
      name: beanPayload.name ?? payload.name,
      process: beanPayload.process ?? payload.process,
      roastLevelId:
        beanPayload.roastLevelId ?? beanPayload.roast_level_id ?? payload.roastLevelId,
      subregion: beanPayload.subregion ?? payload.subregion,
      sweetness: beanPayload.sweetness ?? payload.sweetness,
      tasteTagIds:
        tasteTagPayload.tasteTagIds ?? tasteTagPayload.taste_tag_ids ?? payload.tasteTagIds ?? [],
      variety: beanPayload.variety ?? payload.variety,
    }
  }

  const formData = await request.formData()

  return {
    acidity: formData.get("acidity") ?? formData.get("bean[acidity]"),
    bitterness: formData.get("bitterness") ?? formData.get("bean[bitterness]"),
    body: formData.get("body") ?? formData.get("bean[body]"),
    countryId: formData.get("countryId") ?? formData.get("bean[countryId]"),
    croppedAt: formData.get("croppedAt") ?? formData.get("bean[croppedAt]"),
    describe: formData.get("describe") ?? formData.get("bean[describe]"),
    elevation: formData.get("elevation") ?? formData.get("bean[elevation]"),
    farm: formData.get("farm") ?? formData.get("bean[farm]"),
    flavor: formData.get("flavor") ?? formData.get("bean[flavor]"),
    images: getFirstNonEmptyArray(formData.getAll("images"), formData.getAll("beanImage[images][]")),
    name: formData.get("name") ?? formData.get("bean[name]"),
    process: formData.get("process") ?? formData.get("bean[process]"),
    roastLevelId: formData.get("roastLevelId") ?? formData.get("bean[roastLevelId]"),
    subregion: formData.get("subregion") ?? formData.get("bean[subregion]"),
    sweetness: formData.get("sweetness") ?? formData.get("bean[sweetness]"),
    tasteTagIds: getFirstNonEmptyArray(
      formData.getAll("tasteTagIds"),
      formData.getAll("tasteTag[tasteTagIds][]"),
    ),
    variety: formData.get("variety") ?? formData.get("bean[variety]"),
  }
}

function readRecord(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return {}
}

function getFirstNonEmptyArray(...values: unknown[][]) {
  return values.find((value) => value.length > 0) ?? []
}

function isFormNavigationRequest(request: Request) {
  const accept = request.headers.get("accept") ?? ""
  const contentType = request.headers.get("content-type") ?? ""

  return accept.includes("text/html") && !contentType.includes("application/json")
}

function redirectForFormError(request: Request, error: unknown, fallbackPath: string) {
  const response = toApiErrorResponse(error)

  if (response.status === 401) {
    return redirectFromRequest(request, "/auth/signin")
  }

  if (response.status === 403) {
    return redirectFromRequest(request, "/users/home")
  }

  return redirectFromRequest(
    request,
    `${fallbackPath}?error=${encodeURIComponent(response.payload.error.message)}`,
  )
}

function redirectFromRequest(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 })
}
