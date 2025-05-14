"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, AlertCircle, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PDFSummarizer() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [docBase64, setDocBase64] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    console.log("File selected:", selectedFile)

    if (!selectedFile) {
      setFile(null)
      return
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed")
      setFile(null)
      return
    }

    setError(null)
    setFile(selectedFile)
    setSummary(null)
    setIsSuccess(false)
  }

  const handleDownload = () => {
    if (!docBase64) return

    const byteCharacters = atob(docBase64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "summary.docx"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a PDF file")
      return
    }

    setIsLoading(true)
    setError(null)
    setIsSuccess(false)
    setSummary(null)

    try {
      console.log("Preparing to upload file:", file.name)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("returnFormat", "json") // Request JSON response with summary and docx

      console.log("Sending request to API...")

      const response = await fetch("/api/customers/summarize", {
        method: "POST",
        body: formData,
      })

      console.log("Response received:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process PDF")
      }

      // Handle the JSON response with summary and docBase64
      const data = await response.json()
      setSummary(data.summary)
      setDocBase64(data.docBase64)

      console.log("Summary received successfully")
      setIsSuccess(true)

      // Reset file input
      const fileInput = document.getElementById("pdf-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (err) {
      console.error("Error processing PDF:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">PDF Summarizer</h1>

      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload PDF Document</CardTitle>
            <CardDescription>Upload a PDF to generate a summary document using Gemini AI</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-4">{file ? file.name : "Drag and drop or click to upload"}</p>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button type="button" variant="outline" onClick={() => document.getElementById("pdf-upload")?.click()}>
                  Select PDF
                </Button>
              </div>

              {file && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="text-sm truncate">{file.name}</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSuccess && (
                <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Your summary has been generated successfully.</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={!file || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Generate Summary"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {summary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Document Summary</span>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download DOCX
                </Button>
              </CardTitle>
              <CardDescription>Generated by Gemini AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{summary}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
