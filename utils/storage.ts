export const getGovfinState = () => {
  try {
    const data = localStorage.getItem("govfin_state")
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export const setGovfinState = (newData: any) => {
  try {
    const existing = getGovfinState()
    const updated = { ...existing, ...newData }
    localStorage.setItem("govfin_state", JSON.stringify(updated))
  } catch (error) {
    console.error("Storage error", error)
  }
}

export const clearGovfinState = () => {
  localStorage.removeItem("govfin_state")
}