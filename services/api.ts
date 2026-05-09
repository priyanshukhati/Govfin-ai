// const BASE_URL = "http://localhost:8000"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL

console.log("API URL:", BASE_URL)  

// 🔹 Common fetch wrapper
async function safeFetch(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`)
    }

    return await res.json()
  } catch (error) {
    console.error("API FAILED:", error)
    throw error
  }
}

// 🔹 Predict API
export async function predictSchemes(data: any) {
  return safeFetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

// 🔹 Search API
export async function searchSchemes(query: string) {
  return safeFetch(
    `${BASE_URL}/search?q=${encodeURIComponent(query)}`
  )
}

// 🔹 Filter API
export async function filterSchemes(category: string) {
  return safeFetch(
    `${BASE_URL}/filter?category=${category.toLowerCase()}`
  )
}

// 🔹 Get Single Scheme
export async function getSchemeById(id: string) {
  return safeFetch(`${BASE_URL}/scheme/${id}`)
}