"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

type Scheme = {
  id: number
  name: string
  description: string
  category_type?: string
  eligibility?: any
  documents?: string[]
  apply_link?: string
}

export default function SchemeDetailsPage() {
  const { id } = useParams()
  const [scheme, setScheme] = useState<Scheme | null>(null)

  useEffect(() => {
    fetch(`http://localhost:8000/scheme/${id}`)
      .then((res) => res.json())
      .then((data) => setScheme(data))
  }, [id])

  if (!scheme) return <p>Loading...</p>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 bg-white rounded-2xl shadow">
      <h1 className="text-3xl font-bold text-gray-900">{scheme?.name}</h1>

      <p className="text-gray-600">
          {scheme.description?.replace("â‚¹", "₹")}
        </p>

      <div>
        <h2 className="font-semibold text-lg">Benefits</h2>
        <p className="text-gray-600">{scheme.description?.replace("â‚¹", "₹")}</p>
      </div>

      {/* <div>
        <h2 className="font-semibold">Eligibility</h2> */}
        <div className="space-y-3">
            <h2 className="font-semibold text-lg">Eligibility</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <p>
                <strong>Age:</strong> {scheme.eligibility?.min_age} – {scheme.eligibility?.max_age} years
              </p>
              <p>
                <strong>Income:</strong> Up to ₹
                {scheme.eligibility?.max_income?.toLocaleString()}
              </p>
              <p>
                <strong>Occupation:</strong>{" "}
                {scheme.eligibility?.occupation?.includes("all")
                  ? "All"
                  : scheme.eligibility?.occupation?.join(", ")}
              </p>
              <p>
              <strong>State:</strong>{" "}
              {scheme.eligibility?.state?.includes("all")
                ? "All States"
                : scheme.eligibility?.state?.join(", ")}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {scheme.eligibility?.category?.includes("all")
                  ? "All Categories"
                  : scheme.eligibility?.category?.join(", ")}
              </p>
              <p>
                <strong>Gender:</strong>{" "}
                {scheme.eligibility?.gender?.join(", ")}
              </p>
              <p>
                <strong>Disability:</strong>{" "}
                {scheme.eligibility?.disability?.join(", ")}
              </p>
            </div>
          </div>
      {/* </div> */}

      {scheme.documents && (
        <div>
          <h2 className="font-semibold">Documents Required</h2>
          <ul className="list-disc ml-5">
            {scheme.documents?.map((doc, i) => (
              <li key={i}>{doc}</li>
            ))}
          </ul>
        </div>
      )}

      {scheme.apply_link && (
        <a
          href={scheme.apply_link}
          target="_blank"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Apply here
        </a>
      )}
    </div>
  )
}